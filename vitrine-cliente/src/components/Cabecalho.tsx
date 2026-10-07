import { useEffect, useRef } from "react";
import { Settings2, ShoppingBasket } from "lucide-react";
import { BuscaCardapio } from "./BuscaCardapio";
import { SimboloClaro } from "./Marca";

// Barra fixa do topo: marca, busca e acesso à sacola.
//
// NÃO mostra o estado da API. "API online" é informação de quem desenvolve,
// não de quem quer comprar doce: ocupa espaço na tela mais valuable do site e
// obriga a cliente a ler algo que não pode fazer nada a respeito. A conexão
// quebrada já aparece onde o problema existe — o `AlertaErro` no lugar do
// cardápio e o balão "Mostrando o cardápio salvo" quando a recarga falha.

interface PropriedadesCabecalho {
  termoBusca: string;
  aoMudarBusca: (termo: string) => void;
  unidadesSacola: number;
  aoAbrirSacola: () => void;
  aoAbrirConfiguracoes: () => void;
}

export function Cabecalho({
  termoBusca,
  aoMudarBusca,
  unidadesSacola,
  aoAbrirSacola,
  aoAbrirConfiguracoes,
}: PropriedadesCabecalho): JSX.Element {
  // A barra publica a própria altura numa variável de CSS. A pílula de
  // categorias é `sticky` e precisa pousar logo abaixo dela — e 67px era um
  // número chutado para o celular em pé. Deitado, ou com o nome quebrado, a
  // barra mudava de altura e a pílula ficava por baixo do texto. Medir é mais
  // barato do que manter o chute certo para cada orientação.
  const referencia = useRef<HTMLElement>(null);

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento) return;
    const observador = new ResizeObserver(([medida]) => {
      document.documentElement.style.setProperty(
        "--altura-cabecalho",
        `${Math.round(medida?.contentRect.height ?? 0)}px`,
      );
    });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <header
      ref={referencia}
      className="sticky top-0 z-40 border-b border-borda bg-creme/85 backdrop-blur-md"
    >
      {/* Os três filhos da barra somavam 355px numa tela de 360px com 40px de
          padding — ou seja, 35px a mais do que cabia. O nome quebrava em duas
          linhas (o <small> é `block`, então abria um vão embaixo), o cabeçalho
          ficava mais alto que os 67px fixos da pílula de categorias, e a sacola
          saía do canto para colar no texto. Tudo por falta de `min-w-0` /
          `shrink-0` / `whitespace-nowrap`. */}
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-3 sm:gap-3">
        {/* `min-w-0` + `truncate`: se sobrar aperto, encolhe o nome em vez de
            empurrar os botões. */}
        <a href="#topo" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          {/* Versão CLARA do símbolo: o disco é escuro, e a silhueta externa
              da versão escura é da mesma cor do fundo — contraste 1,00:1, ou
              seja, cupcake invisível. Medido, não suposto. A versão clara dá
              15,3:1, e é a mesma que o painel usa. */}
          <span className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-gradient-to-br from-tinta to-carameloForte shadow-Cartao sm:h-11 sm:w-11">
            <SimboloClaro tamanho={26} />
          </span>
          {/* `whitespace-nowrap` é o que impede a quebra do nome: sem ele, o
              navegador corta no espaço e o cabeçalho ganha uma segunda linha
              (com o vão do subtítulo) em qualquer tela estreita ou deitada.

              E o subtítulo usa `mt-0`, e não `mt-1`: medindo os metrics reais
              das fontes, o vão entre a tinta do título e a do subtítulo era de
              7,1px para um título de apenas 10,6px de altura — quase do mesmo
              tamanho que o próprio nome, o que abria a marca. Quem causa é o
              `leading-none`: a caixa da linha (20px) é menor que a área da
              fonte Playfair (26,7px), o texto transborda 3,3px para fora e
              sobram 1,69px vazios embaixo da tinta, que o `mt-1` ainda
              empurrava mais 4px. Sem a margem, o vão cai para 3,1px e
              acompanha o tamanho da fonte em cada breakpoint (2,8px no
              celular, 2,9px em sm, 3,1px no desktop). */}
          <span className="min-w-0 font-display text-base font-extrabold leading-none whitespace-nowrap sm:text-lg md:text-xl">
            Doce<em className="text-caramelo">&amp;</em> Carinho
            <small className="mt-0 block font-corpo text-[10px] font-semibold tracking-[0.14em] whitespace-nowrap text-textoSuave uppercase">
              confeitaria artesanal
            </small>
          </span>
        </a>

        {/* No desktop a busca ocupa o vão entre a marca e os botões. */}
        <BuscaCardapio
          termo={termoBusca}
          aoMudar={aoMudarBusca}
          className="hidden min-w-0 flex-1 md:flex"
        />

        {/* `shrink-0` nos dois botões: sem isso eles encolhem e a marca é que
            cede espaço, que é o oposto do que se quer. */}
        <button
          onClick={aoAbrirConfiguracoes}
          aria-label="Configurar API e WhatsApp"
          title="Configurar API e WhatsApp"
          className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-borda bg-white text-tinta transition-transform hover:-translate-y-0.5 sm:h-11 sm:w-11"
        >
          <Settings2 size={19} />
        </button>

        <button
          onClick={aoAbrirSacola}
          aria-label={`Abrir sacola com ${unidadesSacola} itens`}
          className="flex flex-none items-center gap-2 rounded-full bg-carameloForte px-4 py-2.5 font-corpo text-sm font-bold text-white shadow-Cartao transition-transform hover:bg-carameloEscuro active:scale-95 sm:px-5"
        >
          <ShoppingBasket size={18} />
          <span className="hidden sm:inline">Sacola</span>
          {/* key=força remontar a cada mudança: o pulo toca em todo adicionar.
              `flex-none` para o contador não ser espremido em tela estreita. */}
          <b
            key={unidadesSacola}
            className="grid h-6 min-w-6 flex-none place-items-center rounded-full bg-caramelo px-1.5 text-xs motion-safe:animate-[pulo_0.45s_ease]"
          >
            {unidadesSacola}
          </b>
        </button>
      </div>

      {/* Busca em uma linha inteira, só no celular. Dentro do cabeçalho (e não
          depois dele) para continuar alcançável depois de rolar: a cliente
          que já está no meio do cardápio e lembra de "morango" não deveria ter
          que voltar ao topo para procurar.
          O `ResizeObserver` acima mede esta linha junto, então a pílula de
          categorias continua pousando na altura certa sem número chutado. */}
      <div className="px-5 pb-3 md:hidden">
        <BuscaCardapio termo={termoBusca} aoMudar={aoMudarBusca} />
      </div>
    </header>
  );
}
