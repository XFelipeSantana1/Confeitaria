import { NavLink } from "react-router-dom";
import { ITENS_MENU } from "../lib/menu";

// Todas as telas do menu, fixas no rodapé do celular — hoje são cinco, que é
// o número que cabe com alvo de toque confortável (7 abas em 360px davam
// alvos de 40px e rótulos de duas letras).
//
// A gaveta do MenuMobile repete a mesma lista e é por ela que se sai e se abre
// o perfil; o rodapé é o atalho do que se usa todo dia.
const ABAS_PRINCIPais = ITENS_MENU;

export function AbasRodape(): JSX.Element {
  return (
    <nav
      aria-label="Atalhos"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-borda bg-creme/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="grid grid-cols-5">
        {ABAS_PRINCIPais.map((item) => {
          const Icone = item.icone;
          return (
            <NavLink
              key={item.rota}
              to={item.rota}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[10px] font-bold transition-colors ${
                  isActive ? "text-carameloForte" : "text-textoSuave"
                }`
              }
            >
              <Icone size={20} />
              {item.rotulo}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
