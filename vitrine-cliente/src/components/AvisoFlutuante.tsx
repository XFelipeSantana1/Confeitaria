// Balão de confirmação ("Adicionado à sacola").
//
// Duas decisões que vieram de bug:
//
// 1. Sai de baixo, não de cima. A área de cima da vitrine é a foto do hero e
//    o cabeçalho fixo; o balão competia com os dois e some na hora. Embaixo
//    fica sobre o creme, longe de tudo, e o polegar do cliente fica perto.
// 2. Tem barra de acento na cor da marca. O fundo escuro sozinho (tinta) é
//    uma mancha genérica; a barra de caramelo diz "isto é do Doce & Carinho" e
//    dá um ponto de atenção que o olho acha em menos de um segundo.
//
// Some sozinho (temporizador no hook useAviso) — aqui é só apresentação.
interface PropriedadesAvisoFlutuante {
  texto: string;
}

export function AvisoFlutuante({ texto }: PropriedadesAvisoFlutuante): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-5 z-[80] flex justify-center sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
    >
      <p className="flex max-w-md items-center gap-3 overflow-hidden rounded-2xl bg-tinta pr-5 text-sm font-semibold text-creme shadow-[0_20px_40px_-18px_rgba(43,30,23,0.55)]">
        {/* Barra de acento: a "fita" é um pseudo-elemento, não uma span, para
            não entrar na árvore de acessibilidade do leitor de tela. */}
        <span aria-hidden="true" className="h-full w-1.5 flex-none self-stretch bg-caramelo" />
        <span className="py-3.5 leading-snug motion-safe:animate-[surgir_0.35s_ease-out]">
          {texto}
        </span>
      </p>
    </div>
  );
}
