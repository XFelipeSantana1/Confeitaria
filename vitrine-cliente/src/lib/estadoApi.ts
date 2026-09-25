import type { EstadoApi } from "../types";

// Prioridade do indicador do topo: carregando > erro > demonstração > online.
// Função pura para o App não carregar ternário aninhado no meio do JSX.
export function determinarEstadoApi(
  carregando: boolean,
  erro: string | null,
  modoDemonstracao: boolean,
): EstadoApi {
  if (carregando) return "carregando";
  if (erro !== null) return "erro";
  if (modoDemonstracao) return "demonstracao";
  return "online";
}
