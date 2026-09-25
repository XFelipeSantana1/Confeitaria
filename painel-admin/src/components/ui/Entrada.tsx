import type { InputHTMLAttributes } from "react";

// Campo de formulário do painel (rótulo + input com erro opcional).
interface PropriedadesEntrada extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string;
  erroCampo?: string | null;
}

export function Entrada({ rotulo, erroCampo, id, ...resto }: PropriedadesEntrada): JSX.Element {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 text-[13px] font-bold text-tinta">
      {rotulo}
      <input
        id={id}
        className="rounded-xl border border-borda bg-creme px-3.5 py-2.5 font-corpo text-sm font-normal text-tinta outline-none placeholder:text-textoSuave/50 focus:border-caramelo"
        {...resto}
      />
      {erroCampo ? <span className="font-normal text-rose-600">{erroCampo}</span> : null}
    </label>
  );
}
