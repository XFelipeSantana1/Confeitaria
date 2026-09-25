import { Botao } from "./ui/Botao";

// Mensagem amigável genérica para "não há nada aqui": usada no grid vazio
// (busca sem resultado) e em outras telas futuras. Ação opcional embaixo.
interface PropriedadesEstadoVazio {
  emoji: string;
  titulo: string;
  mensagem: string;
  textoAcao?: string;
  aoAgir?: () => void;
}

export function EstadoVazio({
  emoji,
  titulo,
  mensagem,
  textoAcao,
  aoAgir,
}: PropriedadesEstadoVazio): JSX.Element {
  return (
    <div className="px-5 py-12 text-center">
      <p className="text-6xl" aria-hidden="true">
        {emoji}
      </p>
      <h3 className="mt-3 font-display text-2xl font-bold text-tinta">{titulo}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-textoSuave">{mensagem}</p>
      {textoAcao && aoAgir && (
        <div className="mt-5">
          <Botao onClick={aoAgir}>{textoAcao}</Botao>
        </div>
      )}
    </div>
  );
}
