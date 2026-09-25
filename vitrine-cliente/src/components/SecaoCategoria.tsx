import { LayoutGrid } from "lucide-react";
import { TODAS_CATEGORIAS } from "../types";
import { iconeParaCategoria } from "../lib/iconeCategoria";

// Pílulas de filtro por categoria. Carrossel horizontal com scroll porque o
// número de categorias cresce (a confeiteira cadastra pelo painel).
interface PropriedadesSecaoCategoria {
  categorias: string[];
  ativa: string;
  aoSelecionar: (categoria: string) => void;
}

export function SecaoCategoria({
  categorias,
  ativa,
  aoSelecionar,
}: PropriedadesSecaoCategoria): JSX.Element {
  const opcoes = [TODAS_CATEGORIAS, ...categorias];
  return (
    <div className="mb-5 flex gap-2.5 overflow-x-auto pb-2" role="tablist" aria-label="Categorias">
      {opcoes.map((categoria) => {
        const selecionada = ativa === categoria;
        const Icone =
          categoria === TODAS_CATEGORIAS ? LayoutGrid : iconeParaCategoria(categoria);
        return (
          <button
            key={categoria}
            role="tab"
            aria-selected={selecionada}
            onClick={() => aoSelecionar(categoria)}
            className={`flex flex-none items-center gap-2 rounded-full px-5 py-2.5 font-corpo text-sm font-semibold transition-all active:scale-95 ${
              selecionada
                ? "bg-tinta text-creme shadow-Cartao"
                : "border border-borda bg-white text-textoSuave hover:border-caramelo hover:text-tinta"
            }`}
          >
            <Icone size={16} />
            {categoria === TODAS_CATEGORIAS ? "Tudo" : categoria}
          </button>
        );
      })}
    </div>
  );
}
