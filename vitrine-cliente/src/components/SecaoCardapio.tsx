import type { Produto } from "../types";
import {
  agruparPorCategoria,
  identificadorSecao,
  numeroSecao,
  separarDestaque,
} from "../lib/secoes";import { useAvisosSacola } from "../hooks/useAvisosSacola";
import { useSecaoVisivel } from "../hooks/useSecaoVisivel";
import { TODAS_CATEGORIAS } from "../types";
import { SecaoCategoria } from "./SecaoCategoria";
import { CabecalhoCardapio } from "./CabecalhoCardapio";
import { GrupoCategoria } from "./GrupoCategoria";
import { CardDestaque } from "./CardDestaque";
import { EstadoVazio } from "./EstadoVazio";
import { EsqueletoCardapio } from "./EsqueletoCardapio";
import { AlertaErro } from "./AlertaErro";

// Cardápio em seções por categoria (não mais filtro que esconde tudo):
// pílulas sticky com scroll-spy de "onde estou", respiro grande ENTRE
// seções e um destaque horizontal quebrando a simetria do grid. O App só
// entrega os produtos já filtrados pela busca — agrupar e navegar é daqui.
interface PropriedadesSecaoCardapio {
  produtos: Produto[];
  categorias: string[];
  buscaAtiva: boolean;
  carregando: boolean;
  erro: string | null;
  modoDemonstracao: boolean;
  quantidades: Record<number, number>;
  aoAdicionarVarios: (produtoId: number, quantidade: number) => void;
  aoMostrarAviso: (texto: string) => void;
  aoAlterarQuantidade: (produtoId: number, diferenca: number) => void;
  aoTentarNovamente: () => void;
  aoUsarDemonstracao: () => void;
  aoLimparBusca: () => void;
}

export function SecaoCardapio({
  produtos,
  categorias,
  buscaAtiva,
  carregando,
  erro,
  modoDemonstracao,
  quantidades,
  aoAdicionarVarios,
  aoMostrarAviso,
  aoAlterarQuantidade,
  aoTentarNovamente,
  aoUsarDemonstracao,
  aoLimparBusca,
}: PropriedadesSecaoCardapio): JSX.Element {
  const secoes = agruparPorCategoria(produtos, categorias);

  const { visivel, irPara } = useSecaoVisivel(
    secoes.map((secao) => identificadorSecao(secao.categoria)),
  );

  const { destaque, restantes } = separarDestaque(secoes, buscaAtiva);
  const { adicionarComAviso, alterarComAviso } = useAvisosSacola(
    produtos,
    quantidades,
    aoAdicionarVarios,
    aoAlterarQuantidade,
    aoMostrarAviso,
  );

  function selecionarPilha(categoria: string): void {
    if (categoria === TODAS_CATEGORIAS) {
      document
        .getElementById("cardapio")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    irPara(identificadorSecao(categoria));
  }

  // Pílula ativa = seção visível no scroll (ou "Tudo" no topo).
  const nomesSecoes = secoes.map((secao) => secao.categoria);
  const ativa =
    nomesSecoes.find((nome) => identificadorSecao(nome) === visivel) ??
    TODAS_CATEGORIAS;

  return (
    <main id="cardapio" className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-8">
      <CabecalhoCardapio
        totalExibido={produtos.length}
        carregando={carregando}
        modoDemonstracao={modoDemonstracao}
      />

      {/* Sticky: acompanha a rolagem para nunca perder o "onde estou". */}
      <div className="sticky top-[67px] z-30 -mx-5 bg-creme/90 px-5 py-3 backdrop-blur-md">
        <SecaoCategoria
          categorias={nomesSecoes}
          ativa={ativa}
          aoSelecionar={selecionarPilha}
        />
      </div>

      {carregando ? (
        <EsqueletoCardapio />
      ) : erro !== null ? (
        <AlertaErro
          mensagem={erro}
          aoTentarNovamente={aoTentarNovamente}
          aoUsarDemonstracao={aoUsarDemonstracao}
        />
      ) : secoes.length === 0 ? (
        <EstadoVazio
          emoji="🍰"
          titulo="Nada por aqui… ainda."
          mensagem="Tente outra busca."
          textoAcao="Limpar busca"
          aoAgir={aoLimparBusca}
        />
      ) : (
        <>
          {destaque && (
            <div className="mb-4 mt-6">
              <CardDestaque
                produto={destaque}
                quantidadeNaSacola={quantidades[destaque.id] ?? 0}
                aoAdicionar={adicionarComAviso}
                aoAlterarQuantidade={alterarComAviso}
              />
            </div>
          )}
          {restantes.map((secao, indice) =>
            secao.itens.length === 0 ? null : (
              <GrupoCategoria
                key={secao.categoria}
                categoria={secao.categoria}
                numero={numeroSecao(indice)}
                itens={secao.itens}
                quantidades={quantidades}
                espacamentoTopo={indice === 0 && !destaque ? "mt-6" : "mt-12"}
                identificador={identificadorSecao(secao.categoria)}
                aoAdicionar={adicionarComAviso}
                aoAlterarQuantidade={alterarComAviso}
              />
            ),
          )}
        </>
      )}
    </main>
  );
}
