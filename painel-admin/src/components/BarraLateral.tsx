import { CakeSlice, ClipboardList, LayoutDashboard, LogOut, Tag, UserRound, Wheat } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAutenticacao } from "../hooks/useAutenticacao";

// Navegação lateral do painel. Telas futuras entram aqui com selo "em breve"
// (desabilitadas) em vez de link quebrado — o menu nunca mente.
const ITENS = [
  { rota: "/painel", rotulo: "Resumo", icone: LayoutDashboard, pronto: true },
  { rota: "/painel/pedidos", rotulo: "Pedidos", icone: ClipboardList, pronto: true },
  { rota: "/painel/insumos", rotulo: "Insumos", icone: Wheat, pronto: true },
  { rota: "/painel/produtos", rotulo: "Produtos", icone: CakeSlice, pronto: true },
  { rota: "/painel/categorias", rotulo: "Categorias", icone: Tag, pronto: true },
  { rota: "/painel/perfil", rotulo: "Meu perfil", icone: UserRound, pronto: true },
];

export function BarraLateral(): JSX.Element {
  const { sessao, sair } = useAutenticacao();
  return (
    <aside className="flex w-60 flex-none flex-col gap-1 bg-gradient-to-b from-tinta via-[#3d2517] to-tinta p-4 text-creme shadow-[4px_0_24px_rgba(43,30,23,0.25)] max-md:hidden">
      <p className="px-2 pb-4 font-display text-xl font-extrabold">
        Confeito<em className="text-dourado">Gest</em>
      </p>
      <p className="px-2 pb-1 font-numero text-[10px] font-bold uppercase tracking-[0.2em] text-creme/40">
        Gerenciar
      </p>
      {ITENS.map((item) => {
        const Icone = item.icone;
        const base =
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors";
        return item.pronto ? (
          <NavLink
            key={item.rota}
            to={item.rota}
            end
            className={({ isActive }) =>
              `${base} ${isActive ? "bg-carameloForte text-white" : "text-creme/70 hover:bg-white/10 hover:text-creme"}`
            }
          >
            <Icone size={18} /> {item.rotulo}
          </NavLink>
        ) : (
          <span
            key={item.rota}
            title="Tela futura"
            className={`${base} cursor-not-allowed text-creme/35`}
          >
            <Icone size={18} /> {item.rotulo}
            <b className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase">
              em breve
            </b>
          </span>
        );
      })}
      <div className="mt-auto flex items-center gap-2 rounded-xl bg-white/5 p-3">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-carameloForte font-display font-bold text-white">
          {sessao?.usuario.nome.charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <b className="block truncate text-sm">{sessao?.usuario.nome}</b>
          <span className="block text-xs text-creme/60">{sessao?.usuario.cargo}</span>
        </span>
        <button
          onClick={sair}
          aria-label="Sair do painel"
          title="Sair"
          className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/10 transition-colors"
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}
