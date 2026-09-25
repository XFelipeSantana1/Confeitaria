import "dotenv/config";
import { Request, Response, NextFunction } from "express";

export function validarApiKeyBot(req: Request, res: Response, next: NextFunction) {
  // Fail-closed de propósito: sem chave configurada, a rota do bot responde
  // 500 em vez de ficar aberta. Rota aberta criaria pedidos e baixaria
  // estoque sem nenhuma autenticação (era o comportamento anterior).
  if (!process.env.BOT_API_KEY) {
    return res.status(500).json({ erro: "Bot não configurado no servidor." });
  }
  const chave = req.headers["x-api-key"];
  if (chave !== process.env.BOT_API_KEY) {
    return res.status(401).json({ erro: "Chave de API do bot inválida." });
  }
  next();
}
