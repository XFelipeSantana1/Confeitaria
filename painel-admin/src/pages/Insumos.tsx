import { useEffect, useState } from "react";
import { Plus, RotateCcw, Wheat, Wrench } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { useInsumos } from "../hooks/useInsumos";
import type { Insumo } from "../types";
import { ErroApi } from "../lib/api";
import { Cartao } from "../components/ui/Cartao";
import { EsqueletoTabela } from "../components/ui/EsqueletoTabela";
import { Botao } from "../components/ui/Botao";
import { DiscoVazio } from "../components/ui/DiscoVazio";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { TabelaInsumos } from "../components/TabelaInsumos";
import { ModaisInsumo, type JanelaInsumo } from "../components/ModaisInsumo";

// Insumos (/painel/insumos): tabela com CRUD + movimentação auditada.
// Linha em alerta (atual ≤ mínima) ganha selo; excluir com vínculo volta
// 409 explicado. Confirmação de excluir via diálogo nativo (ferramenta
// interna, sem cliente final envolvido).
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
    movimentar,
    remover,
  } = useInsumos(sessao?.token ?? null);

  const [janela, definirJanela] = useState<JanelaInsumo>({ tipo: "fechada" });
  const [salvando, definirSalvando] = useState(false);
  const [erroModal, definirErroModal] = useState<string | null>(null);

  // Efeito, e não `if` no corpo do render: `sair()` atualiza o estado do
  // provedor de sessão, e mexer no estado de outro componente durante o
  // render é o que o React avisa em tempo de execução.
  useEffect(() => {
    if (precisaLogin) sair();
  }, [precisaLogin, sair]);


  async function executar(acao: () => Promise<unknown>): Promise<void> {
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

  // Abrir a janela sempre limpa o erro: reaproveitar o modal com o aviso do
  // save anterior faz o gestor achar que a falha continua lá.
  function abrir(tipo: Exclude<JanelaInsumo["tipo"], "fechada">, insumo: Insumo | null = null): void {
    definirErroModal(null);
    definirJanela({ tipo, insumo } as JanelaInsumo);
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <CabecalhoSecao
        rotulo="estoque"
        titulo="Insumos"
        acao={
          <Botao onClick={() => abrir("insumo")}>
            <Plus size={17} /> Novo insumo
          </Botao>
        }
      />

      {carregando ? (
        <EsqueletoTabela linhas={4} />
      ) : erro ? (
        <Cartao className="text-center">
          <p className="flex items-center justify-center gap-2 font-display text-xl font-bold text-tinta">
            <Wrench size={19} className="text-caramelo" aria-hidden="true" />
            O forno esfriou por aqui
          </p>
          <p className="mt-1 text-sm text-textoSuave">{erro}</p>
          <div className="mt-4">
            <Botao onClick={buscarNovamente}>
              <RotateCcw size={17} /> Tentar novamente
            </Botao>
          </div>
        </Cartao>
      ) : insumos.length === 0 ? (
        <Cartao className="py-12 text-center">
          <DiscoVazio>
            <Wheat size={26} />
          </DiscoVazio>
          <b className="mt-2 block font-display text-xl text-tinta">Nenhum insumo cadastrado</b>
          <p className="mt-1 text-sm text-textoSuave">Cadastre o primeiro para montar as fichas técnicas.</p>
        </Cartao>
      ) : (
        <TabelaInsumos
          insumos={insumos}
          aoMovimentar={(insumo) => abrir("movimentar", insumo)}
          aoEditar={(insumo) => abrir("insumo", insumo)}
          aoExcluir={(insumo) => abrir("excluir", insumo)}
        />
      )}

      <ModaisInsumo
        janela={janela}
        salvando={salvando}
        erroModal={erroModal}
        aoFechar={() => definirJanela({ tipo: "fechada" })}
        aoSalvar={(dados) =>
          void executar(() =>
            janela.tipo === "insumo" && janela.insumo
              ? atualizar(janela.insumo.id, {
                  nome: dados.nome,
                  unidade_medida: dados.unidade_medida,
                  quantidade_minima: dados.quantidade_minima,
                  custo_unitario: dados.custo_unitario,
                })
              : criar(dados),
          )
        }
        aoSalvarMovimentacao={(dados) =>
          void executar(() =>
            janela.tipo === "movimentar"
              ? movimentar(janela.insumo.id, dados)
              : Promise.resolve(),
          )
        }
        aoConfirmarExclusao={() =>
          void executar(() => (janela.tipo === "excluir" ? remover(janela.insumo.id) : Promise.resolve()))
        }
      />
    </div>
  );
}
