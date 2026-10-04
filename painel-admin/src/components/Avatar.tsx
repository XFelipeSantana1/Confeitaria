import { urlPublica } from "../lib/api";

interface PropriedadesAvatar {
  nome: string | undefined;
  cargo?: string | null;
  imagemUrl?: string | null;
  /** Botão em vez de <span>, para abrir o perfil. */
  aoClicar?: () => void;
  tamanho?: "md" | "sm";
}

/**
 * O nome do gestor no rodapé da sidebar e da gaveta.
 *
 * Foto quando tem, inicial quando não. A inicial continua existindo porque
 * `imagem_url` pode ser null e um quadrado vazio ali parece quebrado.
 *
 * `overflow-hidden` + `object-cover`: sem ele, uma foto deitado esticava o
 * círculo e a imagem saía do lugar.
 */
export function Avatar({
  nome,
  cargo = null,
  imagemUrl = null,
  aoClicar,
  tamanho = "md",
}: PropriedadesAvatar): JSX.Element {
  const classeCirculo = tamanho === "sm" ? "h-9 w-9 text-sm" : "h-9 w-9";
  const conteudo = imagemUrl ? (
    <img
      src={urlPublica(imagemUrl)}
      alt=""
      className={`${classeCirculo} flex-none rounded-full object-cover`}
    />
  ) : (
    <span
      aria-hidden="true"
      className={`grid ${classeCirculo} flex-none place-items-center rounded-full bg-carameloForte font-display font-bold text-white`}
    >
      {(nome ?? "?").charAt(0).toUpperCase()}
    </span>
  );

  if (aoClicar === undefined) {
    return (
      <span className="flex min-w-0 flex-1 items-center gap-2">
        {conteudo}
        <span className="min-w-0 flex-1">
          <b className="block truncate text-sm">{nome}</b>
          {cargo ? <span className="block text-xs text-creme/60">{cargo}</span> : null}
        </span>
      </span>
    );
  }

  return (
    <button
      onClick={aoClicar}
      className="flex min-w-0 flex-1 items-center gap-2 rounded-lg text-left"
    >
      {conteudo}
      <span className="min-w-0 flex-1">
        <b className="block truncate text-sm">{nome}</b>
        {cargo ? <span className="block text-xs text-creme/60">{cargo}</span> : null}
      </span>
    </button>
  );
}
