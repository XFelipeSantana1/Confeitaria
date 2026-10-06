/**
 * Selo com a quantidade de pedidos pendentes, ao lado do item de menu.
 *
 * Fica num componente só porque aparece em três lugares com， como as regras
 * de dentro da barra lateral, da gaveta e do rodapé são diferentes: quem
 * chama decide se o selo é absoluto (ícone do rodapé) ou na linha (menu).
 */
export function ContadorMenu({ valor }: { valor: number | null }): JSX.Element | null {
  // `0` não desenha nada: um zero no menu é ruído, e a ausência já
  // comunica "nada esperando".
  if (valor === null || valor === 0) return null;
  return (
    <span
      aria-label={`${valor} pedido${valor === 1 ? "" : "s"} pendente${valor === 1 ? "" : "s"}`}
      className="grid h-5 min-w-5 place-items-center rounded-full bg-caramelo px-1.5 font-numero text-[11px] font-extrabold tabular-nums text-white"
    >
      {valor}
    </span>
  );
}

/**
 * Mesma coisa, ancorada no canto do ícone. Para o rodapé do celular, onde a
 * linha é curta e empurrar o selo desalinaria o alvo de toque.
 */
export function ContadorSobreposto({ valor }: { valor: number | null }): JSX.Element | null {
  if (valor === null || valor === 0) return null;
  return (
    <span
      aria-label={`${valor} pedido${valor === 1 ? "" : "s"} pendente${valor === 1 ? "" : "s"}`}
      className="absolute -right-2.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-caramelo px-1 font-numero text-[10px] font-extrabold tabular-nums text-white ring-2 ring-creme"
    >
      {valor}
    </span>
  );
}
