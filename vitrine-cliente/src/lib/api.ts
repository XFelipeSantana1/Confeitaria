import type { Categoria, ItemCarrinho, Produto, ProdutoBruto } from "../types";

// URL base resolvida em tempo de execução (não no build): o que a pessoa
// digitou na engrenagem ⚙️ ganha do .env, que ganha do localhost padrão.
// Isso permite usar o MESMO build contra o backend local ou o publicado.
// Aceita com ou sem o sufixo /api (cola sozinho quando falta): o erro mais
// comum é colar a URL do Codespaces sem o /api no final.
const URL_PADRAO = "http://localhost:3000/api";
const CHAVE_ARMAZENAMENTO = "cg_api";

function normalizarBase(url: string): string {
  const semBarra = url.trim().replace(/\/+$/, "");
  return semBarra.endsWith("/api") ? semBarra : `${semBarra}/api`;
}

export function obterUrlBase(): string {
  const salva = localStorage.getItem(CHAVE_ARMAZENAMENTO);
  if (salva && salva.trim() !== "") return normalizarBase(salva);
  const doAmbiente = import.meta.env.VITE_API_URL as string | undefined;
  if (doAmbiente && doAmbiente.trim() !== "") return normalizarBase(doAmbiente);
  return URL_PADRAO;
}

export function salvarUrlBase(url: string): void {
  localStorage.setItem(CHAVE_ARMAZENAMENTO, url.trim());
}

// Converte o formato bruto da API para o formato usado nos componentes.
// Centralizar aqui evita que cada tela precise lembrar que preco vem string.
export function normalizarProduto(bruto: ProdutoBruto): Produto {
  return {
    id: bruto.id,
    nome: bruto.nome,
    descricao: bruto.descricao ?? "Receita artesanal da casa.",
    preco: Number(bruto.preco) || 0,
    imagemUrl: bruto.imagem_url,
    categoria: bruto.categoria || "Doces",
    ativo: bruto.ativo ?? true,
    disponivel: bruto.disponivel,
    quantidadeDisponivel: bruto.quantidade_disponivel,
  };
}

async function lerJson(resposta: Response, rota: string): Promise<unknown> {
  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} em ${rota}.`);
  }
  return resposta.json();
}

/** GET /api/categorias — devolve só os nomes, que é o que as pílulas usam. */
export async function buscarCategorias(): Promise<string[]> {
  const base = obterUrlBase();
  const resposta = await fetch(`${base}/categorias`);
  const dados = (await lerJson(resposta, "/categorias")) as Categoria[];
  return dados.map((categoria) => categoria.nome);
}

/** GET /api/produtos — cardápio público (o backend já filtra só ativos). */
export async function buscarProdutos(): Promise<Produto[]> {
  const base = obterUrlBase();
  const resposta = await fetch(`${base}/produtos`);
  const dados = (await lerJson(resposta, "/produtos")) as ProdutoBruto[];
  return dados.map(normalizarProduto);
}

/** GET /api/health — usada pelo botão "Testar API" da configuração. */
export async function testarConexao(): Promise<boolean> {
  const base = obterUrlBase();
  const resposta = await fetch(`${base}/health`);
  const dados = (await lerJson(resposta, "/health")) as { status?: string };
  return dados.status === "ok";
}

/** Atalho para montar ItemCarrinho a partir do mapa id → quantidade. */
export function montarItens(
  mapaQuantidade: Record<number, number>,
  produtos: Produto[],
): ItemCarrinho[] {
  return Object.entries(mapaQuantidade)
    .map(([id, quantidade]) => {
      const produto = produtos.find((item) => item.id === Number(id));
      return produto ? { produto, quantidade } : null;
    })
    .filter((item): item is ItemCarrinho => item !== null);
}
