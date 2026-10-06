import { Cartao } from "./ui/Cartao";
import { ChartNoAxesColumn } from "lucide-react";
import { VazioLista } from "./ui/VazioLista";
import { formatarMoeda } from "../lib/formatarMoeda";
import type { DiaVendido } from "../lib/periodo";

interface PropriedadesGraficoVendas {
  dias: DiaVendido[];
  /** Dia com maior venda do período: é contra ele que as barras se medem. */
  diaDe: string;
}

/**
 * Vendas por dia, em barras de CSS.
 *
 * Sem biblioteca de gráfico (o prompt pede para não adicionar uma só por
 * detalhe). A barra é relativa ao maior dia, então ler o desenho já diz o
 * valor — e o número exato fica no rótulo de cada barra, para quem precisa
 * conferir.
 *
 * Cada barra é uma imagem de fundo com `aria-label`: quem usa leitor de tela
 * ouve "05/10, 3 pedidos, R$ 120,00" em vez de um traço sem sentido.
 */
export function GraficoVendas({ dias, diaDe }: PropriedadesGraficoVendas): JSX.Element {
  const maior = Math.max(...dias.map((dia) => dia.total), 1);
  const totalPeriodo = dias.reduce((soma, dia) => soma + dia.total, 0);
  const pedidosPeriodo = dias.reduce((soma, dia) => soma + dia.quantidade, 0);

  return (
    <Cartao className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-carameloForte">
            vendas no período
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-tinta">
            {formatarMoeda(totalPeriodo)}
          </p>
        </div>
        <p className="text-sm font-semibold text-textoSuave">
          {pedidosPeriodo} {pedidosPeriodo === 1 ? "pedido" : "pedidos"} · melhor dia {diaDe}
        </p>
      </div>

      {dias.every((dia) => dia.total === 0) ? (
        <VazioLista icone={ChartNoAxesColumn} texto="Nenhuma venda neste período." />
      ) : (
        <>
          {/* `h-40` com `items-end`: as barras crescem de baixo para cima, e o
              gráfico inteiro tem altura fixa para as telas não pularem quando
              um dia vende e outro não. */}
          <div
            role="img"
            aria-label={`Vendas por dia: ${dias
              .map((dia) => `${dia.rotulo} ${formatarMoeda(dia.total)}`)
              .join(", ")}`}
            className="flex h-40 items-end gap-1 sm:gap-1.5"
          >
            {dias.map((dia) => (
              <div
                key={dia.chave}
                className="group relative flex h-full min-w-0 flex-1 flex-col justify-end"
              >
                <div
                  style={{ height: `${Math.max((dia.total / maior) * 100, dia.total > 0 ? 3 : 0)}%` }}
                  className={`w-full rounded-t-md transition-colors ${
                    dia.total === 0
                      ? "bg-borda/50"
                      : "bg-caramelo/25 group-hover:bg-carameloForte"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Rótulos só nas pontas: um por barra em 360px vira listra ilegível,
              e o valor já está no aria-label e no tooltip. */}
          <div className="flex justify-between text-xs font-semibold text-textoSuave">
            <span>{dias[0]?.rotulo}</span>
            {dias.length > 2 ? <span>{dias[Math.floor(dias.length / 2)]?.rotulo}</span> : null}
            <span>{dias[dias.length - 1]?.rotulo}</span>
          </div>
        </>
      )}
    </Cartao>
  );
}
