import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { ErroApi } from "../lib/api";
import { Botao } from "../components/ui/Botao";
import { Entrada } from "../components/ui/Entrada";
import { MarcaLogin } from "../components/MarcaLogin";

// Porta de entrada do painel. Mesmo padrão do painel: carregando + erro
// + try/catch/finally; 401 vira "credenciais" (sem dizer se foi email ou senha).
//
// No desktop a tela é dividida: foto à esquerda, formulário à direita. No
// celular a foto vira uma faixa curta no topo e o formulário vem logo abaixo
// — antes o gestor via só o formulário, sem nenhuma pista de onde estava.
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
    <div className="flex min-h-screen flex-col font-corpo md:grid md:grid-cols-2">
      <MarcaLogin compacta />
      <MarcaLogin />

      <div className="grid flex-1 place-items-center bg-creme px-4 py-10">
        <form
          onSubmit={aoEnviar}
          className="w-full max-w-sm rounded-3xl border border-borda bg-white p-7 shadow-Cartao"
        >
          <h1 className="font-display text-xl font-bold text-tinta">
            Entrar no painel
          </h1>
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
            <p
              role="alert"
              className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700"
            >
              {erro}
            </p>
          ) : null}
          <Botao type="submit" carregando={carregando} className="mt-4 w-full py-3">
            <LogIn size={17} /> {carregando ? "Entrando…" : "Entrar"}
          </Botao>
        </form>
      </div>
    </div>
  );
}
