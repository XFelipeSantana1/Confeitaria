import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Painel do gestor (área logada). A URL da API vem do .env no build;
// o token JWT vai no header Authorization (ver src/lib/api.ts).
export default defineConfig({
  plugins: [react()],
});
