import { useState, type FormEvent } from "react";
import { PackagePlus, X } from "lucide-react";
import type { Insumo } from "../types";
import { Entrada } from "./ui/Entrada";
import { Botao } from "./ui/Botao";

// Registrar movimentação: entrada soma; perda/ajuste baixam (saída manual
// segue bloqueada no backend — só via venda). Baixa sem saldo volta 409.
const TIPOS = [
  { valor: "entrada", rotulo: "Entrada (compra/doação)" },
  { valor: "perda", rotulo: "Perda (vencido/quebra)" },
  { valor: "ajuste", rotulo: "Ajuste de baixa (inventário)" },
];

interface PropriedadesModalMovimentacao {
  insumo: Insumo;
  salvando: boolean;
  erro: string | null;
  aoFechar: () => void;
  aoSalvar: (dados: { tipo: string; quantidade: number; observacao?: string }) => void;
}

export function ModalMovimentacao({
  insumo,
  salvando,
  erro,
  aoFechar,
  aoSalvar,
}: PropriedadesModalMovimentacao): JSX.Element {
  const [tipo, definirTipo] = useState("entrada");
  const [quantidade, definirQuantidade] = useState("");
  const [observacao, definirObservacao] = useState("");

  function enviar(evento: FormEvent): void {
    evento.preventDefault();
    aoSalvar({
      tipo,
      quantidade: Number(quantidade),
      observacao: observacao.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-tinta/50 p-4" role="dialog" aria-modal="true" aria-label="Movimentar estoque">
      <form onSubmit={enviar} className="flex w-full max-w-md flex-col gap-3 rounded-3xl bg-white p-6 text-tinta shadow-Cartao">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-xl font-bold">
            <PackagePlus size={20} /> {insumo.nome}
          </h3>
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="grid h-10 w-10 place-items-center rounded-xl border border-borda">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-textoSuave">
          Atual: <b className="text-tinta">{insumo.quantidade_atual} {insumo.unidade_medida}</b>
        </p>
        <label className="flex flex-col gap-1.5 text-[13px] font-bold">
          Tipo
          <select value={tipo} onChange={(e) => definirTipo(e.target.value)} className="rounded-xl border border-borda bg-creme px-3.5 py-2.5 text-sm font-normal">
            {TIPOS.map((t) => (
              <option key={t.valor} value={t.valor}>{t.rotulo}</option>
            ))}
          </select>
        </label>
        <Entrada id="mov-qtd" rotulo={`Quantidade (${insumo.unidade_medida})`} type="number" min="0" step="any" value={quantidade} onChange={(e) => definirQuantidade(e.target.value)} placeholder="Ex: 500" />
        <Entrada id="mov-obs" rotulo="Observação (opcional)" value={observacao} onChange={(e) => definirObservacao(e.target.value)} placeholder="Ex: compra no atacadão" />
        {erro ? (
          <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{erro}</p>
        ) : null}
        <Botao type="submit" disabled={salvando}>
          <PackagePlus size={17} /> {salvando ? "Registrando…" : "Registrar"}
        </Botao>
      </form>
    </div>
  );
}
