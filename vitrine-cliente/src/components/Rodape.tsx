import { SimboloClaro } from "./Marca";
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
          {/* O rodapé é a única tela em 3 colunas: no celular a primeira coluna fica
              com ~80px de largura útil, e "Doce & Carinho" só precisa 78px —
              com o símbolo do lado estourava 77px. Então abaixo de md fica só
              o símbolo, que é a marca completa numa forma só. */}
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-carameloForte">
              <SimboloClaro tamanho={24} />
            </span>
            {/* A fonte sobe por degrau e não de uma vez: em md a grade vira 3 colunas
              e a primeira fica com ~216px, onde text-2xl estourava 4px. */}
            <p className="hidden font-display text-lg font-extrabold sm:block md:text-xl lg:text-2xl">
              Doce<em className="text-dourado">&amp;</em> Carinho
            </p>
          </div>
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
            Doces feitos à mão, todos os dias. Do balcão para a sua sacola.
          </p>
          <button
            onClick={aoAbrirConfiguracoes}
            className="mt-3 text-sm font-bold text-creme underline decoration-dourado decoration-2 underline-offset-4 hover:text-dourado transition-colors"
          >
            trocar API / WhatsApp
          </button>
        </div>
      </div>
    </footer>
  );
}
