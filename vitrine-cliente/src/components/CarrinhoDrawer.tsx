import { useEffect } from "react";
import { Lock, MessageCircle, ShoppingBasket, X } from "lucide-react";
import type { ItemCarrinho } from "../types";
import { formatarMoeda } from "../lib/formatarMoeda";
import { Botao } from "./ui/Botao";
import { ItemSacola } from "./ItemSacola";

// Gaveta lateral da sacola. No mobile ocupa a tela toda (w-full); no desktop
// vira painel de 420px. Fecha no Escape e no clique fora (overlay do App).
interface PropriedadesCarrinhoDrawer {
  aberto: boolean;
  itens: ItemCarrinho[];
  total: number;
  nomeCliente: string;
  observacao: string;
  aoMudarNome: (nome: string) => void;
  aoMudarObservacao: (observacao: string) => void;
  aoAlterarQuantidade: (produtoId: number, diferenca: number) => void;
  aoRemover: (produtoId: number) => void;
  aoFechar: () => void;
  aoFinalizar: () => void;
  aoVerCardapio: () => void;
}

export function CarrinhoDrawer({
  aberto,
  itens,
  total,
  nomeCliente,
  observacao,
  aoMudarNome,
  aoMudarObservacao,
  aoAlterarQuantidade,
  aoRemover,
  aoFechar,
  aoFinalizar,
  aoVerCardapio,
}: PropriedadesCarrinhoDrawer): JSX.Element | null {
  // Escape fecha só quando aberta (evita roubar o atalho do resto do site).
  useEffect(() => {
    if (!aberto) return;
    function aoTeclar(evento: KeyboardEvent): void {
      if (evento.key === "Escape") aoFechar();
    }
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="Sacola de pedidos"
      className="fixed inset-y-0 right-0 z-[61] flex w-full animate-[deslizar_0.35s_cubic-bezier(0.32,0.72,0,1)] flex-col border-l border-borda bg-[#fffdf9] text-tinta shadow-2xl sm:max-w-[420px]"
    >
      <div className="flex items-start justify-between gap-2 border-b border-dashed border-borda p-5">
        <div>
          <h3 className="flex items-center gap-2 font-display text-2xl font-bold">
            <ShoppingBasket size={22} /> Sua sacola
          </h3>
          <p className="mt-1 text-[13px] text-stone-500">
            {itens.length === 0
              ? "Nada aqui ainda — o cardápio te espera."
              : `${itens.reduce((soma, item) => soma + item.quantidade, 0)} item(ns) · ${formatarMoeda(total)}`}
          </p>
        </div>
        <button
          onClick={aoFechar}
          aria-label="Fechar sacola"
          className="grid h-10 w-10 place-items-center rounded-xl border border-borda bg-white hover:-translate-y-0.5"
        >
          <X size={19} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
        {itens.length === 0 ? (
          <div className="px-2 py-10 text-center">
            <p className="text-5xl" aria-hidden="true">
              🧺
            </p>
            <b className="mt-3 block font-display text-xl">Sacola vazia</b>
            <p className="mt-1 text-sm text-stone-500">
              Que tal começar pelo destaque da casa? É só rolar um pouco. 👇
            </p>
            <div className="mt-5">
              <Botao variante="clara" onClick={aoVerCardapio}>
                Ver cardápio
              </Botao>
            </div>
          </div>
        ) : (
          itens.map((item) => (
            <ItemSacola
              key={item.produto.id}
              item={item}
              aoAlterarQuantidade={aoAlterarQuantidade}
              aoRemover={aoRemover}
            />
          ))
        )}
      </div>

      {/* Rodapé fixo fora da área de rolagem: o finalizar fica sempre
          visível com itens, sem precisar rolar o drawer. */}
      <div className="flex flex-col gap-2.5 border-t border-borda bg-white p-5">
        <label className="flex flex-col gap-1 text-xs font-bold text-stone-600">
          Seu nome
          <input
            value={nomeCliente}
            onChange={(evento) => aoMudarNome(evento.target.value)}
            placeholder="Ex: Maria"
            autoComplete="name"
            className="rounded-xl border border-borda bg-creme px-3.5 py-2.5 font-corpo text-sm font-normal"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold text-stone-600">
          Observações
          <input
            value={observacao}
            onChange={(evento) => aoMudarObservacao(evento.target.value)}
            placeholder="Ex: sem granulado no segundo cone"
            className="rounded-xl border border-borda bg-creme px-3.5 py-2.5 font-corpo text-sm font-normal"
          />
        </label>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-corpo">Total</span>
          <b className="font-display text-2xl">{formatarMoeda(total)}</b>
        </div>
        <Botao variante="whats" onClick={aoFinalizar} className="w-full py-4 text-base">
          <MessageCircle size={20} /> Finalizar no WhatsApp
        </Botao>
        <p className="flex items-center justify-center gap-1.5 text-xs text-stone-400">
          <Lock size={13} /> Sem pagamento online — você confirma tudo no chat.
        </p>
      </div>
    </aside>
  );
}
