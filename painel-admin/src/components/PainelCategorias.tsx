import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import type { Categoria, ProdutoAdmin } from "../types";
import { ErroApi } from "../lib/api";
import { Botao } from "./ui/Botao";
import { ModalCategoria } from "./ModalCategoria";
import { ModalConfirmacao } from "./ModalConfirmacao";

/** O que a lista está mostrando: todas, uma categoria, ou os sem categoria. */
export type FiltroCategoria = "todas" | "sem" | number;

interface PropriedadesPainelCategorias {
  categorias: Categoria[];
  produtos: ProdutoAdmin[];
  filtro: FiltroCategoria;
  aoFiltrar: (filtro: FiltroCategoria) => void;
  // As escritas devolvem Promise e podem rejeitar: o painel espera, e só
  // fecha o modal quando deu certo. Quem segura `salvando` e `erro` é o
  // painel, não a tela — assim o 409 de nome duplicado aparece no modal em
  // vez de sumir junto com ele.
  aoCriar: (nome: string) => Promise<void>;
  aoRenomear: (id: number, nome: string) => Promise<void>;
  aoRemover: (categoria: Categoria) => Promise<void>;
  aoFechar: () => void;
}

type EmEdicao = { tipo: "nova" } | { tipo: "renomear"; categoria: Categoria };

/**
 * Categorias dentro da tela de Produtos.
 *
 * Virou painel lateral em vez de tela porque eram três registros ocupando a
 * tela inteira — e porque categoria é atributo de produto, não assunto
 * próprio. Aproveitei para fazer o painel *servir* a tela: tocar numa
 * categoria filtra a tabela logo abaixo, que é o que se quer 90% das vezes
 * (ver "quantos brigadeiros eu tenho").
 */
