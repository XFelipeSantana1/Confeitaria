import { useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { useProdutos } from "../hooks/useProdutos";
import type { ProdutoAdmin } from "../types";
import { ErroApi } from "../lib/api";
import { Cartao } from "../components/ui/Cartao";
import { Botao } from "../components/ui/Botao";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { TabelaProdutos } from "../components/TabelaProdutos";
import { ModaisProduto, type JanelaProduto } from "../components/ModaisProduto";
import type { DadosProduto } from "../components/ModalProduto";

// Produtos (/painel/produtos): tabela com liga/desliga da vitrine, modal com
// ficha técnica dinâmica e excluir com confirmação personalizada.
// Editar carrega a ficha atual (GET /admin/:id) antes de abrir o modal.
type Janela = JanelaProduto;

export function Produtos(): JSX.Element {
  const { sessao, sair } = useAutenticacao();
  const {
    produtos,
    categorias,
    insumos,
    carregando,
    erro,
    precisaLogin,
    buscarNovamente,
    criar,
    atualizar,
    salvarFicha,
    remover,
    carregarFicha,
  } = useProdutos(sessao?.token ?? null);

  const [janela, definirJanela] = useState<Janela>({ tipo: "fechada" });
  const [salvando, definirSalvando] = useState(false);
  const [erroModal, definirErroModal] = useState<string | null>(null);
  const [aviso, definirAviso] = useState<string | null>(null);

  if (precisaLogin) sair();

  // Molde: executa, fecha em sucesso ou mostra o erro do backend no modal.
  async function executar(acao: () => Promise<unknown>): Promise<void> {
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

  async function salvar(dados: DadosProduto): Promise<void> {
    if (janela.tipo !== "produto") return;
    const alvo = janela.produto;
    if (!alvo) {
      await executar(() =>
        criar({
          nome: dados.nome,
          descricao: dados.descricao || undefined,
          preco: dados.preco,
          categoria_id: dados.categoria_id,
          imagem_url: dados.imagem_url || undefined,
          ficha_tecnica: dados.ficha,
        }),
      );
      return;
    }
    // Edição em duas chamadas (dados + ficha), como o backend separa.
    await executar(async () => {
      await atualizar(alvo.id, {
        nome: dados.nome,
        descricao: dados.descricao || null,
        preco: dados.preco,
        categoria_id: dados.categoria_id,
        imagem_url: dados.imagem_url || null,
      });
      await salvarFicha(alvo.id, dados.ficha);
    });
  }

  async function abrirEdicao(produto: ProdutoAdmin): Promise<void> {
    try {
      const { ficha } = await carregarFicha(produto.id);
      definirErroModal(null);
      definirAviso(null);
      definirJanela({ tipo: "produto", produto, ficha });
    } catch (falha) {
      definirAviso(falha instanceof Error ? falha.message : "Não foi possível abrir a edição.");
    }
  }

  async function excluir(): Promise<void> {
    if (janela.tipo !== "excluir") return;
    await executar(() => remover(janela.produto.id));
  }

  return (
    <div className="flex flex-col gap-5">
      <CabecalhoSecao
        rotulo="cardápio"
        titulo="Produtos"
        acao={
          <Botao onClick={() => { definirErroModal(null); definirJanela({ tipo: "produto", produto: null, ficha: [] }); }}>
            <Plus size={17} /> Novo produto
          </Botao>
        }
      />

      {aviso ? (
        <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700">{aviso}</p>
      ) : null}
      {carregando ? (
        <div className="h-64 animate-pulse rounded-3xl border border-borda bg-white" aria-busy="true" aria-label="Carregando produtos" />
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
      ) : produtos.length === 0 ? (
        <Cartao className="py-12 text-center">
          <p className="text-5xl" aria-hidden="true">🧁</p>
          <b className="mt-2 block font-display text-xl text-tinta">Nenhum produto cadastrado</b>
          <p className="mt-1 text-sm text-textoSuave">Cadastre o primeiro doce para encher a vitrine.</p>
        </Cartao>
      ) : (
        <TabelaProdutos
          produtos={produtos}
          aoEditar={abrirEdicao}
          aoAlternarAtivo={(produto) => atualizar(produto.id, { ativo: !produto.ativo })}
          aoExcluir={(produto) => { definirErroModal(null); definirJanela({ tipo: "excluir", produto }); }}
        />
      )}

      <ModaisProduto
        janela={janela}
        categorias={categorias}
        insumos={insumos}
        salvando={salvando}
        erroModal={erroModal}
        aoFechar={() => definirJanela({ tipo: "fechada" })}
        aoSalvar={salvar}
        aoConfirmarExcluir={excluir}
      />
    </div>
  );
}
