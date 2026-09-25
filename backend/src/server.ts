import express from "express";
import cors from "cors";
import "dotenv/config";
import "express-async-errors"; // faz erros de controllers async (throw) chegarem no middleware de erro abaixo

import authRoutes from "./routes/authRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import insumoRoutes from "./routes/insumoRoutes.js";
import produtoRoutes from "./routes/produtoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import botRoutes from "./routes/botRoutes.js";
import { validarApiKeyBot } from "./middleware/apiKeyBot.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/insumos", insumoRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/bot", validarApiKeyBot, botRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Middleware de erro central: qualquer "throw" dentro de um
// controller async cai aqui, em vez de derrubar o servidor.
// Precisa ter os 4 parâmetros (err, req, res, next) para o Express
// reconhecer como error handler.
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno no servidor." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
