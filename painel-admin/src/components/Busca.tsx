import { Search, X } from "lucide-react";

/**
 * Campo de busca por texto.
 *
 * Fica em componente próprio porque as três telas que listam (produtos,
 * insumos e histórico) precisam do mesmo campo e do mesmo comportamento: limpar
 * com um clique, `Esc` limpa, e o rótulo acessível incluso — o campo só com
 * placeholder não diz nada para quem usa leitor de tela.
 */
interface PropriedadesBusca {
  valor: string;
  aoMudar: (valor: string) => void;
  placeholder: string;
  /** O que está sendo filtrado, para o rótulo acessível ("Buscar insumos"). */
  rotulo: string;
}

export function Busca({ valor, aoMudar, placeholder, rotulo }: PropriedadesBusca): JSX.Element {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-borda bg-white px-4 py-2 transition-colors focus-within:border-caramelo">
      <Search size={17} className="flex-none text-textoSuave" aria-hidden="true" />
      <input
        type="search"
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        onKeyDown={(evento) => {
          if (evento.key === "Escape") aoMudar("");
        }}
        placeholder={placeholder}
        aria-label={rotulo}
        className="w-full min-w-0 bg-transparent font-corpo text-sm text-tinta outline-none placeholder:text-textoSuave/60"
      />
      {valor !== "" ? (
        <button
          onClick={() => aoMudar("")}
          aria-label="Limpar a busca"
          className="grid h-6 w-6 flex-none place-items-center rounded-full text-textoSuave transition-colors hover:bg-areia hover:text-tinta"
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}
