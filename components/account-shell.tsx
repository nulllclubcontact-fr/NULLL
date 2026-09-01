import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./ArrowIcon";
import { SiteHeader } from "./site-shell";
import { getSiteCopy } from "../lib/site-content";

type AccountShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  image?: string;
  imageAlt?: string;
  /** Trois raisons concretes de creer un compte. */
  benefits?: Array<{ label: string; text: string }>;
};

const BENEFITS_PAR_DEFAUT = [
  { label: "Ton QR", text: "Il te suit d’une sortie à l’autre. Un scan, et ta présence est comptée." },
  { label: "Tes points", text: "Chaque run en rapporte. Ils ne dorment pas et ne se perdent pas." },
  { label: "Les partenaires", text: "Des avantages chez les commerçants d’Aix qui jouent le jeu avec nous." }
];

export function AccountShell({
  eyebrow,
  title,
  intro,
  children,
  image = "/assets/photos/coucher-soleil-calanques.webp",
  imageAlt = "Coucher de soleil sur la mer depuis les hauteurs, après une sortie NULLL.CLUB",
  benefits = BENEFITS_PAR_DEFAUT
}: AccountShellProps) {
  return (
    <main className="min-h-dvh bg-[#f6eadf] text-[#351815]">
      <AccountHeader />

      {/* La photo occupait un bandeau court au-dessus du formulaire, ce qui
          recadrait les portraits verticaux sur un sourcil. Elle prend
          desormais toute la hauteur de sa colonne, et porte le titre. */}
      <section className="grid border-b-2 border-[#351815] lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
        <div className="relative isolate flex min-h-[62svh] flex-col justify-end overflow-hidden bg-[#120908] text-[#f6eadf] lg:min-h-[calc(100dvh-5rem)]">
          <Image alt={imageAlt} className="object-cover object-[50%_45%]" fill priority sizes="(min-width: 1024px) 55vw, 100vw" src={image} />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,9,8,.94)_0%,rgba(18,9,8,.66)_42%,rgba(18,9,8,.24)_78%,rgba(18,9,8,.5)_100%)]" />

          <div className="relative px-5 pb-10 pt-16 sm:px-8 sm:pb-14 xl:px-12">
            <p className="hero-rise font-mono text-xs font-black uppercase tracking-[.18em] text-[#ffb000]" style={{ animationDelay: "60ms" }}>
              {eyebrow}
            </p>
            <h1 className="hero-rise hero-text-shadow mt-5 max-w-[14ch] font-display text-[clamp(2.6rem,6vw,5.4rem)] uppercase leading-[.9]" style={{ animationDelay: "150ms" }}>
              {title}
            </h1>
            <p className="hero-rise hero-text-shadow mt-5 max-w-lg text-lg font-bold leading-snug" style={{ animationDelay: "250ms" }}>
              {intro}
            </p>

            {/* Trois raisons concretes remplacent l'ancienne bande rose, qui
                alignait trois libelles sans rien expliquer. */}
            <ul className="hero-rise mt-9 grid gap-px border-2 border-[#f6eadf]/30 bg-[#f6eadf]/30 sm:grid-cols-3" style={{ animationDelay: "340ms" }}>
              {benefits.map((b, i) => (
                <li className="bg-[#120908]/85 px-4 py-4" key={b.label}>
                  <span className="block font-mono text-[.6rem] font-black uppercase tracking-[.2em] text-[#ffb000]">0{i + 1}</span>
                  <span className="mt-2 block font-display text-lg uppercase leading-none">{b.label}</span>
                  <span className="mt-2 block text-sm leading-snug text-[#f6eadf]/72">{b.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5 bg-[#351815] px-5 py-10 text-[#f6eadf] sm:px-8 sm:py-14 xl:px-12">
          <div className="mx-auto w-full max-w-xl">{children}</div>
        </div>
      </section>
    </main>
  );
}

export function AccountHeader() {
  return <SiteHeader copy={getSiteCopy("fr")} current="identification" locale="fr" pathname="/identification" />;
}

export function AccountLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return (
    <Link
      className={`group inline-flex min-h-14 items-center justify-between gap-4 border-2 border-[#351815] px-4 py-3 font-mono text-sm font-black uppercase transition hover:-translate-y-1 ${
        secondary ? "bg-[#f6eadf] text-[#351815] hover:bg-[#351815] hover:text-[#f6eadf]" : "bg-[#351815] text-[#f6eadf] hover:bg-[#ffb000] hover:text-[#351815]"
      }`}
      href={href}
    >
      <span>{children}</span>
      <ArrowIcon />
    </Link>
  );
}
