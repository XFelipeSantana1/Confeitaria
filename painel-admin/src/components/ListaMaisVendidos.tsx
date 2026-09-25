import { Trophy } from "lucide-react";
import type { ProdutoVendido } from "../types";
import { Cartao } from "./ui/Cartao";

// Ranking de vendas (GET /admin/mais-vendidos). Vazio não é erro: loja nova
// ainda não vendeu — mensagem orienta em vez de tabela vazia.
export function ListaMaisVendidos({ itens }: { itens: ProdutoVendido[] }): JSX.Element {
  return (
    <Cartao className="flex-1">
      <h2 className="flex items-center gap-2 font-display text-xl font-bold text-tinta">
        <Trophy size={20} className="text-carameloForte" /> Mais vendidos
      </h2>
      {itens.length === 0 ? (
        <p className="py-6 text-center text-sm text-textoSuave">
          Nenhuma venda registrada ainda — os queridinhos aparecem aqui. 🏆
        </p>
      ) : (
        <ol className="mt-3 flex flex-col gap-3">
          {itens.map((item, indice) => {
            // Barra proporcional ao campeão: compara sem precisar de gráfico.
            const maximo = Math.max(...itens.map((i) => i.total_vendido), 1);
            const largura = Math.max(8, Math.round((item.total_vendido / maximo) * 100));
            return (
              <li key={item.id}>
                <span className="flex items-center gap-3">
                  <b className="grid h-7 w-7 flex-none place-items-center rounded-full bg-tinta font-display text-sm text-creme">
                    {indice + 1}
                  </b>
                  <span className="flex-1 truncate text-sm font-semibold text-tinta">
                    {item.nome}
                  </span>
                  <span className="text-sm font-bold text-carameloForte">
                    {item.total_vendido} un.
                  </span>
                </span>
                <span className="ml-10 mt-1 block h-2 overflow-hidden rounded-full bg-areia">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-dourado to-caramelo"
                    style={{ width: `${largura}%` }}
                  />
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </Cartao>
  );
}
