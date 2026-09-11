import Link from "next/link";
import { StructuredData } from "../../components/StructuredData";
import { PrimaryLink, SiteShell } from "../../components/site-shell";
import { buildBreadcrumbSchema } from "../../lib/seo";
import { getRoute, type Article, type Locale, type RunEvent } from "../../lib/site-content";

/**
 * Les guides se lisent : titre a interligne ouvert (les lignes du h1 se
 * chevauchaient sur mobile), sections separees par un filet plutot que
 * des cadres a ombre, et un corps borne a une largeur de lecture.
 */
export function SeoArticleView({
  article,
  locale,
  pathname,
  prochaines
}: {
  article: Article;
  locale: Locale;
  pathname: string;
  /** Pour le guide des rendez-vous : les vraies dates, lues en base. */
  prochaines?: RunEvent[] | null;
}) {
  return (
    <SiteShell current="home" locale={locale} pathname={pathname}>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: article.h1, url: pathname }
        ])}
      />
      <article className="shell py-10 lg:py-14">
        <p className="inline-flex border-2 border-[#773331] bg-[#FFB200] px-3 py-2 font-mono text-xs font-black uppercase">Guide · NULLL.CLUB</p>
        <h1 className="mt-6 max-w-4xl font-display text-4xl uppercase leading-[1.12] tracking-[-.01em] sm:text-5xl lg:text-6xl">{article.h1}</h1>
        <p className="mt-6 max-w-[68ch] text-xl font-bold leading-snug">{article.intro}</p>

        {prochaines !== undefined ? <ProchainesDates locale={locale} runs={prochaines} /> : null}

        <div className="mt-12 grid gap-12">
          {article.sections.map((section) => (
            <section className="border-t-2 border-[#773331] pt-8" key={section.title}>
              <h2 className="max-w-3xl font-display text-2xl uppercase leading-[1.15] tracking-[-.01em] sm:text-3xl">{section.title}</h2>
              <div className="mt-5 max-w-[68ch] space-y-4 text-lg leading-relaxed">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <PrimaryLink href={getRoute(locale, "runs")}>Voir les prochaines sorties</PrimaryLink>
          <PrimaryLink href={getRoute(locale, "contact")} secondary>
            Contacter le club
          </PrimaryLink>
        </div>
      </article>
    </SiteShell>
  );
}

function ProchainesDates({ locale, runs }: { locale: Locale; runs: RunEvent[] | null }) {
  return (
    <section aria-labelledby="prochaines-dates" className="mt-10 border-2 border-[#773331] bg-[#EBA0CD] p-5 sm:p-6">
      <h2 className="font-mono text-xs font-black uppercase tracking-[.16em]" id="prochaines-dates">
        Les prochaines dates
      </h2>
      {runs && runs.length > 0 ? (
        <ul className="mt-4 grid gap-2">
          {runs.map((run) => (
            <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[#773331] pb-2 last:border-b-0" key={run.id}>
              <span className="font-display text-xl uppercase leading-[1.15]">{run.date}</span>
              <span className="font-mono text-xs font-black uppercase tracking-[.1em]">
                {run.time} · {run.distance} · {run.location}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 font-bold">
          {runs === null ? "Impossible de charger les dates pour le moment." : "Les prochaines dates arrivent bientôt."}
        </p>
      )}
      <Link className="mt-4 inline-flex min-h-11 items-center font-mono text-xs font-black uppercase tracking-[.12em] underline decoration-2 underline-offset-4" href={getRoute(locale, "runs")}>
        S’inscrire à une sortie
      </Link>
    </section>
  );
}
