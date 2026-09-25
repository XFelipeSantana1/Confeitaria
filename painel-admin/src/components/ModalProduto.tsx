import { useState, type FormEvent } from "react";
import { Save, X } from "lucide-react";
import type { Categoria, Insumo, ProdutoAdmin } from "../types";
import { Entrada } from "./ui/Entrada";
import { Botao } from "./ui/Botao";
import { EditorFicha, type LinhaFicha } from "./EditorFicha";

export interface DadosProduto {
  nome: string;
  descricao: string;
  preco: number;
  categoria_id: number | null;
  imagem_url: string;
  ficha: Array<{ insumo_id: number; quantidade_necessaria: number }>;
}

// Criação e edição com ficha técnica embutida. Linhas vazias são
// descartadas no salvar; duplicar o mesmo insumo o backend barra (PK).
interface PropriedadesModalProduto {
  produto: ProdutoAdmin | null;
  fichaInicial: Array<{ insumo_id: number; quantidade_necessaria: number }>;
  categorias: Categoria[];
  insumos: Insumo[];
  salvando: boolean;
  erro: string | null;
  aoFechar: () => void;
  aoSalvar: (dados: DadosProduto) => void;
}

let proximaChave = 1;

export function ModalProduto({
  produto,
  fichaInicial,
  categorias,
  insumos,
  salvando,
  erro,
  aoFechar,
  aoSalvar,
}: PropriedadesModalProduto): JSX.Element {
  const [nome, definirNome] = useState(produto?.nome ?? "");
  const [descricao, definirDescricao] = useState(produto?.descricao ?? "");
  const [preco, definirPreco] = useState(produto ? String(produto.preco) : "");
  const [categoria, definirCategoria] = useState(
    produto?.categoria_id != null ? String(produto.categoria_id) : "",
  );
  const [imagem, definirImagem] = useState(produto?.imagem_url ?? "");
  const [linhas, definirLinhas] = useState<LinhaFicha[]>(
    fichaInicial.map((item) => ({
      chave: proximaChave++,
      insumo_id: String(item.insumo_id),
      quantidade: String(item.quantidade_necessaria),
    })),
  );

  function enviar(evento: FormEvent): void {
    evento.preventDefault();
    const ficha = linhas
      .filter((linha) => linha.insumo_id !== "" && Number(linha.quantidade) > 0)
      .map((linha) => ({
        insumo_id: Number(linha.insumo_id),
        quantidade_necessaria: Number(linha.quantidade),
      }));
    aoSalvar({
      nome: nome.trim(),
      descricao: descricao.trim(),
      preco: Number(preco),
      categoria_id: categoria === "" ? null : Number(categoria),
      imagem_url: imagem.trim(),
      ficha,
    });
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-tinta/50 p-4" role="dialog" aria-modal="true" aria-label={produto ? "Editar produto" : "Novo produto"}>
      <form onSubmit={enviar} className="my-8 flex w-full max-w-lg flex-col gap-3 rounded-3xl bg-white p-6 text-tinta shadow-Cartao">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">{produto ? "Editar produto" : "Novo produto"}</h3>
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="grid h-10 w-10 place-items-center rounded-xl border border-borda">
            <X size={18} />
          </button>
        </div>
        <Entrada id="prod-nome" rotulo="Nome" value={nome} onChange={(e) => definirNome(e.target.value)} placeholder="Ex: Cone doce tradicional" />
        <label className="flex flex-col gap-1.5 text-[13px] font-bold">
          Descrição
          <textarea value={descricao} onChange={(e) => definirDescricao(e.target.value)} rows={2} placeholder="O que torna esse doce especial?" className="rounded-xl border border-borda bg-creme px-3.5 py-2.5 font-corpo text-sm font-normal outline-none placeholder:text-textoSuave/50 focus:border-caramelo" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Entrada id="prod-preco" rotulo="Preço (R$)" type="number" min="0" step="any" value={preco} onChange={(e) => definirPreco(e.target.value)} placeholder="8.50" />
          <label className="flex flex-col gap-1.5 text-[13px] font-bold">
            Categoria
            <select value={categoria} onChange={(e) => definirCategoria(e.target.value)} className="rounded-xl border border-borda bg-creme px-3.5 py-2.5 text-sm font-normal">
              <option value="">Sem categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </label>
        </div>
        <Entrada id="prod-imagem" rotulo="URL da foto (opcional)" value={imagem} onChange={(e) => definirImagem(e.target.value)} placeholder="https://…" />
        <EditorFicha linhas={linhas} insumos={insumos} aoMudar={definirLinhas} />
        {erro ? (
          <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{erro}</p>
        ) : null}
        <Botao type="submit" disabled={salvando}>
          <Save size={17} /> {salvando ? "Salvando…" : produto ? "Salvar" : "Cadastrar"}
        </Botao>
      </form>
    </div>
  );
}
