import pool from "../config/db.js";
import { Request, Response } from "express";

class ErroNegocio extends Error {}

// GET /api/pedidos?status=pendente -> painel
export async function listar(req: Request, res: Response) {
  const { status } = req.query;

  let sql = `
    SELECT pe.*, c.nome AS cliente_nome, c.whatsapp
    FROM pedidos pe
    JOIN clientes c ON c.id = pe.cliente_id
  `;
  const params: any[] = [];

  if (status) {
    sql += " WHERE pe.status = ?";
    params.push(status);
  }
  sql += " ORDER BY pe.criado_em DESC";

  const [rows] = await pool.query(sql, params);
  res.json(rows);
}

export async function buscarPorId(req: Request, res: Response) {
  const id = Number(req.params.id);

  const [pedidoRows]: any = await pool.query(
    `SELECT pe.*, c.nome AS cliente_nome, c.whatsapp
     FROM pedidos pe JOIN clientes c ON c.id = pe.cliente_id
     WHERE pe.id = ?`,
    [id]
  );
  if (!pedidoRows[0]) return res.status(404).json({ erro: "Pedido não encontrado." });

  const [itens] = await pool.query(
    `SELECT ip.*, p.nome AS produto_nome
     FROM itens_pedido ip JOIN produtos p ON p.id = ip.produto_id
     WHERE ip.pedido_id = ?`,
    [id]
  );

  res.json({ ...pedidoRows[0], itens });
}

