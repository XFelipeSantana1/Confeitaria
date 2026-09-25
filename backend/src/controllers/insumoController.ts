import pool from "../config/db.js";
import { Request, Response } from "express";

export async function listar(req: Request, res: Response) {
  const [rows] = await pool.query("SELECT * FROM insumos ORDER BY nome");
  res.json(rows);
}

export async function listarBaixoEstoque(req: Request, res: Response) {
  const [rows] = await pool.query(
    "SELECT * FROM insumos WHERE quantidade_atual <= quantidade_minima ORDER BY quantidade_atual ASC"
  );
  res.json(rows);
}

const UNIDADES_VALIDAS = ["g", "kg", "ml", "l", "unidade"];

function numeroValido(valor: unknown, permiteZero = true): boolean {
  const numero = Number(valor);
  return Number.isFinite(numero) && (permiteZero ? numero >= 0 : numero > 0);
}

export async function criar(req: Request, res: Response) {
  const { nome, unidade_medida, quantidade_atual, quantidade_minima, custo_unitario } = req.body;

  if (!nome || !unidade_medida || quantidade_atual == null || quantidade_minima == null || custo_unitario == null) {
    return res.status(400).json({ erro: "É necessário preencher todos os campos." });
  }
  if (!UNIDADES_VALIDAS.includes(unidade_medida)) {
    return res.status(400).json({ erro: "Unidade de medida inválida. Use: g, kg, ml, l ou unidade." });
  }
  if (!numeroValido(quantidade_atual) || !numeroValido(quantidade_minima) || !numeroValido(custo_unitario)) {
    return res.status(400).json({ erro: "Quantidades e custo devem ser números maiores ou iguais a zero." });
  }

  const [result]: any = await pool.query(
    `INSERT INTO insumos (nome, unidade_medida, quantidade_atual, quantidade_minima, custo_unitario)
     VALUES (?, ?, ?, ?, ?)`,
    [nome, unidade_medida, quantidade_atual, quantidade_minima, custo_unitario]
  );

  res.status(201).json({
    id: result.insertId,
    nome,
    unidade_medida,
    quantidade_atual,
    quantidade_minima,
    custo_unitario,
  });
}

// Atualização PARCIAL: só muda os campos que vierem preenchidos no body.
export async function atualizar(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { nome, unidade_medida, quantidade_minima, custo_unitario } = req.body;
  // Propositalmente NÃO inclui quantidade_atual aqui - mexer em estoque
  // é responsabilidade da função "movimentar", não de uma edição de cadastro.
  if (unidade_medida !== undefined && unidade_medida !== null && !UNIDADES_VALIDAS.includes(unidade_medida)) {
    return res.status(400).json({ erro: "Unidade de medida inválida. Use: g, kg, ml, l ou unidade." });
  }
  if (
    (quantidade_minima !== undefined && quantidade_minima !== null && !numeroValido(quantidade_minima)) ||
    (custo_unitario !== undefined && custo_unitario !== null && !numeroValido(custo_unitario))
  ) {
    return res.status(400).json({ erro: "Quantidade mínima e custo devem ser números maiores ou iguais a zero." });
  }

  const [result]: any = await pool.query(
    `UPDATE insumos SET
       nome = COALESCE(?, nome),
       unidade_medida = COALESCE(?, unidade_medida),
       quantidade_minima = COALESCE(?, quantidade_minima),
       custo_unitario = COALESCE(?, custo_unitario)
     WHERE id = ?`,
    [nome ?? null, unidade_medida ?? null, quantidade_minima ?? null, custo_unitario ?? null, id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ erro: "Insumo não encontrado." });
  }
  res.json({ mensagem: "Insumo atualizado com sucesso." });
}

// Entrada soma; ajuste/perda subtraem ('saida' manual continua bloqueada de
// propósito: saída de verdade só acontece via venda, com auditoria do pedido).
// Nunca deixa o estoque negativo nem movimenta insumo inexistente (404).
export async function movimentar(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { tipo, quantidade, observacao } = req.body; // tipo: 'entrada' | 'ajuste' | 'perda'

  if (!["entrada", "ajuste", "perda"].includes(tipo)) {
    return res.status(400).json({ erro: "Tipo inválido para esta rota." });
  }
  // Number() de verdade: string "abc" passava na checagem antiga (NaN não é
  // <= 0) e virava delta NaN no banco.
  const qtd = Number(quantidade);
  if (!Number.isFinite(qtd) || qtd <= 0) {
    return res.status(400).json({ erro: "Quantidade deve ser maior que zero." });
  }

  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();

    // Trava a linha: garante 404 se não existe e evita corrida com vendas.
    const [insumoRows]: any = await conexao.query(
      "SELECT quantidade_atual FROM insumos WHERE id = ? FOR UPDATE",
      [id]
    );
    if (!insumoRows[0]) {
      await conexao.rollback();
      return res.status(404).json({ erro: "Insumo não encontrado." });
    }
    const atual = Number(insumoRows[0].quantidade_atual);
    if (tipo !== "entrada" && atual < qtd) {
      await conexao.rollback();
      return res.status(409).json({ erro: "Estoque insuficiente para essa baixa." });
    }

    const delta = tipo === "entrada" ? qtd : -qtd;

    await conexao.query(
      "UPDATE insumos SET quantidade_atual = quantidade_atual + ? WHERE id = ?",
      [delta, id]
    );

    await conexao.query(
      `INSERT INTO movimentacoes_estoque (insumo_id, tipo, quantidade, observacao)
       VALUES (?, ?, ?, ?)`,
      [id, tipo, qtd, observacao || null]
    );

    await conexao.commit();
    res.status(201).json({ mensagem: "Estoque atualizado." });
  } catch (err) {
    await conexao.rollback();
    throw err;
  } finally {
    conexao.release();
  }
}

export async function remover(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const [result]: any = await pool.query("DELETE FROM insumos WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Insumo não encontrado." });
    }
    res.status(204).send();
  } catch (err: any) {
    // Tem ficha técnica ou movimentação vinculada: 409 explicando, não 500.
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ erro: "Insumo possui receitas ou movimentações vinculadas." });
    }
    throw err;
  }
}
