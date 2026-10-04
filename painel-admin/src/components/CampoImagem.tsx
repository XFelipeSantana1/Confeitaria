import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { BotaoEscolher } from "./ui/BotaoEscolher";
import { urlPublica, validarArquivo } from "../lib/api";

// Campo de foto.
//
// Clique abre o explorador/galeria do sistema. No celular, o seletor nativo
// JÁ TRAZ o ajuste de recorte — é o "cortar" do próprio Android/iOS, depois
// de escolher a foto. Por isso não existe painel de recorte aqui: construí um
// e ele dava mais trabalho do que tomava da pessoa, e fechava sozinho
// quando a imagem demorava a carregar.
//
// O que este campo faz é o que o seletor nativo não faz: preview na proporção
// REAL do card, erro de formato/tamanho na hora, e envio direto.
//
// A lista de tipos é explícita de propósito: com `image/*` o iOS oferece HEIC,
// que o backend recusa (ele só grava JPG, PNG e WebP). Pedir a lista certa faz
// o sistema converter antes de entregar o arquivo.
interface PropriedadesCampoImagem {
  valor: string;
  rotulo: string;
  /** Largura / altura do quadro. 4/3 no card do produto, 1 no avatar. */
  proporcao?: number;
  textoAjuda?: string;
  aoMudar: (caminho: string) => void;
  // Devolve o caminho salvo: quem chamou é quem já tem o estado do formulário
  // e quem mostra a pré-visualização, então o upload não precisa conhecer o
  // valor atual — só devolvê-lo.
  aoEnviar: (arquivo: File) => Promise<string>;
  salvando: boolean;
}

export function CampoImagem({
  valor,
  rotulo,
  proporcao = 4 / 3,
  textoAjuda,
  aoMudar,
  aoEnviar,
  salvando,
}: PropriedadesCampoImagem): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastando, definirArrastando] = useState(false);
  const [erro, definirErro] = useState<string | null>(null);
  const [enviando, definirEnviando] = useState(false);

  async function processar(arquivo: File | undefined): Promise<void> {
    if (!arquivo) return;
    const problema = validarArquivo(arquivo);
    if (problema !== null) {
      definirErro(problema);
      return;
    }
    definirErro(null);
    definirEnviando(true);
    try {
      aoMudar(await aoEnviar(arquivo));
    } catch (falha) {
      definirErro(falha instanceof Error ? falha.message : "Não consegui enviar a foto.");
    } finally {
      definirEnviando(false);
    }
  }

  function escolher(evento: ChangeEvent<HTMLInputElement>): void {
    // O campo é zerado depois: sem isso, escolher o MESMO arquivo duas vezes
    // não dispara onChange e o gestor acha que o botão quebrou.
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    void processar(arquivo);
  }

  const occupado = enviando || salvando;
  const circular = proporcao === 1;

  return (
    <div className="flex flex-col gap-2 text-[13px]">
      <span className="font-bold text-tinta">{rotulo}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={escolher}
        className="sr-only"
      />

      <div
        className={
          circular
            ? "flex items-center gap-4"
            : "flex flex-col gap-3 sm:flex-row sm:items-start"
        }
      >
        <div
          style={{ aspectRatio: String(proporcao) }}
          className={`relative w-full flex-none overflow-hidden bg-areia/50 ${
            circular ? "h-20 w-20 rounded-full border border-borda" : "rounded-2xl border border-borda sm:w-44"
          }`}
        >
          {valor !== "" ? (
            <img
              src={urlPublica(valor)}
              alt={`Pré-visualização de ${rotulo.toLowerCase()}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="grid h-full place-items-center gap-1 text-textoSuave">
              <ImagePlus size={20} aria-hidden="true" />
              <span className="text-[11px] font-bold">sem foto</span>
            </span>
          )}
          {enviando && (
            <span
              aria-hidden="true"
              className="absolute inset-0 grid place-items-center bg-tinta/35"
            >
              <Loader2 size={22} className="motion-safe:animate-spin text-white" />
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <BotaoEscolher
              occupado={occupado}
              enviando={enviando}
              arrastando={arrastando}
              trocou={valor !== ""}
              aoClicar={() => inputRef.current?.click()}
              aoArrastarSobre={() => definirArrastando(true)}
              aoSair={() => definirArrastando(false)}
              aoSoltar={(arquivo) => {
                definirArrastando(false);
                void processar(arquivo);
              }}
            />
            {valor !== "" && (
              <button
                type="button"
                onClick={() => aoMudar("")}
                disabled={occupado}
                aria-label={`Remover ${rotulo.toLowerCase()}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-borda px-2.5 py-2 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-60"
              >
                <Trash2 size={14} aria-hidden="true" />
                Remover
              </button>
            )}
          </div>
          <p className="text-[11px] leading-relaxed font-normal text-textoSuave">
            {textoAjuda ??
              "Clique ou arraste a imagem. JPG, PNG ou WebP até 5 MB. No celular, o ajuste de recorte aparece depois de escolher a foto."}
          </p>
        </div>
      </div>

      {erro !== null && (
        <span role="alert" className="text-xs font-bold text-rose-700">
          {erro}
        </span>
      )}
    </div>
  );
}
