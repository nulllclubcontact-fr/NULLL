import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "../components/ArrowIcon";
import { SiteFooter, SiteHeader } from "../components/site-shell";
import { getRoute, getSiteCopy } from "../lib/site-content";

export const metadata: Metadata = {
  title: "Page introuvable | NULLL.CLUB",
  robots: { index: false, follow: true }
};

/** La 404 de Next affichait « This page could not be found. », en anglais et sans issue. */
export default function NotFound() {
  const copy = getSiteCopy("fr");

  return (
    <div className="min-h-dvh bg-[#F1EDE9] text-[#773331]">
      <SiteHeader copy={copy} current="home" locale="fr" pathname="/404" />

      <main className="mx-auto max-w-[900px] px-5 py-20 sm:px-8 sm:py-28" id="contenu" tabIndex={-1}>
        <p className="font-mono text-xs font-black uppercase tracking-[.16em]">Erreur 404</p>
        <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,5rem)] uppercase leading-[1.04]">
          On a perdu cette page.
          <br />
          <span className="bg-[#FFB200] px-[.12em] [box-decoration-break:clone]">Pas le rendez-vous.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed">
          Le lien est peut-être ancien, ou mal recopié. Les sorties, elles, sont toujours au même endroit.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            className="inline-flex min-h-14 items-center justify-between gap-6 border-2 border-[#773331] bg-[#773331] px-6 font-mono text-xs font-black uppercase tracking-[.12em] text-[#F1EDE9] transition-colors hover:bg-[#FFB200] hover:text-[#773331] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#773331]"
            href={getRoute("fr", "runs")}
          >
            <span>Voir les sorties</span>
            <ArrowIcon />
          </Link>
          <Link
            className="inline-flex min-h-14 items-center justify-between gap-6 border-2 border-[#773331] px-6 font-mono text-xs font-black uppercase tracking-[.12em] transition-colors hover:bg-[#773331] hover:text-[#F1EDE9] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#773331]"
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
