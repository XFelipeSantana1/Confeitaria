import type { ReactNode } from "react";

// Peças que os dois formatos da lista (card no celular, tabela no desktop)
// compartilham. Ficaram aqui porque repetidas em dois arquivos elas iam
// divergir na primeira alteração — foi o que aconteceu com o selo de
// visibilidade antes de o esqueleto virar componente.

/**
 * Botão de ação de linha. O rótulo vira também `title`: no celular não há
 * coluna de ações, então sem ele o gestor não saberia o que o ícone faz.
 */
export function BotaoAcao({
  onClick,
  rotulo,
  disabled = false,
  className = "",
  children,
}: {
  onClick: () => void;
  rotulo: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={rotulo}
      title={rotulo}
      className={`grid h-10 w-10 place-items-center rounded-xl md:h-9 md:w-9 transition-colors hover:bg-areia disabled:cursor-wait disabled:opacity-60 disabled:hover:bg-transparent ${className}`}
    >
      {children}
    </button>
  );
}

/** Selo "Visível / Oculto" do produto. */
export function SeloAtivo({ ativo }: { ativo: boolean }): JSX.Element {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        ativo ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-500"
      }`}
    >
      {ativo ? "Visível" : "Oculto"}
    </span>
  );
}

/** Moldura de card: a mesma nos dois formatos, para o "respiro" não variar. */
export function CartaoLinha({ children }: { children: ReactNode }): JSX.Element {
  return (
    <li className="rounded-3xl border border-borda bg-white p-3 shadow-[0_8px_22px_-16px_rgba(43,30,23,0.25)]">
      {children}
    </li>
  );
}

/** Faixa de ações no rodapé do card (celular). */
export function FaixaAcoes({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="mt-2.5 flex gap-1.5 border-t border-borda/60 pt-2.5">{children}</div>
  );
}
