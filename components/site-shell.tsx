import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowIcon } from "./ArrowIcon";
import { LocaleDocumentSync } from "./LocaleDocumentSync";
import { PageStamp } from "./PageStamp";
import { PosterPhoto } from "./PosterPhoto";
import { getRoute, getSiteCopy, switchLocalePath, type Locale, type RouteKey, type RunEvent } from "../lib/site-content";

type ShellCopy = ReturnType<typeof getSiteCopy>;

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
    <div className="min-h-screen bg-ink text-paper">
      <LocaleDocumentSync locale={locale} />
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
  current: RouteKey;
  locale: Locale;
  pathname: string;
}) {
  const switchPath = switchLocalePath(locale === "fr" ? "eng" : "fr", pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-paper/20 bg-ink/95 backdrop-blur">
      <div className="shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" href={getRoute(locale, "home")}>
            <div className="grid h-12 w-12 place-items-center border border-paper bg-paper text-ink">
              <span className="font-display text-2xl leading-none">N</span>
            </div>
            <div>
              <p className="font-display text-3xl uppercase leading-none">NULLL.CLUB</p>
              <p className="text-sm text-paper/72">{copy.brandLine}</p>
            </div>
          </Link>
          <Link className="locale-chip lg:hidden" href={switchPath}>
            {copy.alternateLanguageLabel}
          </Link>
        </div>
        <nav aria-label={locale === "fr" ? "Navigation principale" : "Main navigation"} className="flex flex-wrap gap-2">
          {copy.nav.map((item: { key: RouteKey; label: string }) => (
            <Link
              aria-current={item.key === current ? "page" : undefined}
              className={item.key === current ? "nav-link nav-link-active" : "nav-link"}
              href={getRoute(locale, item.key)}
              key={item.key}
            >
              {item.label}
            </Link>
          ))}
          <Link className="nav-link text-shock" href="/identification">
            {locale === "fr" ? "S'identifier" : "Sign in"}
          </Link>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link className="locale-chip" href={switchPath}>
            {copy.alternateLanguageLabel}
          </Link>
          <Link className="primary-link" href={getRoute(locale, "runs")}>
            {locale === "fr" ? "Prochain run" : "Next run"}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ copy, locale }: { copy: ShellCopy; locale: Locale }) {
  return (
    <footer className="border-t border-paper/20 bg-ink-soft">
      <div className="shell grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <p className="font-display text-[clamp(2.6rem,6vw,5.4rem)] uppercase leading-[0.9]">
            {locale === "fr" ? "Run club social à Aix-en-Provence." : "Social run club in Aix-en-Provence."}
          </p>
          <p className="max-w-2xl text-paper/72">
            {locale === "fr"
              ? "Prochains runs, communauté, merch et contact : tout pour rejoindre NULLL.CLUB à Aix."
              : "Find the next runs, local landing pages and merch order details in a few clicks."}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FooterBlock
            links={[
              { href: getRoute(locale, "runs"), label: locale === "fr" ? "Runs" : "Runs" },
              { href: getRoute(locale, "community"), label: locale === "fr" ? "Communauté" : "Community" },
              { href: getRoute(locale, "merch"), label: "Merch" },
              { href: getRoute(locale, "contact"), label: locale === "fr" ? "Contact" : "Contact" }
            ]}
            title={locale === "fr" ? "Navigation" : "Navigation"}
          />
          <FooterBlock
            links={[
              { href: copy.contact.instagram, label: "Instagram" },
              { href: `mailto:${copy.contact.email}`, label: "Email" },
              { href: copy.contact.linkedin, label: "LinkedIn" },
              { href: getRoute(locale, "localClub"), label: locale === "fr" ? "Guide local" : "Local guide" }
            ]}
            title={locale === "fr" ? "Liens utiles" : "Useful links"}
          />
        </div>
      </div>
    </footer>
  );
}

function FooterBlock({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div className="panel p-5">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-paper/60">{title}</p>
      <div className="space-y-3">
        {links.map((link) => (
          <Link className="group flex items-center justify-between gap-4 text-lg hover:text-accent" href={link.href} key={link.href}>
            {link.label}
            <ArrowIcon />
          </Link>
        ))}
      </div>
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
    <section className="hero-grid shell py-8 lg:py-12">
      <div className="panel panel-grid p-6 lg:p-10">
        <PageStamp index={stamp}>{label}</PageStamp>
        <h1 className="mt-8 max-w-4xl font-display text-[clamp(3.6rem,8vw,8rem)] uppercase leading-[0.88]">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/78 lg:text-xl">{intro}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">{actions}</div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {facts.map((fact) => (
            <div className="border-t border-paper/20 pt-4" key={fact.label}>
              <p className="text-sm uppercase tracking-[0.18em] text-paper/52">{fact.label}</p>
              <p className="mt-2 text-lg">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
      <PosterPhoto alt={imageAlt} className="min-h-[460px] lg:min-h-[640px]" priority src={image} stamp="AIX" />
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
      <PageStamp index={index}>{title}</PageStamp>
      <HeadingTag className="max-w-4xl font-display text-[clamp(2.8rem,6vw,5.6rem)] uppercase leading-[0.9]">{title}</HeadingTag>
      {text ? <p className="max-w-2xl text-paper/72">{text}</p> : null}
    </div>
  );
}

export function PrimaryLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return (
    <Link className={secondary ? "secondary-link group" : "primary-link group"} href={href}>
      <span>{children}</span>
      <ArrowIcon />
    </Link>
  );
}

export function RunCard({ run, locale }: { run: RunEvent; locale: Locale }) {
  return (
    <article className="panel flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-4 border-b border-paper/15 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-accent">{run.date}</p>
          <h3 className="mt-2 font-display text-[clamp(2rem,4vw,3.6rem)] uppercase leading-[0.92]">{run.title}</h3>
        </div>
        <p className="text-right text-sm uppercase tracking-[0.16em] text-paper/60">{run.time}</p>
      </div>
      <div className="mt-5 grid gap-2 text-paper/78">
        <p>
          <strong>{locale === "fr" ? "Distance :" : "Distance:"}</strong> {run.distance}
        </p>
        <p>
          <strong>{locale === "fr" ? "Allure :" : "Pace:"}</strong> {run.pace}
        </p>
        <p>
          <strong>{locale === "fr" ? "Lieu :" : "Location:"}</strong> {run.location}
        </p>
        <p>
          <strong>{locale === "fr" ? "Après-run :" : "After run:"}</strong> {run.afterRun}
        </p>
      </div>
      <p className="mt-5 text-paper/72">{run.summary}</p>
    </article>
  );
}

