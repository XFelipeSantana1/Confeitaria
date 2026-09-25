// Formatos do painel. Espelham a API (rotas autenticadas do backend).

/** Usuário logado (payload do JWT + GET /api/auth/me). */
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: "admin" | "gestor";
}

/** Sessão guardada no navegador: token + quem é o dono dele. */
export interface Sessao {
  token: string;
  usuario: Usuario;
}

/** Pedido como o GET /api/pedidos entrega (com dados do cliente juntos). */
export interface Pedido {
  id: number;
  cliente_id: number;
  cliente_nome: string | null;
  whatsapp: string;
  status: string;
  forma_pagamento: string | null;
  status_pagamento: string;
  valor_total: number;
  origem: string;
}

/** Insumo como o GET /api/insumos entrega (completo, com custo). */
export interface Insumo {
  id: number;
  nome: string;
  unidade_medida: string;
  quantidade_atual: number;
  quantidade_minima: number;
  custo_unitario: number;
}

/** Linha do GET /api/produtos/admin/mais-vendidos (total pode vir string:
 *  SUM de inteiro volta DECIMAL pelo driver). */
export interface ProdutoVendido {
  id: number;
  nome: string;
  total_vendido: number;
}

/** Item de um pedido (GET /api/pedidos/:id traz junto). */
export interface ItemPedido {
  id: number;
  produto_id: number;
  produto_nome: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

/** Pedido com itens (detalhe do drawer). */
export interface DetalhePedido extends Pedido {
  itens: ItemPedido[];
}

/** Produto do painel (GET /admin/todos traz tudo, inclusive inativos). */
export interface ProdutoAdmin {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  categoria_id: number | null;
  categoria: string | null;
  imagem_url: string | null;
  ativo: boolean;
}

/** Linha da ficha técnica (receita): insumo + quanto vai no produto. */
export interface ItemFicha {
  insumo_id: number;
  insumo_nome?: string;
  unidade_medida?: string;
  quantidade_necessaria: number;
}

/** Categoria para o select do formulário. */
export interface Categoria {
  id: number;
  nome: string;
}

/** Status possíveis de um pedido (enum do banco). */
export const STATUS_PEDIDO = [
  "pendente",
  "em_preparo",
  "pronto",
  "entregue",
  "cancelado",
] as const;

export type StatusPedido = (typeof STATUS_PEDIDO)[number];

/** Status de pagamento (enum do banco). */
export const STATUS_PAGAMENTO = ["pendente", "pago", "estornado"] as const;
