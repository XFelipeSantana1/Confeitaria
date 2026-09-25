import { useEffect, useState } from "react";
import { Check, PlugZap, Settings2, X } from "lucide-react";
import { obterUrlBase, salvarUrlBase, testarConexao } from "../lib/api";
import { Botao } from "./ui/Botao";

// ⚙️ Configuração: URL da API + WhatsApp da loja, guardados no navegador.
// WhatsApp padrão também pode vir do .env (VITE_WHATSAPP_LOJA).
const CHAVE_WHATS = "cg_whats";

function obterWhatsSalvo(): string {
  return (
    localStorage.getItem(CHAVE_WHATS) ||
    (import.meta.env.VITE_WHATSAPP_LOJA as string | undefined) ||
    "5511999999999"
  );
}

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

  // Recarrega os valores salvos toda vez que abre (se salvou, fechou e
  // abriu de novo, mostra o atual — não o da primeira abertura).
  useEffect(() => {
    if (aberto) {
      definirUrlApi(obterUrlBase());
      definirWhats(obterWhatsSalvo());
      definirRetorno("");
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

  // Testa ANTES de salvar para não trocar uma URL boa por uma quebrada.
  async function testarAntesDeSalvar(): Promise<void> {
    salvarUrlBase(urlApi);
    definirRetorno("Testando…");
    try {
      const ok = await testarConexao();
      definirRetorno(
        ok ? "✅ API respondeu! Pode salvar." : "❌ Resposta inesperada da API.",
      );
    } catch {
      definirRetorno("❌ Não consegui falar com a API nesse endereço.");
    }
  }

  function salvar(): void {
    salvarUrlBase(urlApi);
    localStorage.setItem(CHAVE_WHATS, whats.trim());
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
            className="grid h-10 w-10 place-items-center rounded-xl border border-borda hover:-translate-y-0.5 transition-colors"
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
          <Botao onClick={salvar}>
            <Check size={17} /> Salvar
          </Botao>
          <Botao variante="clara" onClick={testarAntesDeSalvar}>
            <PlugZap size={17} /> Testar API
          </Botao>
        </div>
        <p className="rounded-2xl border border-dashed border-borda bg-creme p-3 text-[13px] leading-relaxed text-textoSuave">
          <b>Como testar:</b> suba o backend (<code>npm run dev</code> na pasta{" "}
          <code>backend</code>) e abra esta vitrine com <code>npm run dev</code>{" "}
          aqui na <code>vitrine-cliente</code>.
        </p>
        {retorno !== "" && <p className="text-sm font-bold">{retorno}</p>}
      </div>
    </div>
  );
}
