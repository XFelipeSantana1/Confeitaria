import { AlertTriangle } from "lucide-react";
import { Botao } from "./ui/Botao";

// Confirmação com a cara do painel (substitui confirm()/alert() nativos):
// título, explicação do impacto e botões claros. Perigo usa terracota.
interface PropriedadesModalConfirmacao {
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  processando?: boolean;
  erro?: string | null;
  aoFechar: () => void;
  aoConfirmar: () => void;
}

export function ModalConfirmacao({
  titulo,
  mensagem,
  textoConfirmar = "Confirmar",
  processando = false,
  erro = null,
  aoFechar,
  aoConfirmar,
}: PropriedadesModalConfirmacao): JSX.Element {
  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-tinta/50 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={aoFechar}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-center text-tinta shadow-Cartao"
        onClick={(evento) => evento.stopPropagation()}
      >
        <p className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-caramelo/15 text-carameloForte">
          <AlertTriangle size={26} />
        </p>
        <h3 className="mt-3 font-display text-xl font-bold">{titulo}</h3>
        <p className="mt-1 text-sm text-textoSuave">{mensagem}</p>
        {erro ? (
          <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
            {erro}
          </p>
        ) : null}
        <div className="mt-5 flex gap-2">
          <Botao variante="clara" onClick={aoFechar} className="flex-1" disabled={processando}>
            Voltar
          </Botao>
          <Botao onClick={aoConfirmar} className="flex-1" disabled={processando}>
            {processando ? "Aguarde…" : textoConfirmar}
          </Botao>
        </div>
      </div>
    </div>
  );
}
