// Skeleton espelhando o card real (foto 4:3 + linhas de texto + linha de
// preço/botão): quando o conteúdo chega, nada "pula" de lugar — o teste
// visual é comparar com CardProduto e ver as mesmas proporções.
export function EsqueletoCardapio(): JSX.Element {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Carregando cardápio"
      aria-busy="true"
    >
      {Array.from({ length: 8 }, (_, indice) => (
        <div
          key={indice}
          className="overflow-hidden rounded-3xl border border-borda bg-white"
        >
          <div className="aspect-[4/3] animate-pulse bg-gradient-to-r from-areia via-borda to-areia" />
          <div className="flex flex-col gap-2 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-areia" />
            <div className="h-3 w-full animate-pulse rounded-full bg-areia/70" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-areia/70" />
            <div className="mt-1 flex items-center justify-between">
              <div className="h-6 w-20 animate-pulse rounded-full bg-areia" />
              <div className="h-9 w-28 animate-pulse rounded-full bg-areia" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
