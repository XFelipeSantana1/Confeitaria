import { Pencil, Power, Trash2 } from "lucide-react";
import type { ProdutoAdmin } from "../types";
import { formatarMoeda } from "../lib/formatarMoeda";

// Tabela de produtos: foto mini, categoria, preço, selo ativo/inativo e
// ações (editar, ligar/desligar da vitrine, remover com 409 se tem venda).
interface PropriedadesTabelaProdutos {
  produtos: ProdutoAdmin[];
  aoEditar: (produto: ProdutoAdmin) => void;
  aoAlternarAtivo: (produto: ProdutoAdmin) => void;
  aoExcluir: (produto: ProdutoAdmin) => void;
}

export function TabelaProdutos({
  produtos,
  aoEditar,
  aoAlternarAtivo,
  aoExcluir,
}: PropriedadesTabelaProdutos): JSX.Element {
  return (
    <div className="overflow-x-auto rounded-3xl border border-borda bg-white p-0 shadow-[0_8px_22px_-16px_rgba(43,30,23,0.25)]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-borda text-xs uppercase tracking-wide text-textoSuave">
            <th className="px-4 py-3">Produto</th>
            <th className="px-4 py-3">Preço</th>
            <th className="px-4 py-3">Na vitrine</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id} className="border-b border-borda/60 transition-colors last:border-0 hover:bg-creme">
              <td className="px-4 py-3">
                <span className="flex items-center gap-3">
                  {produto.imagem_url ? (
                    <img src={produto.imagem_url} alt="" loading="lazy" className="h-11 w-11 flex-none rounded-xl object-cover" />
                  ) : (
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-areia text-xl" aria-hidden="true">🧁</span>
                  )}
                  <span>
                    <b className="block text-tinta">{produto.nome}</b>
                    <span className="block text-xs font-normal text-textoSuave">
                      {produto.categoria ?? "Sem categoria"}
                    </span>
                  </span>
                </span>
              </td>
              <td className="px-4 py-3 font-numero font-extrabold tabular-nums text-carameloForte">
                {formatarMoeda(produto.preco)}
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${produto.ativo ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-500"}`}>
                  {produto.ativo ? "Visível" : "Oculto"}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="flex justify-end gap-1">
                  <button onClick={() => aoAlternarAtivo(produto)} aria-label={produto.ativo ? `Ocultar ${produto.nome} da vitrine` : `Mostrar ${produto.nome} na vitrine`} title="Ligar/desligar na vitrine" className={`grid h-9 w-9 place-items-center rounded-xl hover:bg-areia ${produto.ativo ? "text-green-700" : "text-stone-400"}`}>
                    <Power size={16} />
                  </button>
                  <button onClick={() => aoEditar(produto)} aria-label={`Editar ${produto.nome}`} title="Editar" className="grid h-9 w-9 place-items-center rounded-xl text-textoSuave hover:bg-areia hover:text-tinta">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => aoExcluir(produto)} aria-label={`Remover ${produto.nome}`} title="Remover" className="grid h-9 w-9 place-items-center rounded-xl text-stone-400 hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 size={16} />
                  </button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
