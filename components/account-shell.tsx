import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./ArrowIcon";
import { SiteHeader } from "./site-shell";
import { getSiteCopy } from "../lib/site-content";

type AccountShellProps = {
  eyebrow: string;
  title: string;
  /** Fin du titre, mise en couleur sur sa propre ligne — comme le reste du site. */
  titleAccent?: string;
  intro: string;
  children: ReactNode;
  image?: string;
  imageAlt?: string;
  /** Cadrage vertical de la photo. Monter la valeur remonte l’image. */
  imagePosition?: string;
  /** Trois raisons concretes de creer un compte. */
  benefits?: Array<{ label: string; text: string }>;
  /** Fil des etapes au-dessus du formulaire. La premiere est l'etape en cours. */
  steps?: string[];
  /** Ce qui suit le formulaire : lien vers l'autre porte d'entree. */
  footerLink?: { label: string; href: string; cta: string };
  /** Texte du bandeau defilant de bas de page. */
  ticker?: string;
};

const BENEFITS_PAR_DEFAUT = [
  { label: "Ton QR", text: "Il te suit d’une sortie à l’autre. Un scan, et ta présence est comptée." },
  { label: "Tes points", text: "Chaque run en rapporte. Ils ne dorment pas et ne se perdent pas." },
  { label: "Les partenaires", text: "Des avantages chez les commerçants d’Aix qui jouent le jeu avec nous." }
];

const TICKER_PAR_DEFAUT = "Samedi 8h30 — Aix-en-Provence — Gratuit — Tous les niveaux";

export function AccountShell({
  eyebrow,
  title,
  intro,
  children,
  image = "/assets/photos/coucher-soleil-calanques.webp",
  titleAccent,
  imageAlt = "Coucher de soleil sur la mer depuis les hauteurs, après une sortie NULLL.CLUB",
  imagePosition = "50% 45%",
  benefits = BENEFITS_PAR_DEFAUT,
  steps,
  footerLink,
  ticker = TICKER_PAR_DEFAUT
}: AccountShellProps) {
  return (
    <main className="flex min-h-dvh flex-col bg-[#f6eadf] text-[#351815]">
      <AccountHeader />

      {/* La photo occupait un bandeau court au-dessus du formulaire, ce qui
          recadrait les portraits verticaux sur un sourcil. Elle prend
          desormais toute la hauteur de sa colonne, et porte le titre. */}
      <section className="grid flex-1 border-b-2 border-[#351815] lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.92fr)]">
        <div className="relative isolate flex min-h-[62svh] flex-col justify-end overflow-hidden bg-[#120908] text-[#f6eadf] lg:min-h-[calc(100dvh-8.6rem)]">
          <Image
            alt={imageAlt}
            className="hero-photo object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            src={image}
            style={{ objectPosition: imagePosition }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,9,8,.94)_0%,rgba(18,9,8,.66)_42%,rgba(18,9,8,.24)_78%,rgba(18,9,8,.5)_100%)]" />

          <div className="relative px-5 pb-10 pt-16 sm:px-8 sm:pb-14 lg:pb-10 lg:pt-10 xl:px-12">
            <p
              className="hero-rise font-mono text-xs font-black uppercase tracking-[.18em] text-[#ffb000]"
              style={{ animationDelay: "60ms" }}
            >
              {eyebrow}
            </p>
            <h1
              className="hero-rise hero-text-shadow mt-5 max-w-[14ch] font-display text-[clamp(2.6rem,6vw,5.4rem)] uppercase leading-[.9]"
              style={{ animationDelay: "150ms" }}
            >
              <span className="block">{title}</span>
              {titleAccent ? <span className="block text-[#b03583]">{titleAccent}</span> : null}
            </h1>
            <p
              className="hero-rise hero-text-shadow mt-5 max-w-lg text-lg font-bold leading-snug"
              style={{ animationDelay: "250ms" }}
            >
              {intro}
            </p>

            {/* Trois raisons concretes remplacent l'ancienne bande rose, qui
                alignait trois libelles sans rien expliquer. Chacune arrive a
                son tour et repond au survol. */}
            <ul className="mt-9 grid gap-px border-2 border-[#f6eadf]/30 bg-[#f6eadf]/30 sm:grid-cols-3 lg:mt-7">
              {benefits.map((b, i) => (
                <li
                  className="account-benefit hero-rise bg-[#120908]/85 px-4 py-5 lg:py-4"
                  key={b.label}
                  style={{ animationDelay: `${360 + i * 90}ms` }}
                >
                  <span className="account-benefit__num block font-display text-3xl leading-none text-[#ffb000]">
                    0{i + 1}
                  </span>
                  <span className="mt-3 block font-display text-lg uppercase leading-none">{b.label}</span>
                  <span className="mt-2 block text-sm leading-snug text-[#f6eadf]/72">{b.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-[#351815] px-5 py-10 text-[#f6eadf] sm:px-8 sm:py-14 lg:py-8 xl:px-12">
          <div className="mx-auto w-full max-w-xl">
            {/* Le fil des etapes remplit le haut de la colonne, qui etait
                vide, et dit ce qui attend le visiteur apres le formulaire. */}
            {steps ? (
              <ol
                className="hero-rise flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[#f6eadf]/25 pb-5 font-mono text-[.62rem] font-black uppercase tracking-[.18em]"
                style={{ animationDelay: "120ms" }}
              >
                {steps.map((step, i) => (
                  <li
                    className={`account-step flex items-center gap-2.5 ${i === 0 ? "is-active text-[#f6eadf]" : "text-[#f6eadf]/45"}`}
                    key={step}
                  >
                    <span aria-hidden="true" className="account-step__dot" />
                    <span>
                      0{i + 1} <span className="ml-1">{step}</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}

            <div className={steps ? "mt-6" : ""}>{children}</div>

            {footerLink ? (
              <p
                className="hero-rise mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-black uppercase tracking-[.14em] text-[#f6eadf]/60"
                style={{ animationDelay: "620ms" }}
              >
                {footerLink.label}
                <Link
                  className="group inline-flex items-center gap-2 text-[#ffb000] underline decoration-[#ffb000]/40 decoration-2 underline-offset-4 transition hover:decoration-[#ffb000]"
                  href={footerLink.href}
                >
                  {footerLink.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Le bandeau defilant du reste du site : la page de compte en etait
          la seule privee, et c'est ce qui la faisait sonner etrangere. */}
      <div
        aria-label={ticker}
        className="marquee shrink-0 bg-[#ffb000] py-4 text-[#351815] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#d96ab4]"
        role="region"
        tabIndex={0}
      >
        <div aria-hidden="true" className="marquee-track font-mono text-xs font-black uppercase tracking-[.16em] sm:text-sm">
          <p className="shrink-0 whitespace-nowrap px-6">{ticker}&nbsp;&nbsp;—&nbsp;&nbsp;</p>
          <p className="shrink-0 whitespace-nowrap px-6">{ticker}&nbsp;&nbsp;—&nbsp;&nbsp;</p>
        </div>
      </div>
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
