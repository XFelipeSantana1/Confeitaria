import { Ban, Check } from "lucide-react";
import type { DetalhePedido } from "../types";
import { proximoStatus, rotuloStatus } from "../lib/pedido";
import { Botao } from "./ui/Botao";

// Rodapé fixo do drawer: avançar no fluxo e cancelar (com estorno).
// Sem próximo (entregue/cancelado) não há botão de avanço; entregue também
// esconde o cancelar — decisão visível aqui, não espalhada.
interface PropriedadesAcoesPedido {
  detalhe: DetalhePedido;
  agindo: boolean;
  aoAvancar: () => void;
  aoCancelar: () => void;
}

export function AcoesPedido({
  detalhe,
  agindo,
  aoAvancar,
  aoCancelar,
}: PropriedadesAcoesPedido): JSX.Element | null {
  const proximo = proximoStatus(detalhe.status);
  const podeCancelar = detalhe.status !== "cancelado" && detalhe.status !== "entregue";
  if (!proximo && !podeCancelar) return null;
  return (
    <div className="flex gap-2 border-t border-borda bg-white p-4">
      {proximo ? (
        <Botao disabled={agindo} onClick={aoAvancar} className="flex-1 py-3">
          <Check size={17} /> {agindo ? "Salvando…" : `Avançar: ${rotuloStatus(proximo)}`}
        </Botao>
      ) : null}
      {podeCancelar ? (
        <Botao
          variante="perigo"
          disabled={agindo}
          onClick={aoCancelar}
          className="py-3"
          title="Cancela e estorna o estoque"
        >
          <Ban size={17} /> Cancelar
        </Botao>
      ) : null}
    </div>
  );
}
