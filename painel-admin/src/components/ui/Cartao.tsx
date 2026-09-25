import type { ReactNode } from "react";

// Moldura padrão dos blocos do painel (cards de métrica, listas, tabelas).
export function Cartao({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <div className={`rounded-3xl border border-borda bg-white p-5 shadow-[0_8px_22px_-16px_rgba(43,30,23,0.25)] ${className}`}>
      {children}
    </div>
  );
}
