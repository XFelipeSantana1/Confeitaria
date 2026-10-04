import type { LucideIcon } from "lucide-react";

// Estado vazio de uma lista dentro do Resumo. É mais discreto que o DiscoVazio
// das telas de cadastro: aqui o vazio é uma linha de texto no meio de um
// cartão pequeno, e um disco de 56px ocuparia mais espaço que o conteúdo.
//
// O ícone é lucide e não emoji por escolha do projeto: emoji de ✅/🏆/🧾 é o
// mesmo que qualquer site usa, e some no meio do texto — aqui ele precisa
// dar um ponto de apoio sem virar ruído.
interface PropriedadesVazioLista {
  icone: LucideIcon;
  texto: string;
  /** Cor do ícone. Verde é "está tudo bem", neutro é "ainda não aconteceu". */
  tom?: "ok" | "neutro";
}

const TONS = {
  ok: "bg-green-100 text-green-800",
  neutro: "bg-areia/70 text-textoSuave",
} as const;

export function VazioLista({ icone: Icone, texto, tom = "neutro" }: PropriedadesVazioLista): JSX.Element {
  return (
    <p className="flex items-center gap-2.5 py-5 text-sm text-textoSuave">
      <span
        aria-hidden="true"
        className={`grid h-8 w-8 flex-none place-items-center rounded-xl ${TONS[tom]}`}
      >
        <Icone size={16} />
      </span>
      <span className="min-w-0 flex-1">{texto}</span>
    </p>
  );
}
