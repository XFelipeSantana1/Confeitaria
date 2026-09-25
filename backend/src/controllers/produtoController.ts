import pool from "../config/db.js";
import { Request, Response } from "express";

// Valida a ficha técnica antes de qualquer INSERT: evita 500 de FK com
// mensagem de banco e barra quantidade zerada/negativa na receita.
function fichaValida(ficha_tecnica: unknown): ficha_tecnica is Array<{ insumo_id: number; quantidade_necessaria: number }> {
  if (!Array.isArray(ficha_tecnica)) return false;
  return ficha_tecnica.every(
    (item: any) =>
      item &&
      Number.isInteger(Number(item.insumo_id)) &&
      Number(item.insumo_id) > 0 &&
      Number.isFinite(Number(item.quantidade_necessaria)) &&
      Number(item.quantidade_necessaria) > 0
  );
}

// Traduz violação de FK em resposta de negócio (404 do dono do vínculo).
function respostaFk(err: any, res: Response): boolean {
  if (err?.code !== "ER_NO_REFERENCED_ROW_2" && err?.code !== "ER_NO_REFERENCED_ROW") return false;
  const mensagem: string = err?.sqlMessage || "";
  if (mensagem.includes("fk_produtos_categoria")) {
    res.status(404).json({ erro: "Categoria informada não existe." });
  } else if (mensagem.includes("fk_pi_insumo")) {
    res.status(404).json({ erro: "Um dos insumos da ficha técnica não existe." });
  } else {
    res.status(400).json({ erro: "Referência inválida nos dados enviados." });
  }
  return true;
}

// GET /api/produtos -> vitrine do cliente (só produtos ativos)
export async function listarPublico(req: Request, res: Response) {
  const [rows] = await pool.query(
    `SELECT p.id, p.nome, p.descricao, p.preco, p.imagem_url, c.nome AS categoria
     FROM produtos p
     LEFT JOIN categorias c ON c.id = p.categoria_id
     WHERE p.ativo = TRUE
     ORDER BY c.nome, p.nome`
  );
  res.json(rows);
}

// GET /api/produtos/admin/todos -> painel (inclui inativos)
export async function listarTodos(req: Request, res: Response) {
  const [rows] = await pool.query(
    `SELECT p.*, c.nome AS categoria
     FROM produtos p
     LEFT JOIN categorias c ON c.id = p.categoria_id
     ORDER BY p.nome`
  );
  res.json(rows);
}

// GET /api/produtos/:id -> vitrine (SEM ficha técnica: receita é segredo
// da casa e a vitrine não precisa dela para vender).
export async function buscarPorId(req: Request, res: Response) {
  const id = Number(req.params.id);

  const [produtoRows]: any = await pool.query(
    `SELECT p.id, p.nome, p.descricao, p.preco, p.imagem_url, p.ativo, c.nome AS categoria
     FROM produtos p LEFT JOIN categorias c ON c.id = p.categoria_id
     WHERE p.id = ?`,
    [id]
  );
  if (!produtoRows[0]) return res.status(404).json({ erro: "Produto não encontrado." });

  res.json(produtoRows[0]);
}

// GET /api/produtos/admin/:id -> painel (COM ficha técnica para edição).
export async function buscarPorIdAdmin(req: Request, res: Response) {
  const id = Number(req.params.id);

  const [produtoRows]: any = await pool.query("SELECT * FROM produtos WHERE id = ?", [id]);
  if (!produtoRows[0]) return res.status(404).json({ erro: "Produto não encontrado." });

  const [insumos] = await pool.query(
    `SELECT i.id, i.nome, i.unidade_medida, pi.quantidade_necessaria
     FROM produto_insumo pi
     JOIN insumos i ON i.id = pi.insumo_id
     WHERE pi.produto_id = ?`,
    [id]
  );

  res.json({ ...produtoRows[0], ficha_tecnica: insumos });
}

