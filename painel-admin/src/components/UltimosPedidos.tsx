import { Link } from "react-router-dom";
import { History, Receipt } from "lucide-react";
import type { Pedido } from "../types";
import { formatarMoeda } from "../lib/formatarMoeda";
import { rotuloStatus, tomStatus } from "../lib/pedido";
import { Cartao } from "./ui/Cartao";
import { VazioLista } from "./ui/VazioLista";

// Últimos pedidos (os 5 mais recentes, que vêm ordenados da API): atalho
// vivo para a operação — quem abre o Resumo vê movimento, não só número.
export function UltimosPedidos({ pedidos }: { pedidos: Pedido[] }): JSX.Element {
  const recentes = pedidos.slice(0, 5);
  return (
    <Cartao>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-tinta">
          <History size={20} className="text-carameloForte" /> Últimos pedidos
        </h2>
        <Link to="/painel/pedidos" className="text-sm font-bold text-carameloForte underline">
          ver todos
        </Link>
      </div>
      {recentes.length === 0 ? (
        <VazioLista
          icone={Receipt}
          texto="Nenhum pedido ainda. O movimento da loja aparece aqui."
        />
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {recentes.map((pedido) => (
            <li key={pedido.id}>
              <Link
                to="/painel/pedidos"
                className="flex items-center gap-3 rounded-xl bg-creme px-3 py-2 transition-colors hover:bg-areia"
              >
                <b className="font-numero text-sm font-extrabold tabular-nums text-tinta">
                  #{pedido.id}
                </b>
                <span className="flex-1 truncate text-sm text-tinta">
                  {pedido.cliente_nome ?? "Cliente"}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${tomStatus(pedido.status)}`}>
                  {rotuloStatus(pedido.status)}
                </span>
                <b className="font-numero text-sm font-extrabold tabular-nums text-carameloForte">
                  {formatarMoeda(pedido.valor_total)}
                </b>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Cartao>
  );
}
