import type { LucideIcon } from "lucide-react";
import { CakeSlice, ClipboardList, History, LayoutDashboard, Wheat } from "lucide-react";

// Menu do painel em um lugar só, para a sidebar (desktop) e a gaveta do
// celular mostrarem exatamente os mesmos itens. Antes cada um tinha sua lista
// e o celular ficava sem nenhum link — o gestor entrava no painel e não
// conseguia sair da tela inicial.
//
// São cinco e só cinco: Categorias virou painel dentro de Produtos (é
// atributo de produto, não assunto próprio) e o perfil virou janela aberta
// pelo nome do gestor, no rodapé da sidebar e da gaveta. Nenhuma das duas
// coisas disputava espaço no menu.
export interface ItemMenu {
  rota: string;
  rotulo: string;
  icone: LucideIcon;
}

export const ITENS_MENU: ItemMenu[] = [
  { rota: "/painel", rotulo: "Resumo", icone: LayoutDashboard },
  { rota: "/painel/pedidos", rotulo: "Pedidos", icone: ClipboardList },
  { rota: "/painel/insumos", rotulo: "Insumos", icone: Wheat },
  { rota: "/painel/produtos", rotulo: "Produtos", icone: CakeSlice },
  { rota: "/painel/registros", rotulo: "Histórico", icone: History },
];
