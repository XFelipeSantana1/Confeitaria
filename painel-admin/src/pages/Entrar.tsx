import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CakeSlice, Check, LogIn } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { ErroApi } from "../lib/api";
import { Botao } from "../components/ui/Botao";
import { Entrada } from "../components/ui/Entrada";

// Porta de entrada do painel. Mesmo padrão do AuthDrawer: carregando + erro
// + try/catch/finally; 401 vira "credenciais" (sem dizer se é email ou senha).
export function Entrar(): JSX.Element {
  const { entrarComSenha } = useAutenticacao();
  const navegar = useNavigate();
  const [email, definirEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [carregando, definirCarregando] = useState(false);
  const [erro, definirErro] = useState<string | null>(null);

  async function aoEnviar(evento: FormEvent): Promise<void> {
    evento.preventDefault();
    if (!email.trim() || !senha) {
      definirErro("Informe email e senha.");
      return;
    }
    definirCarregando(true);
    definirErro(null);
    try {
      await entrarComSenha(email.trim(), senha);
      navegar("/painel", { replace: true });
    } catch (falha) {
      definirErro(
        falha instanceof ErroApi && falha.codigo === 401
          ? "Email ou senha incorretos."
          : (falha instanceof Error ? falha.message : "Não foi possível entrar."),
      );
    } finally {
      definirCarregando(false);
    }
  }

  return (
    <div className="grid min-h-screen font-corpo md:grid-cols-2">
      {/* Lado marca: vende o sonho (só desktop — no mobile é só o form). */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-tinta p-10 text-creme md:flex">
        <p className="flex items-center gap-2 font-display text-2xl font-extrabold">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-caramelo text-white">
            <CakeSlice size={22} />
          </span>
          Confeito<em className="text-dourado">Gest</em>
        </p>
        <div>
          <h1 className="max-w-md font-display text-4xl font-bold leading-tight">
            A sua confeitaria <em className="text-dourado">no controle.</em>
          </h1>
          <ul className="mt-6 flex flex-col gap-3 text-sm text-creme/70">
            <li className="flex items-center gap-2"><Check size={16} className="text-dourado" /> Pedidos do bot caindo direto no painel</li>
            <li className="flex items-center gap-2"><Check size={16} className="text-dourado" /> Estoque baixado sozinho a cada venda</li>
            <li className="flex items-center gap-2"><Check size={16} className="text-dourado" /> Ficha técnica sem furo de estoque</li>
          </ul>
        </div>
        <p className="text-xs text-creme/40">TCC Desenvolvimento de Sistemas — Etec 🍓</p>
      </div>

      {/* Lado acesso. */}
      <div className="grid place-items-center bg-creme px-4">
        <form
          onSubmit={aoEnviar}
          className="w-full max-w-sm rounded-3xl border border-borda bg-white p-7 shadow-Cartao"
        >
        <h1 className="font-display text-xl font-bold text-tinta md:hidden">Entrar no painel</h1>
        <div className="mt-4 flex flex-col gap-3">
          <Entrada
            id="email"
            rotulo="Email"
            type="email"
            autoComplete="username"
            placeholder="voce@confeitaria.com"
            value={email}
            onChange={(evento) => definirEmail(evento.target.value)}
          />
          <Entrada
            id="senha"
            rotulo="Senha"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={senha}
            onChange={(evento) => definirSenha(evento.target.value)}
          />
        </div>
        {erro ? (
          <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
            {erro}
          </p>
        ) : null}
        <Botao type="submit" disabled={carregando} className="mt-4 w-full py-3">
          <LogIn size={17} /> {carregando ? "Entrando…" : "Entrar"}
        </Botao>
      </form>
      </div>
    </div>
  );
}
