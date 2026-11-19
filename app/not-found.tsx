import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "../components/ArrowIcon";
import { SiteFooter, SiteHeader } from "../components/site-shell";
import { getRoute, getSiteCopy } from "../lib/site-content";

export const metadata: Metadata = {
  title: "Page introuvable | Nulll Club",
  robots: { index: false, follow: true }
};

/** La 404 de Next affichait « This page could not be found. », en anglais et sans issue. */
export default function NotFound() {
  const copy = getSiteCopy("fr");

  return (
    <div className="da min-h-dvh bg-[#141116] text-white">
      <SiteHeader copy={copy} current="home" locale="fr" pathname="/404" />

      <main className="mx-auto max-w-[900px] px-5 py-20 sm:px-8 sm:py-28" id="contenu" tabIndex={-1}>
        <p className="font-mono text-xs font-black uppercase tracking-[.16em]">Erreur 404</p>
        <h1 className="da-stack mt-5">
          <span className="st st-cream">On a perdu cette page</span>
          <span className="st st-pink st-xl">Pas le rendez-vous</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed">
          Le lien est peut-être ancien, ou mal recopié. Les sorties, elles, sont toujours au même endroit.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            className="inline-flex min-h-14 items-center justify-between gap-6 border-2 border-white/15 bg-[#1E1A21] px-6 font-mono text-xs font-black uppercase tracking-[.12em] text-white transition-colors hover:bg-[#FFC531] hover:text-[#141116] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]"
            href={getRoute("fr", "runs")}
          >
            <span>Voir les sorties</span>
            <ArrowIcon />
          </Link>
          <Link
            className="inline-flex min-h-14 items-center justify-between gap-6 border-2 border-white/15 px-6 font-mono text-xs font-black uppercase tracking-[.12em] transition-colors hover:bg-[#1E1A21] hover:text-white focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]"
            href={getRoute("fr", "home")}
          >
            <span>Retour à l’accueil</span>
            <ArrowIcon />
          </Link>
        </div>
      </main>

      <SiteFooter copy={copy} locale="fr" />
    </div>
  );
}
