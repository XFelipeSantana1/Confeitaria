import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { iconeParaCategoria } from "../lib/iconeCategoria";
import type { Produto } from "../types";
import { CardProduto } from "./CardProduto";

// Uma categoria dentro do cardápio: cabeçalho assimétrico (ícone + nome
// grande + contagem + filete). No celular vira carrossel com setas (cards
// largos de ~80% da tela, snap suave); no desktop vira grid. As setas ficam
// no cabeçalho, só no mobile — no desktop o grid mostra tudo de uma vez.
interface PropriedadesGrupoCategoria {
  categoria: string;
  numero: string;
  itens: Produto[];
  quantidades: Record<number, number>;
  espacamentoTopo: string;
  identificador: string;
  aoAdicionar: (produtoId: number) => void;
  aoAlterarQuantidade: (produtoId: number, diferenca: number) => void;
}

export function GrupoCategoria({
  categoria,
  numero,
  itens,
  quantidades,
  espacamentoTopo,
  identificador,
  aoAdicionar,
  aoAlterarQuantidade,
}: PropriedadesGrupoCategoria): JSX.Element {
  const Icone = iconeParaCategoria(categoria);
  const rotulo = itens.length === 1 ? "1 delícia" : `${itens.length} delícias`;
  const trilho = useRef<HTMLDivElement>(null);

  // Rola ~80% da largura visível: mostra o próximo card em destaque parcial,
  // insinuando que há mais para o lado (affordance do carrossel).
  function rolar(direcao: 1 | -1): void {
    const elemento = trilho.current;
    if (!elemento) return;
    elemento.scrollBy({ left: direcao * elemento.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section id={identificador} className={`scroll-mt-40 ${espacamentoTopo}`}>
      <div className="mb-4 flex items-center gap-3">
        {/* Numeração editorial ("01 — Doces"): cara de cardápio impresso,
            orienta o olhar melhor que título solto. */}
        <span className="font-display text-sm font-bold tracking-widest text-caramelo" aria-hidden="true">
          {numero}
        </span>
        <span className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-caramelo/15 text-carameloForte">
          <Icone size={20} />
        </span>
        <h3 className="font-display text-2xl font-bold md:text-3xl">{categoria}</h3>
        <span className="rounded-full bg-areia px-3 py-1 text-xs font-bold text-carameloForte">
          {rotulo}
        </span>
        <span className="h-px min-w-6 flex-1 bg-borda" aria-hidden="true" />
        <span className="flex flex-none gap-2 sm:hidden">
          <button
            onClick={() => rolar(-1)}
            aria-label={`Ver doces anteriores de ${categoria}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-borda bg-white text-tinta shadow-sm transition-all active:scale-90"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => rolar(1)}
            aria-label={`Ver próximos doces de ${categoria}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-borda bg-white text-tinta shadow-sm transition-all active:scale-90"
          >
            <ChevronRight size={18} />
          </button>
        </span>
      </div>
      <div
        ref={trilho}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 xl:grid-cols-4"
      >
        {itens.map((produto) => (
          <div
            key={produto.id}
            className="w-[80%] flex-none snap-center sm:w-auto sm:snap-align-none"
          >
            <CardProduto
              produto={produto}
              quantidadeNaSacola={quantidades[produto.id] ?? 0}
              aoAdicionar={aoAdicionar}
              aoAlterarQuantidade={aoAlterarQuantidade}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
