import { useRef, useState } from "react";

// Balãozinho temporário de confirmação ("Adicionado à sacola 🧁").
// Vira hook porque tem ciclo de vida próprio (temporizador que esconde
// sozinho) — o App só chama `mostrarAviso` e lê `aviso`.
export function useAviso(): {
  aviso: string | null;
  mostrarAviso: (texto: string) => void;
} {
  const [aviso, definirAviso] = useState<string | null>(null);
  const temporizador = useRef<number | undefined>(undefined);

  function mostrarAviso(texto: string): void {
    definirAviso(texto);
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => definirAviso(null), 2400);
  }

  return { aviso, mostrarAviso };
}
