import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StructuredData } from "../../../components/StructuredData";
import { ArrowIcon } from "../../../components/ArrowIcon";
import { Countdown } from "../../../components/countdown";
import { Reveal } from "../../../components/reveal";
import { RubanVitesse } from "../../../components/ruban-vitesse";
import "../../../components/home-experience.css";
import { RunCarouselNav } from "../../../components/run-carousel-nav";
import { SmoothAnchor } from "../../../components/smooth-anchor";
import { SiteShell } from "../../../components/site-shell";
import { resolveLocale } from "../../../lib/locale";
import { buildBreadcrumbSchema, buildEventSchema, buildFaqSchema, buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy, type RunEvent } from "../../../lib/site-content";
import { listPublicRuns } from "../../../lib/races/repo";
import { DEPART } from "../../../lib/rendez-vous";

// Les sorties viennent de la base. La page se regenere au plus tard chaque
// minute (et aussitot qu'une sortie change dans l'admin) : une sortie
// passee en disparait d'elle-meme, la plus proche prend la tete.
export const revalidate = 60;

type PageProps = { params: Promise<{ locale: string }> };

/**
 * Le depart habituel s'ouvre sur ses coordonnees : chercher « parking du
 * chemin de la Cible » en texte ne tombe pas toujours au bon endroit.
 */
