// Balãozinho de confirmação ("Adicionado à sacola 🧁"). Some sozinho após
// ~2,4s (temporizador controlado pelo App) — aqui é só apresentação.
interface PropriedadesAvisoFlutuante {
  texto: string;
}

export function AvisoFlutuante({ texto }: PropriedadesAvisoFlutuante): JSX.Element {
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 animate-[subir_0.3s_ease] rounded-full bg-tinta px-6 py-3 text-sm font-semibold text-creme shadow-Cartao"
    >
      {texto}
    </div>
  );
}
