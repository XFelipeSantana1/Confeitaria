import { CakeSlice, Loader2, Pencil, Power, Trash2 } from "lucide-react";
import type { ProdutoAdmin } from "../types";
import { formatarMoeda } from "../lib/formatarMoeda";
import { urlPublica } from "../lib/api";
import { BotaoAcao, SeloAtivo } from "./ui/AcoesLinha";
import { CartaoProduto } from "./CartaoProduto";

// Lista de produtos em dois formatos: card empilhado no celular, tabela no
// desktop. Com 4 colunas a tabela exigia 368px de rolagem lateral numa tela
// de 360px — o gestor tinha de arrastar a tela para fora para ver o preço.
// Abaixo de `md` vale o card, que cabe inteiro sem arrastar nada.
interface PropriedadesTabelaProdutos {
  produtos: ProdutoAdmin[];
  aoEditar: (produto: ProdutoAdmin) => void;
  // Promise de propósito: quem chama precisa saber se deu certo. Com `void` a
  // falha de rede sumia e o selo de visibilidade mentia sobre o cardápio.
  aoAlternarAtivo: (produto: ProdutoAdmin) => Promise<void>;
  aoExcluir: (produto: ProdutoAdmin) => void;
  /** Id do produto com a troca em andamento, para travar só aquela linha. */
  trocandoId: number | null;
}

export function TabelaProdutos({
  produtos,
  aoEditar,
  aoAlternarAtivo,
  aoExcluir,
  trocandoId,
}: PropriedadesTabelaProdutos): JSX.Element {
  return (
    <>
      <ul className="flex flex-col gap-2 md:hidden">
        {produtos.map((produto) => (
          <CartaoProduto
            key={produto.id}
            produto={produto}
            aoEditar={aoEditar}
            aoAlternarAtivo={aoAlternarAtivo}
            aoExcluir={aoExcluir}
            trocando={trocandoId === produto.id}
          />
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-3xl border border-borda bg-white p-0 shadow-[0_8px_22px_-16px_rgba(43,30,23,0.25)] md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
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
              <tr
                key={produto.id}
                className="border-b border-borda/60 transition-colors last:border-0 hover:bg-creme"
              >
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    {produto.imagem_url ? (
                      <img
                        src={urlPublica(produto.imagem_url)}
                        alt=""
                        loading="lazy"
                        className="h-11 w-11 flex-none rounded-xl object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-areia text-caramelo"
                      >
                        <CakeSlice size={19} />
                      </span>
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
                  <SeloAtivo ativo={produto.ativo} />
                </td>
                <td className="px-4 py-3">
                  <span className="flex justify-end gap-1">
                    <BotaoAcao
                      onClick={() => void aoAlternarAtivo(produto)}
                      disabled={trocandoId === produto.id}
                      rotulo={
                        trocandoId === produto.id
                          ? "Salvando a mudança de visibilidade"
                          : produto.ativo
                            ? `Ocultar ${produto.nome} da vitrine`
                            : `Mostrar ${produto.nome} na vitrine`
                      }
                      className={produto.ativo ? "text-green-700" : "text-stone-400"}
                    >
                      {trocandoId === produto.id ? (
                        <Loader2 size={16} className="motion-safe:animate-spin" />
                      ) : (
                        <Power size={16} />
                      )}
                    </BotaoAcao>
                    <BotaoAcao
                      onClick={() => aoEditar(produto)}
                      rotulo={`Editar ${produto.nome}`}
                      className="text-textoSuave hover:text-tinta"
                    >
                      <Pencil size={16} />
                    </BotaoAcao>
                    <BotaoAcao
                      onClick={() => aoExcluir(produto)}
                      rotulo={`Remover ${produto.nome}`}
                      className="text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={16} />
                    </BotaoAcao>
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
