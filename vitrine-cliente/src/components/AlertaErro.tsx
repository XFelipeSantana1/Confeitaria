import { CloudOff, RotateCcw, Sparkles } from "lucide-react";
import { Botao } from "./ui/Botao";

// Tela de erro de rede: explica em linguagem de cliente (sem código HTTP),
// oferece "Tentar novamente" (refaz o fetch) e, como alternativa, ver a
// demonstração local. Nunca tela branca, nunca cardápio falso.
interface PropriedadesAlertaErro {
  mensagem: string;
  aoTentarNovamente: () => void;
  aoUsarDemonstracao: () => void;
}

export function AlertaErro({
  mensagem,
  aoTentarNovamente,
  aoUsarDemonstracao,
}: PropriedadesAlertaErro): JSX.Element {
  return (
    <div className="mx-auto max-w-lg px-5 py-12 text-center">
      <p className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-500/15 text-rose-300">
        <CloudOff size={30} />
      </p>
      <h3 className="mt-4 font-display text-2xl font-bold text-tinta">
        O forno esfriou por aqui 🔌
      </h3>
      <p className="mt-2 text-sm text-textoSuave">
        Não consegui falar com a cozinha ({mensagem}). Confira se o backend
        está no ar e tente de novo.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Botao onClick={aoTentarNovamente}>
          <RotateCcw size={17} /> Tentar novamente
        </Botao>
        <Botao variante="clara" onClick={aoUsarDemonstracao}>
          <Sparkles size={17} /> Ver demonstração
        </Botao>
      </div>
    </div>
  );
}
