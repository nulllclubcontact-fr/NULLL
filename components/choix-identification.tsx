"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowIcon } from "./ArrowIcon";
import { suiteSortie } from "../lib/races/sortie-choisie";

/**
 * Les boutons de la page d'identification. La sortie choisie (?sortie=)
 * est lue dans le navigateur : la page elle-meme reste statique, donc
 * prechargee, et s'affiche des le clic sur « Se connecter ».
 */
export function ChoixIdentificationAvecSortie() {
  const suite = suiteSortie(useSearchParams().get("sortie"));
  return <ChoixIdentification suite={suite} />;
}

export function ChoixIdentification({ suite }: { suite: string }) {
  return (
    <>
      {/* Une phrase, pas trois blocs : le visiteur doit savoir a quoi
          sert un compte sans avoir a lire la page. */}
      <p className="hero-rise mt-7 max-w-lg text-lg leading-relaxed text-white sm:text-xl" style={{ animationDelay: "220ms" }}>
        {suite
          ? "Ta sortie est notée. Crée ton compte ou connecte-toi pour confirmer ta place et retrouver ton QR."
          : "Crée ton compte pour choisir une sortie et retrouver son QR."}
      </p>

      <div className="hero-rise mt-10 flex max-w-xl flex-col gap-4" style={{ animationDelay: "300ms" }}>
        <Link
          className="inline-flex min-h-[5.5rem] items-center justify-between gap-8 border-2 border-[#FFC531] bg-[#FFC531] px-7 font-mono text-base font-black uppercase tracking-[.06em] text-[#141116] transition-colors [word-spacing:.12em] hover:bg-transparent hover:text-[#FFC531] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#FFFFFF] sm:text-xl"
          href={`/membre/register${suite}`}
        >
          <span>Créer mon compte</span>
          <ArrowIcon />
        </Link>
        <Link
          className="inline-flex min-h-[5.5rem] items-center justify-between gap-8 border-2 border-white/80 px-7 font-mono text-base font-black uppercase tracking-[.06em] transition-colors [word-spacing:.12em] hover:border-white/15 hover:bg-[#141116] hover:text-white focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531] sm:text-xl"
          href={`/membre/login${suite}`}
        >
          <span>Se connecter</span>
          <ArrowIcon />
        </Link>
      </div>

      <p className="hero-rise mt-8 text-sm leading-relaxed text-white" style={{ animationDelay: "380ms" }}>
        {suite ? (
          <>
            Déjà connecté ?{" "}
            <Link className="font-bold underline decoration-2 underline-offset-4 transition-colors hover:text-[#FFC531]" href={`/membre${suite}`}>
              Aller à mon espace
            </Link>
            {" · "}
          </>
        ) : null}
        {/* Troisieme chemin, rare : un lien suffit, il ne doit pas peser
            autant que les deux boutons. */}
        Commerçant partenaire ?{" "}
        <Link
          className="font-bold underline decoration-2 underline-offset-4 transition-colors hover:text-[#FFC531] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]"
          href="/pro/login"
        >
          Espace pro
        </Link>
      </p>
    </>
  );
}
