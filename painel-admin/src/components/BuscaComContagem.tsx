import { Busca } from "./Busca";

/**
 * Busca com o contador "3 de 12" ao lado.
 *
 * O contador não é enfeite: sem ele, uma lista que cai para zero depois da
 * busca parece que os dados sumiram, e não que o termo não bateu.
 */
export function BuscaComContagem({
  valor,
  aoMudar,
  placeholder,
  rotulo,
  encontrados,
  total,
}: {
  valor: string;
  aoMudar: (valor: string) => void;
  placeholder: string;
  rotulo: string;
  encontrados: number;
  total: number;
}): JSX.Element {
  const buscando = valor.trim() !== "";
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Busca
        valor={valor}
        aoMudar={aoMudar}
        placeholder={placeholder}
        rotulo={rotulo}
      />
      {buscando ? (
        <p className="text-xs font-semibold text-textoSuave sm:flex-none">
          {encontrados} de {total}
        </p>
      ) : null}
    </div>
  );
}
