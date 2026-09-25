import { Outlet } from "react-router-dom";
import { CakeSlice, LogOut } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { BarraLateral } from "../components/BarraLateral";

// Moldura das telas logadas: sidebar no desktop, topo compacto no mobile.
export function EstruturaPainel(): JSX.Element {
  const { sair } = useAutenticacao();
  return (
    <div className="flex min-h-screen bg-creme font-corpo">
      <BarraLateral />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-borda bg-creme/85 px-5 py-3 backdrop-blur-md md:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-tinta text-amber-200">
            <CakeSlice size={18} />
          </span>
          <b className="font-display text-lg text-tinta">ConfeitoGest</b>
          <button
            onClick={sair}
            aria-label="Sair do painel"
            className="ml-auto grid h-9 w-9 place-items-center rounded-xl border border-borda bg-white text-tinta"
          >
            <LogOut size={17} />
          </button>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
