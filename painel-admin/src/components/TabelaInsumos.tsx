import { PackagePlus, Pencil, Trash2 } from "lucide-react";
import type { Insumo } from "../types";

// Tabela de insumos: selo verde/vermelho por saldo vs. mínimo e três ações
// por linha (movimentar, editar, remover). O pai decide os modais e o
// excluir — aqui só apresentação + clique.
interface PropriedadesTabelaInsumos {
  insumos: Insumo[];
  aoMovimentar: (insumo: Insumo) => void;
  aoEditar: (insumo: Insumo) => void;
  aoExcluir: (insumo: Insumo) => void;
}

export function TabelaInsumos({
  insumos,
  aoMovimentar,
  aoEditar,
  aoExcluir,
}: PropriedadesTabelaInsumos): JSX.Element {
  return (
    <div className="overflow-x-auto rounded-3xl border border-borda bg-white p-0 shadow-[0_8px_22px_-16px_rgba(43,30,23,0.25)]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-borda text-xs uppercase tracking-wide text-textoSuave">
            <th className="px-4 py-3">Insumo</th>
            <th className="px-4 py-3">Estoque</th>
            <th className="px-4 py-3">Custo/un.</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo) => {
            const alerta = insumo.quantidade_atual <= insumo.quantidade_minima;
            return (
              <tr key={insumo.id} className="border-b border-borda/60 transition-colors last:border-0 hover:bg-creme">
                <td className="px-4 py-3 font-bold text-tinta">
                  {insumo.nome}
                  <span className="block text-xs font-normal text-textoSuave">
                    mín. {insumo.quantidade_minima} {insumo.unidade_medida}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${alerta ? "bg-rose-100 text-rose-700" : "bg-green-100 text-green-800"}`}>
                    {insumo.quantidade_atual} {insumo.unidade_medida}
                  </span>
                </td>
                <td className="px-4 py-3 text-tinta">R$ {insumo.custo_unitario.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className="flex justify-end gap-1">
                    <button onClick={() => aoMovimentar(insumo)} aria-label={`Movimentar ${insumo.nome}`} title="Registrar entrada/baixa" className="grid h-9 w-9 place-items-center rounded-xl text-carameloForte hover:bg-areia">
                      <PackagePlus size={17} />
                    </button>
                    <button onClick={() => aoEditar(insumo)} aria-label={`Editar ${insumo.nome}`} title="Editar" className="grid h-9 w-9 place-items-center rounded-xl text-textoSuave hover:bg-areia hover:text-tinta">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => aoExcluir(insumo)} aria-label={`Remover ${insumo.nome}`} title="Remover" className="grid h-9 w-9 place-items-center rounded-xl text-stone-400 hover:bg-rose-50 hover:text-rose-600">
                      <Trash2 size={16} />
                    </button>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
