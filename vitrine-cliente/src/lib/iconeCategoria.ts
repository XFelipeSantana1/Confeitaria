import {
  Cake,
  Candy,
  Cookie,
  Croissant,
  CupSoda,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";

// Ícone personalizado por categoria (mantido no lucide-react, que já é a
// lib de ícones do projeto — sem trazer FontAwesome só para isso).
// Casamento por palavra-chave para não quebrar quando a confeiteira criar
// categorias novas com nomes parecidos ("Bolos de festa", "Docinhos"...).
const MAPA: Array<{ chaves: string[]; icone: LucideIcon }> = [
  { chaves: ["bolo", "torta", "fatia"], icone: Cake },
  { chaves: ["doce", "brigadeiro", "chocolate", "cone"], icone: Candy },
  { chaves: ["salgad", "coxinha", "empada", "pastel", "lanche"], icone: Croissant },
  { chaves: ["bebida", "suco", "café", "cafe", "refrigerante"], icone: CupSoda },
  { chaves: ["festa", "kit", "encomenda", "presente"], icone: PartyPopper },
];

export function iconeParaCategoria(nome: string): LucideIcon {
  const minusculo = nome.toLowerCase();
  const achado = MAPA.find((entrada) =>
    entrada.chaves.some((chave) => minusculo.includes(chave)),
  );
  return achado ? achado.icone : Cookie;
}
