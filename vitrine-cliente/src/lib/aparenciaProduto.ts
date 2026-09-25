import type { Produto } from "../types";

// Fotos verificadas uma a uma (todas retornam 200 image/jpeg no CDN do
// Unsplash). Hierarquia de imagem do produto:
//   1. `imagem_url` cadastrada no painel (foto real da casa) — sempre vence;
//   2. foto curada por palavra-chave/categoria (doces reais, não ilustração);
//   3. emoji + gradiente (último recurso, ex: se o CDN estiver fora do ar).
const foto = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

const FOTO_TRUFA = foto("1549007994-cb92caebd54b");
const FOTO_GRANULADO = foto("1486427944299-d1955d23e34d");
const FOTO_MORANGO = foto("1565958011703-44f9829ba187");
const FOTO_BOLO = foto("1578985545062-69928b1d9587");
const FOTO_TACA = foto("1563805042-7684c019e1cb");
const FOTO_SALGADO = foto("1601050690597-df0568f70950");

export function imagemParaProduto(produto: Produto): string | null {
  if (produto.imagemUrl) return produto.imagemUrl;
  const nome = produto.nome.toLowerCase();
  if (nome.includes("morango")) return FOTO_MORANGO;
  if (nome.includes("brigadeiro") || nome.includes("trufa")) return FOTO_TRUFA;
  if (nome.includes("bolo") || nome.includes("torta")) return FOTO_BOLO;
  if (nome.includes("cone")) return FOTO_GRANULADO;
  if (
    nome.includes("mousse") ||
    nome.includes("pave") ||
    nome.includes("pavê") ||
    nome.includes("taca") ||
    nome.includes("taça")
  ) {
    return FOTO_TACA;
  }
  if (
    nome.includes("coxinha") ||
    nome.includes("salgad") ||
    nome.includes("empada") ||
    nome.includes("pastel")
  ) {
    return FOTO_SALGADO;
  }
  const categoria = produto.categoria.toLowerCase();
  if (categoria.includes("bolo")) return FOTO_BOLO;
  if (categoria.includes("salg")) return FOTO_SALGADO;
  if (categoria.includes("doce")) return FOTO_GRANULADO;
  return FOTO_TRUFA;
  return FOTO_TRUFA;
}

// Emoji + gradiente estáveis por id: aparecem enquanto a foto carrega ou se
// ela falhar (cada <img> do projeto trata onError e volta para cá).
const EMOJIS = ["🧁", "🍰", "🍫", "🍓", "🍦", "🥐", "🍩", "🥧"];
const GRADIENTES: Array<[string, string]> = [
  ["#f3ddba", "#c99b62"],
  ["#f2c9c2", "#c96a5e"],
  ["#e3c39c", "#7c4a2d"],
  ["#f0cbd8", "#a34a6e"],
  ["#f6e8c8", "#b97f4a"],
  ["#e6d3ae", "#6f7c3f"],
];

export function emojiParaProduto(produto: Produto): string {
  return EMOJIS[produto.id % EMOJIS.length] as string;
}

export function gradienteParaProduto(produto: Produto): [string, string] {
  return GRADIENTES[produto.id % GRADIENTES.length] as [string, string];
}
