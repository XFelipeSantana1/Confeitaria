import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import pool from "../config/db.js";
import { Request, Response } from "express";
import { RequisicaoAutenticada } from "../middleware/auth.js";

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  const [rows]: any = await pool.query(
    "SELECT * FROM usuarios WHERE email = ? AND ativo = TRUE",
    [email]
  );
  const usuario = rows[0];

  if (!usuario) {
    return res.status(401).json({ erro: "Credenciais inválidas." });
  }

  const senhaOk = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaOk) {
    return res.status(401).json({ erro: "Credenciais inválidas." });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, cargo: usuario.cargo },
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXPIRES_IN || "8h") as jwt.SignOptions["expiresIn"] }
  );

  res.json({
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, cargo: usuario.cargo },
  });
}

export async function registrar(req: RequisicaoAutenticada, res: Response) {
  const { nome, email, senha, cargo } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
  }

  const cargoFinal = cargo || "gestor";
  if (!["admin", "gestor"].includes(cargoFinal)) {
    return res.status(400).json({ erro: "Cargo inválido. Use: admin ou gestor." });
  }

  // A partir do momento em que existe ao menos 1 usuário, criar novos
  // usuários exige estar logado como admin. A exceção é o bootstrap:
  // com a base vazia, o primeiro cadastro é livre (é assim que se cria
  // o admin inicial). Sem isso a rota ficaria aberta para sempre.
  const [existentes]: any = await pool.query("SELECT COUNT(*) AS total FROM usuarios");
  if (Number(existentes[0]?.total) > 0) {
    if (!req.usuario) {
      return res.status(401).json({ erro: "Apenas administradores podem cadastrar usuários." });
    }
    if (req.usuario.cargo !== "admin") {
      return res.status(403).json({ erro: "Apenas administradores podem cadastrar usuários." });
    }
  }

  const senha_hash = await bcrypt.hash(senha, 10);

  try {
    const [result]: any = await pool.query(
      "INSERT INTO usuarios (nome, email, senha_hash, cargo) VALUES (?, ?, ?, ?)",
      [nome, email, senha_hash, cargoFinal]
    );
    res.status(201).json({ id: result.insertId, nome, email, cargo: cargoFinal });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Já existe um usuário com esse email." });
    }
    throw err;
  }
}

// GET /api/auth/me - retorna quem é o dono do token (o front usa isso
// para validar a sessão salva e exibir nome/cargo no painel).
export async function me(req: RequisicaoAutenticada, res: Response) {
  const [rows]: any = await pool.query(
    "SELECT id, nome, email, cargo, ativo FROM usuarios WHERE id = ?",
    [req.usuario!.id]
  );
  const usuario = rows[0];
  if (!usuario || !usuario.ativo) {
    return res.status(401).json({ erro: "Usuário não encontrado ou inativo." });
  }
  res.json(usuario);
}

// PUT /api/auth/me - o próprio usuário edita nome/email e troca a senha.
// Escopo travado no id do token (nunca edita outra pessoa). Troca de senha
// exige a senha atual; email duplicado vira 409.
export async function atualizarPerfil(req: RequisicaoAutenticada, res: Response) {
  const id = req.usuario!.id;
  const { nome, email, senha_atual, senha_nova } = req.body;

  if (nome !== undefined && (typeof nome !== "string" || nome.trim() === "")) {
    return res.status(400).json({ erro: "Nome inválido." });
  }
  if (email !== undefined && (typeof email !== "string" || !email.includes("@"))) {
    return res.status(400).json({ erro: "Email inválido." });
  }
  if (senha_nova !== undefined && (typeof senha_nova !== "string" || senha_nova.length < 6)) {
    return res.status(400).json({ erro: "A nova senha precisa de ao menos 6 caracteres." });
  }

  try {
    let senha_hash: string | null = null;
    if (senha_nova !== undefined) {
      if (!senha_atual) {
        return res.status(400).json({ erro: "Informe a senha atual para trocar a senha." });
      }
      const [linhas]: any = await pool.query(
        "SELECT senha_hash FROM usuarios WHERE id = ?",
        [id]
      );
      if (!linhas[0]) return res.status(404).json({ erro: "Usuário não encontrado." });
      const confere = await bcrypt.compare(senha_atual, linhas[0].senha_hash);
      if (!confere) {
        return res.status(401).json({ erro: "Senha atual incorreta." });
      }
      senha_hash = await bcrypt.hash(senha_nova, 10);
    }

    const [result]: any = await pool.query(
      `UPDATE usuarios SET
         nome = COALESCE(?, nome),
         email = COALESCE(?, email),
         senha_hash = COALESCE(?, senha_hash)
       WHERE id = ? AND ativo = TRUE`,
      [
        nome !== undefined ? nome.trim() : null,
        email !== undefined ? email.trim() : null,
        senha_hash,
        id,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const [atualizado]: any = await pool.query(
      "SELECT id, nome, email, cargo FROM usuarios WHERE id = ?",
      [id]
    );
    res.json(atualizado[0]);
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Já existe um usuário com esse email." });
    }
    throw err;
  }
}
