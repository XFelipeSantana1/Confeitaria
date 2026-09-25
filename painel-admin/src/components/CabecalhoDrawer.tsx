import { X } from "lucide-react";
import { rotuloStatus, tomStatus } from "../lib/pedido";

// Topo do drawer: número, selo de status e fechar. Separado para o drawer
// cuidar só de dados e ações, não de apresentação do cabeçalho.
interface PropriedadesCabecalhoDrawer {
  pedidoId: number;
  status: string | null;
  aoFechar: () => void;
}

export function CabecalhoDrawer({
  pedidoId,
  status,
  aoFechar,
}: PropriedadesCabecalhoDrawer): JSX.Element {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-dashed border-borda p-5">
      <div>
        <h3 className="font-display text-2xl font-bold">Pedido #{pedidoId}</h3>
        {status && (
          <span className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${tomStatus(status)}`}>
            {rotuloStatus(status)}
          </span>
        )}
      </div>
      <button
        onClick={aoFechar}
        aria-label="Fechar detalhe"
        className="grid h-10 w-10 place-items-center rounded-xl border border-borda bg-white"
      >
        <X size={19} />
      </button>
    </div>
  );
}
