import type { ReactNode } from "react";

// Cabeçalho padrão das telas (sobretítulo + título + ação à direita).
// Unifica o ritmo visual do painel em vez de cada página inventar o seu.
interface PropriedadesCabecalhoSecao {
  rotulo: string;
  titulo: string;
  acao?: ReactNode;
}

export function CabecalhoSecao({ rotulo, titulo, acao }: PropriedadesCabecalhoSecao): JSX.Element {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-carameloForte">{rotulo}</p>
        <h1 className="font-display text-3xl font-bold text-tinta">{titulo}</h1>
      </div>
      {acao}
    </div>
  );
}
