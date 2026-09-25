import {
  CircleDollarSign,
  ClipboardList,
  CookingPot,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { useResumo } from "../hooks/useResumo";
import { Cartao } from "../components/ui/Cartao";
import { Botao } from "../components/ui/Botao";
import { CartaoMetrica } from "../components/CartaoMetrica";
import { ListaMaisVendidos } from "../components/ListaMaisVendidos";
import { ListaBaixoEstoque } from "../components/ListaBaixoEstoque";
import { UltimosPedidos } from "../components/UltimosPedidos";

// Resumo (/painel): o dia da confeitaria num olhar — pedidos que precisam de
// ação, dinheiro a receber e reposição. Token expirado desloga sozinho.
export function Resumo(): JSX.Element {
  const { sessao, sair } = useAutenticacao();
  const {
    pedidos,
    baixoEstoque,
    maisVendidos,
    carregando,
    erro,
    precisaLogin,
    buscarNovamente,
  } = useResumo(sessao?.token ?? null);

  if (precisaLogin) sair();

  const pendentes = pedidos.filter((p) => p.status === "pendente").length;
  const emPreparo = pedidos.filter((p) => p.status === "em_preparo").length;
  const aReceber = pedidos.filter((p) => p.status_pagamento === "pendente").length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-carameloForte">
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="font-display text-3xl font-bold text-tinta">
          Bom dia, {sessao?.usuario.nome.split(" ")[0]} ☀️
        </h1>
      </div>

      {carregando ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true" aria-label="Carregando resumo">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl border border-borda bg-white" />
          ))}
        </div>
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
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          <div className="flex flex-col gap-4 lg:flex-row">
            <ListaMaisVendidos itens={maisVendidos} />
            <ListaBaixoEstoque itens={baixoEstoque} />
          </div>
          <UltimosPedidos pedidos={pedidos} />
          <p className="text-center text-xs text-textoSuave">
            O gerenciamento de pedidos e estoques chega nas próximas telas do painel.
          </p>
        </>
      )}
    </div>
  );
}
