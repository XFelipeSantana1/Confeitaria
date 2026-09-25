import { useCallback, useEffect, useState } from "react";
import type { Pedido } from "../types";
import { ErroApi, definirPagamentoPedido, definirStatusPedido, listarPedidos } from "../lib/api";

// Lista de pedidos com filtro por status. O filtro é client-side sobre a
// lista cheia (as abas mostram contagens, então tudo vem de uma vez).
export function usePedidos(token: string | null): {
  pedidos: Pedido[];
  filtro: string;
  definirFiltro: (filtro: string) => void;
  carregando: boolean;
  erro: string | null;
  precisaLogin: boolean;
  buscarNovamente: () => void;
  mudarStatus: (id: number, status: string) => Promise<void>;
  mudarPagamento: (id: number, status: string) => Promise<void>;
} {
  const [pedidos, definirPedidos] = useState<Pedido[]>([]);
  const [filtro, definirFiltro] = useState("todos");
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState<string | null>(null);
  const [precisaLogin, definirPrecisaLogin] = useState(false);

  const buscar = useCallback(async () => {
    if (!token) {
      definirCarregando(false);
      return;
    }
    definirCarregando(true);
    definirErro(null);
    try {
      const todos = await listarPedidos(token);
      // Filtro client-side sobre a lista (a API também aceita ?status=, mas
      // contar as abas "todos" precisa da lista cheia de qualquer jeito).
      definirPedidos(filtro === "todos" ? todos : todos.filter((p) => p.status === filtro));
    } catch (falha) {
      if (falha instanceof ErroApi && falha.codigo === 401) {
        definirPrecisaLogin(true);
      } else {
        definirErro(falha instanceof Error ? falha.message : "Não foi possível carregar os pedidos.");
      }
    } finally {
      definirCarregando(false);
    }
  }, [token, filtro]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  // Atualiza a linha local após o PATCH (evita refetch da lista inteira).
  async function mudarStatus(id: number, status: string): Promise<void> {
    if (!token) return;
    await definirStatusPedido(token, id, status);
    definirPedidos((atual) => atual.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  async function mudarPagamento(id: number, status: string): Promise<void> {
    if (!token) return;
    await definirPagamentoPedido(token, id, status);
    definirPedidos((atual) =>
      atual.map((p) => (p.id === id ? { ...p, status_pagamento: status } : p)),
    );
  }

  return {
    pedidos,
    filtro,
    definirFiltro,
    carregando,
    erro,
    precisaLogin,
    buscarNovamente: buscar,
    mudarStatus,
    mudarPagamento,
  };
}
