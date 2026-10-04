import { MessageCircleHeart, Sparkles, Tag, UtensilsCrossed } from "lucide-react";
import { Botao } from "./ui/Botao";
import { formatarMoeda } from "../lib/formatarMoeda";

// Abertura em dois tempos: foto limpa em tela cheia (sem véu nem moldura)
// e, abaixo, o conteúdo sobre o cacau da página. A foto vende; o texto
// respira no escuro sem precisar de overlay.
interface PropriedadesAbertura {
  totalProdutos: number;
  totalCategorias: number;
  /** Menor preço do cardápio, para o terceiro número ser um dado e não um
   *  adorno. Antes a peça mostrava "hoje / pedido médio em minutos" sem
   *  número nenhum — o banco não tem hora de entrega, então a promessa era
   *  impossível de cumprir. */
  menorPreco: number | null;
  aoComoFunciona: () => void;
}

export function Abertura({
  totalProdutos,
  totalCategorias,
  menorPreco,
  aoComoFunciona,
}: PropriedadesAbertura): JSX.Element {
  return (
    <section>
      {/* `44svh` com `min-h-[300px` era problema deitado: num celular com
          360px de altura, 44% dá 158px — e o mínimo de 300px tomava quase a
          tela inteira, empurrando o nome e o cardápio para fora da vista.
          Agora a faixa acompanha a largura (vw), que é o que importa para
          retrato de foto, e em paisagem ela encolhe em vez de crescer. */}
      <div className="h-[52vw] max-h-[44svh] min-h-[240px] w-full overflow-hidden sm:min-h-[300px]">
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

      <div className="mx-auto w-full max-w-6xl px-5 py-12">
        <p className="inline-flex items-center gap-2 rounded-full border border-borda bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-carameloForte">
          <Sparkles size={15} /> feito à mão, todos os dias
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-tight text-tinta md:text-7xl">
          Doces artesanais que abraçam{" "}
          <em className="text-caramelo">antes do primeiro morso.</em>
        </h1>
        <p className="mt-4 max-w-xl font-corpo text-base leading-relaxed text-textoSuave md:text-lg">
          Monte sua sacola no cardápio e finalize em um toque no WhatsApp —
          sem cadastro, sem espera, direto com a confeiteira.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#cardapio">
            <Botao>
              <UtensilsCrossed size={18} /> Ver cardápio
            </Botao>
          </a>
          <Botao variante="clara" onClick={aoComoFunciona}>
            <MessageCircleHeart size={18} /> Como funciona
          </Botao>
        </div>
        <div className="mt-8 flex gap-7">
          <div>
            <b className="font-display text-2xl text-tinta">{totalProdutos || "–"}</b>
            <span className="block text-xs text-textoSuave">delícias no cardápio</span>
          </div>
          <div>
            <b className="font-display text-2xl text-tinta">{totalCategorias || "–"}</b>
            <span className="block text-xs text-textoSuave">categorias</span>
          </div>
          <div>
            <b className="flex items-center gap-1.5 font-display text-2xl text-tinta">
              <Tag size={18} className="text-caramelo" aria-hidden="true" />
              {menorPreco === null ? "–" : formatarMoeda(menorPreco)}
            </b>
            <span className="block text-xs text-textoSuave">a partir de</span>
          </div>
        </div>
      </div>
    </section>
  );
}
