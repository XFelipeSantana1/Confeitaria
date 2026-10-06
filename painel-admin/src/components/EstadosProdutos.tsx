import { CakeSlice, Tag } from "lucide-react";
import type { FiltroCategoria } from "../components/PainelCategorias";
import { Cartao } from "./ui/Cartao";
import { DiscoVazio } from "./ui/DiscoVazio";

/**
 * Os três vazios da tela de Produtos, em um componente.
 *
 * Ficavam dentro da página e deixavam o arquivo em 257 linhas — acima do limite
 * do projeto. E são os três casos em que o gestor não tem nada para fazer:
 * nenhum produto cadastrado, nenhum produto na categoria escolhida, e nenhum
 * produto para o termo buscado.
 */
export type SituacaoLista =
  | { tipo: "sem-produtos" }
  | { tipo: "sem-categoria"; filtro: FiltroCategoria }
  | { tipo: "sem-resultado"; busca: string; categoria: FiltroCategoria };

export function EstadosProdutos({ situacao }: { situacao: SituacaoLista }): JSX.Element {
  if (situacao.tipo === "sem-produtos") {
    return (
      <Cartao className="py-12 text-center">
        <DiscoVazio>
          <CakeSlice size={26} />
        </DiscoVazio>
        <b className="mt-2 block font-display text-xl text-tinta">Nenhum produto cadastrado</b>
        <p className="mt-1 text-sm text-textoSuave">
          Cadastre o primeiro doce para encher a vitrine.
        </p>
      </Cartao>
    );
  }

  if (situacao.tipo === "sem-categoria") {
    return (
      <Cartao className="py-10 text-center">
        <DiscoVazio>
          <Tag size={26} />
        </DiscoVazio>
        <b className="mt-2 block font-display text-lg text-tinta">Nada nesta categoria</b>
        <p className="mt-1 text-sm text-textoSuave">
          {situacao.filtro === "sem"
            ? "Todos os produtos estão classificados."
            : "Nenhum produto usa essa categoria ainda."}
        </p>
      </Cartao>
    );
  }

  // Busca sem resultado: distinguir "não existe isso" de "existe, mas está
  // fora do filtro" é o que evita a pessoa achar que apagou produto por engano.
  const filtrando = situacao.categoria !== "todas";
  return (
    <Cartao className="py-10 text-center">
      <DiscoVazio>
        <Tag size={26} />
      </DiscoVazio>
      <b className="mt-2 block font-display text-lg text-tinta">
        Nada para “{situacao.busca}”
      </b>
      <p className="mt-1 text-sm text-textoSuave">
        {filtrando
          ? "Nenhum produto com esse nome nesta categoria. Tente “ver todos”."
          : "Nenhum produto com esse nome. Confira a escrita."}
      </p>
    </Cartao>
  );
}
