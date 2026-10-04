import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { ITENS_MENU } from "../lib/menu";
import { SimboloClaro } from "./Marca";
import { Avatar } from "./Avatar";

// Barra fixa do desktop (w-60) e rodapé de abas no celular.
//
// No celular a barra some e quem manda é o MenuMobile. Os dois leem a MESMA
// lista em lib/menu — antes cada um tinha a sua, e o rodapé do celular ficou
// sem nenhum item.
export function BarraLateral({ aoAbrirPerfil }: { aoAbrirPerfil: () => void }): JSX.Element {
  const { sessao, sair } = useAutenticacao();
  return (
    <aside className="hidden w-60 flex-none flex-col gap-1 bg-gradient-to-b from-tinta via-[#3d2517] to-tinta p-4 text-creme shadow-[4px_0_24px_rgba(43,30,23,0.25)] md:flex">
      <p className="flex items-center gap-2.5 px-2 pb-4 font-display text-xl font-extrabold">
        <SimboloClaro tamanho={26} />
        Doce<em className="text-dourado">&amp;</em> Carinho
      </p>
      <p className="px-2 pb-1 font-numero text-[10px] font-bold uppercase tracking-[0.2em] text-creme/40">
        Gerenciar
      </p>
      {ITENS_MENU.map((item) => {
        const Icone = item.icone;
        return (
          <NavLink
            key={item.rota}
            to={item.rota}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-carameloForte text-white"
                  : "text-creme/70 hover:bg-white/10 hover:text-creme"
              }`
            }
          >
            <Icone size={18} /> {item.rotulo}
          </NavLink>
        );
      })}
      <div className="mt-auto flex items-center gap-2 rounded-xl bg-white/5 p-3">
        <Avatar
          nome={sessao?.usuario.nome}
          cargo={sessao?.usuario.cargo}
          imagemUrl={sessao?.usuario.imagem_url}
          aoClicar={aoAbrirPerfil}
        />
        <button
          onClick={sair}
          aria-label="Sair do painel"
          title="Sair"
          className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-white/10"
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}
