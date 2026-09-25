import type { DetalhePedido } from "../types";
import { formatarMoeda } from "../lib/formatarMoeda";
import { rotuloPagamento } from "../lib/pedido";
import { STATUS_PAGAMENTO } from "../types";

// Corpo do drawer: cliente, itens, total e seletor de pagamento. Recebe
// callbacks prontos — buscar e salvar continuam no DrawerPedido.
interface PropriedadesItensPedido {
  detalhe: DetalhePedido;
  desabilitado: boolean;
  aoTrocarPagamento: (valor: string) => void;
}

export function ItensPedido({
  detalhe,
  desabilitado,
  aoTrocarPagamento,
}: PropriedadesItensPedido): JSX.Element {
  return (
    <>
      <div className="rounded-2xl border border-borda bg-white p-3 text-sm">
        <b className="block text-tinta">{detalhe.cliente_nome ?? "Cliente"}</b>
        <span className="text-textoSuave">{detalhe.whatsapp}</span>
      </div>
      <ul className="flex flex-col gap-2">
        {detalhe.itens.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 rounded-2xl border border-borda bg-white p-2.5 text-sm"
          >
            <span className="flex-1 text-tinta">
              <b className="block">
                {item.quantidade}x {item.produto_nome}
              </b>
              <span className="text-xs text-textoSuave">
                {formatarMoeda(item.preco_unitario)} cada
              </span>
            </span>
            <b className="text-tinta">{formatarMoeda(item.subtotal)}</b>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between rounded-2xl bg-tinta px-4 py-3 text-creme">
        <span className="text-sm">Total</span>
        <b className="font-display text-2xl">{formatarMoeda(detalhe.valor_total)}</b>
      </div>
      <label className="flex flex-col gap-1 text-xs font-bold text-tinta">
        Pagamento ({rotuloPagamento(detalhe.status_pagamento)})
        <select
          value={detalhe.status_pagamento}
          disabled={desabilitado}
          onChange={(evento) => aoTrocarPagamento(evento.target.value)}
          className="rounded-xl border border-borda bg-white px-3 py-2.5 text-sm font-normal"
        >
          {STATUS_PAGAMENTO.map((opcao) => (
            <option key={opcao} value={opcao}>
              {rotuloPagamento(opcao)}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
