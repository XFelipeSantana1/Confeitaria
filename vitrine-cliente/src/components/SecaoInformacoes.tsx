import { BadgeCheck, MessageCircleHeart, Wheat } from "lucide-react";

// Três cartões de confiança abaixo do cardápio. Conteúdo fixo (educativo),
// então não recebe props — se um dia vier da API, vira prop aqui.
const CARTOES = [
  {
    titulo: "Pedido pelo WhatsApp",
    texto: "Sua sacola vira mensagem pronta. É só enviar.",
    icone: <MessageCircleHeart size={26} />,
  },
  {
    titulo: "Receita de verdade",
    texto: "Cada produto tem ficha técnica e baixa automática no estoque.",
    icone: <Wheat size={26} />,
  },
  {
    titulo: "Feito na hora",
    texto: "Confirmamos pelo chat o prazo de entrega.",
    icone: <BadgeCheck size={26} />,
  },
];

export function SecaoInformacoes(): JSX.Element {
  return (
    <section className="mx-auto grid max-w-6xl gap-4 px-5 py-8 md:grid-cols-3">
      {CARTOES.map((cartao) => (
        <div
          key={cartao.titulo}
          className="flex items-start gap-3.5 rounded-3xl bg-tinta p-5 text-creme"
        >
          <span className="text-dourado">{cartao.icone}</span>
          <span>
            <b className="block text-[15px]">{cartao.titulo}</b>
            <span className="text-[13px] opacity-80">{cartao.texto}</span>
          </span>
        </div>
      ))}
    </section>
  );
}
