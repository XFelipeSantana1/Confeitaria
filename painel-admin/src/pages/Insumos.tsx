import { useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { useInsumos } from "../hooks/useInsumos";
import type { Insumo } from "../types";
import { ErroApi } from "../lib/api";
import { Cartao } from "../components/ui/Cartao";
import { Botao } from "../components/ui/Botao";
import { TabelaInsumos } from "../components/TabelaInsumos";
import { ModalConfirmacao } from "../components/ModalConfirmacao";
import { ModalInsumo } from "../components/ModalInsumo";
import { ModalMovimentacao } from "../components/ModalMovimentacao";

// Insumos (/painel/insumos): tabela com CRUD + movimentação auditada.
// Linha em alerta (atual ≤ mínima) ganha selo; excluir com vínculo volta
// 409 explicado. Confirmação de excluir via diálogo nativo (ferramenta
// interna, sem cliente final envolvido).
type Janela =
  | { tipo: "fechada" }
  | { tipo: "insumo"; insumo: Insumo | null }
  | { tipo: "movimentar"; insumo: Insumo }
  | { tipo: "excluir"; insumo: Insumo };

export function Insumos(): JSX.Element {
  const { sessao, sair } = useAutenticacao();
  const {
    insumos,
    carregando,
    erro,
    precisaLogin,
    buscarNovamente,
    criar,
    atualizar,
    remover,
    movimentar,
  } = useInsumos(sessao?.token ?? null);

  const [janela, definirJanela] = useState<Janela>({ tipo: "fechada" });
  const [salvando, definirSalvando] = useState(false);
  const [erroModal, definirErroModal] = useState<string | null>(null);

  if (precisaLogin) sair();

  // Molde: executa a ação, fecha em sucesso ou mostra o erro do backend.
  async function executar(acao: () => Promise<void>): Promise<void> {
    definirSalvando(true);
    definirErroModal(null);
    try {
      await acao();
      definirJanela({ tipo: "fechada" });
    } catch (falha) {
      definirErroModal(
        falha instanceof ErroApi ? falha.message : "A ação falhou. Tente de novo.",
      );
    } finally {
      definirSalvando(false);
    }
  }

  async function excluir(): Promise<void> {
    if (janela.tipo !== "excluir") return;
    const id = janela.insumo.id;
    await executar(() => remover(id));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-carameloForte">estoque</p>
          <h1 className="font-display text-3xl font-bold text-tinta">Insumos</h1>
        </div>
        <Botao onClick={() => { definirErroModal(null); definirJanela({ tipo: "insumo", insumo: null }); }}>
          <Plus size={17} /> Novo insumo
        </Botao>
      </div>

      {carregando ? (
        <div className="h-64 animate-pulse rounded-3xl border border-borda bg-white" aria-busy="true" aria-label="Carregando insumos" />
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
      ) : insumos.length === 0 ? (
        <Cartao className="py-12 text-center">
          <p className="text-5xl" aria-hidden="true">🌾</p>
          <b className="mt-2 block font-display text-xl text-tinta">Nenhum insumo cadastrado</b>
          <p className="mt-1 text-sm text-textoSuave">Cadastre o primeiro para montar as fichas técnicas.</p>
        </Cartao>
      ) : (
        <TabelaInsumos
          insumos={insumos}
          aoMovimentar={(insumo) => { definirErroModal(null); definirJanela({ tipo: "movimentar", insumo }); }}
          aoEditar={(insumo) => { definirErroModal(null); definirJanela({ tipo: "insumo", insumo }); }}
          aoExcluir={(insumo) => { definirErroModal(null); definirJanela({ tipo: "excluir", insumo }); }}
        />
      )}

      {janela.tipo === "insumo" ? (
        <ModalInsumo
          key={janela.insumo?.id ?? "novo"}
          insumo={janela.insumo}
          salvando={salvando}
          erro={erroModal}
          aoFechar={() => definirJanela({ tipo: "fechada" })}
          aoSalvar={(dados) =>
            executar(() =>
              janela.insumo
                ? atualizar(janela.insumo.id, {
                    nome: dados.nome,
                    unidade_medida: dados.unidade_medida,
                    quantidade_minima: dados.quantidade_minima,
                    custo_unitario: dados.custo_unitario,
                  })
                : criar(dados),
            )
          }
        />
      ) : null}
      {janela.tipo === "excluir" ? (
        <ModalConfirmacao
          titulo={`Remover "${janela.insumo.nome}"?`}
          mensagem="O cadastro sai da lista. Se ele estiver em alguma receita ou movimentação, a remoção é bloqueada com aviso."
          textoConfirmar="Remover"
          processando={salvando}
          erro={erroModal}
          aoFechar={() => definirJanela({ tipo: "fechada" })}
          aoConfirmar={excluir}
        />
      ) : null}
      {janela.tipo === "movimentar" ? (
        <ModalMovimentacao
          key={janela.insumo.id}
          insumo={janela.insumo}
          salvando={salvando}
          erro={erroModal}
          aoFechar={() => definirJanela({ tipo: "fechada" })}
          aoSalvar={(dados) => executar(() => movimentar(janela.insumo.id, dados))}
        />
      ) : null}
    </div>
  );
}
