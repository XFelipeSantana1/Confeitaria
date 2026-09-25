import type { ButtonHTMLAttributes } from "react";

// Botão no espírito shadcn/ui (mesma linguagem do protótipo e da vitrine).
type VarianteBotao = "escura" | "clara" | "perigo";

const ESTILOS: Record<VarianteBotao, string> = {
  escura: "bg-caramelo text-white hover:bg-carameloForte hover:-translate-y-0.5 shadow-Cartao",
  clara: "bg-white text-tinta border border-borda hover:-translate-y-0.5",
  perigo: "bg-rose-600 text-white hover:brightness-110",
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-corpo text-sm font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${ESTILOS[variante]} ${className}`}
      {...resto}
    >
      {children}
    </button>
  );
}