function mapsUrl(run: RunEvent) {
  const requete = run.location === DEPART.nom ? `${DEPART.latitude},${DEPART.longitude}` : run.address;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(requete)}`;
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
  const tickerCopy = "On court ensemble · On prend le temps de se parler";
  const lecture = await listPublicRuns();
  const panne = lecture === null;
  const runs = lecture ?? [];
  const prochaine = runs[0];

  return (
    <SiteShell current="runs" locale={locale} pathname={getRoute(locale, "runs")}>
      {runs.map((run) => (
        <StructuredData
          data={buildEventSchema({
            locale,
            name: run.title,
            description: run.summary,
            startDate: run.isoDate,
            locationName: run.location,
            address: run.address,
            image: run.image,
            ouverte: run.inscriptionsOuvertes !== false,
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

      <div className="home-journey">
        {/* ---------------- OUVERTURE ---------------- */}
        <section className="hx-hero" aria-labelledby="runs-title">
          <Image
            alt="Le groupe de Nulll Club court vers l’objectif sur un chemin du parc"
            className="object-cover object-[50%_35%]"
            fill
            priority
            sizes="100vw"
            src="/assets/actus/bienvenue/15.webp"
          />
          <div className="hx-hero-shade" aria-hidden="true" />
          <div className="hx-hero-copy">
            <h1 className="hx-hero-title" id="runs-title">
              <span className="st st-yellow hx-hero-kicker">Les prochaines dates · Aix-en-Provence</span>
              <span className="st st-pink">Les sorties</span>
            </h1>
            <p className="hx-hero-support">
              {prochaine ? <>Prochaine sortie : <strong>{prochaine.date}</strong></> : "Nouvelles dates très bientôt."}
            </p>
            {prochaine ? (
              <div className="mt-6">
                <Countdown centered isoDate={prochaine.isoDate} />
              </div>
            ) : null}
            <div className="hx-hero-cta">
              <SmoothAnchor className="hx-pill cursor-pointer" targetId="prochaines-sorties">
                <span>Choisir une date</span>
                <span aria-hidden="true">↓</span>
              </SmoothAnchor>
              <span className="hx-note">Gratuit · tous niveaux · tu peux venir seul</span>
            </div>
          </div>
        </section>

        <section className="hx-bands" aria-label="Informations pratiques">
          <dl className="hx-band hx-band-pink">
            <div><dt>Quand</dt><dd>Samedi 9h30</dd></div>
            <div><dt>Départ</dt><dd>10h</dd></div>
            <div><dt>Où</dt><dd>{DEPART.nom}</dd></div>
            <div><dt>Distance</dt><dd>5 à 6 km</dd></div>
            <div><dt>Combien</dt><dd>0 €</dd></div>
          </dl>
        </section>

        {/* ---------------- LE CALENDRIER ---------------- */}
        <section className="scroll-mt-24 px-[max(5vw,20px)] pb-16 pt-28 sm:pb-20 sm:pt-32" aria-labelledby="runs-list-title" id="prochaines-sorties">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="hx-stack hx-stack-left" id="runs-list-title">
                <span className="st st-blue">Le calendrier</span>
                <span className="st st-yellow st-xl">Choisis ta date</span>
              </h2>
              <div className="flex items-center gap-4 font-mono text-xs font-bold uppercase tracking-[.14em] text-white/70">
                <span>{runs.length} sortie{runs.length > 1 ? "s" : ""}</span>
                {runs.length > 1 ? <RunCarouselNav runs={runs.map(({ date, id }) => ({ date, id }))} /> : null}
              </div>
            </div>

            {runs.length === 0 ? (
              <div className="mt-12 max-w-2xl -rotate-1 rounded-[2px] bg-[#FFF3DF] p-8 text-[#1C2245]">
                <p className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] uppercase leading-[1.05]">
                  {panne ? "Impossible de charger les sorties." : "Pas de sortie programmée pour l’instant."}
                </p>
                <p className="mt-3 text-base leading-relaxed">
                  {panne ? "Recharge la page dans un instant." : "Les prochaines dates arrivent ici dès qu’elles sont publiées. Suis le club sur Instagram pour ne rien rater."}
                </p>
                {panne ? (
                  <Link className="mt-5 inline-flex min-h-11 items-center rounded-[2px] bg-[#141116] px-4 font-mono text-xs font-bold uppercase tracking-[.12em] text-white" href={getRoute(locale, "runs")}>
                    Réessayer
                  </Link>
                ) : null}
              </div>
            ) : (
              <div
                aria-label="Prochaines sorties, carrousel horizontal"
                className="run-carousel -ml-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8 pl-4 pr-[10%] pt-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531] sm:-ml-6 sm:gap-8 sm:pl-6 sm:pr-[18%]"
                role="region"
                tabIndex={0}
              >
                {runs.map((run, index) => (
                  <div className="run-carousel-slide flex w-[90%] shrink-0 snap-center sm:w-[78%] xl:w-[64%]" id={`run-card-${run.id}`} key={run.id}>
                    <RunCardCol index={index} joinHref={`/membre/login?sortie=${run.id}`} run={run} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <RubanVitesse className="hx-ruban" texte={`${tickerCopy} ✱ `} />

        {/* ---------------- AVANT DE VENIR ---------------- */}
        <section className="px-[max(5vw,20px)] pb-24 pt-28 sm:pb-28" aria-labelledby="runs-faq">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="hx-stack" id="runs-faq">
              <span className="st st-cream">Les questions</span>
              <span className="st st-pink st-xl">Avant de venir</span>
            </h2>

            <dl className="mt-14 grid gap-4">
              {copy.runsPage.faq.map((entry, index) => (
                <div className="grid gap-3 rounded-[2px] border border-white/10 bg-[#1E1A21] p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:gap-10" key={entry.q}>
                  <dt className="flex items-baseline gap-4 font-display text-[clamp(1.4rem,2.2vw,2rem)] uppercase leading-[1.1]">
                    <span aria-hidden="true" className="shrink-0 font-mono text-xs font-bold tracking-[.14em] text-[#FFC531]">0{index + 1}</span>
                    <span>{entry.q}</span>
                  </dt>
                  <dd className="text-[1.05rem] leading-relaxed text-white/85">{entry.a}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-16 flex flex-col items-center gap-5 text-center">
              <p className="st st-yellow">Il reste une question ?</p>
              <Link className="hx-pill" href={contactHref}>
                <span>{copy.runsPage.cta}</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}

function RunCardCol({ index, joinHref, run }: { index: number; joinHref: string; run: RunEvent }) {
  // Sans photo choisie dans l'admin, une vraie photo des sorties du club.
  const visuels = [
    { src: "/assets/actus/quatrieme-run/03.webp", position: "object-[50%_45%]", etiquette: "st-yellow" },
    { src: "/assets/actus/bienvenue/09.webp", position: "object-center", etiquette: "st-pink" },
    { src: "/assets/actus/quatrieme-run/02.webp", position: "object-center", etiquette: "st-blue" }
  ];
  const visuel = visuels[index % visuels.length];

  return (
    <Reveal as="article" className="run-poster group relative h-full w-full overflow-hidden rounded-[2px] text-white" delay={index * 100}>
      {/* La photo de la sortie si l'admin en a mis une, sinon une photo du
          club. Servie telle quelle depuis Supabase : aucun domaine distant
          a declarer dans next.config. */}
      <Image
        alt=""
        className={`run-card-image object-cover ${run.image ? "object-center" : visuel.position}`}
        fill
        sizes="(min-width: 1280px) 64vw, (min-width: 640px) 78vw, 90vw"
        src={run.image || visuel.src}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,22,.15)_0%,rgba(20,17,22,.25)_40%,rgba(20,17,22,.85)_100%)]" />

      <div className="relative z-10 flex h-full min-h-[31rem] flex-col justify-between p-5 sm:min-h-[34rem] sm:p-8 lg:min-h-[36rem] lg:p-10">
        <div>
          <span className={`st ${visuel.etiquette}`}>{index === 0 ? "La prochaine" : `Sortie ${index + 1}`}</span>
        </div>

        <div>
          <h3 className="max-w-[14ch] font-display text-[clamp(2.4rem,5.6vw,5.6rem)] uppercase leading-[1.02] [overflow-wrap:normal]" id={`run-${run.id}`}>
            {run.date}
          </h3>
          <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-xs font-bold uppercase tracking-[.1em]">
            <span className="rounded-[2px] bg-white/15 px-3 py-2.5">RDV {run.time}</span>
            <span className="rounded-[2px] bg-white/15 px-3 py-2.5">{run.distance}</span>
            <a
              aria-label={`Ouvrir le lieu de départ ${run.location} dans Google Maps`}
              className="inline-flex min-h-11 items-center gap-2 rounded-[2px] bg-white/15 px-3 py-2 transition-colors hover:bg-white hover:text-[#141116] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC531]"
              href={mapsUrl(run)}
              rel="noreferrer noopener"
              target="_blank"
            >
              <span aria-hidden="true">⌖</span>
              <span>{run.location}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          {run.inscriptionsOuvertes === false ? (
            <p className="st st-cream mt-6">Inscriptions fermées</p>
          ) : (
            <Link
              aria-label={`Choisir la sortie du ${run.date}, à ${run.time}, ${run.distance}. Départ ${run.location}.`}
              className="hx-pill mt-6"
              href={joinHref}
            >
              <span>Choisir cette sortie</span>
              <ArrowIcon />
            </Link>
          )}
        </div>
      </div>
    </Reveal>
  );
}
