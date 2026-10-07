import { Loader2, RefreshCw } from "lucide-react";

// Título do cardápio, contador e o botão de recarregar. Separado para a seção
// principal cuidar só de agrupar e navegar, não de apresentar o cabeçalho.
interface PropriedadesCabecalhoCardapio {
  totalExibido: number;
  carregando: boolean;
  atualizando: boolean;
  modoDemonstracao: boolean;
  aoAtualizar: () => void;
}

export function CabecalhoCardapio({
  totalExibido,
  carregando,
  atualizando,
  modoDemonstracao,
  aoAtualizar,
}: PropriedadesCabecalhoCardapio): JSX.Element {
  return (
    <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-3xl font-bold text-tinta md:text-4xl">
          Nosso cardápio
        </h2>
        {/* O selo "§ nosso cardápio" repetia o título logo abaixo, e a frase
            "escolha com calma, coma com alegria" era mais uma frase de marca
            onde a cliente já tinha lido o suficiente. O que fica é o que ela
            precisa: onde está a lista e quantas opções tem. */}
        <p className="mt-1 text-sm font-semibold text-textoSuave">
          {carregando
            ? "carregando…"
            : `${totalExibido} ${totalExibido === 1 ? "doce" : "doces"}${
                modoDemonstracao ? " em demonstração" : ""
              }`}
        </p>
      </div>

      {/* Contador e recarrega lado a lado: o botão fica onde o olho já está
          depois de ler o número, e é o lugar natural para quem acha que a
          vitrine travou. Vira spinner no lugar do ícone enquanto busca. */}
      <div className="flex items-center gap-2">
        <p className="text-sm text-textoSuave">
          {carregando
            ? "Carregando delícias…"
            : `Mostrando ${totalExibido} delícia(s)${modoDemonstracao ? " em demonstração" : " fresquinha(s)"}.`}
        </p>
        <button
          onClick={aoAtualizar}
          disabled={atualizando}
          aria-label="Atualizar o cardápio"
          title={
            atualizando
              ? "Atualizando…"
              : "Atualizar o cardápio (também acontece sozinho ao voltar para esta aba)"
          }
          aria-busy={atualizando}
          className="grid h-9 w-9 flex-none place-items-center rounded-xl border border-borda bg-white text-tinta transition-all hover:-translate-y-0.5 hover:bg-areia/60 disabled:cursor-progress disabled:opacity-70"
        >
          {atualizando ? (
            <Loader2 size={17} className="motion-safe:animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw size={17} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
