import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { ErroApi, atualizarPerfil } from "../lib/api";
import { Botao } from "./ui/Botao";
import { Entrada } from "./ui/Entrada";

interface PropriedadesFormularioSenha {
  aoAvisar: (mensagem: string) => void;
  aoErro: (mensagem: string) => void;
}

/**
 * Troca de senha, isolada do resto da janela.
 *
 * Fica em arquivo próprio porque os campos precisam começar VAZIOS sempre que
 * a janela abre: quem erra a senha atual não pode sair, corrigir o nome e
 * voltar para descobrir que a caixa ainda mostra a senha antiga. Montando o
 * formulário dentro da janela, o `useState` sobreviveria à segunda abertura.
 */
export function FormularioSenha({
  aoAvisar,
  aoErro,
}: PropriedadesFormularioSenha): JSX.Element {
  const { sessao } = useAutenticacao();
  const [senhas, definirSenhas] = useState({ atual: "", nova: "" });
  const [salvando, definirSalvando] = useState(false);

  async function enviar(evento: FormEvent): Promise<void> {
    evento.preventDefault();
    if (!sessao) return;
    definirSalvando(true);
    try {
      await atualizarPerfil(sessao.token, {
        senha_atual: senhas.atual,
        senha_nova: senhas.nova,
      });
      // Limpa os campos: a senha antiga não pode ficar escrita no formulário
      // depois de trocar, e o vazio avisa que foi preciso.
      definirSenhas({ atual: "", nova: "" });
      aoAvisar("Senha trocada.");
    } catch (falha) {
      aoErro(falha instanceof ErroApi ? falha.message : "Não foi possível trocar a senha.");
    } finally {
      definirSalvando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3 border-t border-dashed border-borda pt-4">
      <h3 className="flex items-center gap-2 font-display text-lg font-bold">
        <KeyRound size={18} className="text-carameloForte" aria-hidden="true" /> Trocar senha
      </h3>
      <Entrada
        id="perfil-atual"
        rotulo="Senha atual"
        type="password"
        value={senhas.atual}
        onChange={(evento) => definirSenhas({ ...senhas, atual: evento.target.value })}
        autoComplete="current-password"
      />
      <Entrada
        id="perfil-nova"
        rotulo="Nova senha (mín. 6)"
        type="password"
        value={senhas.nova}
        onChange={(evento) => definirSenhas({ ...senhas, nova: evento.target.value })}
        autoComplete="new-password"
      />
      <Botao type="submit" carregando={salvando} className="self-start">
        <KeyRound size={17} /> Trocar senha
      </Botao>
    </form>
  );
}
