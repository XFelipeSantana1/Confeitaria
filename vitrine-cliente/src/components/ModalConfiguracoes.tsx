import { useEffect, useState } from "react";
import { Check, PlugZap, Settings2, X } from "lucide-react";
import { obterUrlBase, salvarUrlBase, testarConexao } from "../lib/api";
import { Botao } from "./ui/Botao";
import { CHAVE_WHATS, lerWhats, lerWhatsDoBuild } from "../lib/whatsLoja";

// Configuração: URL da API + WhatsApp da loja, guardados no navegador. O
// número tem uma chave só (ver lib/whatsLoja) porque a vitrine lê em dois
// lugares: este modal e o botão de finalizar pedido.
interface PropriedadesModalConfiguracoes {
  aberto: boolean;
  aoFechar: () => void;
  aoSalvar: () => void;
}

export function ModalConfiguracoes({
  aberto,
  aoFechar,
  aoSalvar,
}: PropriedadesModalConfiguracoes): JSX.Element | null {
  const [urlApi, definirUrlApi] = useState("");
  const [whats, definirWhats] = useState("");
  const [retorno, definirRetorno] = useState("");
  const [salvando, definirSalvando] = useState(false);
  const [erro, definirErro] = useState<string | null>(null);

  // Recarrega os valores salvos toda vez que abre (se salvou, fechou e
  // abriu de novo, mostra o atual — não o da primeira abertura).
  useEffect(() => {
    if (aberto) {
      definirUrlApi(obterUrlBase());
      definirWhats(lerWhats() || lerWhatsDoBuild());
      definirRetorno("");
      definirErro(null);
    }
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    function aoTeclar(evento: KeyboardEvent): void {
      if (evento.key === "Escape") aoFechar();
    }
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  // Testa a URL DIGITADA, sem salvar nada. O código antigo gravava antes de
  // testar (e o comentário dizia o contrário): um endereço errado ficava no
  // navegador e a vitrine quebrava no carregamento seguinte.
  async function testarAntesDeSalvar(): Promise<void> {
    definirRetorno("");
    definirErro(null);
    definirRetorno("Testando o endereço…");
    definirSalvando(true);
    try {
      const ok = await testarConexao(urlApi);
      definirRetorno(ok ? "API respondeu. Pode salvar." : "Resposta inesperada da API.");
    } catch {
      definirRetorno("Não consegui falar com a API nesse endereço.");
    } finally {
      definirSalvando(false);
    }
  }

  function salvar(): void {
    salvarUrlBase(urlApi);

    // Só grava WhatsApp com DDI+DDD. Um número incompleto faria o link abrir
    // errado, e a pessoa acharia que a loja sumiu — então o campo volta ao
    // valor do build e o motivo aparece em vez de sumir calado.
    const limpo = whats.replace(/\D/g, "");
    if (limpo.length >= 10) {
      localStorage.setItem(CHAVE_WHATS, limpo);
      definirErro(null);
    } else {
      const temNumero = limpo.length > 0;
      if (temNumero || localStorage.getItem(CHAVE_WHATS) !== null) {
        localStorage.removeItem(CHAVE_WHATS);
      }
      definirErro(
        temNumero
          ? "O WhatsApp precisa de DDI + DDD + número (10 ou 11 dígitos). Não foi salvo."
          : null,
      );
      if (temNumero) {
        definirWhats(lerWhatsDoBuild());
        return;
      }
    }
    aoSalvar();
  }

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-tinta/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Configurações"
    >
      <div className="flex w-full max-w-md flex-col gap-3 rounded-3xl bg-white p-6 text-tinta shadow-Cartao">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-xl font-bold">
            <Settings2 size={20} /> Configurações
          </h3>
          <button
            onClick={aoFechar}
            aria-label="Fechar configurações"
            className="grid h-10 w-10 place-items-center rounded-xl border border-borda transition-colors hover:-translate-y-0.5"
          >
            <X size={18} />
          </button>
        </div>
        <label className="flex flex-col gap-1.5 text-[13px] font-bold">
          URL da API (backend Express)
          <input
            value={urlApi}
            onChange={(evento) => definirUrlApi(evento.target.value)}
            placeholder="https://sua-api-3000.app.github.dev/api"
            className="rounded-xl border border-borda px-3.5 py-2.5 font-corpo text-sm font-normal"
          />
        </label>
        <p className="-mt-1 text-xs font-normal text-textoSuave">
          Vale com ou sem o <code>/api</code> no final — a vitrine completa sozinha.
        </p>
        <label className="flex flex-col gap-1.5 text-[13px] font-bold">
          WhatsApp da loja (só números, com DDI+DDD)
          <input
            value={whats}
            onChange={(evento) => definirWhats(evento.target.value)}
            placeholder="5511999999999"
            inputMode="numeric"
            className="rounded-xl border border-borda px-3.5 py-2.5 font-corpo text-sm font-normal"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <Botao onClick={salvar} carregando={salvando}>
            <Check size={17} /> Salvar
          </Botao>
          <Botao variante="clara" onClick={testarAntesDeSalvar} carregando={salvando}>
            <PlugZap size={17} /> Testar API
          </Botao>
        </div>
        <p className="rounded-2xl border border-dashed border-borda bg-creme p-3 text-[13px] leading-relaxed text-textoSuave">
          <b>Como testar:</b> suba o backend (<code>npm run dev</code> na pasta{" "}
          <code>backend</code>) e abra esta vitrine com <code>npm run dev</code>{" "}
          aqui na <code>vitrine-cliente</code>.
        </p>
        {retorno !== "" && <p className="text-sm font-bold">{retorno}</p>}
        {erro !== null && (
          <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
            {erro}
          </p>
        )}
      </div>
    </div>
  );
}
