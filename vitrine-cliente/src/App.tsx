import { useMemo, useState } from "react";
import { useCardapio } from "./hooks/useCardapio";
import { useCarrinho } from "./hooks/useCarrinho";
import { useAviso } from "./hooks/useAviso";
import { montarLinkWhats, montarMensagemPedido } from "./lib/mensagemWhats";
import { determinarEstadoApi } from "./lib/estadoApi";
import { Cabecalho } from "./components/Cabecalho";
import { Abertura } from "./components/Abertura";
import { FaixaRolante } from "./components/FaixaRolante";
import { SecaoCardapio } from "./components/SecaoCardapio";
import { SecaoInformacoes } from "./components/SecaoInformacoes";
import { Rodape } from "./components/Rodape";
import { CarrinhoDrawer } from "./components/CarrinhoDrawer";
import { AvisoFlutuante } from "./components/AvisoFlutuante";
import { ModalConfiguracoes } from "./components/ModalConfiguracoes";
import { ModalAjuda } from "./components/ModalAjuda";

// Orquestra a vitrine: busca dados, guarda filtros e abre/fecha painéis.
// Regra de negócio mora nos hooks/lib — aqui só composição e estado de tela.
export default function App(): JSX.Element {
  const {
    produtos,
    categorias,
    carregando,
    erro,
    modoDemonstracao,
    buscarNovamente,
    usarDemonstracao,
  } = useCardapio();
  const { itens, adicionarVarios, remover, alterarQuantidade, total, unidades, quantidades } =
    useCarrinho(produtos);
  const { aviso, mostrarAviso } = useAviso();

  const [termoBusca, definirBusca] = useState("");
  const [sacolaAberta, definirSacolaAberta] = useState(false);
  const [configAberto, definirConfigAberto] = useState(false);
  const [ajudaAberta, definirAjudaAberta] = useState(false);
  const [nomeCliente, definirNome] = useState("");
  const [observacao, definirObservacao] = useState("");

  // Só a busca filtra aqui (case-insensitive); agrupar por categoria e
  // navegar entre seções é papel da SecaoCardapio (scroll-spy).
  const buscados = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase();
    if (termo === "") return produtos;
    return produtos.filter((produto) =>
      `${produto.nome} ${produto.descricao}`.toLowerCase().includes(termo),
    );
  }, [produtos, termoBusca]);

  const estadoApi = determinarEstadoApi(carregando, erro, modoDemonstracao);

  // Fecha a sacola e leva de volta ao cardápio (usado pelo vazio que convida).
  function verCardapio(): void {
    definirSacolaAberta(false);
    document
      .getElementById("cardapio")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  // MVP: sem checkout via API — só monta o texto e abre o wa.me (decisão de
  // escopo: o pedido entra pelo bot/painel depois, não pela vitrine).
  function finalizarNoWhats(): void {
    if (itens.length === 0) {
      mostrarAviso("Sua sacola está vazia 🧺");
      return;
    }
    const numero =
      localStorage.getItem("cg_whats") ||
      (import.meta.env.VITE_WHATSAPP_LOJA as string | undefined) ||
      "";
    if (numero.replace(/\D/g, "").length < 10) {
      mostrarAviso("Configure o WhatsApp da loja na engrenagem ⚙️");
      return;
    }
    const mensagem = montarMensagemPedido(itens, nomeCliente, observacao);
    window.open(montarLinkWhats(numero, mensagem), "_blank");
    mostrarAviso("Abrindo o WhatsApp… 💬");
  }

  return (
    <div id="topo" className="min-h-screen bg-creme font-corpo text-tinta">
      <Cabecalho
        termoBusca={termoBusca}
        aoMudarBusca={definirBusca}
        unidadesSacola={unidades}
        estadoApi={estadoApi}
        aoAbrirSacola={() => definirSacolaAberta(true)}
        aoAbrirConfiguracoes={() => definirConfigAberto(true)}
      />

      <Abertura
        totalProdutos={produtos.length}
        totalCategorias={categorias.length}
        aoComoFunciona={() => definirAjudaAberta(true)}
      />

      <FaixaRolante />

      <SecaoCardapio
        produtos={buscados}
        categorias={categorias}
        buscaAtiva={termoBusca.trim() !== ""}
        carregando={carregando}
        erro={erro}
        modoDemonstracao={modoDemonstracao}
        quantidades={quantidades}
        aoAdicionarVarios={adicionarVarios}
        aoMostrarAviso={mostrarAviso}
        aoAlterarQuantidade={alterarQuantidade}
        aoTentarNovamente={buscarNovamente}
        aoUsarDemonstracao={usarDemonstracao}
        aoLimparBusca={() => definirBusca("")}
      />

      <SecaoInformacoes />
      <Rodape secoes={categorias} aoAbrirConfiguracoes={() => definirConfigAberto(true)} />

      {sacolaAberta && (
        <div
          className="fixed inset-0 z-[60] animate-[aparecer_0.25s_ease] bg-tinta/45"
          onClick={() => definirSacolaAberta(false)}
          aria-hidden="true"
        />
      )}
      <CarrinhoDrawer
        aberto={sacolaAberta}
        itens={itens}
        total={total}
        nomeCliente={nomeCliente}
        observacao={observacao}
        aoMudarNome={definirNome}
        aoMudarObservacao={definirObservacao}
        aoAlterarQuantidade={alterarQuantidade}
        aoRemover={remover}
        aoFechar={() => definirSacolaAberta(false)}
        aoFinalizar={finalizarNoWhats}
        aoVerCardapio={verCardapio}
      />
      <ModalConfiguracoes
        aberto={configAberto}
        aoFechar={() => definirConfigAberto(false)}
        aoSalvar={() => {
          definirConfigAberto(false);
          buscarNovamente();
        }}
      />
      <ModalAjuda aberto={ajudaAberta} aoFechar={() => definirAjudaAberta(false)} />

      {aviso !== null && <AvisoFlutuante texto={aviso} />}
    </div>
  );
}
