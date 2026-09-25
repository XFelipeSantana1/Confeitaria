import pool from "../config/db.js";
import { Request, Response } from "express";

export async function listar(req: Request, res: Response) {
  const [rows] = await pool.query("SELECT * FROM categorias ORDER BY nome");
  res.json(rows);
}

export async function criar(req: Request, res: Response) {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ erro: "Nome é obrigatório." });
  }

  try {
    const [result]: any = await pool.query(
      "INSERT INTO categorias (nome) VALUES (?)",
      [nome]
    );
    res.status(201).json({ id: result.insertId, nome });
  } catch (err: any) {
    // Nome é UNIQUE: duplicada vira 409 (mesmo padrão do registrar de usuários).
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Já existe uma categoria com esse nome." });
    }
    throw err;
  }
}

export async function atualizar(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { nome } = req.body;

  try {
    const [result]: any = await pool.query(
      "UPDATE categorias SET nome = COALESCE(?, nome) WHERE id = ?",
      [nome ?? null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Categoria não encontrada." });
    }
    res.json({ id, nome });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Já existe uma categoria com esse nome." });
    }
    throw err;
  }
}

export async function remover(req: Request, res: Response) {
  const id = Number(req.params.id);
  const [result]: any = await pool.query("DELETE FROM categorias WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ erro: "Categoria não encontrada." });
  }
  res.status(204).send();
}
