import type { ReactNode } from "react";

// Disco com ícone para os estados vazios. Existe como componente (e não como
// classe repetida) porque as telas do painel têm o mesmo vazio com
// ícones diferentes: a classe repetida cinco vezes é chance de uma tela
// divergir das outras sem ninguém perceber.
interface PropriedadesDiscoVazio {
  children: ReactNode;
}
export function DiscoVazio({ children }: PropriedadesDiscoVazio): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-borda bg-areia/50 text-caramelo"
    >
      {children}
    </span>
  );
}
