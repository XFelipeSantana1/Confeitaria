import { useCallback, useEffect, useState } from "react";
import type { Categoria } from "../types";
import {
  ErroApi,
  atualizarCategoria,
  criarCategoria,
  listarCategorias,
  removerCategoria,
} from "../lib/api";

// CRUD de categorias. Tela simples (o prompt permite): criar, renomear e
// remover — remover NÃO quebra produtos (FK é ON DELETE SET NULL), mas o
// texto do modal avisa que os produtos ficam sem categoria.
export function useCategorias(token: string | null): {
  categorias: Categoria[];
  carregando: boolean;
  erro: string | null;
  precisaLogin: boolean;
  buscarNovamente: () => void;
  criar: (nome: string) => Promise<void>;
  atualizar: (id: number, nome: string) => Promise<void>;
  remover: (id: number) => Promise<void>;
} {
  const [categorias, definirCategorias] = useState<Categoria[]>([]);
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
      definirCategorias(await listarCategorias());
    } catch (falha) {
      if (falha instanceof ErroApi && falha.codigo === 401) {
        definirPrecisaLogin(true);
      } else {
        definirErro(falha instanceof Error ? falha.message : "Não foi possível carregar as categorias.");
      }
    } finally {
      definirCarregando(false);
    }
  }, [token]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  async function criar(nome: string): Promise<void> {
    if (!token) return;
    await criarCategoria(token, nome);
    await buscar();
  }

  async function atualizar(id: number, nome: string): Promise<void> {
    if (!token) return;
    await atualizarCategoria(token, id, nome);
    await buscar();
  }

  async function remover(id: number): Promise<void> {
    if (!token) return;
    await removerCategoria(token, id);
    await buscar();
  }

  return {
    categorias,
    carregando,
    erro,
    precisaLogin,
    buscarNovamente: buscar,
    criar,
    atualizar,
    remover,
  };
}
