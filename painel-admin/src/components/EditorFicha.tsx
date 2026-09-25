import { Plus, Trash2 } from "lucide-react";
import type { Insumo } from "../types";

// Editor de linhas da ficha técnica: cada linha é insumo + quantidade.
// Linha sem insumo não entra no salvamento (o pai filtra as vazias).
export interface LinhaFicha {
  chave: number;
  insumo_id: string;
  quantidade: string;
}

interface PropriedadesEditorFicha {
  linhas: LinhaFicha[];
  insumos: Insumo[];
  aoMudar: (linhas: LinhaFicha[]) => void;
}

export function EditorFicha({ linhas, insumos, aoMudar }: PropriedadesEditorFicha): JSX.Element {
  function mudarLinha(chave: number, campo: "insumo_id" | "quantidade", valor: string): void {
    aoMudar(linhas.map((linha) => (linha.chave === chave ? { ...linha, [campo]: valor } : linha)));
  }

  return (
    <div className="flex flex-col gap-2">
      <b className="text-[13px]">Ficha técnica (receita)</b>
      {linhas.map((linha) => {
        const insumo = insumos.find((i) => String(i.id) === linha.insumo_id);
        return (
          <div key={linha.chave} className="flex items-center gap-2">
            <select
              value={linha.insumo_id}
              onChange={(e) => mudarLinha(linha.chave, "insumo_id", e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-borda bg-creme px-3 py-2 text-sm font-normal"
              aria-label="Insumo da receita"
            >
              <option value="">Escolher insumo…</option>
              {insumos.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome} ({i.unidade_medida})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="any"
              value={linha.quantidade}
              onChange={(e) => mudarLinha(linha.chave, "quantidade", e.target.value)}
              placeholder="Qtd"
              aria-label="Quantidade necessária"
              className="w-24 rounded-xl border border-borda bg-creme px-3 py-2 text-sm"
            />
            <span className="w-14 flex-none text-xs text-textoSuave">{insumo?.unidade_medida ?? ""}</span>
            <button
              type="button"
              onClick={() => aoMudar(linhas.filter((l) => l.chave !== linha.chave))}
              aria-label="Remover linha da receita"
              className="grid h-9 w-9 flex-none place-items-center rounded-xl text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => aoMudar([...linhas, { chave: Date.now(), insumo_id: "", quantidade: "" }])}
        className="flex items-center gap-1.5 self-start rounded-full border border-dashed border-caramelo px-4 py-1.5 text-xs font-bold text-carameloForte hover:bg-caramelo/10 transition-colors"
      >
        <Plus size={14} /> Adicionar ingrediente
      </button>
    </div>
  );
}
