import { useState, type FormEvent } from "react";
import { KeyRound, Save, UserRound } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { ErroApi, atualizarPerfil } from "../lib/api";
import { Cartao } from "../components/ui/Cartao";
import { Botao } from "../components/ui/Botao";
import { Entrada } from "../components/ui/Entrada";

// Perfil (/painel/perfil): a dona edita nome/email e troca a senha (pedindo
// a atual). Sucesso atualiza a sessão salva para a sidebar mostrar na hora.
export function Perfil(): JSX.Element {
  const { sessao, atualizarUsuario } = useAutenticacao();
  const [nome, definirNome] = useState(sessao?.usuario.nome ?? "");
  const [email, definirEmail] = useState(sessao?.usuario.email ?? "");
  const [senhaAtual, definirSenhaAtual] = useState("");
  const [senhaNova, definirSenhaNova] = useState("");
  const [salvando, definirSalvando] = useState(false);
  const [erro, definirErro] = useState<string | null>(null);
  const [ok, definirOk] = useState(false);

  async function salvarDados(evento: FormEvent): Promise<void> {
    evento.preventDefault();
    if (!sessao) return;
    definirSalvando(true);
    definirErro(null);
    definirOk(false);
    try {
      const usuario = await atualizarPerfil(sessao.token, {
        nome: nome.trim(),
        email: email.trim(),
      });
      atualizarUsuario(usuario);
      definirOk(true);
    } catch (falha) {
      definirErro(falha instanceof ErroApi ? falha.message : "Não foi possível salvar.");
    } finally {
      definirSalvando(false);
    }
  }

  async function trocarSenha(evento: FormEvent): Promise<void> {
    evento.preventDefault();
    if (!sessao) return;
    definirSalvando(true);
    definirErro(null);
    definirOk(false);
    try {
      await atualizarPerfil(sessao.token, {
        senha_atual: senhaAtual,
        senha_nova: senhaNova,
      });
      definirSenhaAtual("");
      definirSenhaNova("");
      definirOk(true);
    } catch (falha) {
      definirErro(falha instanceof ErroApi ? falha.message : "Não foi possível trocar a senha.");
    } finally {
      definirSalvando(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-carameloForte">conta</p>
        <h1 className="font-display text-3xl font-bold text-tinta">Meu perfil</h1>
      </div>

      {erro ? (
        <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700">{erro}</p>
      ) : null}
      {ok ? (
        <p role="status" className="rounded-2xl bg-green-100 px-4 py-2.5 text-sm font-semibold text-green-800">
          Salvo com sucesso! ✅
        </p>
      ) : null}

      <Cartao>
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-tinta">
          <UserRound size={20} className="text-carameloForte" /> Dados
        </h2>
        <form onSubmit={salvarDados} className="mt-3 flex flex-col gap-3">
          <Entrada id="perfil-nome" rotulo="Nome" value={nome} onChange={(e) => definirNome(e.target.value)} autoComplete="name" />
          <Entrada id="perfil-email" rotulo="Email" type="email" value={email} onChange={(e) => definirEmail(e.target.value)} autoComplete="email" />
          <Botao type="submit" disabled={salvando} className="self-start">
            <Save size={17} /> {salvando ? "Salvando…" : "Salvar dados"}
          </Botao>
        </form>
      </Cartao>

      <Cartao>
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-tinta">
          <KeyRound size={20} className="text-carameloForte" /> Trocar senha
        </h2>
        <form onSubmit={trocarSenha} className="mt-3 flex flex-col gap-3">
          <Entrada id="perfil-atual" rotulo="Senha atual" type="password" value={senhaAtual} onChange={(e) => definirSenhaAtual(e.target.value)} autoComplete="current-password" />
          <Entrada id="perfil-nova" rotulo="Nova senha (mín. 6)" type="password" value={senhaNova} onChange={(e) => definirSenhaNova(e.target.value)} autoComplete="new-password" />
          <Botao type="submit" disabled={salvando} className="self-start">
            <KeyRound size={17} /> {salvando ? "Trocando…" : "Trocar senha"}
          </Botao>
        </form>
      </Cartao>
    </div>
  );
}
