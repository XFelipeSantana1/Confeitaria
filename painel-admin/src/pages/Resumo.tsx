import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CircleDollarSign, ClipboardList, CookingPot, RotateCcw, TriangleAlert, Wheat, Wrench } from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { useResumo } from "../hooks/useResumo";
import { Cartao } from "../components/ui/Cartao";
import { Botao } from "../components/ui/Botao";
import { CartaoMetrica } from "../components/CartaoMetrica";
import { GraficoVendas } from "../components/GraficoVendas";
import { ListaMaisVendidos } from "../components/ListaMaisVendidos";
import { ListaBaixoEstoque } from "../components/ListaBaixoEstoque";
import { UltimosPedidos } from "../components/UltimosPedidos";
import { PERIODOS, pedidosDoPeriodo, usePeriodo, vendasPorDia } from "../lib/periodo";

// Resumo (/painel): o dia da confeitaria num olhar — pedidos que precisam de
// ação, dinheiro a receber e reposição. Token expirado desloga sozinho.

/** Saudação pelo relógio: às 22h "Bom dia" estava errado na tela. */
function saudacao(): string {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

/** Primeiro nome, sem quebrar quando o nome vier vazio. */
function primeiroNome(nome: string | undefined): string {
  const partes = (nome ?? "").trim().split(/\s+/).filter(Boolean);
  return partes[0] ?? "tudo bem";
}
export function Resumo(): JSX.Element {
  const { sessao, sair } = useAutenticacao();
  const irPara = useNavigate();
  const {
    pedidos,
    baixoEstoque,
    maisVendidos,
    carregando,
    erro,
    precisaLogin,
    buscarNovamente,
  } = useResumo(sessao?.token ?? null);

  // Efeito, e não `if` no corpo do render: `sair()` atualiza o estado do
  // provedor de sessão, e mexer no estado de outro componente durante o
  // render é o que o React avisa em tempo de execução.
  useEffect(() => {
    if (precisaLogin) sair();
  }, [precisaLogin, sair]);


  const pendentes = pedidos.filter((p) => p.status === "pendente").length;
  const emPreparo = pedidos.filter((p) => p.status === "em_preparo").length;
  // Cancelado fora: a API estorna o pagamento de quem já tinha pago, mas um
  // pedido cancelado que nunca foi pago continua com status "pendente" e
  // entrava na conta como dinheiro que a loja ainda vai receber.
  const aReceber = pedidos.filter(
    (p) => p.status_pagamento === "pendente" && p.status !== "cancelado",
  ).length;

  const [periodo, definirPeriodo] = usePeriodo();
  const noPeriodo = useMemo(() => pedidosDoPeriodo(pedidos, periodo), [pedidos, periodo]);
  const diasVendidos = useMemo(() => vendasPorDia(pedidos, periodo), [pedidos, periodo]);
  const diaDe = useMemo(() => {
    if (diasVendidos.length === 0) return "—";
    return diasVendidos.reduce((melhor, dia) => (dia.total > melhor.total ? dia : melhor))
      .rotulo;
  }, [diasVendidos]);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-carameloForte">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="font-display text-3xl font-bold text-tinta">
            {saudacao()}, {primeiroNome(sessao?.usuario.nome)}.
          </h1>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          {/* Filtro de período. `role="group"` com `aria-pressed` no botão
              ativo: é um conjunto de botões que troca a leitura do mesmo
              conjunto de dados, e é isso que o leitor de tela precisa ouvir. */}
          <div
            role="group"
            aria-label="Filtrar o resumo por período"
            className="flex flex-wrap gap-1 rounded-full border border-borda bg-white p-1"
          >
            {PERIODOS.map((opcao) => (
              <button
                key={opcao.valor}
                onClick={() => definirPeriodo(opcao.valor)}
                aria-pressed={periodo === opcao.valor}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  periodo === opcao.valor
                    ? "bg-tinta text-creme shadow-Cartao"
                    : "text-textoSuave hover:bg-areia hover:text-tinta"
                }`}
              >
                {opcao.rotulo}
              </button>
            ))}
          </div>

          {/* Atalhos: o Resumo é a tela de entrada e as duas filas que pedem
              ação moram em outra tela. Sem atalho, o caminho é lembrar o
              menu. */}
          <div className="flex gap-2">
            <Botao
              variante="clara"
              className="px-3 py-1.5 text-xs"
              onClick={() => { definirPeriodo("tudo"); irPara("/painel/pedidos"); }}
            >
              <ClipboardList size={14} aria-hidden="true" /> Ver pedidos
            </Botao>
            <Botao
              variante="clara"
              className="px-3 py-1.5 text-xs"
              onClick={() => irPara("/painel/insumos")}
            >
              <Wheat size={14} aria-hidden="true" /> Ver estoque
            </Botao>
          </div>
        </div>
      </div>

      {carregando ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4" aria-busy="true" aria-label="Carregando resumo">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl border border-borda bg-white" />
          ))}
        </div>
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
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <CartaoMetrica
              icone={ClipboardList}
              rotulo="Pedidos pendentes"
              valor={pendentes}
              detalhe="aguardando preparo"
              tom={pendentes > 0 ? "neutro" : "ok"}
            />
            <CartaoMetrica
              icone={CookingPot}
              rotulo="Em preparo"
              valor={emPreparo}
              detalhe="no forno agora"
            />
            <CartaoMetrica
              icone={CircleDollarSign}
              rotulo="A receber"
              valor={aReceber}
              detalhe="pagamentos pendentes"
              tom={aReceber > 0 ? "neutro" : "ok"}
            />
            <CartaoMetrica
              icone={TriangleAlert}
              rotulo="Estoque baixo"
              valor={baixoEstoque.length}
              detalhe="insumos no limite"
              tom={baixoEstoque.length > 0 ? "alerta" : "ok"}
            />
          </div>
          <GraficoVendas dias={diasVendidos} diaDe={diaDe} />
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row">
            <ListaMaisVendidos itens={maisVendidos} />
            <ListaBaixoEstoque itens={baixoEstoque} />
          </div>
          <UltimosPedidos pedidos={pedidos} />
          <p className="text-center text-xs text-textoSuave">
            {noPeriodo.length === pedidos.length
              ? "Mostrando todos os pedidos. "
              : `Mostrando ${noPeriodo.length} de ${pedidos.length} pedidos. `}
            Pedidos e estoques são gerenciados nas telas do menu.
          </p>
        </>
      )}
    </div>
  );
}
