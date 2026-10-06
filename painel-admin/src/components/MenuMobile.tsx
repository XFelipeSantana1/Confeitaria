import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { ITENS_MENU } from "../lib/menu";
import { SimboloClaro } from "./Marca";
import { Avatar } from "./Avatar";
import { ContadorMenu } from "./ContadorMenu";

// Navegação do celular: gaveta que abre pelo botão do cabeçalho.
//
// Gaveta, e não uma fileira de abas no rodapé: são 5 telas, e 5 ícones já
// ocupam 72px de cada lado em 360px. Com mais telas os alvos caiam para 40px
// (abaixo do mínimo confortável de toque) e os rótulos viravam duas letras.
// A gaveta dá a lista inteira por extenso, e some depois que o gestor escolhe.
interface PropriedadesMenuMobile {
  aoAbrirPerfil: () => void;
  pendentes: number | null;
}

export function MenuMobile({ aoAbrirPerfil, pendentes }: PropriedadesMenuMobile): JSX.Element {
  const { sessao, sair } = useAutenticacao();
  const [aberto, definirAberto] = useState(false);

  // Navegar fecha a gaveta: sem isso ela ficaria aberta por cima da tela nova
  // e o gestor teria que apertar o X a cada troca.
  useEffect(() => {
    if (!aberto) return;
    function aoTeclar(evento: KeyboardEvent): void {
      if (evento.key === "Escape") definirAberto(false);
    }
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  return (
    <>
      <button
        onClick={() => definirAberto(true)}
        aria-label="Abrir o menu do painel"
        aria-expanded={aberto}
        className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-borda bg-white text-tinta md:hidden"
      >
        <Menu size={18} />
      </button>

      {/* A gaveta vai para o <body> por portal, e NÃO fica dentro do <header>.

          O cabeçalho usa `backdrop-blur-md`, e pelo spec do CSS um
          `backdrop-filter` no ancestral torna-se o bloco contentor dos
          descendentes `position: fixed`. Renderizando aqui dentro, a gaveta
          "de tela cheia" seria desenhada dentro dos 60px do cabeçalho — e
          aparecia como uma fatia fina no lugar de um menu. O portal escapa
          dessa regra sem depender de z-index nenhum. */}
      {aberto &&
        createPortal(
          <div className="fixed inset-0 z-[65] md:hidden">
            {/* Escurece o fundo e fecha ao clicar fora — como o drawer da
                sacola da vitrine, para o padrão ser o mesmo nos dois fronts. */}
            <button
              onClick={() => definirAberto(false)}
              aria-label="Fechar o menu"
              className="absolute inset-0 animate-[aparecer_0.2s_ease] bg-tinta/50"
            />
            <nav
              aria-label="Navegação do painel"
              className="absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col gap-1 overflow-y-auto bg-tinta p-4 text-creme shadow-[8px_0_30px_-10px_rgba(43,30,23,0.5)]"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-2 font-display text-lg font-extrabold">
                  <SimboloClaro tamanho={22} />
                  Doce<em className="text-dourado">&amp;</em> Carinho
                </p>
                <button
                  onClick={() => definirAberto(false)}
                  aria-label="Fechar o menu"
                  className="grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>

              {ITENS_MENU.map((item) => {
                const Icone = item.icone;
                return (
                  <NavLink
                    key={item.rota}
                    to={item.rota}
                    end
                    onClick={() => definirAberto(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-carameloForte text-white"
                          : "text-creme/75 active:bg-white/10"
                      }`
                    }
                  >
                    <Icone size={18} />
                    <span className="min-w-0 flex-1 truncate">{item.rotulo}</span>
                    <ContadorMenu valor={item.contagem === undefined ? null : pendentes} />
                  </NavLink>
                );
              })}

              <div className="mt-auto flex items-center gap-2 pt-4">
                <Avatar
                  nome={sessao?.usuario.nome}
                  cargo={sessao?.usuario.cargo}
                  imagemUrl={sessao?.usuario.imagem_url}
                  // Fecha a gaveta junto: a janela de perfil abre por cima
                  // dela, e voltar para a gaveta aberta depois de fechar a
                  // janela seria um passo a mais sem ganho.
                  aoClicar={() => {
                    definirAberto(false);
                    aoAbrirPerfil();
                  }}
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
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
