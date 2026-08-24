import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StructuredData } from "../../../components/StructuredData";
import { ArrowIcon } from "../../../components/ArrowIcon";
import { Countdown } from "../../../components/countdown";
import { Reveal } from "../../../components/reveal";
import { SmoothAnchor } from "../../../components/smooth-anchor";
import { SiteShell } from "../../../components/site-shell";
import { resolveLocale } from "../../../lib/locale";
import { buildBreadcrumbSchema, buildEventSchema, buildFaqSchema, buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy, type RunEvent } from "../../../lib/site-content";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  return buildPageMetadata({ locale, routeKey: "runs", title: copy.meta.runs.title, description: copy.meta.runs.description });
}

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default async function RunsPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  const contactHref = getRoute(locale, "contact");

  return (
    <SiteShell current="runs" locale={locale} pathname={getRoute(locale, "runs")}>
      {copy.runs.map((run) => (
        <StructuredData
          data={buildEventSchema({
            locale,
            name: run.title,
            description: run.summary,
            startDate: run.isoDate,
            locationName: run.location,
            address: run.address,
            route: getRoute(locale, "runs")
          })}
          key={run.id}
        />
      ))}
      <StructuredData data={buildFaqSchema(copy.runsPage.faq)} />
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "Sorties", url: getRoute(locale, "runs") }
        ])}
      />

      {/* ---------------- AFFICHE D'OUVERTURE ---------------- */}
      <section className="relative flex min-h-[calc(100svh-82px)] flex-col overflow-hidden bg-[#351815] text-[#f6eadf]" aria-labelledby="runs-title">
        <Image
          alt="Un membre de NULLL.CLUB en pleine foulée sur un chemin, saisi en flou de mouvement"
          className="object-cover object-[50%_54%]"
          fill
          priority
          sizes="100vw"
          src="/assets/photos/runs-blur.png"
        />
        <div className="absolute inset-0 bg-[rgba(30,14,10,.10)]" />

        {/* Barre identique a celle de l'accueil */}
        <div className="relative mx-auto w-full max-w-[1800px] shrink-0 px-5 pt-6 sm:px-8 sm:pt-8 xl:px-12">
          <div className="hero-text-shadow flex items-center justify-between gap-4 border-b border-[#f6eadf]/45 pb-4 font-mono text-[.68rem] font-black uppercase tracking-[.1em] sm:text-xs">
            <span>Social sport club · Aix-en-Provence</span>
            <span className="text-[#ffb000]">Ouvert à tous · Gratuit</span>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[1800px] flex-1 flex-col items-center justify-center gap-14 px-5 py-10 text-center sm:px-8 sm:py-12 xl:px-12">
          <h1
            className="hero-rise hero-text-shadow whitespace-nowrap font-display text-[clamp(1.9rem,12.4vw,13rem)] uppercase leading-[.9] tracking-[-.045em]"
            id="runs-title"
            style={{ animationDelay: "120ms" }}
          >
            Samedi on <span className="text-[#d96ab4]">sort.</span>
          </h1>

          <div className="hero-rise hero-text-shadow flex w-full flex-col items-center" style={{ animationDelay: "280ms" }}>
            <p className="font-mono text-[.65rem] font-black uppercase tracking-[.18em] text-[#ffb000]">
              Prochaine sortie
            </p>
            <p className="mt-3 font-display text-[clamp(1.9rem,4vw,3.4rem)] uppercase leading-none [overflow-wrap:normal]">
              {copy.runs[0].date}
            </p>

            <div className="mt-7">
              <Countdown centered isoDate={copy.runs[0].isoDate} />
            </div>
            <SmoothAnchor
              className="group mt-6 inline-flex min-h-[4.25rem] cursor-pointer items-center justify-center gap-8 border-2 border-[#ffb000] bg-[#ffb000] px-8 font-display text-[1.35rem] uppercase leading-none text-[#351815] [text-shadow:none] transition-colors hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf]"
              targetId="prochaines-sorties"
            >
              <span>Choisir une date</span>
              <span aria-hidden="true">↓</span>
            </SmoothAnchor>
          </div>
        </div>

        <div className="relative shrink-0 overflow-hidden border-y-2 border-[#351815] bg-[#ffb000] py-4 text-[#351815]">
          <p className="whitespace-nowrap font-mono text-xs font-black uppercase tracking-[.16em] sm:text-sm">
            Allure conversation&nbsp;&nbsp;—&nbsp;&nbsp;Personne derrière&nbsp;&nbsp;—&nbsp;&nbsp;Ouvert à tous&nbsp;&nbsp;—&nbsp;&nbsp;After run&nbsp;&nbsp;—&nbsp;&nbsp;Aix-en-Provence&nbsp;&nbsp;—&nbsp;&nbsp;Allure conversation&nbsp;&nbsp;—&nbsp;&nbsp;Personne derrière&nbsp;&nbsp;—&nbsp;&nbsp;Ouvert à tous
          </p>
        </div>
      </section>

      {/* ---------------- PROCHAINES SORTIES ---------------- */}
      <section className="bg-[#351815] text-[#f6eadf]" aria-labelledby="runs-list-title" id="prochaines-sorties">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24 xl:px-12">
          <div className="grid gap-8 border-b border-[#f6eadf]/35 pb-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#ffb000]">01 — Le calendrier</p>
              <h2 className="mt-4 max-w-[13ch] font-display text-[clamp(3.2rem,6vw,6rem)] uppercase leading-[.82] tracking-[-.035em]" id="runs-list-title">
                Prends ton<br /><span className="text-[#d96ab4]">couloir.</span>
              </h2>
            </div>
            <div className="lg:border-l lg:border-[#f6eadf]/35 lg:pl-8">
              <p className="max-w-sm text-xl font-bold leading-snug">Trois rendez-vous. Même principe : on part ensemble, on revient ensemble.</p>
              <p className="mt-5 font-mono text-xs font-black uppercase tracking-[.12em] text-[#d96ab4]">Débutants bienvenus · Gratuit</p>
            </div>
          </div>

          <div className="mt-12 border-x-2 border-[#f6eadf]">
            {copy.runs.map((run, index) => (
              <RunCardCol contactHref={contactHref} index={index} key={run.id} run={run} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- LE MERCH ---------------- */}
      <section className="bg-[#351815] text-[#f6eadf]" aria-labelledby="runs-merch">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-20 xl:px-12">
          <Reveal className="grid gap-8 lg:grid-cols-[1.2fr_auto] lg:items-end">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#ffb000]">Avant de courir</p>
              <h2
                className="mt-5 max-w-[16ch] font-display text-[clamp(2.4rem,5.2vw,4.6rem)] uppercase leading-[.86] tracking-[-.035em]"
                id="runs-merch"
              >
                Le club se <span className="text-[#d96ab4]">porte.</span>
              </h2>
              <p className="mt-6 max-w-md text-lg font-bold leading-snug text-[#f6eadf]/75">
                Un tee, une casquette. De quoi se reconnaître au départ — et se souvenir de qui était là.
              </p>
            </div>
            <Link
              className="group inline-flex min-h-[4.25rem] items-center justify-between gap-10 border-2 border-[#ffb000] bg-[#ffb000] px-7 font-display text-[1.35rem] uppercase leading-none text-[#351815] transition-colors hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf]"
              href={getRoute(locale, "merch")}
            >
              <span>Voir les pièces</span>
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- LE FORMAT ---------------- */}
      <section className="bg-[#f6eadf] text-[#351815]" aria-labelledby="runs-format">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28 xl:px-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-end">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#d96ab4]">02 — Le format</p>
              <h2
                className="mt-5 font-display text-[clamp(3rem,6.4vw,6.4rem)] uppercase leading-[.82] tracking-[-.04em]"
                id="runs-format"
              >
                Pareil à<br />chaque fois.
              </h2>
            </div>
            <p className="max-w-sm text-xl font-bold leading-snug lg:pb-3">
              Quatre repères qui ne bougent jamais, d’une sortie à l’autre.
            </p>
          </div>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {copy.runsPage.checklist.map((item, index) => (
              <Reveal
                as="li"
                className="flex min-h-[13rem] flex-col justify-between border-2 border-[#351815] bg-[#f6eadf] p-6 transition-colors hover:bg-[#ffb000]"
                delay={index * 110}
                key={item}
              >
                <span className="font-display text-5xl leading-none opacity-25">0{index + 1}</span>
                <span className="mt-8 block font-display text-[1.35rem] uppercase leading-[1.05]">{item}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="bg-[#ffb000] text-[#351815]" aria-labelledby="runs-faq">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28 xl:px-12">
          <p className="font-mono text-xs font-black uppercase tracking-[.16em]">03 — Les questions</p>
          <h2
            className="mt-5 max-w-[12ch] font-display text-[clamp(3rem,6.4vw,6.4rem)] uppercase leading-[.82] tracking-[-.04em]"
            id="runs-faq"
          >
            Avant de venir.
          </h2>

          <dl className="mt-14 border-t-2 border-[#351815]">
            {copy.runsPage.faq.map((entry, index) => (
              <Reveal
                className="grid gap-4 border-b-2 border-[#351815] py-8 md:grid-cols-[auto_1fr_1.1fr] md:items-baseline md:gap-10"
                delay={index * 110}
                key={entry.q}
              >
                <span className="font-mono text-[.65rem] font-black uppercase tracking-[.14em] opacity-50">
                  0{index + 1}
                </span>
                <dt className="font-display text-[clamp(1.5rem,2.6vw,2.3rem)] uppercase leading-[.95]">{entry.q}</dt>
                <dd className="text-lg font-bold leading-snug">{entry.a}</dd>
              </Reveal>
            ))}
          </dl>

          <div className="mt-14 flex flex-col gap-4 border-2 border-[#351815] bg-[#351815] p-8 text-[#f6eadf] sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <p className="max-w-md font-display text-[clamp(1.6rem,3vw,2.6rem)] uppercase leading-[.95]">
              Il reste une question ?
            </p>
            <Link
              className="group inline-flex min-h-[4rem] items-center justify-between gap-10 border-2 border-[#ffb000] bg-[#ffb000] px-7 font-display text-[1.35rem] uppercase leading-none text-[#351815] transition-colors hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf]"
              href={contactHref}
            >
              <span>{copy.runsPage.cta}</span>
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

    </SiteShell>
  );
}

function RunCardCol({ contactHref, index, run }: { contactHref: string; index: number; run: RunEvent }) {
  const isNext = index === 0;

  return (
    <Reveal
      as="article"
      className={`group relative grid border-y-2 border-[#f6eadf] transition-colors duration-300 lg:min-h-[13rem] lg:grid-cols-[7rem_1.3fr_1.15fr_.9fr_10rem] ${
        isNext ? "bg-[#ffb000] text-[#351815]" : "bg-[#351815] text-[#f6eadf] hover:bg-[#48201c]"
      }`}
      delay={index * 100}
    >
      <div className={`flex items-center justify-between border-b-2 p-5 lg:flex-col lg:items-start lg:justify-between lg:border-b-0 lg:border-r-2 ${isNext ? "border-[#351815]" : "border-[#f6eadf]"}`}>
        <span className="font-display text-6xl leading-none tracking-[-.05em]">0{index + 1}</span>
        <span className="font-mono text-[.58rem] font-black uppercase tracking-[.14em] opacity-60">
          Couloir<br className="hidden lg:block" /> {index + 1}
        </span>
      </div>

      <div className={`flex flex-col justify-center border-b-2 p-6 lg:border-b-0 lg:border-r-2 ${isNext ? "border-[#351815]" : "border-[#f6eadf]"}`}>
        <p className={`font-mono text-[.6rem] font-black uppercase tracking-[.15em] ${isNext ? "text-[#8d3d00]" : "text-[#d96ab4]"}`}>
          {isNext ? "Départ imminent" : "Prochain passage"}
        </p>
        <h2 className="mt-3 font-display text-[clamp(2.5rem,3.6vw,4rem)] uppercase leading-[.78] tracking-[-.035em]" id={`run-${run.id}`}>
          {run.date}
        </h2>
        <p className="mt-4 max-w-md text-sm font-bold leading-snug opacity-70">{run.summary}</p>
      </div>

      <dl className={`grid grid-cols-2 content-center gap-x-5 gap-y-6 border-b-2 p-6 lg:border-b-0 lg:border-r-2 ${isNext ? "border-[#351815]" : "border-[#f6eadf]"}`}>
          {[
            ["Heure", run.time],
            ["Distance", run.distance],
            ["Allure", run.pace],
            ["Départ", run.location]
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="font-mono text-[.58rem] font-black uppercase tracking-[.14em] opacity-45">{label}</dt>
              <dd className="mt-2 text-base font-black uppercase leading-tight">{value}</dd>
            </div>
          ))}
      </dl>

      <div className={`flex flex-col justify-center gap-5 border-b-2 p-6 lg:border-b-0 lg:border-r-2 ${isNext ? "border-[#351815]" : "border-[#f6eadf]"}`}>
        <p className="text-sm font-bold leading-snug">
          <span className="block font-mono text-[.55rem] font-black uppercase tracking-[.14em] opacity-45">Après la ligne</span>
          <span className="mt-2 block">{run.afterRun}</span>
        </p>
        <a
          className="font-mono text-[.6rem] font-black uppercase tracking-[.1em] underline decoration-2 underline-offset-4 transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4"
          href={mapsUrl(run.address)}
          rel="noreferrer noopener"
          target="_blank"
        >
          Voir le départ ↗
        </a>
      </div>

      <Link
        className={`flex min-h-24 items-center justify-between gap-4 p-6 font-display text-[1.35rem] uppercase leading-none transition-colors focus-visible:outline-4 focus-visible:outline-offset-[-4px] lg:flex-col lg:items-start lg:justify-between ${
          isNext
            ? "bg-[#351815] text-[#f6eadf] hover:bg-[#d96ab4] hover:text-[#351815] focus-visible:outline-[#351815]"
            : "bg-[#f6eadf] text-[#351815] hover:bg-[#d96ab4] focus-visible:outline-[#ffb000]"
        }`}
        href={contactHref}
      >
        <span className="font-mono text-[.55rem] font-black uppercase tracking-[.15em] opacity-55">Arrivée</span>
        <span className="flex w-full items-center justify-between gap-4">Je viens <ArrowIcon /></span>
      </Link>
    </Reveal>
  );
}
