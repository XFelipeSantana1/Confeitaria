import { useState } from "react";
import { Plus, RotateCcw, Tag } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { useCategorias } from "../hooks/useCategorias";
import type { Categoria } from "../types";
import { ErroApi } from "../lib/api";
import { Cartao } from "../components/ui/Cartao";
import { Botao } from "../components/ui/Botao";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { ModalCategoria } from "../components/ModalCategoria";
import { ModalConfirmacao } from "../components/ModalConfirmacao";

// Categorias (/painel/categorias): organizar o cardápio por tipo. Renomear
// reflete na vitrine; remover deixa os produtos sem categoria (ON DELETE
// SET NULL no banco) — o modal avisa antes.
type Janela =
  | { tipo: "fechada" }
  | { tipo: "editar"; categoria: Categoria | null }
  | { tipo: "excluir"; categoria: Categoria };

export function Categorias(): JSX.Element {
  const { sessao, sair } = useAutenticacao();
  const { categorias, carregando, erro, precisaLogin, buscarNovamente, criar, atualizar, remover } =
    useCategorias(sessao?.token ?? null);

  const [janela, definirJanela] = useState<Janela>({ tipo: "fechada" });
  const [salvando, definirSalvando] = useState(false);
  const [erroModal, definirErroModal] = useState<string | null>(null);

  if (precisaLogin) sair();

  async function executar(acao: () => Promise<void>): Promise<void> {
    definirSalvando(true);
    definirErroModal(null);
    try {
      await acao();
      definirJanela({ tipo: "fechada" });
    } catch (falha) {
      definirErroModal(falha instanceof ErroApi ? falha.message : "A ação falhou. Tente de novo.");
    } finally {
      definirSalvando(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <CabecalhoSecao
        rotulo="organização"
        titulo="Categorias"
        acao={
          <Botao onClick={() => { definirErroModal(null); definirJanela({ tipo: "editar", categoria: null }); }}>
            <Plus size={17} /> Nova categoria
          </Botao>
        }
      />

      {carregando ? (
        <div className="h-40 animate-pulse rounded-3xl border border-borda bg-white" aria-busy="true" aria-label="Carregando categorias" />
      ) : erro ? (
        <Cartao className="text-center">
          <p className="font-display text-xl font-bold text-tinta">O forno esfriou por aqui 🔌</p>
          <p className="mt-1 text-sm text-textoSuave">{erro}</p>
          <div className="mt-4">
            <Botao onClick={buscarNovamente}>
              <RotateCcw size={17} /> Tentar novamente
            </Botao>
          </div>
        </Cartao>
      ) : categorias.length === 0 ? (
        <Cartao className="py-12 text-center">
          <p className="text-5xl" aria-hidden="true">🏷️</p>
          <b className="mt-2 block font-display text-xl text-tinta">Nenhuma categoria</b>
          <p className="mt-1 text-sm text-textoSuave">
            Crie as primeiras (Doces, Bolos, Salgados) para organizar a vitrine.
          </p>
        </Cartao>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((categoria, indice) => (
            <li key={categoria.id}>
              <Cartao className="flex h-full flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-numero text-xs font-extrabold tabular-nums text-caramelo">
                    {String(indice + 1).padStart(2, "0")}
                  </span>
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-caramelo/15 text-carameloForte">
                    <Tag size={17} />
                  </span>
                  <b className="font-display text-lg text-tinta">{categoria.nome}</b>
                </div>
                <div className="mt-auto flex gap-2">
                  <Botao
                    variante="clara"
                    className="px-4 py-1.5 text-xs"
                    onClick={() => { definirErroModal(null); definirJanela({ tipo: "editar", categoria }); }}
                  >
                    Renomear
                  </Botao>
                  <Botao
                    variante="clara"
                    className="px-4 py-1.5 text-xs text-rose-700"
                    onClick={() => { definirErroModal(null); definirJanela({ tipo: "excluir", categoria }); }}
                  >
                    Remover
                  </Botao>
                </div>
              </Cartao>
            </li>
          ))}
        </ul>
      )}

      {janela.tipo === "editar" ? (
        <ModalCategoria
          key={janela.categoria?.id ?? "nova"}
          categoria={janela.categoria}
          salvando={salvando}
          erro={erroModal}
          aoFechar={() => definirJanela({ tipo: "fechada" })}
          aoSalvar={(nome) =>
            executar(() =>
              janela.categoria ? atualizar(janela.categoria.id, nome) : criar(nome),
            )
          }
        />
      ) : null}
      {janela.tipo === "excluir" ? (
        <ModalConfirmacao
          titulo={`Remover "${janela.categoria.nome}"?`}
          mensagem="Os produtos dessa categoria continuam no cardápio, mas ficam sem categoria."
          textoConfirmar="Remover"
          processando={salvando}
          erro={erroModal}
          aoFechar={() => definirJanela({ tipo: "fechada" })}
          aoConfirmar={() => executar(() => remover(janela.categoria.id))}
        />
      ) : null}
    </div>
  );
}
