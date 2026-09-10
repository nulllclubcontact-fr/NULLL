import { supprimerCourse } from "../../courses-actions";

/** Suppression en deux temps : le bouton ouvre la confirmation, sans JavaScript. */
export function SuppressionCourse({ id, titre, inscrits }: { id: string; titre: string; inscrits: number }) {
  return (
    <details className="relative">
      <summary className="nav-link cursor-pointer">Supprimer</summary>
      <form
        action={supprimerCourse}
        className="absolute right-0 z-20 mt-2 grid w-72 max-w-[calc(100vw-2rem)] gap-3 border-2 border-[#773331] bg-[#F1EDE9] p-4 shadow-[6px_6px_0_#EBA0CD]"
      >
        <input name="race_id" type="hidden" value={id} />
        <p className="text-sm font-bold">
          Supprimer « {titre} » ?{" "}
          {inscrits > 0
            ? `Ses ${inscrits} inscription${inscrits > 1 ? "s" : ""} et leurs QR partent avec, pour de bon.`
            : "Personne n’y est inscrit."}
        </p>
        <button
          className="inline-flex min-h-11 items-center justify-center border-2 border-[#773331] bg-[#773331] px-3 font-mono text-xs font-black uppercase tracking-[.1em] text-[#F1EDE9] transition hover:bg-[#FFB200] hover:text-[#773331]"
          type="submit"
        >
          Oui, supprimer
        </button>
      </form>
    </details>
  );
}
