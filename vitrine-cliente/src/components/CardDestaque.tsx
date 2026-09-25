import { useEffect, useState } from "react";
import { Plus, Star } from "lucide-react";
import type { Produto } from "../types";
import { estaDisponivel } from "../lib/disponibilidade";
import {
  emojiParaProduto,
  gradienteParaProduto,
  imagemParaProduto,
} from "../lib/aparenciaProduto";
import { formatarMoeda } from "../lib/formatarMoeda";

// Destaque da casa: o primeiro doce em card horizontal largo (foto à
// esquerda, conteúdo à direita). Quebra a simetria do grid e dá ao olhar
// um ponto de partida — sem ele, todos os cards competem igual.
interface PropriedadesCardDestaque {
  produto: Produto;
  quantidadeNaSacola: number;
  aoAdicionar: (produtoId: number) => void;
  aoAlterarQuantidade: (produtoId: number, diferenca: number) => void;
}

export function CardDestaque({
  produto,
  quantidadeNaSacola,
  aoAdicionar,
  aoAlterarQuantidade,
}: PropriedadesCardDestaque): JSX.Element {
  const disponivel = estaDisponivel(produto);
  const [corInicial, corFinal] = gradienteParaProduto(produto);
  const imagem = imagemParaProduto(produto);
  const [falhouImagem, definirFalhouImagem] = useState(false);
  useEffect(() => {
    definirFalhouImagem(false);
  }, [produto.id, imagem]);

  return (
    <article className="grid overflow-hidden rounded-3xl border border-borda bg-white text-tinta shadow-Cartao transition-all duration-300 motion-safe:hover:scale-[1.005] md:grid-cols-5">
      <div
        className="relative grid min-h-56 place-items-center overflow-hidden text-8xl md:col-span-2"
        style={{ background: `linear-gradient(135deg, ${corInicial}, ${corFinal})` }}
      >
        {imagem && !falhouImagem ? (
          <img
            src={imagem}
            alt={produto.nome}
            loading="lazy"
            onError={() => definirFalhouImagem(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{emojiParaProduto(produto)}</span>
        )}
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-tinta/85 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-100">
          <Star size={13} /> destaque da casa
        </span>
      </div>
      <div className="flex flex-col justify-center gap-3 p-6 md:col-span-3 md:p-8">
        <span className="text-xs font-bold uppercase tracking-widest text-carameloForte">
          {produto.categoria}
        </span>
        <h3 className="font-display text-3xl font-bold md:text-4xl">{produto.nome}</h3>
        <p className="max-w-prose font-corpo text-sm leading-relaxed text-stone-600">
          {produto.descricao}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-4">
          <span className="font-display text-3xl font-extrabold text-carameloForte">
            {formatarMoeda(produto.preco)}
          </span>
          {!disponivel ? (
            <span className="font-corpo text-sm font-semibold text-stone-400">
              Sem estoque no momento
            </span>
          ) : quantidadeNaSacola === 0 ? (
            <button
              onClick={() => aoAdicionar(produto.id)}
              aria-label={`Adicionar ${produto.nome} à sacola`}
              className="flex items-center gap-1.5 rounded-full bg-caramelo px-7 py-3 font-corpo text-sm font-bold text-white shadow-Cartao transition-all hover:bg-carameloForte active:scale-95"
            >
              <Plus size={16} /> Quero esse
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-full border border-borda bg-creme p-1">
              <button
                onClick={() => aoAlterarQuantidade(produto.id, -1)}
                aria-label={`Tirar um ${produto.nome} da sacola`}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-lg font-bold shadow-sm transition-colors hover:bg-tinta hover:text-white active:scale-95"
              >
                −
              </button>
              <b className="min-w-7 text-center">{quantidadeNaSacola}</b>
              <button
                onClick={() => aoAlterarQuantidade(produto.id, 1)}
                aria-label={`Colocar mais um ${produto.nome} na sacola`}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-lg font-bold shadow-sm transition-colors hover:bg-tinta hover:text-white active:scale-95"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
