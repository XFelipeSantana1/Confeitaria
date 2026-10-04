import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

// Botão no espírito shadcn/ui (mesma linguagem do protótipo e da vitrine).
type VarianteBotao = "escura" | "clara" | "perigo";

const ESTILOS: Record<VarianteBotao, string> = {
  escura: "bg-carameloForte text-white hover:bg-carameloEscuro hover:-translate-y-0.5 shadow-Cartao",
  clara: "bg-white text-tinta border border-borda hover:-translate-y-0.5",
  perigo: "bg-rose-600 text-white hover:brightness-110",
};

interface PropriedadesBotao extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao;
  // Carregando trava o clique e gira um spinner. Sem isto o gestor clica duas
  // vezes no "Salvar" e cria dois registros — o botão sumir não impede o
  // segundo clique, só esvazia a pista de que a primeira passada entrou.
  carregando?: boolean;
}

export function Botao({
  variante = "escura",
  carregando = false,
  disabled = false,
  children,
  className = "",
  ...resto
}: PropriedadesBotao): JSX.Element {
  return (
    <button
      {...resto}
      disabled={disabled || carregando}
      aria-busy={carregando}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-corpo text-sm font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${ESTILOS[variante]} ${className}`}
    >
      {carregando && <Loader2 size={15} className="motion-safe:animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
