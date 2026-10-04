// Letreiro corrido entre hero e cardápio: frases da casa em terracota sobre
// cacau. É identidade em movimento — barato (uma keyframe) e com pausa para
// quem prefere sem animação (motion-safe).
const FRASES = [
  "feito à mão",
  "receitas de família",
  "ingredientes selecionados",
  "encomendas pelo WhatsApp",
];

export function FaixaRolante(): JSX.Element {
  return (
    <div className="overflow-hidden border-y border-carameloForte/30 bg-tinta py-3" aria-hidden="true">
      <div className="flex w-max motion-safe:animate-[letreiro_26s_linear_infinite]">
        {[0, 1].map((metade) => (
          <div key={metade} className="flex flex-none items-center">
            {FRASES.map((frase) => (
              <span
                key={`${metade}-${frase}`}
                className="flex items-center font-display text-sm font-bold uppercase tracking-[0.2em] text-amber-100"
              >
                <span className="px-5">{frase}</span>
                <span className="text-dourado">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
