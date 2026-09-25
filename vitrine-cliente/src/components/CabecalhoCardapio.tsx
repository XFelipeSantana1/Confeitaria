// Título do cardápio + contador. Separado para a seção principal cuidar só
// de agrupar e navegar, não de apresentar o cabeçalho.
interface PropriedadesCabecalhoCardapio {
  totalExibido: number;
  carregando: boolean;
  modoDemonstracao: boolean;
}

export function CabecalhoCardapio({
  totalExibido,
  carregando,
  modoDemonstracao,
}: PropriedadesCabecalhoCardapio): JSX.Element {
  return (
    <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-carameloForte px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          📖 nosso cardápio
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-tinta md:text-4xl">
          Escolha com calma, <em className="text-caramelo">coma com alegria.</em>
        </h2>
      </div>
      <p className="text-sm text-textoSuave">
        {carregando
          ? "Carregando delícias…"
          : `Mostrando ${totalExibido} delícia(s)${modoDemonstracao ? " em demonstração" : " fresquinha(s)"}.`}
      </p>
    </div>
  );
}