// POST /api/produtos
// Body: { nome, descricao, preco, categoria_id, imagem_url,
//         ficha_tecnica: [{ insumo_id, quantidade_necessaria }] }
export async function criar(req: Request, res: Response) {
  const { nome, descricao, preco, categoria_id, imagem_url, ficha_tecnica } = req.body;
  if (!nome || preco == null) {
    return res.status(400).json({ erro: "Nome e preço são obrigatórios." });
  }
  if (!Number.isFinite(Number(preco)) || Number(preco) <= 0) {
    return res.status(400).json({ erro: "Preço deve ser maior que zero." });
  }
  if (ficha_tecnica !== undefined && !fichaValida(ficha_tecnica)) {
    return res.status(400).json({ erro: "Ficha técnica inválida: cada item precisa de insumo_id e quantidade_necessaria maiores que zero." });
  }

  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();

    const [result]: any = await conexao.query(
      `INSERT INTO produtos (nome, descricao, preco, categoria_id, imagem_url)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, descricao || null, preco, categoria_id || null, imagem_url || null]
    );
    const produtoId = result.insertId;

    if (Array.isArray(ficha_tecnica) && ficha_tecnica.length > 0) {
      const valores = ficha_tecnica.map((item: any) => [produtoId, item.insumo_id, item.quantidade_necessaria]);
      await conexao.query(
        "INSERT INTO produto_insumo (produto_id, insumo_id, quantidade_necessaria) VALUES ?",
        [valores]
      );
    }

    await conexao.commit();
    res.status(201).json({ id: produtoId, nome });
  } catch (err) {
    await conexao.rollback();
    if (respostaFk(err, res)) return;
    throw err;
  } finally {
    conexao.release();
  }
}

// PUT /api/produtos/:id - atualização parcial dos dados básicos
export async function atualizar(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { nome, descricao, preco, categoria_id, imagem_url, ativo } = req.body;

  const [result]: any = await pool.query(
    `UPDATE produtos SET
       nome = COALESCE(?, nome),
       descricao = COALESCE(?, descricao),
       preco = COALESCE(?, preco),
       categoria_id = COALESCE(?, categoria_id),
       imagem_url = COALESCE(?, imagem_url),
       ativo = COALESCE(?, ativo)
     WHERE id = ?`,
    [nome ?? null, descricao ?? null, preco ?? null, categoria_id ?? null, imagem_url ?? null, ativo ?? null, id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }
  res.json({ mensagem: "Produto atualizado com sucesso." });
}

// PUT /api/produtos/:id/ficha-tecnica - substitui a receita inteira.
// Primeiro confirma que o produto existe (antes respondia 200 em id fantasma).
export async function atualizarFichaTecnica(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { ficha_tecnica } = req.body;

  if (ficha_tecnica !== undefined && !fichaValida(ficha_tecnica)) {
    return res.status(400).json({ erro: "Ficha técnica inválida: cada item precisa de insumo_id e quantidade_necessaria maiores que zero." });
  }

  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();

    const [produtoRows]: any = await conexao.query("SELECT id FROM produtos WHERE id = ?", [id]);
    if (!produtoRows[0]) {
      await conexao.rollback();
      return res.status(404).json({ erro: "Produto não encontrado." });
    }

    await conexao.query("DELETE FROM produto_insumo WHERE produto_id = ?", [id]);

    if (Array.isArray(ficha_tecnica) && ficha_tecnica.length > 0) {
      const valores = ficha_tecnica.map((item: any) => [id, item.insumo_id, item.quantidade_necessaria]);
      await conexao.query(
        "INSERT INTO produto_insumo (produto_id, insumo_id, quantidade_necessaria) VALUES ?",
        [valores]
      );
    }

    await conexao.commit();
    res.json({ mensagem: "Ficha técnica atualizada." });
  } catch (err) {
    await conexao.rollback();
    if (respostaFk(err, res)) return;
    throw err;
  } finally {
    conexao.release();
  }
}

// GET /api/produtos/admin/mais-vendidos -> dashboard do painel
export async function maisVendidos(req: Request, res: Response) {
  const [rows] = await pool.query(
    `SELECT p.id, p.nome, SUM(ip.quantidade) AS total_vendido
     FROM itens_pedido ip
     JOIN produtos p ON p.id = ip.produto_id
     JOIN pedidos pe ON pe.id = ip.pedido_id
     WHERE pe.status != 'cancelado'
     GROUP BY p.id
     ORDER BY total_vendido DESC
     LIMIT 10`
  );
  res.json(rows);
}

export async function remover(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const [result]: any = await pool.query("DELETE FROM produtos WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Produto não encontrado." });
    }
    res.status(204).send();
  } catch (err: any) {
    // Tem itens de pedido vinculados: 409 explicando, não 500.
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ erro: "Produto possui vendas vinculadas e não pode ser removido." });
    }
    throw err;
  }
}
