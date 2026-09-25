import { useCallback, useEffect, useState } from "react";
import type { Produto } from "../types";
import { buscarCategorias, buscarProdutos } from "../lib/api";
import {
  CATEGORIAS_DEMONSTRACAO,
  PRODUTOS_DEMONSTRACAO,
} from "../lib/dadosDemonstracao";

// Busca do cardápio seguindo o padrão do AuthDrawer: estado `carregando` +
// estado `erro` + try/catch/finally. O [] no useEffect garante UMA busca na
// montagem (sem ele, cada render refaria o fetch e entraria em loop).
export function useCardapio(): {
  produtos: Produto[];
  categorias: string[];
  carregando: boolean;
  erro: string | null;
  modoDemonstracao: boolean;
  buscarNovamente: () => void;
  usarDemonstracao: () => void;
} {
  const [produtos, definirProdutos] = useState<Produto[]>([]);
  const [categorias, definirCategorias] = useState<string[]>([]);
  const [carregando, definirCarregando] = useState<boolean>(true);
  const [erro, definirErro] = useState<string | null>(null);
  const [modoDemonstracao, definirDemonstracao] = useState<boolean>(false);

  // useCallback para o botão "Tentar novamente" reutilizar a mesma busca
  // sem recriar a função a cada render (e sem o efeito depender dela em loop).
  const buscar = useCallback(async () => {
    definirCarregando(true);
    definirErro(null);
    definirDemonstracao(false);
    try {
      const [listaCategorias, listaProdutos] = await Promise.all([
        buscarCategorias(),
        buscarProdutos(),
      ]);
      definirCategorias(listaCategorias);
      definirProdutos(listaProdutos);
    } catch (falha) {
      // Erro propositalmente amigável: detalhe técnico não ajuda a cliente.
      definirErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível carregar o cardápio.",
      );
      definirProdutos([]);
      definirCategorias([]);
    } finally {
      definirCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscar();
  }, [buscar]);

  // Demonstração é opt-in explícito (botão na tela de erro), nunca fallback
  // silencioso — erro de rede deve aparecer como erro, não como sucesso falso.
  function usarDemonstracao(): void {
    definirProdutos(PRODUTOS_DEMONSTRACAO);
    definirCategorias(CATEGORIAS_DEMONSTRACAO);
    definirErro(null);
    definirDemonstracao(true);
  }

  return {
    produtos,
    categorias,
    carregando,
    erro,
    modoDemonstracao,
    buscarNovamente: buscar,
    usarDemonstracao,
  };
}
