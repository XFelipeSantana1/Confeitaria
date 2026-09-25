import { MessageCircleHeart, X } from "lucide-react";

// Explica o pedido em 3 passos. Separado do App para o App não virar um
// arquivo gigante — mesma regra dos outros componentes pequenos.
interface PropriedadesModalAjuda {
  aberto: boolean;
  aoFechar: () => void;
}

export function ModalAjuda({ aberto, aoFechar }: PropriedadesModalAjuda): JSX.Element | null {
  if (!aberto) return null;
  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-tinta/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Como funciona"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-tinta shadow-Cartao">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-xl font-bold">
            <MessageCircleHeart size={20} /> Como funciona
          </h3>
          <button
            onClick={aoFechar}
            aria-label="Fechar ajuda"
            className="grid h-10 w-10 place-items-center rounded-xl border border-borda hover:-translate-y-0.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <ol className="flex list-none flex-col gap-3 p-0 font-corpo text-[15px] leading-relaxed">
          <li>
            <b>1.</b> Toque em <b>+</b> nos doces que você quer.
          </li>
          <li>
            <b>2.</b> Abra a <b>sacola</b>, confira e diga seu nome.
          </li>
          <li>
            <b>3.</b> Toque em <b>Finalizar no WhatsApp</b> — a mensagem já vai
            prontinha, é só enviar. 💬
          </li>
        </ol>
      </div>
    </div>
  );
}
