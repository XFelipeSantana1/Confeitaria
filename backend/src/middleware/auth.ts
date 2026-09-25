import jwt from "jsonwebtoken";
import "dotenv/config";
import { Request, Response, NextFunction } from "express";

export interface RequisicaoAutenticada extends Request {
  usuario?: { id: number; email: string; cargo: string };
}

export function autenticar(req: RequisicaoAutenticada, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não informado." });
  }

  const [esquema, token] = authHeader.split(" ");
  if (esquema !== "Bearer" || !token) {
    return res.status(401).json({ erro: "Formato do token inválido. Use: Bearer <token>." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.usuario = payload as any;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

// Variação que NÃO bloqueia requisições sem token: apenas preenche
// req.usuario quando o token é válido. Usada pelo registrar para permitir
// o bootstrap do primeiro usuário (base vazia) sem deixar a rota aberta
// depois que já existem usuários.
export function autenticarOpcional(req: RequisicaoAutenticada, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")?.[1];
  if (token) {
    try {
      req.usuario = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    } catch {
      // Token inválido aqui é ignorado de propósito: o controller decide
      // o que fazer (a rota de registro exige admin quando já há usuários).
    }
  }
  next();
}
