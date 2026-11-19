/**
 * Accord photos et vidéos : distinct de la décharge et facultatif. Un
 * consentement glissé dans la case obligatoire ne serait pas libre, donc
 * pas valable. Décochée par défaut, et on peut s'inscrire sans.
 */
export function CaseImage({ pas, defaultChecked = false }: { pas: number; defaultChecked?: boolean }) {
  return (
    <label
      className="flex cursor-pointer gap-3 border-2 border-white/15 bg-[#141116] p-4 text-sm font-bold leading-tight text-white transition-colors duration-300 has-[:checked]:bg-[#E8459E]/12"
      style={{ "--pas": pas } as React.CSSProperties}
    >
      <input className="mt-0.5 h-6 w-6 shrink-0 accent-[#E8459E]" defaultChecked={defaultChecked} name="image" type="checkbox" />
      <span>
        Facultatif. J’accepte d’être pris·e en photo ou filmé·e pendant les sorties, et que Nulll Club publie ces images
        sur son site et ses réseaux. Je peux changer d’avis à tout moment depuis mon profil.
      </span>
    </label>
  );
}
