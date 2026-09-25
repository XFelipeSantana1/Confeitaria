import type { Categoria, DetalhePedido, Insumo, ItemFicha, Pedido, ProdutoAdmin, ProdutoVendido, Sessao, Usuario } from "../types";

// Base da API (congelada no build via .env). Sem fallback de localStorage
// aqui de propósito: painel é operado pela dona, URL fixa por ambiente.
const BASE: string =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:3000/api";

/** Erro com status HTTP, para a tela decidir a mensagem (401 expira sessão). */
export class ErroApi extends Error {
  codigo: number;
  constructor(codigo: number, mensagem: string) {
    super(mensagem);
    this.codigo = codigo;
  }
}

async function requisitar<T>(rota: string, token: string, opcoes?: RequestInit): Promise<T> {
  const resposta = await fetch(`${BASE}${rota}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opcoes?.headers ?? {}),
    },
  });
  const corpo = (await resposta.json().catch(() => ({}))) as {
    erro?: string;
  };
  if (!resposta.ok) {
    throw new ErroApi(resposta.status, corpo.erro ?? `A API respondeu ${resposta.status}.`);
  }
  return corpo as T;
}

/** POST /api/auth/login — não pede token (é assim que se consegue um). */
export async function entrar(email: string, senha: string): Promise<Sessao> {
  const resposta = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const corpo = (await resposta.json().catch(() => ({}))) as Partial<Sessao> & {
    erro?: string;
  };
  if (!resposta.ok || !corpo.token || !corpo.usuario) {
    throw new ErroApi(resposta.status, corpo.erro ?? "Não foi possível entrar.");
  }
  return { token: corpo.token, usuario: corpo.usuario };
}

/** GET /api/auth/me — confirma que o token salvo ainda vale. */
export async function obterUsuario(token: string): Promise<Usuario> {
  return requisitar<Usuario>("/auth/me", token);
}

/** GET /api/pedidos — todos (o resumo conta por status no cliente). */
export async function listarPedidos(token: string): Promise<Pedido[]> {
  const lista = await requisitar<Array<Record<string, unknown>>>("/pedidos", token);
  return lista.map((pedido) => ({
    id: Number(pedido.id),
    cliente_id: Number(pedido.cliente_id),
    cliente_nome: (pedido.cliente_nome as string | null) ?? null,
    whatsapp: String(pedido.whatsapp ?? ""),
    status: String(pedido.status ?? ""),
    forma_pagamento: (pedido.forma_pagamento as string | null) ?? null,
    status_pagamento: String(pedido.status_pagamento ?? ""),
    valor_total: Number(pedido.valor_total) || 0,
    origem: String(pedido.origem ?? ""),
  }));
}

/** GET /api/insumos/baixo-estoque — alerta de reposição. */
export async function listarBaixoEstoque(token: string): Promise<Insumo[]> {
  const lista = await requisitar<Array<Record<string, unknown>>>("/insumos/baixo-estoque", token);
  return lista.map((insumo) => ({
    id: Number(insumo.id),
    nome: String(insumo.nome ?? ""),
    unidade_medida: String(insumo.unidade_medida ?? ""),
    quantidade_atual: Number(insumo.quantidade_atual) || 0,
    quantidade_minima: Number(insumo.quantidade_minima) || 0,
    custo_unitario: Number(insumo.custo_unitario) || 0,
  }));
}

/** GET /api/pedidos/:id — cabeçalho + itens (normaliza números do DECIMAL). */
export async function obterPedido(token: string, id: number): Promise<DetalhePedido> {
  const dados = await requisitar<Record<string, unknown>>(`/pedidos/${id}`, token);
  const brutos = (dados.itens as Array<Record<string, unknown>>) ?? [];
  return {
    id: Number(dados.id),
    cliente_id: Number(dados.cliente_id),
    cliente_nome: (dados.cliente_nome as string | null) ?? null,
    whatsapp: String(dados.whatsapp ?? ""),
    status: String(dados.status ?? ""),
    forma_pagamento: (dados.forma_pagamento as string | null) ?? null,
    status_pagamento: String(dados.status_pagamento ?? ""),
    valor_total: Number(dados.valor_total) || 0,
    origem: String(dados.origem ?? ""),
    itens: brutos.map((item) => ({
      id: Number(item.id),
      produto_id: Number(item.produto_id),
      produto_nome: String(item.produto_nome ?? ""),
      quantidade: Number(item.quantidade) || 0,
      preco_unitario: Number(item.preco_unitario) || 0,
      subtotal: Number(item.subtotal) || 0,
    })),
  };
}

/** PATCH /api/pedidos/:id/status — avança ou cancela (cancelar estorna). */
export async function definirStatusPedido(
  token: string,
  id: number,
  status: string,
): Promise<void> {
  await requisitar(`/pedidos/${id}/status`, token, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/** PATCH /api/pedidos/:id/pagamento — marca como pago/pendente/estornado. */
export async function definirPagamentoPedido(
  token: string,
  id: number,
  status_pagamento: string,
): Promise<void> {
  await requisitar(`/pedidos/${id}/pagamento`, token, {
    method: "PATCH",
    body: JSON.stringify({ status_pagamento }),
  });
}
/** POST /api/insumos — cadastro (estoque inicial vai junto). */
export async function criarInsumo(
  token: string,
  dados: {
    nome: string;
    unidade_medida: string;
    quantidade_atual: number;
    quantidade_minima: number;
    custo_unitario: number;
  },
): Promise<{ id: number }> {
  return requisitar<{ id: number }>("/insumos", token, {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

/** PUT /api/insumos/:id — edição parcial (estoque NÃO entra aqui). */
export async function atualizarInsumo(
  token: string,
  id: number,
  dados: {
    nome?: string;
    unidade_medida?: string;
    quantidade_minima?: number;
    custo_unitario?: number;
  },
): Promise<void> {
  await requisitar(`/insumos/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

/** DELETE /api/insumos/:id — 409 se tem receita/movimentação vinculada. */
export async function removerInsumo(token: string, id: number): Promise<void> {
  await requisitar(`/insumos/${id}`, token, { method: "DELETE" });
}

/** POST /api/insumos/:id/movimentar — entrada/perda/ajuste auditado. */
export async function movimentarInsumo(
  token: string,
  id: number,
  dados: { tipo: string; quantidade: number; observacao?: string },
): Promise<void> {
  await requisitar(`/insumos/${id}/movimentar`, token, {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

/** GET /api/insumos — lista completa para a tabela. */
export async function listarInsumos(token: string): Promise<Insumo[]> {
  const lista = await requisitar<Array<Record<string, unknown>>>("/insumos", token);
  return lista.map((insumo) => ({
    id: Number(insumo.id),
    nome: String(insumo.nome ?? ""),
    unidade_medida: String(insumo.unidade_medida ?? ""),
    quantidade_atual: Number(insumo.quantidade_atual) || 0,
    quantidade_minima: Number(insumo.quantidade_minima) || 0,
    custo_unitario: Number(insumo.custo_unitario) || 0,
  }));
}
/** PUT /api/auth/me — nome/email + troca de senha (com senha atual). */
export async function atualizarPerfil(
  token: string,
  dados: { nome?: string; email?: string; senha_atual?: string; senha_nova?: string },
): Promise<Usuario> {
  return requisitar<Usuario>("/auth/me", token, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

/** GET /api/categorias — público, alimenta selects do painel. */
export async function listarCategorias(): Promise<Categoria[]> {
  const resposta = await fetch(`${BASE}/categorias`);
  if (!resposta.ok) throw new ErroApi(resposta.status, "Não foi possível carregar as categorias.");
  const lista = (await resposta.json()) as Array<Record<string, unknown>>;
  return lista.map((c) => ({ id: Number(c.id), nome: String(c.nome ?? "") }));
}

/** POST /api/categorias — nome duplicado volta 409 do backend. */
export async function criarCategoria(token: string, nome: string): Promise<{ id: number }> {
  return requisitar<{ id: number }>("/categorias", token, {
    method: "POST",
    body: JSON.stringify({ nome }),
  });
}

/** PUT /api/categorias/:id — edição parcial (COALESCE no backend). */
export async function atualizarCategoria(token: string, id: number, nome: string): Promise<void> {
  await requisitar(`/categorias/${id}`, token, { method: "PUT", body: JSON.stringify({ nome }) });
}

/** DELETE /api/categorias/:id — categoria é ON DELETE SET NULL nos produtos. */
export async function removerCategoria(token: string, id: number): Promise<void> {
  await requisitar(`/categorias/${id}`, token, { method: "DELETE" });
}

/** GET /api/produtos/admin/todos — tabela do painel (com inativos). */
export async function listarProdutosAdmin(token: string): Promise<ProdutoAdmin[]> {
  const lista = await requisitar<Array<Record<string, unknown>>>("/produtos/admin/todos", token);
  return lista.map((p) => ({
    id: Number(p.id),
    nome: String(p.nome ?? ""),
    descricao: (p.descricao as string | null) ?? null,
    preco: Number(p.preco) || 0,
    categoria_id: p.categoria_id == null ? null : Number(p.categoria_id),
    categoria: (p.categoria as string | null) ?? null,
    imagem_url: (p.imagem_url as string | null) ?? null,
    ativo: Boolean(p.ativo),
  }));
}
/** GET /api/produtos/admin/:id — produto + ficha para edição. */
export async function obterProdutoAdmin(
  token: string,
  id: number,
): Promise<{ produto: ProdutoAdmin; ficha: ItemFicha[] }> {
  const dados = await requisitar<Record<string, unknown>>(`/produtos/admin/${id}`, token);
  const bruta = (dados.ficha_tecnica as Array<Record<string, unknown>>) ?? [];
  return {
    produto: {
      id: Number(dados.id),
      nome: String(dados.nome ?? ""),
      descricao: (dados.descricao as string | null) ?? null,
      preco: Number(dados.preco) || 0,
      categoria_id: dados.categoria_id == null ? null : Number(dados.categoria_id),
      categoria: null,
      imagem_url: (dados.imagem_url as string | null) ?? null,
      ativo: Boolean(dados.ativo),
    },
    ficha: bruta.map((item) => ({
      insumo_id: Number(item.id),
      insumo_nome: String(item.nome ?? ""),
      unidade_medida: String(item.unidade_medida ?? ""),
      quantidade_necessaria: Number(item.quantidade_necessaria) || 0,
    })),
  };
}

/** POST /api/produtos — cria com ficha opcional (transação no backend). */
export async function criarProduto(
  token: string,
  dados: {
    nome: string;
    descricao?: string;
    preco: number;
    categoria_id?: number | null;
    imagem_url?: string;
    ficha_tecnica: Array<{ insumo_id: number; quantidade_necessaria: number }>;
  },
): Promise<{ id: number }> {
  return requisitar<{ id: number }>("/produtos", token, {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

/** PUT /api/produtos/:id — dados básicos (parcial, com ativo). */
export async function atualizarProduto(
  token: string,
  id: number,
  dados: {
    nome?: string;
    descricao?: string | null;
    preco?: number;
    categoria_id?: number | null;
    imagem_url?: string | null;
    ativo?: boolean;
  },
): Promise<void> {
  await requisitar(`/produtos/${id}`, token, { method: "PUT", body: JSON.stringify(dados) });
}

/** PUT /api/produtos/:id/ficha-tecnica — substitui a receita inteira. */
export async function salvarFichaTecnica(
  token: string,
  id: number,
  ficha: Array<{ insumo_id: number; quantidade_necessaria: number }>,
): Promise<void> {
  await requisitar(`/produtos/${id}/ficha-tecnica`, token, {
    method: "PUT",
    body: JSON.stringify({ ficha_tecnica: ficha }),
  });
}

/** DELETE /api/produtos/:id — 409 com vendas vinculadas. */
export async function removerProduto(token: string, id: number): Promise<void> {
  await requisitar(`/produtos/${id}`, token, { method: "DELETE" });
}
export async function listarMaisVendidos(token: string): Promise<ProdutoVendido[]> {
  const lista = await requisitar<Array<Record<string, unknown>>>(
    "/produtos/admin/mais-vendidos",
    token,
  );
  return lista.map((linha) => ({
    id: Number(linha.id),
    nome: String(linha.nome ?? ""),
    total_vendido: Number(linha.total_vendido) || 0,
  }));
}