// POST /api/bot/pedidos - chamado pelo bot (menu fixo, Nível 2)
// Body: { whatsapp, nome_cliente, forma_pagamento, itens: [{ produto_id, quantidade }] }
//
// Tudo roda em UMA transação: só confirma o pedido se houver estoque
// suficiente de TODOS os insumos envolvidos - é isso que impede o
// "furo de estoque" mesmo com pedidos simultâneos.
export async function criarViaBot(req: Request, res: Response) {
  const { whatsapp, nome_cliente, forma_pagamento, itens } = req.body;

  if (!whatsapp || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: "whatsapp e itens são obrigatórios." });
  }

  // Validação dura de cada item ANTES de abrir a transação: sem ela,
  // quantidade 0 criava pedido vazio e quantidade negativa AUMENTAVA o
  // estoque (a baixa subtrai o valor, e menos com menos dá mais).
  const itensNormalizados = itens.map((item) => ({
    produto_id: Number(item?.produto_id),
    quantidade: Number(item?.quantidade),
  }));
  const itemInvalido = itensNormalizados.some(
    (item) =>
      !Number.isInteger(item.produto_id) ||
      item.produto_id <= 0 ||
      !Number.isInteger(item.quantidade) ||
      item.quantidade <= 0,
  );
  if (itemInvalido) {
    return res.status(400).json({
      erro: "Cada item precisa de produto_id e quantidade inteira maior que zero.",
    });
  }

  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();

    // 1. Garante que o cliente existe
    const [clienteRows]: any = await conexao.query(
      "SELECT id FROM clientes WHERE whatsapp = ?",
      [whatsapp]
    );
    let clienteId: number;
    if (clienteRows[0]) {
      clienteId = clienteRows[0].id;
    } else {
      const [result]: any = await conexao.query(
        "INSERT INTO clientes (nome, whatsapp) VALUES (?, ?)",
        [nome_cliente || null, whatsapp]
      );
      clienteId = result.insertId;
    }

    // 2. Para cada item: busca preço + ficha técnica, e TRAVA a linha
    //    do insumo (FOR UPDATE) para evitar corrida entre pedidos
    //    simultâneos disputando o mesmo insumo escasso.
    let valorTotal = 0;
    const itensParaInserir: any[] = [];
    const baixasDeEstoque: { insumo_id: number; quantidade: number }[] = [];

    for (const item of itensNormalizados) {
      const [produtoRows]: any = await conexao.query(
        "SELECT id, nome, preco FROM produtos WHERE id = ? AND ativo = TRUE",
        [item.produto_id]
      );
      const produto = produtoRows[0];
      if (!produto) {
        throw new ErroNegocio(`Produto ${item.produto_id} não encontrado ou inativo.`);
      }

      const subtotal = produto.preco * item.quantidade;
      valorTotal += subtotal;
      itensParaInserir.push({
        produto_id: produto.id,
        quantidade: item.quantidade,
        preco_unitario: produto.preco,
        subtotal,
      });

      const [receita]: any = await conexao.query(
        "SELECT insumo_id, quantidade_necessaria FROM produto_insumo WHERE produto_id = ?",
        [produto.id]
      );

      for (const ingrediente of receita) {
        const necessario = ingrediente.quantidade_necessaria * item.quantidade;

        const [insumoRows]: any = await conexao.query(
          "SELECT quantidade_atual FROM insumos WHERE id = ? FOR UPDATE",
          [ingrediente.insumo_id]
        );
        const disponivel = insumoRows[0]?.quantidade_atual ?? 0;

        if (disponivel < necessario) {
          throw new ErroNegocio(`Estoque insuficiente para o produto "${produto.nome}".`);
        }

        baixasDeEstoque.push({ insumo_id: ingrediente.insumo_id, quantidade: necessario });
      }
    }

    // 3. Cria o pedido (forma de pagamento validada: é enum no banco,
    // então string arbitrária viraria 500 do MySQL em vez de 400).
    const formasValidas = ["pix", "cartao", "dinheiro", "outro"];
    if (forma_pagamento !== undefined && forma_pagamento !== null && !formasValidas.includes(forma_pagamento)) {
      await conexao.rollback();
      return res.status(400).json({ erro: "Forma de pagamento inválida. Use: pix, cartao, dinheiro ou outro." });
    }
    const [pedidoResult]: any = await conexao.query(
      `INSERT INTO pedidos (cliente_id, status, forma_pagamento, valor_total, origem)
       VALUES (?, 'pendente', ?, ?, 'whatsapp')`,
      [clienteId, forma_pagamento || null, valorTotal]
    );
    const pedidoId = pedidoResult.insertId;

    // 4. Insere os itens
    for (const item of itensParaInserir) {
      await conexao.query(
        `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [pedidoId, item.produto_id, item.quantidade, item.preco_unitario, item.subtotal]
      );
    }

    // 5. Debita estoque e registra a movimentação (auditoria)
    for (const baixa of baixasDeEstoque) {
      await conexao.query(
        "UPDATE insumos SET quantidade_atual = quantidade_atual - ? WHERE id = ?",
        [baixa.quantidade, baixa.insumo_id]
      );
      await conexao.query(
        `INSERT INTO movimentacoes_estoque (insumo_id, tipo, quantidade, pedido_id, observacao)
         VALUES (?, 'saida', ?, ?, 'Baixa automática por venda')`,
        [baixa.insumo_id, baixa.quantidade, pedidoId]
      );
    }

    await conexao.commit();
    res.status(201).json({ id: pedidoId, valor_total: valorTotal, status: "pendente" });
  } catch (err) {
    await conexao.rollback();
    if (err instanceof ErroNegocio) {
      return res.status(409).json({ erro: err.message });
    }
    throw err;
  } finally {
    conexao.release();
  }
}

// PATCH /api/pedidos/:id/status -> painel
// Regras: cancelado é estado final (não sai de lá) e cancelar ESTORNA o
// estoque debitado na venda (baixa reversa auditada). Sem isso, cancelar
// sumia com o pedido e o insumo ficava debitado para sempre.
export async function atualizarStatus(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { status } = req.body;

  const validos = ["pendente", "em_preparo", "pronto", "entregue", "cancelado"];
  if (!validos.includes(status)) {
    return res.status(400).json({ erro: "Status inválido." });
  }

  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();

    const [pedidoRows]: any = await conexao.query(
      "SELECT status FROM pedidos WHERE id = ? FOR UPDATE",
      [id]
    );
    if (!pedidoRows[0]) {
      await conexao.rollback();
      return res.status(404).json({ erro: "Pedido não encontrado." });
    }
    const statusAnterior = pedidoRows[0].status as string;

    if (statusAnterior === "cancelado" && status !== "cancelado") {
      await conexao.rollback();
      return res.status(409).json({ erro: "Pedido cancelado não pode mudar de status." });
    }

    await conexao.query("UPDATE pedidos SET status = ? WHERE id = ?", [status, id]);

    // Entrou em cancelado vindo de outro estado: devolve cada insumo usado
    // pelos itens (agrupado por insumo) e registra a devolução.
    if (status === "cancelado" && statusAnterior !== "cancelado") {
      const [usos]: any = await conexao.query(
        `SELECT pi.insumo_id AS insumo_id, SUM(pi.quantidade_necessaria * ip.quantidade) AS quantidade
         FROM itens_pedido ip
         JOIN produto_insumo pi ON pi.produto_id = ip.produto_id
         WHERE ip.pedido_id = ?
         GROUP BY pi.insumo_id`,
        [id]
      );
      for (const uso of usos) {
        await conexao.query(
          "UPDATE insumos SET quantidade_atual = quantidade_atual + ? WHERE id = ?",
          [uso.quantidade, uso.insumo_id]
        );
        await conexao.query(
          `INSERT INTO movimentacoes_estoque (insumo_id, tipo, quantidade, pedido_id, observacao)
           VALUES (?, 'entrada', ?, ?, 'Estorno por cancelamento do pedido')`,
          [uso.insumo_id, uso.quantidade, id]
        );
      }
    }

    await conexao.commit();
    res.json({ id, status });
  } catch (err) {
    await conexao.rollback();
    throw err;
  } finally {
    conexao.release();
  }
}

export async function atualizarPagamento(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { status_pagamento } = req.body;

  const validos = ["pendente", "pago", "estornado"];
  if (!validos.includes(status_pagamento)) {
    return res.status(400).json({ erro: "Status de pagamento inválido. Use: pendente, pago ou estornado." });
  }

  const [result]: any = await pool.query(
    "UPDATE pedidos SET status_pagamento = ? WHERE id = ?",
    [status_pagamento, id]
  );
  if (result.affectedRows === 0) {
    return res.status(404).json({ erro: "Pedido não encontrado." });
  }
  res.json({ id, status_pagamento });
}
