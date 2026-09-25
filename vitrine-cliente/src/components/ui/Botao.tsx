import type { ButtonHTMLAttributes } from "react";

// Botão no espírito shadcn/ui (variantes por prop, classes utilitárias):
// evita trazer a lib inteira + Radix só para três estilos de botão,
// mas mantém a mesma linguagem visual do painel futuro.
type VarianteBotao = "escura" | "clara" | "whats";

const ESTILOS: Record<VarianteBotao, string> = {
  // "escura" é o terracota da marca: acento principal em preço, botão e
  // pílula ativa — um único quente em vez de cor espalhada.
  escura: "bg-caramelo text-white hover:bg-carameloForte hover:-translate-y-0.5 shadow-Cartao",
  clara: "bg-white text-tinta border border-borda hover:-translate-y-0.5",
  whats:
    "bg-green-500 text-green-950 font-extrabold shadow-[0_12px_26px_-12px_rgba(34,197,94,0.7)] hover:brightness-105 hover:-translate-y-0.5",
};

interface PropriedadesBotao extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao;
}

export function Botao({
  variante = "escura",
  children,
  className = "",
  ...resto
}: PropriedadesBotao): JSX.Element {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-corpo text-sm font-bold transition-all active:scale-95 ${ESTILOS[variante]} ${className}`}
      {...resto}
    >
      {children}
    </button>
  );
}
