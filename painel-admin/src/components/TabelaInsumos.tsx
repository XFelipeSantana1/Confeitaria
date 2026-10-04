import { PackagePlus, Pencil, Trash2 } from "lucide-react";
import type { Insumo } from "../types";
import { BotaoAcao, CartaoLinha, FaixaAcoes } from "./ui/AcoesLinha";

// Lista de insumos: selo verde/vermelho por saldo vs. mínimo e três ações por
// linha (movimentar, editar, remover). O pai decide os modais e o excluir —
// aqui só apresentação + clique.
//
// Mesma ideia dos produtos: no celular a tabela de 720px exigia 368px de
// rolagem lateral numa tela de 360px, então abaixo de `md` cada insumo vira
// um card. No desktop continua a tabela.
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
    <>
      <ul className="flex flex-col gap-2 md:hidden">
        {insumos.map((insumo) => (
          <CartaoLinha key={insumo.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <b className="block leading-tight text-tinta">{insumo.nome}</b>
                <span className="block text-xs text-textoSuave">
                  mín. {insumo.quantidade_minima} {insumo.unidade_medida} · R${" "}
                  {insumo.custo_unitario.toFixed(2)}/un
                </span>
              </div>
              <SeloSaldo insumo={insumo} />
            </div>
            <FaixaAcoes>
              <Acoes
                insumo={insumo}
                aoMovimentar={aoMovimentar}
                aoEditar={aoEditar}
                aoExcluir={aoExcluir}
              />
            </FaixaAcoes>
          </CartaoLinha>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-3xl border border-borda bg-white p-0 shadow-[0_8px_22px_-16px_rgba(43,30,23,0.25)] md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-borda text-xs uppercase tracking-wide text-textoSuave">
              <th className="px-4 py-3">Insumo</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3">Custo/un.</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map((insumo) => (
              <tr
                key={insumo.id}
                className="border-b border-borda/60 transition-colors last:border-0 hover:bg-creme"
              >
                <td className="px-4 py-3 font-bold text-tinta">
                  {insumo.nome}
                  <span className="block text-xs font-normal text-textoSuave">
                    mín. {insumo.quantidade_minima} {insumo.unidade_medida}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <SeloSaldo insumo={insumo} />
                </td>
                <td className="px-4 py-3 text-tinta">R$ {insumo.custo_unitario.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className="flex justify-end gap-1">
                    <Acoes
                      insumo={insumo}
                      aoMovimentar={aoMovimentar}
                      aoEditar={aoEditar}
                      aoExcluir={aoExcluir}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Acoes({ insumo, aoMovimentar, aoEditar, aoExcluir }: {
  insumo: Insumo;
  aoMovimentar: (i: Insumo) => void;
  aoEditar: (i: Insumo) => void;
  aoExcluir: (i: Insumo) => void;
}): JSX.Element {
  return (
    <>
      <BotaoAcao
        onClick={() => aoMovimentar(insumo)}
        rotulo={`Movimentar ${insumo.nome}`}
        className="text-carameloForte"
      >
        <PackagePlus size={16} />
      </BotaoAcao>
      <BotaoAcao
        onClick={() => aoEditar(insumo)}
        rotulo={`Editar ${insumo.nome}`}
        className="text-textoSuave hover:text-tinta"
      >
        <Pencil size={16} />
      </BotaoAcao>
      <BotaoAcao
        onClick={() => aoExcluir(insumo)}
        rotulo={`Remover ${insumo.nome}`}
        className="text-stone-400 hover:bg-rose-50 hover:text-rose-600"
      >
        <Trash2 size={16} />
      </BotaoAcao>
    </>
  );
}

function SeloSaldo({ insumo }: { insumo: Insumo }): JSX.Element {
  const alerta = insumo.quantidade_atual <= insumo.quantidade_minima;
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        alerta ? "bg-rose-100 text-rose-700" : "bg-green-100 text-green-800"
      }`}
    >
      {insumo.quantidade_atual} {insumo.unidade_medida}
    </span>
  );
}
