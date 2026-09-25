import { useState, type FormEvent } from "react";
import { Save, X } from "lucide-react";
import type { Categoria } from "../types";
import { Entrada } from "./ui/Entrada";
import { Botao } from "./ui/Botao";

// Criar/renomear categoria no mesmo modal. Duplicada volta 409 do backend
// e aparece aqui — o nome tem índice único no banco.
interface PropriedadesModalCategoria {
  categoria: Categoria | null;
  salvando: boolean;
  erro: string | null;
  aoFechar: () => void;
  aoSalvar: (nome: string) => void;
}

export function ModalCategoria({
  categoria,
  salvando,
  erro,
  aoFechar,
  aoSalvar,
}: PropriedadesModalCategoria): JSX.Element {
  const [nome, definirNome] = useState(categoria?.nome ?? "");

  function enviar(evento: FormEvent): void {
    evento.preventDefault();
    aoSalvar(nome.trim());
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-tinta/50 p-4" role="dialog" aria-modal="true" aria-label={categoria ? "Renomear categoria" : "Nova categoria"}>
      <form onSubmit={enviar} className="flex w-full max-w-sm flex-col gap-3 rounded-3xl bg-white p-6 text-tinta shadow-Cartao">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">
            {categoria ? "Renomear categoria" : "Nova categoria"}
          </h3>
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="grid h-10 w-10 place-items-center rounded-xl border border-borda">
            <X size={18} />
          </button>
        </div>
        <Entrada
          id="cat-nome"
          rotulo="Nome"
          value={nome}
          onChange={(evento) => definirNome(evento.target.value)}
          placeholder="Ex: Doces, Bolos, Salgados…"
          autoFocus
        />
        {erro ? (
          <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{erro}</p>
        ) : null}
        <Botao type="submit" disabled={salvando}>
          <Save size={17} /> {salvando ? "Salvando…" : "Salvar"}
        </Botao>
      </form>
    </div>
  );
}
