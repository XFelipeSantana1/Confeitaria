import { ArrowRight } from "lucide-react";
import { formatarMoeda } from "../lib/formatarMoeda";
import { formatarQuando } from "../lib/formatarData";
import { rotuloStatus, tomStatus } from "../lib/pedido";
import type { Pedido } from "../types";

// Um pedido como card empilhado — o formato do celular.
//
// A tabela de pedidos tinha 640px de largura mínima, ou seja, 288px de
// rolagem lateral num celular de 360px. Aqui o card inteiro cabe: quem,
// telefone, total e status. O card inteiro é clicável (vira <button>, não
// <li> com onClick) para o dedo abrir o detalhe sem precisar acertar um
// alvo pequeno.
interface PropriedadesCartaoPedido {
  pedido: Pedido;
  aoAbrir: (pedido: Pedido) => void;
}

export function CartaoPedido({ pedido, aoAbrir }: PropriedadesCartaoPedido): JSX.Element {
  return (
    <li>
      <button
        onClick={() => aoAbrir(pedido)}
        className="w-full rounded-3xl border border-borda bg-white p-3 text-left shadow-[0_8px_22px_-16px_rgba(43,30,23,0.25)] transition-colors active:bg-creme"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <b className="block leading-tight text-tinta">
              #{pedido.id} · {pedido.cliente_nome ?? "Cliente"}
            </b>
            <span className="block text-xs text-textoSuave">{pedido.whatsapp}</span>
          </span>
          <span
            className={`flex-none rounded-full px-3 py-1 text-xs font-bold ${tomStatus(pedido.status)}`}
          >
            {rotuloStatus(pedido.status)}
          </span>
        </div>
        <span className="mt-2 flex items-center justify-between">
          <span className="font-numero font-extrabold text-carameloForte">
            {formatarMoeda(pedido.valor_total)}
            <span className="block text-xs font-normal text-textoSuave">
              {formatarQuando(pedido.criado_em)}
            </span>
          </span>
          {/* Seta discreta: diz que o card abre algo, sem precisar de texto. */}
          <ArrowRight size={15} className="text-textoSuave" aria-hidden="true" />
        </span>
      </button>
    </li>
  );
}
