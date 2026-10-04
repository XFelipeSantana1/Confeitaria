import { ArrowLeftRight, Pencil, Plus, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Registro } from "../types";

// Cada ação com ícone e cor próprios. Sem isto, a coluna vira texto repetido
// ("criou", "editou") e o gestor precisa ler cada linha para achar o que
// importa. A cor vem do mesmo tom da marca, não de uma paleta nova.
const APARENCIA: Record<Registro["acao"], { icone: LucideIcon; classe: string }> = {
  criar: { icone: Plus, classe: "bg-green-700/10 text-green-800" },
  atualizar: { icone: Pencil, classe: "bg-caramelo/10 text-carameloForte" },
  excluir: { icone: Trash2, classe: "bg-rose-600/10 text-rose-700" },
  mover: { icone: ArrowLeftRight, classe: "bg-dourado/20 text-amber-800" },
};

export function aparenciaAcao(acao: Registro["acao"]): { icone: LucideIcon; classe: string } {
  return APARENCIA[acao] ?? APARENCIA.atualizar;
}
