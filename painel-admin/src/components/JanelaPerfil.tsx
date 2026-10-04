import { useState, type FormEvent } from "react";
import { CircleCheck, Save, UserRound, X } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { useUploadImagem } from "../hooks/useUploadImagem";
import { ErroApi, atualizarPerfil } from "../lib/api";
import { Botao } from "./ui/Botao";
import { Entrada } from "./ui/Entrada";
import { CampoImagem } from "./CampoImagem";
import { FormularioSenha } from "./FormularioSenha";
import { Avatar } from "./Avatar";

/**
 * Meu perfil, em janela.
 *
 * Era página inteira para duas linhas de formulário — e uma tela do menu que
 * nunca era visitada no meio do trabalho. Agora abre pelo nome do gestor, na
 * sidebar e na gaveta, que é onde a pessoa procura quando quer sair ou trocar a
 * senha.
 *
 * Os dois formulários são independentes de propósito: salvar o nome não pode
 * apagar o que já foi digitado no campo de senha, e vice-versa.
 */
export function JanelaPerfil({ aoFechar }: { aoFechar: () => void }): JSX.Element {
  const { sessao, atualizarUsuario } = useAutenticacao();
  const { enviar: enviarFoto } = useUploadImagem(sessao?.token ?? null);

  const [dados, definirDados] = useState({
    nome: sessao?.usuario.nome ?? "",
    email: sessao?.usuario.email ?? "",
  });
  const [salvando, definirSalvando] = useState(false);
  const [erro, definirErro] = useState<string | null>(null);
  const [ok, definirOk] = useState<string | null>(null);
  // A foto já sobe no momento em que é escolhida, como no produto. Guardar o
  // arquivo em estado até o "Salvar dados" seguraria a imagem em memória
  // durante toda a edição e perderia a foto num refresh acidental.
  const [enviandoFoto, definirEnviandoFoto] = useState(false);

  function limparAvisos(): void {
    definirErro(null);
    definirOk(null);
  }

  async function salvarDados(evento: FormEvent): Promise<void> {
    evento.preventDefault();
    if (!sessao) return;
    definirSalvando(true);
    limparAvisos();
    try {
      const usuario = await atualizarPerfil(sessao.token, {
        nome: dados.nome.trim(),
        email: dados.email.trim(),
      });
      // Atualiza a sessão na hora: a sidebar e a gaveta mostram o novo nome
      // sem precisar recarregar.
      atualizarUsuario(usuario);
      definirOk("Dados salvos.");
    } catch (falha) {
      definirErro(falha instanceof ErroApi ? falha.message : "Não foi possível salvar.");
    } finally {
      definirSalvando(false);
    }
  }

  async function guardarFoto(caminho: string): Promise<void> {
    if (!sessao) return;
    definirEnviandoFoto(true);
    limparAvisos();
    try {
      const usuario = await atualizarPerfil(sessao.token, { imagem_url: caminho });
      atualizarUsuario(usuario);
      definirOk("Foto atualizada.");
    } catch (falha) {
      definirErro(falha instanceof ErroApi ? falha.message : "Não foi possível enviar a foto.");
    } finally {
      definirEnviandoFoto(false);
    }
  }

  async function removerFoto(): Promise<void> {
    if (!sessao) return;
    definirEnviandoFoto(true);
    limparAvisos();
    try {
      // `null` no corpo, e não string vazia: o backend trata como "remover".
      const usuario = await atualizarPerfil(sessao.token, { imagem_url: null });
      atualizarUsuario(usuario);
      definirOk("Foto removida.");
    } catch (falha) {
      definirErro(falha instanceof ErroApi ? falha.message : "Não foi possível remover a foto.");
    } finally {
      definirEnviandoFoto(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-tinta/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Meu perfil"
      onClick={aoFechar}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white text-tinta shadow-Cartao"
        onClick={(evento) => evento.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-2 border-b border-borda p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-carameloForte">conta</p>
            <h2 className="font-display text-2xl font-bold">Meu perfil</h2>
          </div>
          <button
            onClick={aoFechar}
            aria-label="Fechar"
            className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-borda"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex flex-col gap-4 overflow-y-auto p-5">
          {erro ? (
            <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              {erro}
            </p>
          ) : null}
          {ok ? (
            <p
              role="status"
              className="flex items-center gap-2 rounded-xl bg-green-100 px-3 py-2 text-sm font-semibold text-green-800"
            >
              <CircleCheck size={16} aria-hidden="true" /> {ok}
            </p>
          ) : null}

          <div className="rounded-2xl border border-borda bg-creme p-4">
            <div className="mb-3 flex items-center gap-3">
              <Avatar
                nome={sessao?.usuario.nome}
                imagemUrl={sessao?.usuario.imagem_url}
                tamanho="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{sessao?.usuario.nome}</p>
                <p className="truncate text-xs text-textoSuave">{sessao?.usuario.email}</p>
              </div>
              {sessao?.usuario.imagem_url ? (
                <Botao
                  variante="clara"
                  className="px-3 py-1.5 text-xs text-rose-700"
                  onClick={() => void removerFoto()}
                  carregando={enviandoFoto}
                >
                  Remover
                </Botao>
              ) : null}
            </div>
            <CampoImagem
              valor={sessao?.usuario.imagem_url ?? ""}
              rotulo="Foto do perfil"
              proporcao={1}
              textoAjuda="A foto entra no círculo do seu nome, na barra lateral e no menu do celular. No celular, o ajuste de recorte aparece depois de escolher a foto."
              aoMudar={(caminho) => void guardarFoto(caminho)}
              aoEnviar={enviarFoto}
              salvando={enviandoFoto}
            />
          </div>

          <form onSubmit={salvarDados} className="flex flex-col gap-3 border-t border-dashed border-borda pt-4">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold">
              <UserRound size={18} className="text-carameloForte" aria-hidden="true" /> Dados
            </h3>
            <Entrada
              id="perfil-nome"
              rotulo="Nome"
              value={dados.nome}
              onChange={(evento) => definirDados({ ...dados, nome: evento.target.value })}
              autoComplete="name"
            />
            <Entrada
              id="perfil-email"
              rotulo="Email"
              type="email"
              value={dados.email}
              onChange={(evento) => definirDados({ ...dados, email: evento.target.value })}
              autoComplete="email"
            />
            <Botao type="submit" carregando={salvando} className="self-start">
              <Save size={17} /> Salvar dados
            </Botao>
          </form>

          <FormularioSenha
            aoAvisar={(mensagem) => {
              definirErro(null);
              definirOk(mensagem);
            }}
            aoErro={(mensagem) => {
              definirOk(null);
              definirErro(mensagem);
            }}
          />
        </div>
      </div>
    </div>
  );
}