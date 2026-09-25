// Formatos de dados da vitrine. Espelham o que o backend realmente retorna
// (conferir backend/src/controllers/produtoController.ts e categoriaController.ts).

/** Categoria como a API entrega: GET /api/categorias → [{ id, nome }]. */
export interface Categoria {
  id: number;
  nome: string;
}

/**
 * Produto como a API entrega (GET /api/produtos).
 * ATENÇÃO: `preco` chega como string porque a coluna é DECIMAL e o driver
 * mysql2 devolve DECIMAL como string — a normalização para number acontece
 * em src/lib/api.ts, então o resto do front só lida com number.
 * `disponivel` / `quantidade_disponivel` ainda NÃO existem na API (o endpoint
 * público lista só produtos ativos); são opcionais para a UI já saber lidar
 * com indisponibilidade quando o backend passar a informar.
 */
export interface ProdutoBruto {
  id: number;
  nome: string;
  descricao: string | null;
  preco: string | number;
  imagem_url: string | null;
  categoria: string;
  ativo?: boolean;
  disponivel?: boolean;
  quantidade_disponivel?: number;
}

/** Produto normalizado, pronto para consumo pelos componentes. */
export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string | null;
  categoria: string;
  ativo: boolean;
  disponivel?: boolean;
  quantidadeDisponivel?: number;
}

/** Um item dentro da sacola: o produto + quantas unidades a pessoa quer. */
export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

/** Rótulo especial da pílula "mostrar tudo", fora das categorias reais. */
export const TODAS_CATEGORIAS = "todas";

/** Estado da conexão exibido no topo (bolinha + rótulo). */
export type EstadoApi = "carregando" | "online" | "demonstracao" | "erro";
