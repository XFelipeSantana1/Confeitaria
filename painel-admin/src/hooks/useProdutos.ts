import { useCallback, useEffect, useState } from "react";
import type { Categoria, Insumo, ProdutoAdmin } from "../types";
import {
  ErroApi,
  atualizarProduto,
  criarProduto,
  listarCategorias,
  listarInsumos,
  listarProdutosAdmin,
  obterProdutoAdmin,
  removerProduto,
  salvarFichaTecnica,
} from "../lib/api";

// CRUD de produtos + ficha técnica + listas de apoio (categorias e insumos
// para os selects). Recarrega após cada escrita: dado fresco no painel.
export function useProdutos(token: string | null): {
  produtos: ProdutoAdmin[];
  categorias: Categoria[];
  insumos: Insumo[];
  carregando: boolean;
  erro: string | null;
  precisaLogin: boolean;
  buscarNovamente: () => void;
  criar: (dados: {
    nome: string;
    descricao?: string;
    preco: number;
    categoria_id?: number | null;
    imagem_url?: string;
    ficha_tecnica: Array<{ insumo_id: number; quantidade_necessaria: number }>;
  }) => Promise<number>;
  atualizar: (
    id: number,
    dados: {
      nome?: string;
      descricao?: string | null;
      preco?: number;
      categoria_id?: number | null;
      imagem_url?: string | null;
      ativo?: boolean;
    },
  ) => Promise<void>;
  salvarFicha: (
    id: number,
    ficha: Array<{ insumo_id: number; quantidade_necessaria: number }>,
  ) => Promise<void>;
  remover: (id: number) => Promise<void>;
  carregarFicha: (id: number) => Promise<{
    produto: ProdutoAdmin;
    ficha: Array<{ insumo_id: number; quantidade_necessaria: number }>;
  }>;
} {
  const [produtos, definirProdutos] = useState<ProdutoAdmin[]>([]);
  const [categorias, definirCategorias] = useState<Categoria[]>([]);
  const [insumos, definirInsumos] = useState<Insumo[]>([]);
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
      const [lista, cats, ins] = await Promise.all([
        listarProdutosAdmin(token),
        listarCategorias(),
        listarInsumos(token),
      ]);
      definirProdutos(lista);
      definirCategorias(cats);
      definirInsumos(ins);
    } catch (falha) {
      if (falha instanceof ErroApi && falha.codigo === 401) {
        definirPrecisaLogin(true);
      } else {
        definirErro(falha instanceof Error ? falha.message : "Não foi possível carregar os produtos.");
      }
    } finally {
      definirCarregando(false);
    }
  }, [token]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  async function criar(dados: {
    nome: string;
    descricao?: string;
    preco: number;
    categoria_id?: number | null;
    imagem_url?: string;
    ficha_tecnica: Array<{ insumo_id: number; quantidade_necessaria: number }>;
  }): Promise<number> {
    if (!token) throw new Error("Sem sessão.");
    const criado = await criarProduto(token, dados);
    await buscar();
    return criado.id;
  }

  async function atualizar(
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
    if (!token) return;
    await atualizarProduto(token, id, dados);
    await buscar();
  }

  async function salvarFicha(
    id: number,
    ficha: Array<{ insumo_id: number; quantidade_necessaria: number }>,
  ): Promise<void> {
    if (!token) return;
    await salvarFichaTecnica(token, id, ficha);
    await buscar();
  }

  async function remover(id: number): Promise<void> {
    if (!token) return;
    await removerProduto(token, id);
    await buscar();
  }

  async function carregarFicha(id: number): Promise<{
    produto: ProdutoAdmin;
    ficha: Array<{ insumo_id: number; quantidade_necessaria: number }>;
  }> {
    if (!token) throw new Error("Sem sessão.");
    const { produto, ficha } = await obterProdutoAdmin(token, id);
    return {
      produto,
      ficha: ficha.map((item) => ({
        insumo_id: item.insumo_id,
        quantidade_necessaria: item.quantidade_necessaria,
      })),
    };
  }

  return {
    produtos,
    categorias,
    insumos,
    carregando,
    erro,
    precisaLogin,
    buscarNovamente: buscar,
    criar,
    atualizar,
    salvarFicha,
    remover,
    carregarFicha,
  };
}
