import { useEffect } from "react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { useRegistros } from "../hooks/useRegistros";
import { Cartao } from "../components/ui/Cartao";
import { Botao } from "../components/ui/Botao";
import { DiscoVazio } from "../components/ui/DiscoVazio";
import { EsqueletoTabela } from "../components/ui/EsqueletoTabela";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { LinhaRegistro } from "../components/LinhaRegistro";
import { History, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

// Histórico de alterações (/painel/registros). Existe para responder "quem
// mudou isso e o que era antes?" — a pergunta que aparece quando o preço está
// errado e ninguém sabe desde quando.
export function Registros(): JSX.Element {
  const { sessao, sair } = useAutenticacao();
  const {
    registros,
    total,
    pagina,
    temAnterior,
    temProxima,
    carregando,
    erro,
    precisaLogin,
    irParaPagina,
    buscarNovamente,
  } = useRegistros(sessao?.token ?? null);

  // Mesmo tratamento das outras telas: 401 durante a leitura é sessão
  // expirada, e a resposta certa é sair — não insistir numa tela morta.
  // Efeito, e não `if` no corpo do render: `sair()` atualiza o estado do
  // provedor de sessão, e mexer no estado de outro componente durante o
  // render é o que o React avisa em tempo de execução.
  useEffect(() => {
    if (precisaLogin) sair();
  }, [precisaLogin, sair]);


  return (
    <>
      <CabecalhoSecao
        rotulo="auditoria"
        titulo="Histórico de alterações"
        acao={
          <Botao variante="clara" onClick={buscarNovamente} carregando={carregando}>
            <RotateCcw size={17} /> Atualizar
          </Botao>
        }
      />

      <p className="mb-4 max-w-2xl text-sm text-textoSuave">
        Tudo que o painel grava fica registrado aqui: quem fez, quando e o que
        era antes. Serve para conferir preço, estoque e visibilidade dos doces
        sem precisar lembrar de cabeça.
      </p>

      {carregando && registros.length === 0 ? (
        <EsqueletoTabela linhas={5} />
      ) : erro !== null ? (
        <Cartao className="text-center">
          <b className="block font-display text-lg text-tinta">Não consegui ler o histórico</b>
          <p className="mt-1 text-sm text-textoSuave">{erro}</p>
          <div className="mt-4">
            <Botao onClick={buscarNovamente}>Tentar de novo</Botao>
          </div>
        </Cartao>
      ) : registros.length === 0 ? (
        <Cartao className="py-12 text-center">
          <DiscoVazio>
            <History size={26} />
          </DiscoVazio>
          <b className="mt-2 block font-display text-xl text-tinta">Nada registrado ainda</b>
          <p className="mt-1 text-sm text-textoSuave">
            Assim que você criar, editar ou excluir algo no painel, aparece aqui.
          </p>
        </Cartao>
      ) : (
        <Cartao className="overflow-x-auto p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-borda text-xs uppercase tracking-wide text-textoSuave">
                <th className="w-10 px-3 py-3">
                  <span className="sr-only">Ação</span>
                </th>
                <th className="px-3 py-3">O que aconteceu</th>
                <th className="hidden px-3 py-3 sm:table-cell">Quem</th>
                <th className="px-3 py-3 text-right">Quando</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <LinhaRegistro key={registro.id} registro={registro} />
              ))}
            </tbody>
          </table>
        </Cartao>
      )}

      {total > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-textoSuave">
          <span>
            {pagina * 25 + 1}–{Math.min(pagina * 25 + registros.length, total)} de {total}
          </span>
          <div className="flex gap-2">
            <Botao
              variante="clara"
              onClick={() => irParaPagina(pagina - 1)}
              disabled={!temAnterior}
              className="px-4 py-2"
            >
              <ChevronLeft size={16} /> Anterior
            </Botao>
            <Botao
              variante="clara"
              onClick={() => irParaPagina(pagina + 1)}
              disabled={!temProxima}
              className="px-4 py-2"
            >
              Próxima <ChevronRight size={16} />
            </Botao>
          </div>
        </div>
      )}
    </>
  );
}
