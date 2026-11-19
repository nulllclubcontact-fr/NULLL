import { supprimerCourse } from "../../courses-actions";

/** Suppression en deux temps : le bouton ouvre la confirmation, sans JavaScript. */
export function SuppressionCourse({ id, titre, inscrits }: { id: string; titre: string; inscrits: number }) {
  return (
    <details className="relative">
      <summary className="nav-link cursor-pointer">Supprimer</summary>
      <form
        action={supprimerCourse}
        className="absolute right-0 z-20 mt-2 grid w-72 max-w-[calc(100vw-2rem)] gap-3 border-2 border-white/15 bg-[#141116] p-4"
      >
        <input name="race_id" type="hidden" value={id} />
        <p className="text-sm font-bold">
          Supprimer « {titre} » ?{" "}
          {inscrits > 0
            ? `Elle a ${inscrits} inscription${inscrits > 1 ? "s" : ""} : elle sera annulée, pas effacée, pour garder leur historique.`
            : "Personne n’y est inscrit."}
        </p>
        <button
          className="inline-flex min-h-11 items-center justify-center border-2 border-white/15 bg-[#1E1A21] px-3 font-mono text-xs font-black uppercase tracking-[.1em] text-white transition hover:bg-[#FFC531] hover:text-[#141116]"
          type="submit"
        >
          Oui, supprimer
        </button>
      </form>
    </details>
  );
}
