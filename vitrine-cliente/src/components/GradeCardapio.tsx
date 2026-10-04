import type { Produto } from "../types";
import type { SecaoProdutos } from "../lib/secoes";
import { identificadorSecao, numeroSecao } from "../lib/secoes";
import { CardDestaque } from "./CardDestaque";
import { GrupoCategoria } from "./GrupoCategoria";

// A grade em si: destaque largo no topo e depois um grupo por categoria.
// Saiu do SecaoCardapio para lá sobrar só a parte de agrupar, filtrar e
// decidir entre carregando / erro / vazio / conteúdo.
interface PropriedadesGradeCardapio {
  destaque: Produto | undefined;
  secoes: SecaoProdutos[];
  quantidades: Record<number, number>;
  // O card grid só passa a quantidade (1 por clique); a soma para vários
  // quantidades mora nos avisos. Tipo mais estreito aqui de propósito.
  aoAdicionar: (produtoId: number) => void;
  aoAlterarQuantidade: (produtoId: number, diferenca: number) => void;
}

export function GradeCardapio({
  destaque,
  secoes,
  quantidades,
  aoAdicionar,
  aoAlterarQuantidade,
}: PropriedadesGradeCardapio): JSX.Element {
  return (
    <>
      {destaque && (
        <div className="mb-4 mt-6">
          <CardDestaque
            produto={destaque}
            quantidadeNaSacola={quantidades[destaque.id] ?? 0}
            aoAdicionar={aoAdicionar}
            aoAlterarQuantidade={aoAlterarQuantidade}
          />
        </div>
      )}
      {secoes.map((secao, indice) =>
        secao.itens.length === 0 ? null : (
          <GrupoCategoria
            key={secao.categoria}
            categoria={secao.categoria}
            numero={numeroSecao(indice)}
            itens={secao.itens}
            quantidades={quantidades}
            espacamentoTopo={indice === 0 && !destaque ? "mt-6" : "mt-12"}
            identificador={identificadorSecao(secao.categoria)}
            aoAdicionar={aoAdicionar}
            aoAlterarQuantidade={aoAlterarQuantidade}
          />
        ),
      )}
    </>
  );
}
