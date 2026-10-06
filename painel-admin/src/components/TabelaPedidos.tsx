import { formatarMoeda } from "../lib/formatarMoeda";
import { formatarQuando } from "../lib/formatarData";
import { rotuloStatus, tomStatus } from "../lib/pedido";
import type { Pedido } from "../types";
import { Cartao } from "./ui/Cartao";

// Tabela de pedidos do desktop. Abaixo de `md` quem manda é o CartaoPedido:
// a tabela tinha 640px de largura mínima, ou seja, 288px de rolagem lateral
// num celular de 360px.
//
// A linha inteira é clicável e abre o drawer de detalhe — por isso o
// cursor-pointer e o hover.
interface PropriedadesTabelaPedidos {
  pedidos: Pedido[];
  aoAbrir: (pedido: Pedido) => void;
}

export function TabelaPedidos({ pedidos, aoAbrir }: PropriedadesTabelaPedidos): JSX.Element {
  return (
    <Cartao className="hidden overflow-x-auto p-0 md:block">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-borda text-xs uppercase tracking-wide text-textoSuave">
            <th className="px-4 py-3">Pedido</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr
              key={pedido.id}
              onClick={() => aoAbrir(pedido)}
              className="cursor-pointer border-b border-borda/60 transition-colors last:border-0 hover:bg-creme"
            >
              <td className="px-4 py-3 font-bold text-tinta">#{pedido.id}</td>
              <td className="px-4 py-3 text-tinta">
                {pedido.cliente_nome ?? "Cliente"}
                <span className="block text-xs text-textoSuave">{pedido.whatsapp}</span>
              </td>
              <td className="px-4 py-3">
                <span className="block font-bold text-carameloForte">
                  {formatarMoeda(pedido.valor_total)}
                </span>
                {/* A hora vai junto do valor: é a informação que responde
                    "isso é de hoje?". Sem o card de celular esconderia esse
                    dado por completo. */}
                <span className="block text-xs text-textoSuave">
                  {formatarQuando(pedido.criado_em)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${tomStatus(pedido.status)}`}
                >
                  {rotuloStatus(pedido.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Cartao>
  );
}
