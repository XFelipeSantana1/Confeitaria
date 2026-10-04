import { useEffect, useState } from "react";
import { CakeSlice, Plus, RotateCcw, Tag, Wrench, X } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { useProdutos } from "../hooks/useProdutos";
import { useJanelaProduto } from "../hooks/useJanelaProduto";
import { useUploadImagem } from "../hooks/useUploadImagem";
import { ErroApi } from "../lib/api";
import type { Categoria, ProdutoAdmin } from "../types";
import { Cartao } from "../components/ui/Cartao";
import { EsqueletoTabela } from "../components/ui/EsqueletoTabela";
import { Botao } from "../components/ui/Botao";
import { DiscoVazio } from "../components/ui/DiscoVazio";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { TabelaProdutos } from "../components/TabelaProdutos";
import { ModaisProduto } from "../components/ModaisProduto";
import { PainelCategorias, type FiltroCategoria } from "../components/PainelCategorias";
import type { DadosProduto } from "../components/ModalProduto";

// Produtos (/painel/produtos): tabela com liga/desliga da vitrine, modal com
// ficha técnica dinâmica e excluir com confirmação personalizada.
// A janela (abrir/editar/excluir + tratamento de erro) mora no hook;
// aqui fica só a composição da tela.
//
// Categorias moram aqui também, num painel lateral (ver PainelCategorias).
// Tocar numa categoria filtra a tabela: era três registros numa tela inteira
// e agora o painel trabalha junto com a lista.
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
    criarCategoria,
    atualizarCategoria,
    removerCategoria,
    carregarFicha,
  } = useProdutos(sessao?.token ?? null);

  const janela = useJanelaProduto({
    criar,
    atualizar,
    salvarFicha,
    remover,
    carregarFicha,
  });
  const { enviar: enviarFoto } = useUploadImagem(sessao?.token ?? null);

  const [painelAberto, definirPainelAberto] = useState(false);
  const [filtro, definirFiltro] = useState<FiltroCategoria>("todas");
  const [trocandoId, definirTrocandoId] = useState<number | null>(null);
  const [erroAlternar, definirErroAlternar] = useState<string | null>(null);

  // Efeito, e não `if` no corpo do render: `sair()` atualiza o estado do
  // provedor de sessão, e mexer no estado de outro componente durante o
  // render é o que o React avisa em tempo de execução.
  useEffect(() => {
    if (precisaLogin) sair();
  }, [precisaLogin, sair]);


  const visiveis =
    filtro === "todas"
      ? produtos
      : filtro === "sem"
        ? produtos.filter((produto) => produto.categoria_id === null)
        : produtos.filter((produto) => produto.categoria_id === filtro);

  // Nome da categoria em foco, para o botão de sair do filtro. Busca pelo id
  // porque o filtro guarda o número, não a linha — que pode ter sido renomeada
  // (ou removida, e aí o efeito abaixo devolve para "todas").
  const categoriaDoFiltro =
    typeof filtro === "number" ? categorias.find((c) => c.id === filtro) : null;

  // Remover a categoria que estava em foco solta o filtro: sobraria uma lista
  // vazia sem botão para sair, porque o painel some junto com a linha.
  async function removerCategoriaVisivel(categoria: Categoria): Promise<void> {
    await removerCategoria(categoria.id);
    if (filtro === categoria.id) definirFiltro("todas");
  }

  // Liga/desliga na vitrine. Precisava de tratamento porque o `void` que
  // existia aqui escondia a falha de rede: o selo mudava na tela e o cardápio
  // continuava como estava, sem nenhuma explicação.
  async function alternarAtivo(produto: ProdutoAdmin): Promise<void> {
    definirTrocandoId(produto.id);
    definirErroAlternar(null);
    try {
      await atualizar(produto.id, { ativo: !produto.ativo });
    } catch (falha) {
      definirErroAlternar(
        falha instanceof ErroApi
          ? falha.message
          : "Não foi possível mudar a visibilidade. Tente de novo.",
      );
    } finally {
      definirTrocandoId(null);
    }
  }

  function filtrar(novo: FiltroCategoria): void {
    definirFiltro(novo);
    // Sai do modo edição de produto: filtrar a lista com um formulário aberto
    // escondia o produto que estava sendo editado atrás do resultado do filtro.
    janela.fechar();
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <CabecalhoSecao
        rotulo="cardápio"
        titulo="Produtos"
        acao={
          <div className="flex flex-wrap gap-2">
            <Botao
              variante="clara"
              onClick={() => definirPainelAberto(true)}
            >
              <Tag size={17} /> Categorias
            </Botao>
            <Botao onClick={janela.abrirNovo}>
              <Plus size={17} /> Novo produto
            </Botao>
          </div>
        }
      />

      {erroAlternar ? (
        <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700">
          {erroAlternar}
        </p>
      ) : null}

      {janela.aviso ? (
        <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700">
          {janela.aviso}
        </p>
      ) : null}

      {filtro !== "todas" ? (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-full bg-caramelo/12 px-3.5 py-1.5 text-sm font-semibold text-carameloForte">
            {filtro === "sem" ? "Sem categoria" : categoriaDoFiltro?.nome}
            <span className="font-numero text-xs tabular-nums opacity-70">{visiveis.length}</span>
          </span>
          <Botao variante="clara" className="px-3 py-1.5 text-xs" onClick={() => filtrar("todas")}>
            <X size={14} /> Ver todos
          </Botao>
        </div>
      ) : null}

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
      ) : produtos.length === 0 ? (
        <Cartao className="py-12 text-center">
          <DiscoVazio>
            <CakeSlice size={26} />
          </DiscoVazio>
          <b className="mt-2 block font-display text-xl text-tinta">Nenhum produto cadastrado</b>
          <p className="mt-1 text-sm text-textoSuave">Cadastre o primeiro doce para encher a vitrine.</p>
        </Cartao>
      ) : visiveis.length === 0 ? (
        <Cartao className="py-10 text-center">
          <DiscoVazio>
            <Tag size={26} />
          </DiscoVazio>
          <b className="mt-2 block font-display text-lg text-tinta">Nada nesta categoria</b>
          <p className="mt-1 text-sm text-textoSuave">
            {filtro === "sem"
              ? "Todos os produtos estão classificados."
              : "Nenhum produto usa essa categoria ainda."}
          </p>
        </Cartao>
      ) : (
        <TabelaProdutos
          produtos={visiveis}
          aoEditar={janela.abrirEdicao}
          aoAlternarAtivo={alternarAtivo}
          aoExcluir={janela.pedirExclusao}
          trocandoId={trocandoId}
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
        aoEnviarImagem={enviarFoto}
        aoConfirmarExcluir={() => void janela.confirmarExclusao()}
      />

      {painelAberto ? (
        <PainelCategorias
          categorias={categorias}
          produtos={produtos}
          filtro={filtro}
          aoFiltrar={filtrar}
          aoFechar={() => definirPainelAberto(false)}
          aoCriar={criarCategoria}
          aoRenomear={atualizarCategoria}
          aoRemover={removerCategoriaVisivel}
        />
      ) : null}
    </div>
  );
}