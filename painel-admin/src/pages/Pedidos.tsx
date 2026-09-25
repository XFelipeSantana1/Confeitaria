import { Inbox, RotateCcw } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { usePedidos } from "../hooks/usePedidos";
import { useState } from "react";
import { formatarMoeda } from "../lib/formatarMoeda";
import { rotuloStatus, tomStatus } from "../lib/pedido";
import { STATUS_PEDIDO } from "../types";
import { Cartao } from "../components/ui/Cartao";
import { Botao } from "../components/ui/Botao";
import { DrawerPedido } from "../components/DrawerPedido";

// Pedidos (/painel/pedidos): abas por status com contagem, tabela clicável
// e drawer com avanço/cancelamento. Linha atualiza in-place após o PATCH.
const ABAS = ["todos", ...STATUS_PEDIDO];

export function Pedidos(): JSX.Element {
  const { sessao, sair } = useAutenticacao();
  const {
    pedidos,
    filtro,
    definirFiltro,
    carregando,
    erro,
    precisaLogin,
    buscarNovamente,
    mudarStatus,
    mudarPagamento,
  } = usePedidos(sessao?.token ?? null);
  const [abertoId, definirAbertoId] = useState<number | null>(null);

  if (precisaLogin) sair();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-carameloForte">
          operação
        </p>
        <h1 className="font-display text-3xl font-bold text-tinta">Pedidos</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filtrar por status">
        {ABAS.map((aba) => (
          <button
            key={aba}
            role="tab"
            aria-selected={filtro === aba}
            onClick={() => definirFiltro(aba)}
            className={`flex-none rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
              filtro === aba
                ? "bg-tinta text-creme shadow-Cartao"
                : "border border-borda bg-white text-textoSuave hover:border-caramelo"
            }`}
          >
            {aba === "todos" ? "Todos" : rotuloStatus(aba)}
          </button>
        ))}
      </div>

      {carregando ? (
        <div className="h-64 animate-pulse rounded-3xl border border-borda bg-white" aria-busy="true" aria-label="Carregando pedidos" />
      ) : erro ? (
        <Cartao className="text-center">
          <p className="font-display text-xl font-bold text-tinta">O forno esfriou por aqui 🔌</p>
          <p className="mt-1 text-sm text-textoSuave">{erro}</p>
          <div className="mt-4">
            <Botao onClick={buscarNovamente}>
              <RotateCcw size={17} /> Tentar novamente
            </Botao>
          </div>
        </Cartao>
      ) : pedidos.length === 0 ? (
        <Cartao className="py-12 text-center">
          <p className="text-5xl" aria-hidden="true">🧾</p>
          <b className="mt-2 block font-display text-xl text-tinta">Nenhum pedido aqui</b>
          <p className="mt-1 text-sm text-textoSuave">
            {filtro === "todos"
              ? "Os pedidos do bot e do balcão aparecem nesta lista."
              : "Tente outra aba ou aguarde novos pedidos."}
          </p>
        </Cartao>
      ) : (
        <Cartao className="overflow-x-auto p-0">
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
                  onClick={() => definirAbertoId(pedido.id)}
                  className="cursor-pointer border-b border-borda/60 transition-colors last:border-0 hover:bg-creme"
                >
                  <td className="px-4 py-3 font-bold text-tinta">#{pedido.id}</td>
                  <td className="px-4 py-3 text-tinta">
                    {pedido.cliente_nome ?? "Cliente"}
                    <span className="block text-xs text-textoSuave">{pedido.whatsapp}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-carameloForte">
                    {formatarMoeda(pedido.valor_total)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${tomStatus(pedido.status)}`}>
                      {rotuloStatus(pedido.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Cartao>
      )}

      <p className="flex items-center gap-2 text-center text-xs text-textoSuave">
        <Inbox size={14} /> Toque numa linha para abrir o detalhe e avançar o status.
      </p>

      {abertoId !== null ? <div className="fixed inset-0 z-[60] animate-[aparecer_0.25s_ease] bg-tinta/45" onClick={() => definirAbertoId(null)} aria-hidden="true" /> : null}
      <DrawerPedido
        pedidoId={abertoId}
        token={sessao?.token ?? ""}
        aoFechar={() => definirAbertoId(null)}
        aoMudarStatus={mudarStatus}
        aoMudarPagamento={mudarPagamento}
      />
    </div>
  );
}
