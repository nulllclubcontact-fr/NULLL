/**
 * Fleches « tracees au doigt », comme celles des stories du club.
 * Purement decoratives : le lien qu'elles designent porte deja le texte.
 */
const TRACES = {
  // Une boucle puis une descente, la fleche des stories « Juste ici ».
  boucle: {
    viewBox: "0 0 160 150",
    corps: "M12 20 C 60 4, 112 18, 98 52 C 88 76, 52 70, 60 48 C 68 28, 112 34, 128 70 C 138 94, 136 116, 130 134",
    pointe: "M112 118 L 130 136 L 146 114"
  },
  // Une vague horizontale qui file vers la droite.
  vague: {
    viewBox: "0 0 220 90",
    corps: "M6 60 C 40 20, 70 86, 108 50 C 140 20, 166 34, 206 46",
    pointe: "M184 26 L 208 46 L 182 64"
  }
} as const;

export function FlecheMain({ variante, className }: { variante: keyof typeof TRACES; className?: string }) {
  const trace = TRACES[variante];
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox={trace.viewBox} xmlns="http://www.w3.org/2000/svg">
      <path d={trace.corps} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
      <path d={trace.pointe} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
    </svg>
  );
}