export function PainelCategorias({
  categorias,
  produtos,
  filtro,
  aoFiltrar,
  aoCriar,
  aoRenomear,
  aoRemover,
  aoFechar,
}: PropriedadesPainelCategorias): JSX.Element {
  const [emEdicao, definirEmEdicao] = useState<EmEdicao | null>(null);
  const [excluindo, definirExcluindo] = useState<Categoria | null>(null);
  const [salvando, definirSalvando] = useState(false);
  const [erro, definirErro] = useState<string | null>(null);

  async function executar(
    acao: () => Promise<void>,
    fechar: () => void,
  ): Promise<void> {
    definirSalvando(true);
    definirErro(null);
    try {
      await acao();
      fechar();
    } catch (falha) {
      definirErro(falha instanceof ErroApi ? falha.message : "A ação falhou. Tente de novo.");
    } finally {
      definirSalvando(false);
    }
  }

  // A contagem vem dos produtos que a tela já carregou: nenhuma requisição
  // extra, e o número é sempre o mesmo que o gestor vê na tabela.
  const contagem = useMemo(() => {
    const mapa = new Map<number, number>();
    let sem = 0;
    for (const produto of produtos) {
      if (produto.categoria_id === null) {
        sem += 1;
      } else {
        mapa.set(produto.categoria_id, (mapa.get(produto.categoria_id) ?? 0) + 1);
      }
    }
    return { mapa, sem };
  }, [produtos]);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent): void {
      if (evento.key !== "Escape") return;
      if (emEdicao || excluindo) return;
      aoFechar();
    }
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aoFechar, emEdicao, excluindo]);

  return (
    <>
      <button
        onClick={aoFechar}
        aria-label="Fechar categorias"
        className="fixed inset-0 z-[60] animate-[aparecer_0.2s_ease] bg-tinta/40"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Categorias do cardápio"
        className="fixed inset-y-0 right-0 z-[61] flex w-full animate-[deslizar_0.35s_cubic-bezier(0.32,0.72,0,1)] flex-col border-l border-borda bg-[#fffdf9] text-tinta shadow-2xl sm:max-w-[380px]"
      >
        <header className="flex items-start justify-between gap-2 border-b border-dashed border-borda p-5">
          <div>
            <h3 className="font-display text-2xl font-bold">Categorias</h3>
            <p className="mt-0.5 text-sm text-textoSuave">Toque para filtrar o cardápio.</p>
          </div>
          <button
            onClick={aoFechar}
            aria-label="Fechar categorias"
            className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-borda bg-white"
          >
            <X size={19} />
          </button>
        </header>

        <ul className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
          <li>
            <LinhaFiltro
              ativo={filtro === "todas"}
              nome="Todos os produtos"
              icone={<Tag size={16} />}
              quantidade={produtos.length}
              aoTocar={() => aoFiltrar("todas")}
            />
          </li>
          {categorias.map((categoria) => (
            <li key={categoria.id} className="flex items-stretch gap-1.5">
              <LinhaFiltro
                ativo={filtro === categoria.id}
                nome={categoria.nome}
                icone={<Tag size={16} />}
                quantidade={contagem.mapa.get(categoria.id) ?? 0}
                aoTocar={() => aoFiltrar(categoria.id)}
                crescendo
              />
              <button
                onClick={() => definirEmEdicao({ tipo: "renomear", categoria })}
                aria-label={`Renomear ${categoria.nome}`}
                className="grid w-9 flex-none place-items-center rounded-xl border border-borda bg-white text-tinta transition-colors hover:bg-areia"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => definirExcluindo(categoria)}
                aria-label={`Remover ${categoria.nome}`}
                className="grid w-9 flex-none place-items-center rounded-xl border border-borda bg-white text-rose-600 transition-colors hover:bg-rose-50"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
          {contagem.sem > 0 ? (
            <li>
              <LinhaFiltro
                ativo={filtro === "sem"}
                nome="Sem categoria"
                icone={<Tag size={16} />}
                quantidade={contagem.sem}
                aoTocar={() => aoFiltrar("sem")}
              />
            </li>
          ) : null}
        </ul>

        <footer className="border-t border-borda p-4">
          <Botao
            className="w-full"
            onClick={() => {
              definirEmEdicao({ tipo: "nova" });
            }}
          >
            <Plus size={17} /> Nova categoria
          </Botao>
          {/* Aviso aqui e não só no modal: a consequência aparece já na lista,
              antes de a pessoa apertar remover. */}
          <p className="mt-2.5 text-xs leading-relaxed text-textoSuave">
            Remover não apaga produtos: eles ficam sem categoria.
          </p>
        </footer>
      </aside>

      {emEdicao ? (
        <ModalCategoria
          key={emEdicao.tipo === "renomear" ? emEdicao.categoria.id : "nova"}
          categoria={emEdicao.tipo === "renomear" ? emEdicao.categoria : null}
          salvando={salvando}
          erro={erro}
          aoFechar={() => definirEmEdicao(null)}
          aoSalvar={(nome) =>
            executar(
              () =>
                emEdicao.tipo === "renomear"
                  ? aoRenomear(emEdicao.categoria.id, nome)
                  : aoCriar(nome),
              () => definirEmEdicao(null),
            )
          }
        />
      ) : null}
      {excluindo ? (
        <ModalConfirmacao
          titulo={`Remover "${excluindo.nome}"?`}
          mensagem={`${contagem.mapa.get(excluindo.id) ?? 0} produto(s) continuam no cardápio, mas ficam sem categoria.`}
          textoConfirmar="Remover"
          processando={salvando}
          erro={erro}
          aoFechar={() => definirExcluindo(null)}
          aoConfirmar={() =>
            executar(
              () => aoRemover(excluindo),
              () => definirExcluindo(null),
            )
          }
        />
      ) : null}
    </>
  );
}

interface PropriedadesLinhaFiltro {
  ativo: boolean;
  nome: string;
  icone: JSX.Element;
  quantidade: number;
  aoTocar: () => void;
  /** Dentro de um <li> com botões ao lado, a linha cresce para não desalinhar. */
  crescendo?: boolean;
}

function LinhaFiltro({
  ativo,
  nome,
  icone,
  quantidade,
  aoTocar,
  crescendo = false,
}: PropriedadesLinhaFiltro): JSX.Element {
  return (
    <button
      onClick={aoTocar}
      aria-pressed={ativo}
      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
        crescendo ? "flex-1" : "w-full"
      } ${ativo ? "border-carameloForte bg-carameloForte text-white" : "border-borda bg-white text-tinta hover:bg-areia"}`}
    >
      <span className={ativo ? "text-white/80" : "text-carameloForte"}>{icone}</span>
      <span className="min-w-0 flex-1 truncate">{nome}</span>
      <span
        className={`font-numero text-xs font-bold tabular-nums ${ativo ? "text-white/80" : "text-textoSuave"}`}
      >
        {quantidade}
      </span>
    </button>
  );
}