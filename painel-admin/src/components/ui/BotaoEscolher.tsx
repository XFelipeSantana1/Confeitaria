// Botão que abre o explorador de arquivos e aceita arrastar.
//
// Saiu do corpo do CampoImagem porque os manipuladores de drag entalhavam o
// JSX: eram 20 linhas de evento no meio do layout, e quem abrisse o arquivo
// para mudar o campo era obrigado a ler tudo antes de achar a foto.
import { Loader2, Upload } from "lucide-react";

interface PropriedadesBotaoEscolher {
  occupado: boolean;
  enviando: boolean;
  arrastando: boolean;
  trocou: boolean;
  aoClicar: () => void;
  aoArrastarSobre: () => void;
  aoSair: () => void;
  aoSoltar: (arquivo: File | undefined) => void;
}

export function BotaoEscolher({
  occupado,
  enviando,
  arrastando,
  trocou,
  aoClicar,
  aoArrastarSobre,
  aoSair,
  aoSoltar,
}: PropriedadesBotaoEscolher): JSX.Element {
  return (
    <button
      type="button"
      onClick={aoClicar}
      disabled={occupado}
      onDragOver={(evento) => {
        // Sem preventDefault o navegador abre o arquivo numa aba nova em vez
        // de soltar no campo.
        evento.preventDefault();
        aoArrastarSobre();
      }}
      onDragLeave={aoSair}
      onDrop={(evento) => {
        evento.preventDefault();
        aoSoltar(evento.dataTransfer.files[0]);
      }}
      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors disabled:opacity-60 ${
        arrastando
          ? "border-caramelo bg-areia"
          : "border-borda bg-white text-tinta hover:border-caramelo hover:bg-creme"
      }`}
    >
      {enviando ? (
        <Loader2 size={15} className="motion-safe:animate-spin" aria-hidden="true" />
      ) : (
        <Upload size={15} aria-hidden="true" />
      )}
      {trocou ? "Trocar a foto" : "Escolher foto"}
    </button>
  );
}
