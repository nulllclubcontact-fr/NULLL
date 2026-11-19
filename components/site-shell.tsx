import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./ArrowIcon";
import { LienCompte } from "./lien-compte";
import { PosterPhoto } from "./PosterPhoto";
import { FermetureMenu } from "./fermeture-menu";
import { SuiviDefilement } from "./suivi-defilement";
import { DEPART } from "../lib/rendez-vous";
import { getRoute, getSiteCopy, type Locale, type RouteKey, type RunEvent } from "../lib/site-content";

type ShellCopy = ReturnType<typeof getSiteCopy>;
type HeaderCurrent = RouteKey | "identification" | "confidentialite";

export function SiteShell({
  locale,
  current,
  pathname,
  children
}: {
  locale: Locale;
  current: RouteKey;
  pathname: string;
  children: ReactNode;
}) {
  const copy = getSiteCopy(locale) as ShellCopy;

  return (
    <div className="da min-h-dvh bg-[#141116] text-white">
      <SiteHeader copy={copy} current={current} locale={locale} pathname={pathname} />
      <main id="contenu" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter copy={copy} locale={locale} />
    </div>
  );
}

export function SiteHeader({
  copy,
  current,
  locale,
  pathname,
  compte
}: {
  copy: ShellCopy;
  current: HeaderCurrent;
  locale: Locale;
  pathname: string;
  /**
   * Porte d'entree du compte. Une fois connecte l'espace membre passe
   * « Mon compte », ce qui evite de proposer de s'identifier a quelqu'un
   * qui l'est deja — et surtout permet a l'espace membre de garder la
   * vraie barre du site au lieu d'un bandeau a lui.
   */
  compte?: { label: string; href: string };
}) {
  // Le libelle suit la session, mais c'est LienCompte qui s'en charge :
  // le lire ici rendrait les trente-deux pages dynamiques. L'en-tete
  // reste donc rendu sur le serveur, seul ce lien s'hydrate.
  const isIdentification = current === "identification" || pathname === "/identification";

  const lien = "site-header-link rounded-[2px] font-mono font-bold uppercase tracking-[.08em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC531]";
  const actif = "bg-[#E8459E] text-white";
  const repos = "text-white/75 hover:bg-white/10 hover:text-white";

  return (
    <>
    {/* La barre est fixe : cette cale lui reserve sa place dans la page. */}
    <div aria-hidden="true" className="site-header-place" />
    <header className="site-header z-50 text-white">
      <SuiviDefilement />
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[60] focus:rounded-[2px] focus:bg-[#FFC531] focus:px-4 focus:py-3 focus:font-mono focus:text-xs focus:font-black focus:uppercase focus:text-[#141116]"
        href="#contenu"
      >
        Aller au contenu
      </a>
      <div className="site-header-bar mx-auto flex items-center gap-3 px-4 sm:px-6 lg:gap-6 lg:px-8">
        <Link className="flex shrink-0 items-center rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]" href={getRoute(locale, "home")}>
          <Image alt="Nulll Club" className="site-header-logo h-auto" height={313} priority sizes="(min-width: 1280px) 144px, (min-width: 640px) 128px, 112px" src="/assets/nulll-new/logo-cream.png" width={2449} />
        </Link>
        <nav aria-label="Navigation principale" className="mx-auto hidden items-center gap-1 lg:flex">
          {copy.nav.map((item: { key: RouteKey; label: string; ancre?: string }) => (
            <Link
              aria-current={item.key === current && !item.ancre ? "page" : undefined}
              className={`${lien} ${item.key === current && !item.ancre ? actif : repos}`}
              href={`${getRoute(locale, item.key)}${item.ancre ? `#${item.ancre}` : ""}`}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <LienCompte actif={isIdentification} className={`hidden lg:inline-flex ${lien} ${isIdentification ? actif : repos}`} fige={compte} />
          <details className="static lg:hidden">
            <summary className="site-header-link flex cursor-pointer items-center rounded-[2px] border border-white/25 font-mono font-bold uppercase tracking-[.08em] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC531]">Menu</summary>
            <FermetureMenu />
            <nav aria-label="Navigation mobile" className="absolute inset-x-0 top-full z-50 grid max-h-[calc(100dvh-60px)] gap-1 overflow-y-auto border-b border-white/10 bg-[#141116] px-4 py-3">
              {copy.nav.map((item: { key: RouteKey; label: string; ancre?: string }) => (
                <Link aria-current={item.key === current && !item.ancre ? "page" : undefined} className={`flex min-h-12 items-center ${lien} ${item.key === current && !item.ancre ? actif : repos}`} href={`${getRoute(locale, item.key)}${item.ancre ? `#${item.ancre}` : ""}`} key={item.label}>
                  {item.label}
                </Link>
              ))}
              <LienCompte actif={isIdentification} className={`flex min-h-12 items-center ${lien} ${isIdentification ? actif : repos}`} fige={compte} />
            </nav>
          </details>
          <Link className="site-header-cta inline-flex items-center rounded-[2px] bg-[#FFC531] font-display uppercase leading-none text-[#141116] transition-colors hover:bg-[#E8459E] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href={getRoute(locale, "runs")}>
            <span className="sm:hidden">Courir</span><span className="hidden sm:inline">Prochaine sortie</span>
          </Link>
        </div>
      </div>
    </header>
    </>
  );
}

export function SiteFooter({ copy, locale }: { copy: ShellCopy; locale: Locale }) {
  const legal = "inline-flex min-h-11 items-center transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]";
  return (
    <footer className="overflow-hidden bg-[#141116] text-white">
      <div className="mx-auto max-w-[1500px] px-5 pt-12 sm:px-8 sm:pt-14 xl:px-12">
        <div className="grid gap-x-10 gap-y-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="max-w-sm text-[1.05rem] leading-relaxed text-white/70">
              Social sport club à Aix-en-Provence. Courir ensemble, couper la semaine, et revenir avec autre chose qu’un chrono.
            </p>
            <p className="mt-5 inline-block -rotate-1 rounded-[2px] bg-[#FFC531] px-3 pb-1 pt-1.5 font-display text-lg uppercase leading-none text-[#141116]">Ouvert à tous · Gratuit</p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            <FooterColumn
              links={[
                { href: getRoute(locale, "runs"), label: "Sorties" },
                { href: getRoute(locale, "community"), label: "Le club" },
                { href: getRoute(locale, "news"), label: "Actu" },
                { href: getRoute(locale, "merch"), label: "Merch" },
                { href: getRoute(locale, "contact"), label: "Contact" },
                { href: getRoute(locale, "partners"), label: "Devenir partenaire" }
              ]}
              title="Navigation"
            />

            <FooterColumn
              links={[
                { href: copy.contact.instagram, label: "Instagram" },
                { href: copy.contact.strava, label: "Strava" },
                { href: copy.contact.linkedin, label: "LinkedIn" },
                { href: `mailto:${copy.contact.email}`, label: copy.contact.email },
                { href: `tel:${copy.contact.phone}`, label: copy.contact.phoneLabel },
                { href: getRoute(locale, "guides"), label: "Guides d’Aix" }
              ]}
              title="Nous suivre"
            />

            <div className="col-span-2 sm:col-span-1">
              <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-white/45">Le rendez-vous</p>
              <ul className="mt-3 space-y-0.5 text-[.95rem] leading-snug text-white/80">
                <li className="py-0.5">Un samedi sur deux</li>
                <li className="py-0.5">Rendez-vous <strong className="font-bold text-[#FFC531]">9h30</strong>, départ <strong className="font-bold text-[#FFC531]">10h</strong></li>
                <li className="py-0.5">{DEPART.nom}</li>
                <li className="py-0.5">Gratuit, sur inscription</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Le logo du club en tres grand, sur toute la largeur. */}
      <div aria-hidden="true" className="pointer-events-none mx-auto mt-12 max-w-[1500px] select-none px-5 sm:px-8 xl:px-12">
        <Image alt="" className="h-auto w-full brightness-0 invert" height={313} sizes="(min-width: 1500px) 1400px, 92vw" src="/assets/nulll-new/logo-cream.png" width={2449} />
      </div>

      <div className="mx-auto max-w-[1500px] px-5 pb-6 sm:px-8 xl:px-12">
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-white/10 pt-4 font-mono text-xs uppercase tracking-[.12em] text-white/55 sm:justify-between">
          <span>
            © 2026 Nulll Club · Fait avec <span aria-label="amour" className="text-[#E8459E]" role="img">♥</span> par{" "}
            <a className="underline decoration-1 underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]" href="https://oculot.studio" rel="noopener" target="_blank">
              oculot.studio
            </a>
          </span>
          <span className="flex flex-wrap gap-x-6">
            <Link className={legal} href="/confidentialite">Confidentialité</Link>
            <Link className={legal} href="/mentions-legales">Mentions légales</Link>
            <span className="inline-flex min-h-11 items-center">Aix-en-Provence, France</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-white/45">{title}</p>
      {/* Sur telephone, les liens se touchent : chacun garde 44 px de haut
          pour le doigt, sans l'espace en plus qui allongeait le pied. */}
      <ul className="mt-3 space-y-0.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="inline-flex min-h-11 items-center py-0.5 text-[.95rem] leading-snug text-white/80 transition-colors hover:text-[#E8459E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531] sm:min-h-0"
              href={link.href}
            >
              {/* L'adresse e-mail peut passer a la ligne apres l'arobase dans
                  une demi-colonne de 320 px. */}
              {link.label.includes("@") && !link.label.startsWith("@") ? (
                <span>
                  {link.label.slice(0, link.label.indexOf("@") + 1)}
                  <wbr />
                  {link.label.slice(link.label.indexOf("@") + 1)}
                </span>
              ) : (
                link.label
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeroPanel({
  stamp,
  label,
  title,
  intro,
  image,
  imageAlt,
  actions,
  facts
}: {
  stamp: string;
  label: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  actions: ReactNode;
  facts: Array<{ label: string; value: string }>;
}) {
  return (
    <section className="mx-auto grid w-full max-w-[1600px] gap-6 px-5 py-8 sm:px-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.68fr)] xl:px-12 xl:py-12">
      <div className="min-w-0 border-2 border-white/15 bg-[#141116] p-5 sm:p-6 xl:p-10">
        <p className="inline-flex border-2 border-white/15 bg-[#FFC531] px-3 py-2 font-mono text-xs font-black uppercase text-[#141116]">{stamp} / {label}</p>
        <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,7.5vw,7.4rem)] uppercase leading-[0.94] sm:mt-8">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg font-bold leading-tight text-white xl:text-xl">{intro}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">{actions}</div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {facts.map((fact) => (
            <div className="border-t-2 border-white/15 pt-4" key={fact.label}>
              <p className="font-mono text-xs font-black uppercase text-white">{fact.label}</p>
              <p className="mt-2 text-lg">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden border-2 border-white/15 bg-[#1E1A21] p-3">
        <PosterPhoto alt={imageAlt} className="min-h-[320px] sm:min-h-[460px] xl:min-h-[640px]" priority src={image} stamp="AIX" />
      </div>
    </section>
  );
}

export function SectionTitle({
  index,
  title,
  text,
  as = "h2"
}: {
  index: string;
  title: string;
  text?: string;
  as?: "h1" | "h2";
}) {
  const HeadingTag = as;
  return (
    <div className="space-y-4">
      <p className="inline-flex border-2 border-white/15 bg-[#FFC531] px-3 py-2 font-mono text-xs font-black uppercase text-[#141116]">{index} / Nulll Club</p>
      <HeadingTag className="max-w-4xl font-display text-[clamp(2.8rem,6.4vw,6rem)] uppercase leading-[0.94]">{title}</HeadingTag>
      {text ? <p className="max-w-2xl text-xl font-bold leading-tight text-white">{text}</p> : null}
    </div>
  );
}

export function PrimaryLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return (
    <Link
      className={`group inline-flex min-h-14 items-center justify-between gap-4 border-2 border-white/15 px-4 py-3 font-mono text-sm font-black uppercase transition hover:-translate-y-1 ${
        secondary ? "bg-[#141116] text-white hover:bg-[#1E1A21] hover:text-[#141116]" : "bg-[#1E1A21] text-white hover:bg-[#FFC531] hover:text-[#141116]"
      }`}
      href={href}
    >
      <span>{children}</span>
      <ArrowIcon />
    </Link>
  );
}

export function RunCard({ run }: { run: RunEvent }) {
  return (
    <article className="flex h-full flex-col border-2 border-white/15 bg-[#141116] p-5 transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4 border-b-2 border-white/15 pb-4">
        <div>
          <p className="font-mono text-xs font-black uppercase text-white">{run.date}</p>
          <h3 className="mt-2 font-display text-[clamp(2rem,4vw,3.6rem)] uppercase leading-[0.92]">{run.title}</h3>
        </div>
        <p className="border-2 border-white/15 bg-[#FFC531] px-2 py-1 text-right font-mono text-xs font-black uppercase text-[#141116]">{run.time}</p>
      </div>
      <div className="mt-5 grid gap-2 text-white">
        <p>
          <strong>Distance :</strong> {run.distance}
        </p>
        <p>
          <strong>Allure :</strong> {run.pace}
        </p>
        <p>
          <strong>Lieu :</strong> {run.location}
        </p>
        <p>
          <strong>Après la course :</strong> {run.afterRun}
        </p>
      </div>
      <p className="mt-5 text-white">{run.summary}</p>
    </article>
  );
}
