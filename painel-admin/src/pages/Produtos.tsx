import { Plus, RotateCcw } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { useProdutos } from "../hooks/useProdutos";
import { useJanelaProduto } from "../hooks/useJanelaProduto";
import { Cartao } from "../components/ui/Cartao";
import { Botao } from "../components/ui/Botao";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { TabelaProdutos } from "../components/TabelaProdutos";
import { ModaisProduto } from "../components/ModaisProduto";
import type { DadosProduto } from "../components/ModalProduto";

// Produtos (/painel/produtos): tabela com liga/desliga da vitrine, modal com
// ficha técnica dinâmica e excluir com confirmação personalizada.
// A janela (abrir/editar/excluir + tratamento de erro) mora no hook;
// aqui fica só a composição da tela.
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

  const janela = useJanelaProduto({
    criar,
    atualizar,
    salvarFicha,
    remover,
    carregarFicha,
  });

  if (precisaLogin) sair();

  return (
    <div className="flex flex-col gap-5">
      <CabecalhoSecao
        rotulo="cardápio"
        titulo="Produtos"
        acao={
          <Botao onClick={janela.abrirNovo}>
            <Plus size={17} /> Novo produto
          </Botao>
        }
      />

      {janela.aviso ? (
        <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700">
          {janela.aviso}
        </p>
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
          aoEditar={janela.abrirEdicao}
          aoAlternarAtivo={(produto) => void atualizar(produto.id, { ativo: !produto.ativo })}
          aoExcluir={janela.pedirExclusao}
        />
      )}

      <ModaisProduto
        janela={janela.janela}
        categorias={categorias}
        insumos={insumos}
        salvando={janela.abrindo}
        erroModal={janela.erro}
        aoFechar={janela.fechar}
        aoSalvar={(dados: DadosProduto) => void janela.salvarProduto(dados)}
        aoConfirmarExcluir={() => void janela.confirmarExclusao()}
      />
    </div>
  );
}
