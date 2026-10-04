import type { LucideIcon } from "lucide-react";
import { Cartao } from "./ui/Cartao";

// Número grande do Resumo. O tom comunica sem ler: neutro (volume), alerta
// (reposição) e ok (tudo em dia) — não é decoração, é o estado da loja.
//
// Layout DOIS formatos por um componente só:
//  - celular: empilhado (ícone no topo, número, rótulo). As 4 métricas em 2
//    colunas ocupam ~264px; deitadas, ocupavam 488px e o gestor tinha de
//    rolar meia tela antes de ver o resto do painel.
//  - desktop: deitado, com o ícone à esquerda, como sempre.
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
    <Cartao className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      <span
        className={`grid h-10 w-10 flex-none place-items-center rounded-2xl sm:h-12 sm:w-12 ${CORES[tom]}`}
      >
        <Icone size={22} />
      </span>
      <span className="min-w-0">
        {/* O número é o que o gestor procura; no celular ele vem primeiro e
            em tamanho cheio, com o rótulo abaixo. */}
        <b className="block font-numero text-3xl font-extrabold leading-none tabular-nums text-tinta">
          {valor}
        </b>
        <span className="mt-1 block text-sm font-bold leading-tight text-tinta">
          {rotulo}
        </span>
        <span className="block text-xs leading-tight text-textoSuave">{detalhe}</span>
      </span>
    </Cartao>
  );
}
