import { SimboloClaro } from "./Marca";

// Foto do cesto de biscoitos cobrindo o lado da marca no login.
//
// Escolhi esta entre cinco candidatas do Unsplash por três motivos: o fundo já
// é escuro (encaixa no `bg-tinta` sem parecer colado), os tons são quentes
// como o caramelo e o dourado da marca, e tem espaço negativo para o texto
// respirar. As outras eram claras demais ou tinham cores de festa que brigavam
// com a paleta.
//
// O véu de tinta em 68% existe por causa do texto: a parte mais clara da foto
// (o próprio biscoito) daria 7,9:1 contra o creme — bem acima dos 4,5:1 da
// WCAG, sem precisar clarear o texto. Medido, não chutado.
const FOTO =
  "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=80";

// Tamanhos: no desktop a metade ocupa até ~700px de largura; no mobile a faixa
// é baixa e estreita. Um único tamanho é mais simples e pesa ~90 KB.
interface PropriedadesMarcaLogin {
  /** Alta no desktop, faixa compacta no topo do celular. */
  compacta?: boolean;
}

export function MarcaLogin({ compacta = false }: PropriedadesMarcaLogin): JSX.Element {
  return (
    <div
      className={
        compacta
          ? "relative h-40 shrink-0 overflow-hidden md:hidden"
          : "relative hidden overflow-hidden md:block"
      }
    >
      <img
        src={FOTO}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Véu duplo: um tom geral e um gradiente que escurece o rodapé, onde
          fica o texto. Sem o gradiente o texto de baixo competia com o
          biscoito claro. */}
      <span aria-hidden="true" className="absolute inset-0 bg-tinta/68" />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-tinta via-tinta/45 to-transparent"
      />

      <div
        className={
          compacta
            ? "relative flex h-full flex-col justify-end gap-2 p-5 text-creme"
            : "relative flex h-full flex-col justify-between p-10 text-creme"
        }
      >
        <p
          className={
            compacta
              ? "flex items-center gap-2 font-display text-lg font-extrabold"
              : "flex items-center gap-2 font-display text-2xl font-extrabold"
          }
        >
          <span
            className={
              compacta
                ? "grid h-10 w-10 place-items-center rounded-xl bg-carameloForte"
                : "grid h-11 w-11 place-items-center rounded-2xl bg-carameloForte"
            }
          >
            {/* Fundo caramelo pede o símbolo ESCURO: o corpo marrom sumiria
                em cima do caramelo (3,95:1). */}
            <SimboloClaro tamanho={compacta ? 22 : 25} />
          </span>
          Doce<em className="text-dourado">&amp;</em> Carinho
        </p>

        {/* Frase de venda some no mobile: a faixa é baixa e ela empurraria o
            formulário para fora da dobra. */}
        {compacta ? null : (
          <div>
            <h1 className="max-w-md font-display text-4xl font-bold leading-tight">
              A sua confeitaria <em className="text-dourado">no controle.</em>
            </h1>
            <ul className="mt-6 flex flex-col gap-3 text-sm text-creme/70">
              <li className="flex items-center gap-2">
                <CheckTexto /> Pedidos chegando direto no painel
              </li>
              <li className="flex items-center gap-2">
                <CheckTexto /> Estoque baixado sozinho a cada venda
              </li>
              <li className="flex items-center gap-2">
                <CheckTexto /> Ficha técnica sem furo de estoque
              </li>
            </ul>
          </div>
        )}

        <p className="text-xs text-creme/45">
          {compacta ? "Gestão para confeitaria artesanal" : "Gestão para confeitaria artesanal"}
        </p>
      </div>
    </div>
  );
}

function CheckTexto(): JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      className="flex-none text-dourado"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5 6.2 12 13 4.5" />
    </svg>
  );
}
