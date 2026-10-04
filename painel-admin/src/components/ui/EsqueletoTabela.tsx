interface PropriedadesEsqueleto {
  /** Linhas do placeholder. 3 é o suficiente para não parecer cartão vazio. */
  linhas?: number;
  className?: string;
}

// Esqueleto de tabela do painel. Existe como componente porque as cinco telas
// repetiam a mesma classe e o resultado era uma página em branco durante o
// carregamento: bloco branco sem nenhuma pista do que viria. Aqui as linhas
// repetidas dizem "isto é uma lista", que é o que o gestor precisa saber.
export function EsqueletoTabela({
  linhas = 3,
  className = "",
}: PropriedadesEsqueleto): JSX.Element {
  return (
    <div
      className={`animate-pulse rounded-3xl border border-borda bg-white p-5 ${className}`}
      aria-busy="true"
      aria-label="Carregando"
    >
      <div className="h-3 w-32 rounded-full bg-areia" />
      {Array.from({ length: linhas }, (_, indice) => (
        <div key={indice} className="mt-3 flex items-center gap-3">
          <div className="h-8 w-8 flex-none rounded-xl bg-areia" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 rounded-full bg-areia" />
            {/* A segunda linha é mais curta e nem todas têm a mesma largura:
                linhas iguais demais denunciam placeholder automático. */}
            <div
              className="h-2 rounded-full bg-areia/70"
              style={{ width: `${55 + ((indice * 13) % 30)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
