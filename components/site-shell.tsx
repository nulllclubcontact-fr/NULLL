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
    <div className="min-h-screen bg-[#f6eadf] text-[#351815]">
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
      <div className="mx-auto grid min-h-20 w-full max-w-none grid-cols-[minmax(0,1fr)_auto] items-stretch 2xl:grid-cols-[280px_minmax(0,1fr)_170px_220px]">
        <Link className="flex items-center border-r-2 border-[#351815] px-4 transition hover:bg-[#ffb000] sm:px-6" href={getRoute(locale, "home")}>
          <Image alt="NULLL.CLUB" className="h-auto w-36 sm:w-44" height={157} priority src="/assets/nulll-new/logo-burgundy.png" width={1225} />
        </Link>
        <nav aria-label="Navigation principale" className="hidden min-w-0 grid-cols-6 font-mono text-xs font-black uppercase 2xl:grid">
          {copy.nav.map((item: { key: RouteKey; label: string }) => (
            <Link
              aria-current={item.key === current ? "page" : undefined}
              className={`grid place-items-center border-r-2 border-[#351815] px-2 text-center transition hover:bg-[#d96ab4] ${
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
          className={`hidden place-items-center border-r-2 border-[#351815] px-3 text-center font-mono text-xs font-black uppercase transition hover:bg-[#d96ab4] 2xl:grid ${
            isIdentification ? "bg-[#d96ab4]" : ""
          }`}
          href="/identification"
        >
          S’identifier
        </Link>
        <Link className="grid min-h-20 place-items-center bg-[#351815] px-4 text-center font-mono text-xs font-black uppercase text-[#f6eadf] transition hover:bg-[#ffb000] hover:text-[#351815] sm:px-6" href={getRoute(locale, "runs")}>
          Prochain run
        </Link>
      </div>
      <details className="border-t-2 border-[#351815] 2xl:hidden">
        <summary className="cursor-pointer px-4 py-3 font-mono text-xs font-black uppercase">Menu</summary>
        <nav aria-label="Navigation mobile" className="grid border-t-2 border-[#351815] font-mono text-xs font-black uppercase">
          {copy.nav.map((item: { key: RouteKey; label: string }) => (
            <Link className={`border-b-2 border-[#351815] px-4 py-4 ${item.key === current ? "bg-[#d96ab4]" : ""}`} href={getRoute(locale, item.key)} key={item.key}>
              {item.label}
            </Link>
          ))}
          <Link className={`border-b-2 border-[#351815] px-4 py-4 ${isIdentification ? "bg-[#d96ab4]" : ""}`} href="/identification">
            S’identifier
          </Link>
        </nav>
      </details>
    </header>
  );
}

export function SiteFooter({ copy, locale }: { copy: ShellCopy; locale: Locale }) {
  return (
    <footer className="border-t-2 border-[#351815] bg-[#351815] text-[#f6eadf]">
      <div className="mx-auto grid w-full max-w-none gap-10 px-4 py-14 sm:px-6 xl:grid-cols-[1.1fr_0.9fr] xl:px-8">
        <div className="space-y-5">
          <p className="font-display text-[clamp(2.6rem,6vw,5.4rem)] uppercase leading-[0.96]">
            Run club social a Aix-en-Provence.
          </p>
          <p className="max-w-2xl text-[#f6eadf]/72">
            Un point de rendez-vous pour courir ensemble, couper la semaine et revenir avec autre chose qu’un chrono.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FooterBlock
            links={[
              { href: getRoute(locale, "runs"), label: "Runs" },
              { href: getRoute(locale, "community"), label: "Communaute" },
              { href: getRoute(locale, "merch"), label: "Merch" },
              { href: getRoute(locale, "contact"), label: "Contact" }
            ]}
            title="Navigation"
          />
          <FooterBlock
            links={[
              { href: copy.contact.instagram, label: "Instagram" },
              { href: `mailto:${copy.contact.email}`, label: "Email" },
              { href: copy.contact.linkedin, label: "LinkedIn" },
              { href: getRoute(locale, "localClub"), label: "Guide local" }
            ]}
            title="Liens utiles"
          />
        </div>
      </div>
    </footer>
  );
}

function FooterBlock({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div className="border-2 border-[#f6eadf] p-5">
      <p className="mb-4 font-mono text-sm font-black uppercase text-[#ffb000]">{title}</p>
      <div className="space-y-3">
        {links.map((link) => (
          <Link className="group flex items-center justify-between gap-4 text-lg hover:text-[#d96ab4]" href={link.href} key={link.href}>
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
    <section className="mx-auto grid w-full max-w-none gap-6 px-4 py-8 sm:px-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.68fr)] xl:px-8 xl:py-12">
      <div className="border-2 border-[#351815] bg-[#f6eadf] p-6 shadow-[8px_8px_0_#d96ab4] xl:p-10">
        <p className="inline-flex border-2 border-[#351815] bg-[#ffb000] px-3 py-2 font-mono text-xs font-black uppercase">{stamp} / {label}</p>
        <h1 className="mt-8 max-w-4xl font-display text-[clamp(3.4rem,7.5vw,7.4rem)] uppercase leading-[0.94]">{title}</h1>
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
        <PosterPhoto alt={imageAlt} className="min-h-[460px] xl:min-h-[640px]" priority src={image} stamp="AIX" />
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
          <strong>Apres-run :</strong> {run.afterRun}
        </p>
      </div>
      <p className="mt-5 text-[#351815]/72">{run.summary}</p>
    </article>
  );
}
