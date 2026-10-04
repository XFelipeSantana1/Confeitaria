import { useState } from "react";
import { aparenciaAcao } from "../lib/aparenciaRegistro";
import { ROTULO_ACAO } from "../types";
import type { Registro } from "../types";

// Botão com o "antes → depois" de uma alteração. Fica recolhido por padrão:
// com 25 linhas na tela o detalhe aberto em todas vira parede de texto. O
// estado é daqui (e não de classList no DOM) para o aria-expanded contar a
// verdade e o botão teclado funcionar sem gambiarra.
export function LinhaRegistro({ registro }: { registro: Registro }): JSX.Element {
  const [aberto, definirAberto] = useState(false);
  const { icone: Icone, classe } = aparenciaAcao(registro.acao);
  const idDetalhe = `registro-${registro.id}`;
  const mudancas = Object.entries(registro.depois ?? {});

  return (
    <tr className="border-b border-borda align-top last:border-0">
      <td className="w-10 px-3 py-3">
        <span className={`grid h-8 w-8 place-items-center rounded-xl ${classe}`}>
          <Icone size={15} />
        </span>
      </td>
      <td className="px-3 py-3">
        <span className="text-xs font-bold uppercase tracking-wide text-textoSuave">
          {ROTULO_ACAO[registro.acao]}
        </span>
        <p className="text-sm text-tinta">{registro.descricao}</p>
        {/* Quem fica aqui embaixo no celular: como coluna, a linha estourava
            62px numa tela de 360px e o gestor tinha de arrastar para ler o
            histórico. Na tela grande a coluna continua ao lado. */}
        <span className="mt-0.5 block text-[11px] text-textoSuave sm:hidden">
          por {registro.usuario_nome}
        </span>
        {mudancas.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => definirAberto((valor) => !valor)}
              aria-expanded={aberto}
              aria-controls={idDetalhe}
              className="mt-1 text-xs font-bold text-carameloForte underline underline-offset-2 transition-colors hover:text-carameloEscuro"
            >
              {aberto ? "esconder o que mudou" : "ver o que mudou"}
            </button>
            {aberto && (
              <dl
                id={idDetalhe}
                className="mt-2 space-y-1 rounded-2xl border border-dashed border-borda bg-creme px-3 py-2 text-xs"
              >
                {mudancas.map(([campo, valor]) => (
                  <div key={campo} className="flex flex-wrap items-baseline gap-x-2">
                    <dt className="font-bold text-textoSuave">{campo}:</dt>
                    <dd className="text-textoSuave line-through">
                      {texto(registro.antes?.[campo])}
                    </dd>
                    <span aria-hidden="true" className="text-textoSuave">
                      →
                    </span>
                    <dd className="font-bold text-tinta">{texto(valor)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        )}
      </td>
      <td className="hidden px-3 py-3 text-sm text-tinta sm:table-cell">
        {registro.usuario_nome}
      </td>
      <td className="px-3 py-3 text-right text-xs whitespace-nowrap text-textoSuave">
        {hora(registro.criado_em)}
        <span className="mt-0.5 block text-[11px] text-textoSuave/70">
          {dia(registro.criado_em)}
        </span>
      </td>
    </tr>
  );
}

function texto(valor: unknown): string {
  if (valor === null || valor === undefined || valor === "") return "(vazio)";
  return String(valor);
}

function hora(iso: string): string {
  return iso.slice(11, 16);
}

function dia(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso.slice(0, 10);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
