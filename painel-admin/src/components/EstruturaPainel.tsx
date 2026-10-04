import { useState } from "react";
import { Outlet } from "react-router-dom";
import { BarraLateral } from "./BarraLateral";
import { MenuMobile } from "./MenuMobile";
import { AbasRodape } from "./AbasRodape";
import { JanelaPerfil } from "./JanelaPerfil";
import { SimboloClaro } from "./Marca";

// Moldura das telas logadas: sidebar no desktop, cabeçalho + gaveta no celular.
//
// A janela de perfil mora aqui porque quem a abre é o rodapé da sidebar e o
// da gaveta — dois irmão diferentes. Subir o estado para a moldura evita
// context novo só para um booleano.
export function EstruturaPainel(): JSX.Element {
  const [perfilAberto, definirPerfilAberto] = useState(false);

  return (
    <div className="flex min-h-screen bg-creme font-corpo">
      <BarraLateral aoAbrirPerfil={() => definirPerfilAberto(true)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-2.5 border-b border-borda bg-creme/90 px-4 py-3 backdrop-blur-md md:hidden">
          <MenuMobile aoAbrirPerfil={() => definirPerfilAberto(true)} />
          {/* Claro, como na sidebar: sobre fundo tinta a versão escura dá
              1,00:1 e o desenho desaparece. */}
          <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-tinta">
            <SimboloClaro tamanho={22} />
          </span>
          <b className="truncate font-display text-base text-tinta sm:text-lg">Doce &amp; Carinho</b>
        </header>
        {/* Reserva a altura do rodapé de abas (~51px) mais 20px de folga, senão
            o último item da lista fica escondido atrás dele. pb-24 (96px)
            sobrava 45px de rolagem vazia no fim de toda tela. */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 pb-[4.5rem] sm:px-5 md:px-5 md:py-6 md:pb-6">
          <Outlet />
        </main>
        <AbasRodape />
      </div>
      {perfilAberto ? <JanelaPerfil aoFechar={() => definirPerfilAberto(false)} /> : null}
    </div>
  );
}
