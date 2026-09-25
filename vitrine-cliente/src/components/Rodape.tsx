import { CakeSlice } from "lucide-react";
import { identificadorSecao } from "../lib/secoes";

// Rodapé em colunas: marca + atalho por categoria (rola até a seção) +
// crédito e configuração. Link âncora de verdade, não texto solto.
interface PropriedadesRodape {
  secoes: string[];
  aoAbrirConfiguracoes: () => void;
}

export function Rodape({ secoes, aoAbrirConfiguracoes }: PropriedadesRodape): JSX.Element {
  function irParaSecao(categoria: string): void {
    document
      .getElementById(identificadorSecao(categoria))
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <footer className="mt-10 bg-tinta text-creme">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 font-display text-2xl font-extrabold">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-caramelo text-white">
              <CakeSlice size={20} />
            </span>
            Confeito<em className="text-dourado">Gest</em>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-creme/60">
            Confeitaria artesanal: do forno para a sua sacola em poucos toques,
            com pedido pronto no WhatsApp.
          </p>
        </div>
        <nav aria-label="Cardápio">
          <b className="text-xs font-bold uppercase tracking-widest text-dourado">Cardápio</b>
          <ul className="mt-3 flex flex-col gap-2">
            {secoes.map((secao) => (
              <li key={secao}>
                <button
                  onClick={() => irParaSecao(secao)}
                  className="text-sm text-creme/75 transition-colors hover:text-creme"
                >
                  {secao}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <b className="text-xs font-bold uppercase tracking-widest text-dourado">A casa</b>
          <p className="mt-3 text-sm leading-relaxed text-creme/60">
            TCC de Desenvolvimento de Sistemas — Etec · feito com carinho 🍓
          </p>
          <button
            onClick={aoAbrirConfiguracoes}
            className="mt-3 text-sm font-bold text-creme underline decoration-dourado decoration-2 underline-offset-4 hover:text-dourado"
          >
            trocar API / WhatsApp
          </button>
        </div>
      </div>
    </footer>
  );
}
