// Ilustração do estado "a busca não achou nada": um prato visto de cima com a
// lente da busca sobre ele. Desenhada em SVG no lugar de um emoji de bolo —
// emoji é genérico, aparece em qualquer site e não diz nada sobre o motivo do
// vazio. O desenho conta o motivo sem nenhuma palavra.
//
// A lente flutua de leve (respeitando prefers-reduced-motion) para o estado
// parado não parecer quebrado: a tela tem que parecer viva mesmo sem cardápio.
export function IlustracaoBuscaVazia(): JSX.Element {
  return (
    <svg
      viewBox="0 0 150 118"
      role="img"
      aria-label="Prato vazio com uma lupa sobre ele"
      className="mx-auto h-32 w-40 sm:h-36 sm:w-44"
    >
      {/* Mancha de fundo assimétrica de propósito: simetria total é a marca
          de ilustração automática, e aqui não queremos isso. */}
      <path
        d="M14 66c-5-25 17-45 43-45 19 0 28 8 40 20 15 14 28 31 23 47-5 18-26 22-51 22-29 0-51-19-55-44Z"
        fill="#E8DDD1"
        opacity="0.5"
      />

      {/* Prato: prato de baixo (sombra) e prato de cima, com aro interno. */}
      <ellipse cx="73" cy="72" rx="43" ry="31" fill="#C4622D" opacity="0.16" />
      <ellipse
        cx="71"
        cy="66"
        rx="43"
        ry="31"
        fill="#FDF8F3"
        stroke="#C4622D"
        strokeWidth="2.5"
      />
      <ellipse
        cx="71"
        cy="66"
        rx="30"
        ry="21"
        fill="none"
        stroke="#C4622D"
        strokeWidth="1.5"
        opacity="0.45"
      />

      {/* Duas migalhas, tamanhos e alturas diferentes: nada de enfeite
          repetido em pares. */}
      <circle cx="62" cy="63" r="2.6" fill="#D4A24C" />
      <circle cx="81" cy="72" r="1.7" fill="#D4A24C" opacity="0.7" />

      {/* Lupa. O contorno é tinta pura (não caramelo) para a leitura ser
          imediata sobre o bege do prato. */}
      <g className="motion-safe:animate-[flutuar_3.6s_ease-in-out_infinite]">
        <circle
          cx="103"
          cy="43"
          r="20"
          fill="#FDF8F3"
          fillOpacity="0.8"
          stroke="#2B1E17"
          strokeWidth="3"
        />
        {/* Reflexo dentro da lente: dá volume ao vidro sem precisar de
            gradiente — sombra e traço resolvem mais barato. */}
        <path
          d="M92 34a15 15 0 0 1 9-5"
          fill="none"
          stroke="#2B1E17"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.28"
        />
        <path
          d="M117 58l14 14"
          stroke="#2B1E17"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
