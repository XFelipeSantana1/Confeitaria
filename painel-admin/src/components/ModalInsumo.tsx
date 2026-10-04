import { useState, type FormEvent } from "react";
import { Save, X } from "lucide-react";
import type { Insumo } from "../types";
import { Entrada } from "./ui/Entrada";
import { Botao } from "./ui/Botao";

const UNIDADES = ["g", "kg", "ml", "l", "unidade"];

// Criação e edição no mesmo modal: sem insumo abre vazio (criar), com
// insumo preenche (editar). Estoque atual só aparece no criar — depois só
// via movimentação (regra do backend, não da tela).
export interface DadosInsumo {
  nome: string;
  unidade_medida: string;
  quantidade_atual: number;
  quantidade_minima: number;
  custo_unitario: number;
}

interface PropriedadesModalInsumo {
  insumo: Insumo | null;
  salvando: boolean;
  erro: string | null;
  aoFechar: () => void;
  aoSalvar: (dados: DadosInsumo) => void;
}

export function ModalInsumo({
  insumo,
  salvando,
  erro,
  aoFechar,
  aoSalvar,
}: PropriedadesModalInsumo): JSX.Element {
  const [nome, definirNome] = useState(insumo?.nome ?? "");
  const [unidade, definirUnidade] = useState(insumo?.unidade_medida ?? "g");
  const [atual, definirAtual] = useState(String(insumo?.quantidade_atual ?? 0));
  const [minima, definirMinima] = useState(String(insumo?.quantidade_minima ?? 0));
  const [custo, definirCusto] = useState(String(insumo?.custo_unitario ?? 0));

  function enviar(evento: FormEvent): void {
    evento.preventDefault();
    aoSalvar({
      nome: nome.trim(),
      unidade_medida: unidade,
      quantidade_atual: Number(atual),
      quantidade_minima: Number(minima),
      custo_unitario: Number(custo),
    });
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-tinta/50 p-4" role="dialog" aria-modal="true" aria-label={insumo ? "Editar insumo" : "Novo insumo"}>
      <form onSubmit={enviar} className="flex w-full max-w-md flex-col gap-3 rounded-3xl bg-white p-6 text-tinta shadow-Cartao">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">{insumo ? "Editar insumo" : "Novo insumo"}</h3>
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="grid h-10 w-10 place-items-center rounded-xl border border-borda">
            <X size={18} />
          </button>
        </div>
        <Entrada id="insumo-nome" rotulo="Nome" value={nome} onChange={(e) => definirNome(e.target.value)} placeholder="Ex: Leite condensado" />
        <label className="flex flex-col gap-1.5 text-[13px] font-bold">
          Unidade de medida
          <select value={unidade} onChange={(e) => definirUnidade(e.target.value)} className="rounded-xl border border-borda bg-creme px-3.5 py-2.5 text-sm font-normal">
            {UNIDADES.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {insumo ? null : (
            <Entrada id="insumo-atual" rotulo="Estoque inicial" type="number" min="0" step="any" value={atual} onChange={(e) => definirAtual(e.target.value)} />
          )}
          <Entrada id="insumo-minima" rotulo="Mínimo" type="number" min="0" step="any" value={minima} onChange={(e) => definirMinima(e.target.value)} />
          <Entrada id="insumo-custo" rotulo="Custo (R$)" type="number" min="0" step="any" value={custo} onChange={(e) => definirCusto(e.target.value)} />
        </div>
        {erro ? (
          <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{erro}</p>
        ) : null}
        <Botao type="submit" disabled={salvando}>
          <Save size={17} /> {salvando ? "Salvando…" : insumo ? "Salvar" : "Cadastrar"}
        </Botao>
      </form>
    </div>
  );
}
