import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StructuredData } from "../../../components/StructuredData";
import { ArrowIcon } from "../../../components/ArrowIcon";
import { Countdown } from "../../../components/countdown";
import { Reveal } from "../../../components/reveal";
import { RunCarouselNav } from "../../../components/run-carousel-nav";
import { SmoothAnchor } from "../../../components/smooth-anchor";
import { SiteShell } from "../../../components/site-shell";
import { resolveLocale } from "../../../lib/locale";
import { buildBreadcrumbSchema, buildEventSchema, buildFaqSchema, buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy, type RunEvent } from "../../../lib/site-content";

type PageProps = { params: Promise<{ locale: string }> };

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  return buildPageMetadata({ locale, routeKey: "runs", title: copy.meta.runs.title, description: copy.meta.runs.description });
}

export default async function RunsPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  const contactHref = getRoute(locale, "contact");
  const identificationHref = "/identification";
  const tickerCopy = "Allure conversation — Personne derrière — Ouvert à tous — After run — Aix-en-Provence";

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
      <section className="relative flex min-h-[calc(100dvh-82px)] flex-col overflow-hidden bg-[#351815] text-[#f6eadf]" aria-labelledby="runs-title">
        <Image
          alt="Un membre de NULLL.CLUB en pleine foulée sur un chemin, saisi en flou de mouvement"
          className="object-cover object-[50%_54%]"
          fill
          priority
          sizes="100vw"
          src="/assets/photos/runs-blur.webp"
        />
        <div className="absolute inset-0 bg-[rgba(30,14,10,.10)]" />

        {/* Barre identique a celle de l'accueil */}
        <div className="relative mx-auto w-full max-w-[1600px] shrink-0 px-5 pt-6 sm:px-8 sm:pt-8 xl:px-12">
          <div className="hero-text-shadow flex flex-col items-start gap-1 border-b border-[#f6eadf]/45 pb-4 font-mono text-[.68rem] font-black uppercase tracking-[.1em] min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between min-[400px]:gap-4 sm:text-xs">
            <span>Social sport club · Aix-en-Provence</span>
            <span className="text-[#ffb000]">Ouvert à tous · Gratuit</span>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-center justify-center gap-9 px-5 py-8 text-center sm:gap-14 sm:px-8 sm:py-12 xl:px-12">
          <h1
            className="hero-rise hero-text-shadow whitespace-nowrap font-display text-[clamp(1.9rem,12.4vw,13rem)] uppercase leading-[.9]"
            id="runs-title"
            style={{ animationDelay: "120ms" }}
          >
            Samedi on <span className="text-[#d96ab4]">sort.</span>
          </h1>

          <div className="hero-rise hero-text-shadow flex w-full flex-col items-center" style={{ animationDelay: "280ms" }}>
            <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#ffb000]">
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

        <div
          aria-label={tickerCopy}
          className="marquee relative shrink-0 border-y-2 border-[#351815] bg-[#ffb000] py-4 text-[#351815] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#d96ab4]"
          role="region"
          tabIndex={0}
        >
          <div aria-hidden="true" className="marquee-track font-mono text-xs font-black uppercase tracking-[.16em] sm:text-sm">
            <p className="shrink-0 whitespace-nowrap px-6">{tickerCopy}&nbsp;&nbsp;—&nbsp;&nbsp;</p>
            <p className="shrink-0 whitespace-nowrap px-6">{tickerCopy}&nbsp;&nbsp;—&nbsp;&nbsp;</p>
          </div>
        </div>
      </section>

      {/* ---------------- PROCHAINES SORTIES ---------------- */}
      <section className="scroll-mt-20 bg-[#351815] text-[#f6eadf]" aria-labelledby="runs-list-title" id="prochaines-sorties">
        <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-16 sm:px-8 sm:pb-12 sm:pt-24 xl:px-12">
          <div className="flex flex-col gap-5 border-b border-[#f6eadf]/35 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#ffb000]">01 — Le calendrier</p>
              <h2 className="mt-4 font-display text-[clamp(3.2rem,6vw,6rem)] uppercase leading-[.82]" id="runs-list-title">
                Prochaine <span className="text-[#d96ab4]">sortie.</span>
              </h2>
            </div>
            <p className="font-mono text-xs font-black uppercase tracking-[.12em] text-[#d96ab4]">Swipe pour la suite →</p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 font-mono text-xs font-black uppercase tracking-[.16em]">
            <span className="text-[#f6eadf]/65">3 sorties</span>
            <RunCarouselNav runs={copy.runs.map(({ date, id }) => ({ date, id }))} />
          </div>

          <div
            aria-label="Prochaines sorties, carrousel horizontal"
            className="run-carousel -ml-4 mt-1 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8 pl-4 pr-[10%] pt-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000] sm:-ml-6 sm:gap-8 sm:pl-6 sm:pr-[18%] xl:-ml-10 xl:pl-10"
            role="region"
            tabIndex={0}
          >
            {copy.runs.map((run, index) => (
              <div className="run-carousel-slide w-[90%] shrink-0 snap-center sm:w-[78%] xl:w-[72%]" id={`run-card-${run.id}`} key={run.id}>
                <RunCardCol index={index} joinHref={identificationHref} run={run} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- LES 3 PILIERS ---------------- */}
      <section className="principles-section overflow-hidden bg-[#351815] text-[#f6eadf]" aria-labelledby="runs-format">
        <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16 xl:px-12">
          <div className="relative z-10 text-center">
            <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#ffb000]">02 — Les seules règles</p>
            <h2
              className="mx-auto mt-5 max-w-[15ch] font-display text-[clamp(3rem,7vw,7.5rem)] uppercase leading-[.8]"
              id="runs-format"
            >
              Le seul podium<br /><span className="text-[#d96ab4]">qui compte.</span>
            </h2>
          </div>

          <ol className="principles-stage relative z-10 mt-24 grid gap-14 md:mt-32 md:grid-cols-3 md:items-end md:gap-3 lg:gap-5">
            <Reveal as="li" className="principle-block principle-block--second group order-2 flex min-h-[19rem] flex-col justify-end border-2 border-[#351815] bg-[#d96ab4] p-6 text-[#351815] md:order-1 md:min-h-[23rem] lg:p-8" delay={110}>
              <Image alt="" className="principle-photo object-cover object-[50%_42%]" fill sizes="(min-width: 768px) 33vw, 100vw" src="/assets/photos/principle-clear-head.webp" />
              <span className="podium-medal" aria-hidden="true">02</span>
              <span className="principle-kicker mb-auto font-mono text-[.65rem] font-black uppercase tracking-[.16em]">Respirer enfin</span>
              <h3 className="break-normal font-display text-[clamp(2.25rem,4vw,4.5rem)] uppercase leading-[.82] [overflow-wrap:normal]">Se vider<br />la tête</h3>
              <span aria-hidden="true" className="mt-6 block h-2 w-20 bg-[#351815]" />
            </Reveal>

            <Reveal as="li" className="principle-block principle-block--first group order-1 flex min-h-[24rem] flex-col justify-end border-2 border-[#351815] bg-[#ffb000] p-6 text-[#351815] md:order-2 md:min-h-[32rem] lg:p-9" delay={0}>
              <Image alt="" className="principle-photo object-cover object-[50%_48%]" fill sizes="(min-width: 768px) 33vw, 100vw" src="/assets/photos/principle-meet.webp" />
              <span className="podium-medal podium-medal--first" aria-hidden="true">01</span>
              <span className="principle-kicker principle-kicker--first mb-auto font-mono text-[.65rem] font-black uppercase tracking-[.16em]">La vraie victoire</span>
              <h3 className="break-normal font-display text-[clamp(2.15rem,4.3vw,4rem)] uppercase leading-[.8] [overflow-wrap:normal]">Faire des<br />rencontres</h3>
              <p className="mt-6 max-w-[25ch] font-mono text-xs font-black uppercase leading-relaxed tracking-[.08em]">Pas d’écouteurs. Des vraies conversations.</p>
            </Reveal>

            <Reveal as="li" className="principle-block principle-block--third group order-3 flex min-h-[18rem] flex-col justify-end border-2 border-[#351815] bg-[#f6eadf] p-6 text-[#351815] md:min-h-[20rem] lg:p-8" delay={220}>
              <Image alt="" className="principle-photo object-cover object-[50%_28%]" fill sizes="(min-width: 768px) 33vw, 100vw" src="/assets/photos/principle-fun.webp" />
              <span className="podium-medal" aria-hidden="true">03</span>
              <span className="principle-kicker mb-auto font-mono text-[.65rem] font-black uppercase tracking-[.16em]">Zéro pression</span>
              <h3 className="break-normal font-display text-[clamp(2.25rem,4vw,4.5rem)] uppercase leading-[.82] [overflow-wrap:normal]">S’amuser.<br />C’est tout.</h3>
              <span aria-hidden="true" className="mt-6 block h-2 w-20 bg-[#d96ab4]" />
            </Reveal>
          </ol>

          <div aria-hidden="true" className="finish-line relative z-10 h-10" />
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="bg-[#ffb000] text-[#351815]" aria-labelledby="runs-faq">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28 xl:px-12">
          <p className="font-mono text-xs font-black uppercase tracking-[.16em]">03 — Les questions</p>
          <h2
            className="mt-5 max-w-[12ch] font-display text-[clamp(3rem,6.4vw,6.4rem)] uppercase leading-[.82]"
            id="runs-faq"
          >
            Avant de venir.
          </h2>

          <dl className="mt-14 border-t-2 border-[#351815]">
            {copy.runsPage.faq.map((entry, index) => (
              <Reveal
                className="grid gap-4 border-b-2 border-[#351815] py-8 lg:grid-cols-[auto_1fr_1.1fr] lg:items-baseline lg:gap-10"
                delay={index * 110}
                key={entry.q}
              >
                <span className="font-mono text-xs font-black uppercase tracking-[.14em] opacity-60">
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

function RunCardCol({ index, joinHref, run }: { index: number; joinHref: string; run: RunEvent }) {
  const visuals = [
    { src: "/assets/photos/runs-golden.webp", position: "object-[50%_58%]", accent: "bg-[#ffb000] text-[#351815]" },
    { src: "/assets/photos/runs-motion.webp", position: "object-center", accent: "bg-[#d96ab4] text-[#351815]" },
    { src: "/assets/photos/runs-crew.webp", position: "object-center", accent: "bg-[#f6eadf] text-[#351815]" }
  ];
  const visual = visuals[index % visuals.length];

  return (
    <Reveal
      as="article"
      className={`run-poster group relative min-h-[31rem] overflow-hidden text-[#f6eadf] sm:min-h-[34rem] lg:min-h-[38rem] ${index === 0 ? "run-poster--featured border-[6px] border-[#ffb000]" : "border-2 border-[#f6eadf]"}`}
      delay={index * 100}
    >
      <Image alt="" className={`run-card-image object-cover ${visual.position}`} fill sizes="(min-width: 1280px) 72vw, (min-width: 640px) 78vw, 90vw" src={visual.src} />
      <div className="run-card-shade absolute inset-0" />
      <div aria-hidden="true" className={`absolute left-0 top-0 h-3 w-full ${visual.accent.split(" ")[0]}`} />

      <div className="relative z-10 flex min-h-[31rem] flex-col justify-between p-5 sm:min-h-[34rem] sm:p-8 lg:min-h-[38rem] lg:p-10">
        <div className="flex items-start justify-between gap-4">
          <span className={`inline-flex min-h-11 items-center px-4 font-mono text-xs font-black uppercase tracking-[.14em] ${visual.accent}`}>
            {index === 0 ? "À ne pas rater" : `Sortie 0${index + 1}`}
          </span>
          <span className="font-display text-5xl leading-none drop-shadow-lg sm:text-7xl">0{index + 1}</span>
        </div>

        <div>
          <h3 className="run-card-date max-w-[11ch] break-normal font-display text-[clamp(2.55rem,7.2vw,7.4rem)] uppercase leading-[.86] [overflow-wrap:normal] sm:leading-[.82]" id={`run-${run.id}`}>
            {run.date}
          </h3>
          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs font-black uppercase tracking-[.1em]">
            <span className="bg-[#351815] px-4 py-3">{run.time}</span>
            <span className="bg-[#351815] px-4 py-3">{run.distance}</span>
            <a
              aria-label={`Ouvrir le lieu de départ ${run.location} dans Google Maps`}
              className="inline-flex min-h-14 items-center gap-3 bg-[#f6eadf] px-4 py-2.5 text-[#351815] transition-colors hover:bg-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000]"
              href={mapsUrl(run.address)}
              rel="noreferrer noopener"
              target="_blank"
            >
              <span aria-hidden="true" className="text-lg">⌖</span>
              <span>Lieu de départ</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <Link
            aria-label={`Je viens à la sortie du ${run.date}, à ${run.time}, ${run.distance}. Départ ${run.location}. ${run.summary}`}
            className={`mt-5 flex min-h-16 w-full items-center justify-between gap-6 px-5 font-display text-[1.55rem] uppercase leading-none transition-colors focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf] sm:w-fit sm:min-w-72 ${visual.accent}`}
            href={joinHref}
          >
            <span>Je viens</span>
            <span className="run-cta-arrow"><ArrowIcon /></span>
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
