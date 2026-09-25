import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { ItemCarrinho } from "../types";
import {
  emojiParaProduto,
  gradienteParaProduto,
  imagemParaProduto,
} from "../lib/aparenciaProduto";
import { formatarMoeda } from "../lib/formatarMoeda";

// Uma linha da sacola: foto/emoji, nome, preço e controle de quantidade.
interface PropriedadesItemSacola {
  item: ItemCarrinho;
  aoAlterarQuantidade: (produtoId: number, diferenca: number) => void;
  aoRemover: (produtoId: number) => void;
}

export function ItemSacola({
  item,
  aoAlterarQuantidade,
  aoRemover,
}: PropriedadesItemSacola): JSX.Element {
  const { produto, quantidade } = item;
  const [corInicial, corFinal] = gradienteParaProduto(produto);
  const imagem = imagemParaProduto(produto);
  const [falhouImagem, definirFalhouImagem] = useState(false);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-borda bg-white p-2.5">
      <div
        className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-xl text-2xl"
        style={{ background: `linear-gradient(135deg, ${corInicial}, ${corFinal})` }}
        aria-hidden="true"
      >
        {imagem && !falhouImagem ? (
          <img
            src={imagem}
            alt=""
            loading="lazy"
            onError={() => definirFalhouImagem(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          emojiParaProduto(produto)
        )}
      </div>
      <div className="min-w-0 flex-1">
        <b className="block truncate font-corpo text-sm">{produto.nome}</b>
        <span className="text-xs text-textoSuave">
          {formatarMoeda(produto.preco)} cada ·{" "}
          <b>{formatarMoeda(produto.preco * quantidade)}</b>
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => aoAlterarQuantidade(produto.id, -1)}
          aria-label={`Tirar um ${produto.nome} da sacola`}
          className="grid h-7 w-7 place-items-center rounded-full border border-borda bg-white font-bold hover:bg-tinta hover:text-white transition-colors"
        >
          −
        </button>
        <b className="min-w-5 text-center text-sm">{quantidade}</b>
        <button
          onClick={() => aoAlterarQuantidade(produto.id, 1)}
          aria-label={`Colocar mais um ${produto.nome} na sacola`}
          className="grid h-7 w-7 place-items-center rounded-full border border-borda bg-white font-bold hover:bg-tinta hover:text-white transition-colors"
        >
          +
        </button>
        <button
          onClick={() => aoRemover(produto.id)}
          aria-label={`Remover ${produto.nome} da sacola`}
          title="Remover"
          className="grid h-7 w-7 place-items-center rounded-full text-textoSuave/70 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
