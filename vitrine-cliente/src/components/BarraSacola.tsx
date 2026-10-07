import { ShoppingBasket } from "lucide-react";
import { formatarMoeda } from "../lib/formatarMoeda";

/**
 * Barra fixa do rodapé com o resumo da sacola.
 *
 * Só no celular, e só quando há item. No desktop não entra porque a sacola já
 * está sempre visível na barra do cabeçalho, com o contador — repetir o número
 * em dois lugares da mesma tela só obriga a cliente a decidir qual é o
 * verdadeiro. No celular o cabeçalho mostra só o número, e o preço (a parte que
 * interessa) ficava três telas abaixo, dentro de um botão que ela precisava
 * lembrar de procurar.
 *
 * Por isso a barra mostra as três coisas juntas: o que fazer ("Ver sacola"), o
 * quanto ("2 itens") e por quanto ("R$ 24,00"). Com só o contador, o número não
 * diz se vale a pena continuar.
 */
export function BarraSacola({
  unidades,
  total,
  aoAbrir,
}: {
  unidades: number;
  total: number;
  aoAbrir: () => void;
}): JSX.Element | null {
  // Sacola vazia: a barra some. Uma barra fixa pedindo "ver sacola · 0 itens ·
  // R$ 0,00" ocupa a tela para não informar nada.
  if (unidades === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 md:hidden">
      {/*
        O `pb-[env(safe-area-inset-bottom)]` é o que segura a barra acima do
        gesto de voltar do Android. Sem isso os últimos 20px ficam sob o gesto,
        e o botão — que fica na borda de baixo — é o primeiro a ser LOSSO.
      */}
      <button
        onClick={aoAbrir}
        className="flex w-full items-center gap-3 rounded-2xl bg-carameloForte px-4 py-3 text-white shadow-[0_10px_30px_-10px_rgba(43,26,18,0.55)] transition-transform active:scale-[0.98]"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <ShoppingBasket size={19} className="flex-none" aria-hidden="true" />
        <span className="flex-1 text-left font-corpo text-sm font-bold">
          Ver sacola
        </span>
        <span className="flex-none font-corpo text-sm">
          {unidades} {unidades === 1 ? "item" : "itens"}
        </span>
        {/* `tabular-nums` (não `font-numero`): a vitrine define só `corpo` e
            `display` no Tailwind, e `font-numero` era uma classe do painel que
            aqui simplesmente não geraria nada — o preço ficaria com algarismos
            de largura variável, e a barra "pulsava" de largura a cada item. */}
        <span
          className="flex-none font-extrabold tabular-nums"
          aria-label={`total ${formatarMoeda(total)}`}
        >
          {formatarMoeda(total)}
        </span>
      </button>
    </div>
  );
}