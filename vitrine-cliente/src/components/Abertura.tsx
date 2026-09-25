import { MessageCircleHeart, Sparkles, Timer, UtensilsCrossed } from "lucide-react";
import { Botao } from "./ui/Botao";

// Abertura em dois tempos: foto limpa em tela cheia (sem véu nem moldura)
// e, abaixo, o conteúdo sobre o cacau da página. A foto vende; o texto
// respira no escuro sem precisar de overlay.
interface PropriedadesAbertura {
  totalProdutos: number;
  totalCategorias: number;
  aoComoFunciona: () => void;
}

export function Abertura({
  totalProdutos,
  totalCategorias,
  aoComoFunciona,
}: PropriedadesAbertura): JSX.Element {
  return (
    <section>
      <div className="h-[44svh] min-h-[300px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=1600&q=80"
          alt="Caixa com vários doces artesanais de chocolate"
          loading="eager"
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
              <Timer size={20} className="text-caramelo" /> hoje
            </b>
            <span className="block text-xs text-textoSuave">pedido médio em minutos</span>
          </div>
        </div>
      </div>
    </section>
  );
}
