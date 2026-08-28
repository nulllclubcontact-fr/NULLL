import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./ArrowIcon";
import { PosterPhoto } from "./PosterPhoto";
import { getRoute, getSiteCopy, type Locale, type RouteKey, type RunEvent } from "../lib/site-content";

type ShellCopy = ReturnType<typeof getSiteCopy>;
type HeaderCurrent = RouteKey | "identification";

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
    <div className="min-h-dvh bg-[#f6eadf] text-[#351815]">
      <SiteHeader copy={copy} current={current} locale={locale} pathname={pathname} />
      {children}
      <SiteFooter copy={copy} locale={locale} />
    </div>
  );
}

export function SiteHeader({
  copy,
  current,
  locale,
  pathname
}: {
  copy: ShellCopy;
  current: HeaderCurrent;
  locale: Locale;
  pathname: string;
}) {
  const isIdentification = current === "identification" || pathname === "/identification";

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#351815] bg-[#f6eadf]">
      <div className="mx-auto grid min-h-20 w-full max-w-none grid-cols-[minmax(0,1fr)_auto_auto] items-stretch lg:grid-cols-[200px_minmax(0,1fr)_132px_172px] xl:grid-cols-[240px_minmax(0,1fr)_150px_190px] 2xl:grid-cols-[280px_minmax(0,1fr)_170px_220px]">
        <Link className="flex min-w-0 items-center border-r-2 border-[#351815] px-3 transition hover:bg-[#ffb000] focus-visible:bg-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#351815] sm:px-5" href={getRoute(locale, "home")}>
          <Image alt="NULLL.CLUB" className="h-auto w-28 max-w-full sm:w-40 lg:w-32 xl:w-40 2xl:w-44" height={157} priority src="/assets/nulll-new/logo-burgundy.png" width={1225} />
        </Link>
        <nav
          aria-label="Navigation principale"
          className="hidden min-w-0 font-mono text-xs font-black uppercase lg:grid"
          // Le nombre de colonnes suit le nombre d'entrees : il etait fige a 6
          // et laissait une colonne vide depuis la fusion des pages.
          style={{ gridTemplateColumns: `repeat(${copy.nav.length}, minmax(0, 1fr))` }}
        >
          {copy.nav.map((item: { key: RouteKey; label: string }) => (
            <Link
              aria-current={item.key === current ? "page" : undefined}
              className={`grid place-items-center border-r-2 border-[#351815] px-2 text-center transition hover:bg-[#d96ab4] focus-visible:bg-[#d96ab4] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#351815] ${
                item.key === current ? "bg-[#d96ab4]" : ""
              }`}
              href={getRoute(locale, item.key)}
              key={item.key}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          aria-current={isIdentification ? "page" : undefined}
          className={`hidden place-items-center border-r-2 border-[#351815] px-3 text-center font-mono text-xs font-black uppercase transition hover:bg-[#d96ab4] focus-visible:bg-[#d96ab4] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#351815] lg:grid ${
            isIdentification ? "bg-[#d96ab4]" : ""
          }`}
          href="/identification"
        >
          S’identifier
        </Link>
        <details className="static lg:hidden">
          <summary className="flex min-h-20 cursor-pointer items-center border-r-2 border-[#351815] px-3 font-mono text-xs font-black uppercase transition-colors hover:bg-[#d96ab4] focus-visible:bg-[#d96ab4] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#351815] sm:px-5">Menu</summary>
          <nav aria-label="Navigation mobile" className="absolute inset-x-0 top-full z-50 grid max-h-[calc(100dvh-80px)] overflow-y-auto border-t-2 border-[#351815] bg-[#f6eadf] font-mono text-xs font-black uppercase shadow-[0_8px_0_rgba(53,24,21,.18)]">
            {copy.nav.map((item: { key: RouteKey; label: string }) => (
              <Link className={`flex min-h-14 items-center border-b-2 border-[#351815] px-4 py-3 transition-colors hover:bg-[#d96ab4] focus-visible:bg-[#d96ab4] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#351815] ${item.key === current ? "bg-[#d96ab4]" : ""}`} href={getRoute(locale, item.key)} key={item.key}>
                {item.label}
              </Link>
            ))}
            <Link className={`flex min-h-14 items-center border-b-2 border-[#351815] px-4 py-3 transition-colors hover:bg-[#d96ab4] focus-visible:bg-[#d96ab4] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#351815] ${isIdentification ? "bg-[#d96ab4]" : ""}`} href="/identification">
              S’identifier
            </Link>
          </nav>
        </details>
        <Link className="grid min-h-20 place-items-center bg-[#351815] px-4 text-center font-mono text-xs font-black uppercase text-[#f6eadf] transition hover:bg-[#ffb000] hover:text-[#351815] focus-visible:bg-[#ffb000] focus-visible:text-[#351815] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#d96ab4] sm:px-6" href={getRoute(locale, "runs")}>
          <span className="sm:hidden">Courir</span><span className="hidden sm:inline">Prochaine sortie</span>
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter({ copy, locale }: { copy: ShellCopy; locale: Locale }) {
  return (
    <footer className="border-t-2 border-[#351815] bg-[#351815] text-[#f6eadf]">
      <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 sm:py-14 xl:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <p className="max-w-[13ch] font-display text-[clamp(2rem,3.4vw,2.9rem)] uppercase leading-[1.12] [overflow-wrap:normal]">
              Social sport club à Aix-en-Provence.
            </p>
            <p className="mt-4 max-w-xs leading-relaxed text-[#f6eadf]/70">
              Courir ensemble, couper la semaine, et revenir avec autre chose qu’un chrono.
            </p>
          </div>

          <FooterColumn
            links={[
              { href: getRoute(locale, "runs"), label: "Sorties" },
              { href: getRoute(locale, "community"), label: "Le club" },
              { href: getRoute(locale, "merch"), label: "Merch" },
              { href: getRoute(locale, "contact"), label: "Contact" }
            ]}
            title="Navigation"
          />

          <FooterColumn
            links={[
              { href: copy.contact.instagram, label: copy.contact.instagramLabel },
              { href: copy.contact.linkedin, label: "LinkedIn" },
              { href: `mailto:${copy.contact.email}`, label: copy.contact.email },
              { href: `tel:${copy.contact.phone}`, label: copy.contact.phoneLabel },
              { href: getRoute(locale, "localClub"), label: "Guide local" }
            ]}
            title="Nous suivre"
          />

          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#ffb000]">Le rendez-vous</p>
            <ul className="mt-5 space-y-3 text-[1.02rem] text-[#f6eadf]/80">
              <li>Tous les samedis</li>
              <li>08:30</li>
              <li>Parking Émile Zola</li>
              <li>Gratuit, sans inscription</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#f6eadf]/20 pt-5 font-mono text-xs uppercase tracking-[.12em] text-[#f6eadf]/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 NULLL.CLUB</span>
          <span>Aix-en-Provence, France</span>
          <span className="text-[#ffb000]/70">Ouvert à tous</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#ffb000]">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="inline-flex min-h-11 items-center py-2 text-[1.02rem] text-[#f6eadf]/80 transition-colors hover:text-[#f6eadf] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
              href={link.href}
            >
              {link.label}
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
      <div className="min-w-0 border-2 border-[#351815] bg-[#f6eadf] p-5 shadow-[6px_6px_0_#d96ab4] sm:p-6 sm:shadow-[8px_8px_0_#d96ab4] xl:p-10">
        <p className="inline-flex border-2 border-[#351815] bg-[#ffb000] px-3 py-2 font-mono text-xs font-black uppercase">{stamp} / {label}</p>
        <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,7.5vw,7.4rem)] uppercase leading-[0.94] sm:mt-8">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg font-bold leading-tight text-[#351815]/80 xl:text-xl">{intro}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">{actions}</div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {facts.map((fact) => (
            <div className="border-t-2 border-[#351815] pt-4" key={fact.label}>
              <p className="font-mono text-xs font-black uppercase text-[#351815]/60">{fact.label}</p>
              <p className="mt-2 text-lg">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden border-2 border-[#351815] bg-[#351815] p-3">
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
      <p className="inline-flex border-2 border-[#351815] bg-[#ffb000] px-3 py-2 font-mono text-xs font-black uppercase">{index} / NULLL.CLUB</p>
      <HeadingTag className="max-w-4xl font-display text-[clamp(2.8rem,6.4vw,6rem)] uppercase leading-[0.94]">{title}</HeadingTag>
      {text ? <p className="max-w-2xl text-xl font-bold leading-tight text-[#351815]/76">{text}</p> : null}
    </div>
  );
}

export function PrimaryLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
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

export function RunCard({ run }: { run: RunEvent }) {
  return (
    <article className="flex h-full flex-col border-2 border-[#351815] bg-[#f6eadf] p-5 transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#ffb000]">
      <div className="flex items-start justify-between gap-4 border-b-2 border-[#351815] pb-4">
        <div>
          <p className="font-mono text-xs font-black uppercase text-[#d96ab4]">{run.date}</p>
          <h3 className="mt-2 font-display text-[clamp(2rem,4vw,3.6rem)] uppercase leading-[0.92]">{run.title}</h3>
        </div>
        <p className="border-2 border-[#351815] bg-[#ffb000] px-2 py-1 text-right font-mono text-xs font-black uppercase">{run.time}</p>
      </div>
      <div className="mt-5 grid gap-2 text-[#351815]/78">
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
      <p className="mt-5 text-[#351815]/72">{run.summary}</p>
    </article>
  );
}
