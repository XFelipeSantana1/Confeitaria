import { Sparkles } from "lucide-react";

// Abertura: a foto ocupa pouco mais que a dobra da tela e o texto diz,
// em duas linhas, o que a loja vende e como se compra.
//
// Mudança em relação à versão anterior, que ocupava a primeira tela inteira e
// repetia a mesma ação três vezes (busca no cabeçalho, "Ver cardápio" apontando
// para a seção logo abaixo e três números decorativos). Cliente que precisa
// de três cliques para chegar no cardápio desiste no primeiro.

interface PropriedadesAbertura {
  /** Abre a janela que explica o passo a passo do pedido. */
  aoComoFunciona: () => void;
}

export function Abertura({ aoComoFunciona }: PropriedadesAbertura): JSX.Element {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-6 pb-10 lg:pt-10 lg:pb-14">
      {/* No celular a foto vem primeiro; no desktop, o texto ocupa a coluna da
          esquerda. A ordem no DOM é texto-depois-foto (leitor de tela começa
          pelo que a loja é), e o `order` só troca quem aparece em cima. */}
      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="order-2 lg:order-1">
          <p className="inline-flex items-center gap-2 rounded-full border border-borda bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-carameloForte">
            <Sparkles size={14} aria-hidden="true" /> confeitaria artesanal
          </p>

          {/* Sem itálico no título. A marca já usa itálico no nome, e repetir o
              recurso no título e no subtítulo tirava o peso dos dois trechos:
              o olho parava neles em vez de ler a frase. A hierarquia
              agora vem do tamanho e do peso, não do dobramento. */}
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] text-tinta sm:text-5xl">
            Doces artesanais para deixar o dia mais doce.
          </h1>

          <p className="mt-3 max-w-md font-corpo text-base leading-relaxed text-textoSuave">
            Escolha seus favoritos e envie a seleção para a confeiteira pelo
            WhatsApp.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href="#cardapio"
              className="inline-flex items-center gap-2 rounded-full bg-carameloForte px-6 py-3 font-corpo text-sm font-bold text-white shadow-Cartao transition-transform hover:-translate-y-0.5 hover:bg-carameloEscuro active:scale-95"
            >
              Escolher meus doces
            </a>
            {/* Link de texto, não segundo botão: dois botões de mesma altura
                competem entre si e a cliente não sabe qual é o principal.
                Este é o único jeito de chegar à explicação do pedido, então
                continua existindo — só sem disputar a atenção. */}
            <button
              onClick={aoComoFunciona}
              className="font-corpo text-sm font-semibold text-textoSuave underline decoration-borda decoration-2 underline-offset-4 transition-colors hover:text-carameloForte hover:decoration-caramelo"
            >
              Como funciona?
            </button>
          </div>
        </div>

        {/* 280px no celular, 360–420px no desktop. Antes eram 52vw com teto em
            44svh: numa tela de 360×640 isso dava 240px de imagem e mais 300px
            de texto e três números abaixo — a dobra da tela toda, com o
            cardápio inteiro fora da vista. */}
        <div className="order-1 lg:order-2">
          <div className="h-[280px] overflow-hidden rounded-[28px] border border-borda shadow-Cartao sm:h-[360px] lg:h-[420px]">
            <img
              src="/abertura.png"
              alt="Caixa de doces artesanais: cupcakes com cobertura clara e coração, brigadeiros e truffas sobre linho"
              loading="eager"
              fetchPriority="high"
              width={1536}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}