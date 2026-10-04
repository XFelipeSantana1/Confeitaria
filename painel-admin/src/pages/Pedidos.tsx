import { Inbox, RotateCcw, Wrench } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { usePedidos } from "../hooks/usePedidos";
import { useEffect, useState } from "react";
import { rotuloStatus } from "../lib/pedido";
import { STATUS_PEDIDO } from "../types";
import { Cartao } from "../components/ui/Cartao";
import { EsqueletoTabela } from "../components/ui/EsqueletoTabela";
import { Botao } from "../components/ui/Botao";
import { DiscoVazio } from "../components/ui/DiscoVazio";
import { CartaoPedido } from "../components/CartaoPedido";
import { TabelaPedidos } from "../components/TabelaPedidos";
import { DrawerPedido } from "../components/DrawerPedido";

// Pedidos (/painel/pedidos): abas por status e tabela clicável
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

  // Efeito, e não `if` no corpo do render: `sair()` atualiza o estado do
  // provedor de sessão, e mexer no estado de outro componente durante o
  // render é o que o React avisa em tempo de execução.
  useEffect(() => {
    if (precisaLogin) sair();
  }, [precisaLogin, sair]);


  return (
    <div className="flex flex-col gap-4 sm:gap-5">
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
        <EsqueletoTabela linhas={4} />
      ) : erro ? (
        <Cartao className="text-center">
          <p className="flex items-center justify-center gap-2 font-display text-xl font-bold text-tinta">
            <Wrench size={19} className="text-caramelo" aria-hidden="true" />
            O forno esfriou por aqui
          </p>
          <p className="mt-1 text-sm text-textoSuave">{erro}</p>
          <div className="mt-4">
            <Botao onClick={buscarNovamente}>
              <RotateCcw size={17} /> Tentar novamente
            </Botao>
          </div>
        </Cartao>
      ) : pedidos.length === 0 ? (
        <Cartao className="py-12 text-center">
          <DiscoVazio>
            <Inbox size={26} />
          </DiscoVazio>
          <b className="mt-2 block font-display text-xl text-tinta">Nenhum pedido aqui</b>
          <p className="mt-1 text-sm text-textoSuave">
            {filtro === "todos"
              ? "Os pedidos que chegam pela vitrine aparecem aqui assim que são feitos."
              : "Tente outra aba ou aguarde novos pedidos."}
          </p>
        </Cartao>
      ) : (
        <>
          {/* Celular: card por pedido. A tabela de 640px exigia 288px de
              rolagem lateral numa tela de 360px. */}
          <ul className="flex flex-col gap-2 md:hidden">
            {pedidos.map((pedido) => (
              <CartaoPedido
                key={pedido.id}
                pedido={pedido}
                aoAbrir={(escolhido) => definirAbertoId(escolhido.id)}
              />
            ))}
          </ul>

          {/* Desktop: tabela. */}
          <TabelaPedidos pedidos={pedidos} aoAbrir={(pedido) => definirAbertoId(pedido.id)} />
        </>
      )}

      <p className="hidden items-center justify-center gap-2 text-center text-xs text-textoSuave md:flex">
        <Inbox size={14} /> Clique numa linha para abrir o detalhe e avançar o status.
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
