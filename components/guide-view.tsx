import Image from "next/image";
import Link from "next/link";
import { getGuide, type Guide } from "../lib/guides";
import { buildBreadcrumbSchema, buildFaqSchema, buildGuideSchema } from "../lib/seo";
import { getRoute, type Locale, type RunEvent } from "../lib/site-content";
import { ArrowIcon } from "./ArrowIcon";
import { CorpsMagazine } from "./article-magazine";
import { FaqAccordeon } from "./faq-accordeon";
import "./home-experience.css";
import { PastilleNulll } from "./pastille-nulll";
import { SiteShell } from "./site-shell";
import { StructuredData } from "./StructuredData";

const DATE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

export function formaterDateGuide(iso: string) {
  return DATE.format(new Date(`${iso}T12:00:00+01:00`));
}

/**
 * Un guide local se lit comme une actu (mise en page magazine), avec en
 * plus ce qui sert le referencement classique et les moteurs IA : un bloc
 * « En bref » qui repond tout de suite, une FAQ balisee, des liens vers
 * les guides voisins, et une fiche Article.
 */
export function GuideView({ guide, locale, prochaines }: { guide: Guide; locale: Locale; prochaines?: RunEvent[] | null }) {
  const index = getRoute(locale, "guides");
  const photos = guide.photos.filter((photo) => photo.src !== guide.image.src);
  const mots = [...guide.enBref, ...guide.sections.flatMap((section) => section.paragraphes), ...guide.faq.map((entree) => entree.a)].join(" ").split(/\s+/).length;
  const minutes = Math.max(1, Math.round(mots / 200));
  const voisins = guide.liens.map((slug) => getGuide(slug)).filter((voisin): voisin is Guide => Boolean(voisin));

  return (
    <SiteShell current="guides" locale={locale} pathname={guide.chemin}>
      <StructuredData
        data={[
          buildGuideSchema(guide),
          buildFaqSchema(guide.faq),
          buildBreadcrumbSchema([
            { name: "Accueil", url: getRoute(locale, "home") },
            { name: "Guides", url: index },
            { name: guide.titre, url: guide.chemin }
          ])
        ]}
      />

      <div className="home-journey">
        <section className="hx-hero hx-hero-bas !min-h-[min(92svh,900px)]" aria-labelledby="guide-titre">
          <Image alt={guide.image.alt} className="object-cover" fill priority sizes="100vw" src={guide.image.src} />
          <div className="hx-hero-shade" aria-hidden="true" />
          <div className="hx-hero-copy">
            <p className="st st-yellow">Guide local · {guide.rubrique}</p>
            <h1 className="mt-4 w-full max-w-[1100px] -rotate-1 [overflow-wrap:normal] [text-wrap:balance]" id="guide-titre">
              <span className="st st-pink st-long">{guide.titre}</span>
            </h1>
            <p className="mt-7 max-w-[56ch] text-[clamp(1.15rem,1.7vw,1.5rem)] font-normal leading-[1.45] text-white">{guide.resume}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-bold uppercase tracking-[.14em] text-white/75">
              <span>Par la team NULLL</span>
              <span aria-hidden="true">·</span>
              <span>
                Mis à jour le <time dateTime={guide.dateMiseAJour}>{formaterDateGuide(guide.dateMiseAJour)}</time>
              </span>
              <span aria-hidden="true">·</span>
              <span>{minutes} min de lecture</span>
            </p>
          </div>
        </section>

        <article className="px-[max(5vw,20px)] pb-24 pt-16 sm:pt-20">
          {/* En bref : les reponses directes, avant le recit. */}
          <aside aria-labelledby="en-bref" className="mx-auto mb-20 max-w-[780px] rounded-[2px] bg-[#FFF3DF] p-7 text-[#141116] sm:p-10" style={{ rotate: "-0.6deg" }}>
            <h2 className="st st-pink" id="en-bref">En bref</h2>
            <ul className="mt-6 grid gap-3 text-[1.08rem] font-medium leading-[1.6]">
              {guide.enBref.map((point) => (
                <li className="flex gap-3" key={point}>
                  <span aria-hidden="true" className="mt-[.55em] size-2 shrink-0 rotate-45 bg-[#E8459E]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </aside>

          {prochaines !== undefined ? <ProchainesDates locale={locale} runs={prochaines} /> : null}

          <CorpsMagazine photos={photos} sections={guide.sections} />

          <section aria-labelledby="guide-faq" className="mx-auto mt-10 max-w-[900px]">
            <h2 className="st st-blue" id="guide-faq">Questions fréquentes</h2>
            <div className="mt-8">
              <FaqAccordeon entrees={guide.faq} nom={`faq-${guide.slug}`} />
            </div>
          </section>

          {voisins.length > 0 ? (
            <section aria-labelledby="a-lire-aussi" className="mx-auto mt-24 max-w-[1100px]">
              <h2 className="st st-lime" id="a-lire-aussi">À lire aussi</h2>
              <ul className="hx-news-list hx-guides-list mt-10">
                {voisins.map((voisin) => (
                  <li key={voisin.slug}>
                    <CarteGuide guide={voisin} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <aside className="mx-auto mt-24 flex max-w-[1100px] flex-col items-center gap-5 rounded-[2px] bg-[#E8459E] px-6 py-14 text-center">
            <p className="st st-yellow st-lg">On court samedi ?</p>
            <p className="max-w-md text-lg font-bold text-white">Un samedi sur deux, gratuit, ouvert à tous. Choisis ta sortie et viens comme tu es.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link className="hx-pill" href={getRoute(locale, "runs")}>
                <span>Voir les sorties</span>
                <ArrowIcon />
              </Link>
              <Link className="inline-flex min-h-[62px] items-center rounded-[2px] border border-white/70 px-5 font-mono text-xs font-bold uppercase tracking-[.1em] text-white transition-colors hover:bg-white hover:text-[#141116]" href={index}>
                Tous les guides
              </Link>
            </div>
          </aside>
        </article>
      </div>
    </SiteShell>
  );
}

/** Carte de guide, version reduite des cartes d'actus (4 par rangee). */
export function CarteGuide({ guide, couleur = "st-yellow" }: { guide: Guide; couleur?: string }) {
  return (
    <Link className="hx-news-card" href={guide.chemin}>
      <span className="hx-news-photo">
        <Image alt={guide.image.alt} fill sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 25vw" src={guide.image.src} />
        <PastilleNulll />
      </span>
      <span className={`st ${couleur} hx-news-date`}>{guide.rubrique}</span>
      <h3 className="st st-cream hx-news-title">{guide.titre}</h3>
      <p className="hx-news-text">{guide.description}</p>
    </Link>
  );
}

function ProchainesDates({ locale, runs }: { locale: Locale; runs: RunEvent[] | null }) {
  return (
    <section aria-labelledby="prochaines-dates" className="mx-auto mb-20 max-w-[780px] rounded-[2px] border border-white/10 bg-[#1E1A21] p-6 sm:p-8">
      <h2 className="st st-yellow" id="prochaines-dates">
        Les prochaines dates
      </h2>
      {runs && runs.length > 0 ? (
        <ul className="mt-5 grid gap-2">
          {runs.map((run) => (
            <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-white/15 pb-2 last:border-b-0" key={run.id}>
              <span className="font-display text-xl uppercase leading-[1.15]">{run.date}</span>
              <span className="font-mono text-xs font-bold uppercase tracking-[.1em]">
                {run.time} · {run.distance} · {run.location}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 font-bold">{runs === null ? "Impossible de charger les dates pour le moment." : "Les prochaines dates arrivent bientôt."}</p>
      )}
      <Link className="mt-5 inline-flex min-h-11 items-center font-mono text-xs font-bold uppercase tracking-[.12em] underline decoration-2 underline-offset-4 hover:text-[#FFC531]" href={getRoute(locale, "runs")}>
        S’inscrire à une sortie
      </Link>
    </section>
  );
}
