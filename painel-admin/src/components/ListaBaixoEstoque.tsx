import { TriangleAlert } from "lucide-react";
import type { Insumo } from "../types";
import { Cartao } from "./ui/Cartao";

// Insumos no limite (atual ≤ mínima). Cada linha mostra o quanto falta para
// o mínimo — a dona decide a compra sem abrir outra tela.
export function ListaBaixoEstoque({ itens }: { itens: Insumo[] }): JSX.Element {
  return (
    <Cartao className="flex-1">
      <h2 className="flex items-center gap-2 font-display text-xl font-bold text-tinta">
        <TriangleAlert size={20} className="text-rose-600" /> Estoque baixo
      </h2>
      {itens.length === 0 ? (
        <p className="py-6 text-center text-sm text-textoSuave">
          Tudo abastecido por aqui. Bom trabalho! ✅
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {itens.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl bg-creme px-3 py-2"
            >
              <span className="flex-1 truncate text-sm font-semibold text-tinta">
                {item.nome}
              </span>
              <span className="text-xs font-bold text-rose-700">
                {item.quantidade_atual} / mín. {item.quantidade_minima} {item.unidade_medida}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Cartao>
  );
}
