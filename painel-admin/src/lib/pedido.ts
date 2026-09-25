// Regras de apresentação dos status (pura, sem JSX): rótulo, cor do selo e
// para onde o botão "avançar" leva. O cancelado é final — sem próximo.

const ROTULOS: Record<string, string> = {
  pendente: "Pendente",
  em_preparo: "Em preparo",
  pronto: "Pronto",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const TONS: Record<string, string> = {
  pendente: "bg-amber-100 text-amber-800",
  em_preparo: "bg-blue-100 text-blue-800",
  pronto: "bg-violet-100 text-violet-800",
  entregue: "bg-green-100 text-green-800",
  cancelado: "bg-stone-200 text-stone-500",
};

const FLUXO: Record<string, string> = {
  pendente: "em_preparo",
  em_preparo: "pronto",
  pronto: "entregue",
};

export function rotuloStatus(status: string): string {
  return ROTULOS[status] ?? status;
}

export function tomStatus(status: string): string {
  return TONS[status] ?? "bg-stone-100 text-stone-600";
}

/** Próximo passo do fluxo (undefined em entregue/cancelado: sem botão). */
export function proximoStatus(status: string): string | undefined {
  return FLUXO[status];
}

export function rotuloPagamento(status: string): string {
  if (status === "pago") return "Pago";
  if (status === "estornado") return "Estornado";
  return "A receber";
}
