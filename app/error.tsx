"use client";

import Link from "next/link";

/**
 * Page d'erreur du site : une panne (base injoignable, bug) affichait
 * l'ecran technique de Next. Ici, en francais, avec une issue.
 */
export default function Erreur({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-dvh bg-[#F1EDE9] px-5 py-20 text-[#773331] sm:px-8 sm:py-28" id="contenu">
      <div className="mx-auto max-w-[900px]">
        <p className="font-mono text-xs font-black uppercase tracking-[.16em]">Erreur</p>
        <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,5rem)] uppercase leading-[1.04]">
          Quelque chose a lâché.
          <br />
          <span className="bg-[#FFB200] px-[.12em] [box-decoration-break:clone]">Pas le rendez-vous.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed">
          Un souci technique nous empêche d’afficher cette page. Réessaie dans un instant.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button
            className="inline-flex min-h-14 items-center justify-center border-2 border-[#773331] bg-[#773331] px-6 font-mono text-xs font-black uppercase tracking-[.12em] text-[#F1EDE9] transition-colors hover:bg-[#FFB200] hover:text-[#773331] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#773331]"
            onClick={reset}
            type="button"
          >
            Réessayer
          </button>
          <Link
            className="inline-flex min-h-14 items-center justify-center border-2 border-[#773331] px-6 font-mono text-xs font-black uppercase tracking-[.12em] transition-colors hover:bg-[#773331] hover:text-[#F1EDE9] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#773331]"
            href="/fr/runs"
          >
            Voir les sorties
          </Link>
        </div>
      </div>
    </main>
  );
}
