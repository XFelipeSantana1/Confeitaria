import type { ReactNode } from "react";
import { Botao } from "./ui/Botao";

// Mensagem amigável para "não há nada aqui". A ilustração é enviada pelo
// chamador em vez de um emoji fixo: cada vazio tem um motivo diferente
// (busca sem resultado ≠ cardápio vazio) e uma imagem genérica apaga essa
// diferença — aqui ela é o desenho, não o texto, que explica o que houve.
interface PropriedadesEstadoVazio {
  ilustracao: ReactNode;
  titulo: string;
  mensagem: string;
  textoAcao?: string;
  aoAgir?: () => void;
  carregando?: boolean;
}

export function EstadoVazio({
  ilustracao,
  titulo,
  mensagem,
  textoAcao,
  aoAgir,
  carregando = false,
}: PropriedadesEstadoVazio): JSX.Element {
  return (
    <div className="px-5 py-12 text-center">
      {ilustracao}
      <h3 className="mt-2 font-display text-2xl font-bold text-tinta">{titulo}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-textoSuave">{mensagem}</p>
      {textoAcao && aoAgir && (
        <div className="mt-5">
          <Botao onClick={aoAgir} carregando={carregando}>
            {textoAcao}
          </Botao>
        </div>
      )}
    </div>
  );
}
