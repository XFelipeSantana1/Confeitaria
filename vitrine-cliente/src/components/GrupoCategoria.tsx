import { iconeParaCategoria } from "../lib/iconeCategoria";
import type { Produto } from "../types";
import { CardProduto } from "./CardProduto";

// Uma categoria dentro do cardápio: cabeçalho assimétrico (ícone + nome grande
// + contagem + filete) e a grade de doces.
//
// No celular é UMA coluna, não o carrossel lateral que existia antes. O
// carrossel economiza rolagem vertical, mas esconde o resto da lista atrás de
// um gesto que ninguém descobre sozinho, e a foto do doce ocupa 80% da largura
// de cada card. Empilhando, a cliente rola uma coluna, vê todas as opções da
// categoria e compara preço em uma passada vertical.
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
      </div>
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {itens.map((produto) => (
          <div
            key={produto.id}
            className="min-w-0"
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
