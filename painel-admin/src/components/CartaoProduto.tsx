import { CakeSlice, Pencil, Power, Trash2, Loader2 } from "lucide-react";
import type { ProdutoAdmin } from "../types";
import { formatarMoeda } from "../lib/formatarMoeda";
import { urlPublica } from "../lib/api";
import { BotaoAcao, CartaoLinha, FaixaAcoes, SeloAtivo } from "./ui/AcoesLinha";

// Um produto como card empilhado — o formato do celular.
//
// A tabela de 4 colunas exigia 368px de rolagem lateral numa tela de 360px:
// o gestor tinha que arrastar a tela para fora para enxergar o preço. Aqui
// tudo cabe sem arrastar nada. Preço e selo ficam na mesma linha porque são
// as duas informações que o gestor procura primeiro.
interface PropriedadesCartaoProduto {
  produto: ProdutoAdmin;
  aoEditar: (produto: ProdutoAdmin) => void;
  aoAlternarAtivo: (produto: ProdutoAdmin) => Promise<void>;
  aoExcluir: (produto: ProdutoAdmin) => void;
  trocando: boolean;
}

export function CartaoProduto({
  produto,
  aoEditar,
  aoAlternarAtivo,
  aoExcluir,
  trocando,
}: PropriedadesCartaoProduto): JSX.Element {
  return (
    <CartaoLinha>
      <div className="flex items-start gap-3">
        {produto.imagem_url ? (
          // urlPublica: o backend devolve "/uploads/x.jpg" e o painel roda em
          // outra porta — sem prefixar a API o <img> procuraria a foto no
          // servidor do painel e mostraria quebrada.
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
        <div className="min-w-0 flex-1">
          <b className="block leading-tight text-tinta">{produto.nome}</b>
          <span className="block text-xs text-textoSuave">
            {produto.categoria ?? "Sem categoria"}
          </span>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="font-numero font-extrabold text-carameloForte">
              {formatarMoeda(produto.preco)}
            </span>
            <SeloAtivo ativo={produto.ativo} />
          </div>
        </div>
      </div>
      <FaixaAcoes>
        <BotaoAcao
          onClick={() => void aoAlternarAtivo(produto)}
          disabled={trocando}
          rotulo={
            trocando
              ? "Salvando a mudança de visibilidade"
              : produto.ativo
                ? `Ocultar ${produto.nome} da vitrine`
                : `Mostrar ${produto.nome} na vitrine`
          }
          className={produto.ativo ? "text-green-700" : "text-stone-400"}
        >
          {trocando ? (
            <Loader2 size={16} className="motion-safe:animate-spin" />
          ) : (
            <Power size={16} />
          )}
        </BotaoAcao>
        <BotaoAcao
          onClick={() => aoEditar(produto)}
          rotulo={`Editar ${produto.nome}`}
          className="text-textoSuave"
        >
          <Pencil size={16} />
        </BotaoAcao>
        <BotaoAcao
          onClick={() => aoExcluir(produto)}
          rotulo={`Remover ${produto.nome}`}
          className="ml-auto text-stone-400 hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2 size={16} />
        </BotaoAcao>
      </FaixaAcoes>
    </CartaoLinha>
  );
}
