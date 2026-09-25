import { useEffect, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import type { Produto } from "../types";
import { estaDisponivel } from "../lib/disponibilidade";
import {
  emojiParaProduto,
  gradienteParaProduto,
  imagemParaProduto,
} from "../lib/aparenciaProduto";
import { formatarMoeda } from "../lib/formatarMoeda";

// Um doce no grid: um toque adiciona 1x na sacola (com toast de confirmação)
// e o stepper inline ajusta sem sair do cardápio. Preço em cima, botão
// centralizado embaixo (largura total esticava e desproporcionava o card).
interface PropriedadesCardProduto {
  produto: Produto;
  quantidadeNaSacola: number;
  aoAdicionar: (produtoId: number) => void;
  aoAlterarQuantidade: (produtoId: number, diferenca: number) => void;
}

export function CardProduto({
  produto,
  quantidadeNaSacola,
  aoAdicionar,
  aoAlterarQuantidade,
}: PropriedadesCardProduto): JSX.Element {
  const disponivel = estaDisponivel(produto);
  const [corInicial, corFinal] = gradienteParaProduto(produto);
  const imagem = imagemParaProduto(produto);

  // Se a foto falhar (CDN fora, URL quebrada), volta para emoji + gradiente
  // em vez de mostrar ícone quebrado. Reseta ao trocar de produto.
  const [falhouImagem, definirFalhouImagem] = useState(false);
  useEffect(() => {
    definirFalhouImagem(false);
  }, [produto.id, imagem]);

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl border border-borda bg-white shadow-[0_8px_22px_-16px_rgba(43,26,18,0.35)] transition-all duration-300 motion-safe:animate-[subir_0.45s_ease_both] motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-Cartao ${
        disponivel ? "" : "opacity-70 grayscale-[0.4]"
      }`}
    >
      <div
        className="relative grid aspect-[4/3] place-items-center overflow-hidden text-7xl"
        style={{ background: `linear-gradient(135deg, ${corInicial}, ${corFinal})` }}
      >
        {imagem && !falhouImagem ? (
          <img
            src={imagem}
            alt={produto.nome}
            loading="lazy"
            onError={() => definirFalhouImagem(true)}
            className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
          />
        ) : (
          <span aria-hidden="true">{emojiParaProduto(produto)}</span>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-tinta/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-100">
          {produto.categoria}
        </span>
        {!disponivel && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            Indisponível
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-xl font-semibold">{produto.nome}</h3>
        <p className="flex-1 font-corpo text-[13px] leading-relaxed text-textoSuave">
          {produto.descricao}
        </p>
        <div className="mt-1 flex flex-col gap-2">
          <span className="font-display text-xl font-extrabold text-carameloForte">
            {formatarMoeda(produto.preco)}
          </span>
          {!disponivel ? (
            <span className="font-corpo text-xs font-semibold text-textoSuave/70">
              Sem estoque no momento
            </span>
          ) : quantidadeNaSacola === 0 ? (
            <button
              onClick={() => aoAdicionar(produto.id)}
              aria-label={`Adicionar ${produto.nome} à sacola`}
              className="flex items-center justify-center gap-1.5 self-center rounded-full bg-carameloForte px-7 py-2.5 font-corpo text-sm font-bold text-white transition-all hover:bg-carameloEscuro active:scale-95"
            >
              <Plus size={16} /> Adicionar produto <ArrowRight size={15} />
            </button>
          ) : (
            <div className="flex items-center gap-1 self-start rounded-full border border-borda bg-creme p-1">
              <button
                onClick={() => aoAlterarQuantidade(produto.id, -1)}
                aria-label={`Tirar um ${produto.nome} da sacola`}
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-lg font-bold shadow-sm transition-all hover:bg-tinta hover:text-white active:scale-95"
              >
                −
              </button>
              <b className="min-w-6 text-center text-sm">{quantidadeNaSacola}</b>
              <button
                onClick={() => aoAlterarQuantidade(produto.id, 1)}
                aria-label={`Colocar mais um ${produto.nome} na sacola`}
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-lg font-bold shadow-sm transition-all hover:bg-tinta hover:text-white active:scale-95"
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
