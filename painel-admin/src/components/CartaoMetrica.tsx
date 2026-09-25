import type { LucideIcon } from "lucide-react";
import { Cartao } from "./ui/Cartao";

// Número grande do Resumo. O tom comunica sem ler: neutro (volume), alerta
// (reposição) e ok (tudo em dia) — não é decoração, é o estado da loja.
type TomMetrica = "neutro" | "alerta" | "ok";

const CORES: Record<TomMetrica, string> = {
  neutro: "bg-caramelo/15 text-carameloForte",
  alerta: "bg-rose-100 text-rose-700",
  ok: "bg-green-100 text-green-800",
};

interface PropriedadesCartaoMetrica {
  icone: LucideIcon;
  rotulo: string;
  valor: number | string;
  detalhe: string;
  tom?: TomMetrica;
}

export function CartaoMetrica({
  icone: Icone,
  rotulo,
  valor,
  detalhe,
  tom = "neutro",
}: PropriedadesCartaoMetrica): JSX.Element {
  return (
    <Cartao className="flex items-center gap-4">
      <span className={`grid h-12 w-12 flex-none place-items-center rounded-2xl ${CORES[tom]}`}>
        <Icone size={24} />
      </span>
      <span>
        <b className="block font-numero text-3xl font-extrabold tabular-nums text-tinta">{valor}</b>
        <span className="block text-sm font-bold text-tinta">{rotulo}</span>
        <span className="block text-xs text-textoSuave">{detalhe}</span>
      </span>
    </Cartao>
  );
}
