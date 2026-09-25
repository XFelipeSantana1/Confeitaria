import { CakeSlice, Search, Settings2, ShoppingBasket } from "lucide-react";
import type { EstadoApi } from "../types";

export type { EstadoApi };

// Barra fixa do topo: marca, busca, estado da API e acesso à sacola.
// A busca some no mobile (espaço curto) — o filtro por categoria cobre o uso.
const ROTULO_ESTADO: Record<EstadoApi, string> = {
  carregando: "conectando…",
  online: "API online",
  demonstracao: "demonstração",
  erro: "API fora do ar",
};

const COR_ESTADO: Record<EstadoApi, string> = {
  carregando: "bg-amber-500",
  online: "bg-green-700",
  demonstracao: "bg-rose-600",
  erro: "bg-rose-600",
};

interface PropriedadesCabecalho {
  termoBusca: string;
  aoMudarBusca: (termo: string) => void;
  unidadesSacola: number;
  estadoApi: EstadoApi;
  aoAbrirSacola: () => void;
  aoAbrirConfiguracoes: () => void;
}

export function Cabecalho({
  termoBusca,
  aoMudarBusca,
  unidadesSacola,
  estadoApi,
  aoAbrirSacola,
  aoAbrirConfiguracoes,
}: PropriedadesCabecalho): JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-borda bg-creme/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
        <a href="#topo" className="flex items-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-tinta to-carameloForte text-amber-200 shadow-Cartao">
            <CakeSlice size={24} />
          </span>
          <span className="font-display text-xl font-extrabold leading-none">
            Confeito<em className="text-caramelo">Gest</em>
            <small className="mt-1 block font-corpo text-[10px] font-semibold uppercase tracking-[0.14em] text-textoSuave">
              confeitaria artesanal
            </small>
          </span>
        </a>

        <div className="hidden flex-1 items-center gap-2 rounded-full border border-borda bg-white px-4 py-2 md:flex">
          <Search size={17} className="text-textoSuave" />
          <input
            value={termoBusca}
            onChange={(evento) => aoMudarBusca(evento.target.value)}
            type="search"
            placeholder="Buscar no cardápio… (ex: cone, morango)"
            aria-label="Buscar no cardápio"
            className="w-full bg-transparent font-corpo text-sm text-tinta outline-none placeholder:text-textoSuave/60"
          />
        </div>

        <span
          className="hidden items-center gap-2 rounded-full border border-borda bg-white px-3 py-2 text-xs text-textoSuave sm:flex"
          title="Estado da conexão com o backend"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${COR_ESTADO[estadoApi]}`} />
          {ROTULO_ESTADO[estadoApi]}
        </span>

        <button
          onClick={aoAbrirConfiguracoes}
          aria-label="Configurar API e WhatsApp"
          title="Configurar API e WhatsApp"
          className="grid h-11 w-11 place-items-center rounded-xl border border-borda bg-white text-tinta transition-transform hover:-translate-y-0.5"
        >
          <Settings2 size={19} />
        </button>

        <button
          onClick={aoAbrirSacola}
          aria-label={`Abrir sacola com ${unidadesSacola} itens`}
          className="flex items-center gap-2 rounded-full bg-carameloForte px-5 py-2.5 font-corpo text-sm font-bold text-white shadow-Cartao transition-transform hover:bg-carameloEscuro active:scale-95"
        >
          <ShoppingBasket size={18} />
          <span className="hidden sm:inline">Sacola</span>
          {/* key=força remontar a cada mudança: o pulo toca em todo adicionar. */}
          <b
            key={unidadesSacola}
            className="grid h-6 min-w-6 place-items-center rounded-full bg-caramelo px-1.5 text-xs motion-safe:animate-[pulo_0.45s_ease]"
          >
            {unidadesSacola}
          </b>
        </button>
      </div>
    </header>
  );
}
