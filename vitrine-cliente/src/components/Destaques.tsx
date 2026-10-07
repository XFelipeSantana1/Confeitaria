// Três garantias da loja, em uma linha só.
//
// Substitui o letreiro corrido (fundo cacau com texto em movimento) que ficava
// entre a abertura e o cardápio. O letreiro ocupava uma faixa inteira da tela
// repetindo quatro frases que a cliente tinha acabado de ler no título — e ainda
// competia com a lista de doces logo abaixo.
//
// Aqui não há animação nem cartão: são três frases separadas por um ponto, do
// jeito que um papel de embrulho de encomenda explica o pedido em uma linha. É
// também a única informação de confiança antes do cardápio — diz o que a loja
// é (artesanal), como se compra (WhatsApp) e o que a cliente NÃO precisa fazer
// (cadastro, pagamento no site).

const GARANTIAS = [
  "Feito artesanalmente",
  "Pedido pelo WhatsApp",
  "Sem cadastro nem pagamento no site",
] as const;

export function Destaques(): JSX.Element {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-2">
      <ul className="flex flex-col items-start gap-2 border-y border-borda py-4 text-sm sm:flex-row sm:items-center sm:justify-center sm:gap-3">
        {GARANTIAS.map((garantia) => (
          <li key={garantia} className="flex items-center gap-2.5">
            <span
              className="h-1.5 w-1.5 flex-none rounded-full bg-caramelo"
              aria-hidden="true"
            />
            <span className="font-corpo font-semibold text-tinta">{garantia}</span>
          </li>
        ))}
        {/* Separadores entre as frases, em coluna, virados na horizontal no
            celular: no celular a lista empilha e o ponto vira marcador de lista;
            na horizontal ele separa. Um por vão, entre um item e o próximo. */}
        <span className="hidden gap-3 sm:flex" aria-hidden="true">
          {GARANTIAS.slice(0, -1).map((garantia) => (
            <span key={`sep-${garantia}`} className="text-borda">
              ·
            </span>
          ))}
        </span>
      </ul>
    </div>
  );
}