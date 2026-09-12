import Link from "next/link";
import { StructuredData } from "../../components/StructuredData";
import { PrimaryLink, SiteShell } from "../../components/site-shell";
import { buildBreadcrumbSchema } from "../../lib/seo";
import { getRoute, type Article, type Locale, type RunEvent } from "../../lib/site-content";

/**
 * Les guides se lisent comme un article : un sommaire qui reste a cote sur
 * grand ecran, un corps a largeur de lecture et en plus grand, des
 * sections qui respirent, et une invitation claire a la fin. Toute la
 * largeur de la page servait avant a un texte colle a gauche.
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

      <article>
        <header className="border-b-2 border-[#773331] bg-[#EBA0CD]">
          <div className="shell max-w-[1180px] py-12 sm:py-16 lg:py-20">
            <p className="font-mono text-xs font-black uppercase tracking-[.16em]">Guide · NULLL.CLUB</p>
            <h1 className="mt-5 max-w-[22ch] font-display text-[clamp(2.4rem,6vw,4.6rem)] uppercase leading-[1.08] tracking-[-.01em] [text-wrap:balance]">
              {article.h1}
            </h1>
            <p className="mt-7 max-w-[60ch] text-[clamp(1.15rem,1.6vw,1.35rem)] font-bold leading-relaxed">{article.intro}</p>
          </div>
        </header>

        <div className="shell grid max-w-[1180px] gap-12 py-12 sm:py-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-xs font-black uppercase tracking-[.16em]">Dans ce guide</p>
            <ol className="mt-4 grid gap-1 border-l-2 border-[#773331]">
              {article.sections.map((section, index) => (
                <li key={section.title}>
                  <a
                    className="block py-2 pl-4 text-[0.95rem] font-bold leading-snug transition-colors hover:bg-[#FFB200] focus-visible:bg-[#FFB200] focus-visible:outline-none"
                    href={`#section-${index + 1}`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
            <Link
              className="mt-6 inline-flex min-h-11 items-center border-2 border-[#773331] bg-[#773331] px-4 font-mono text-xs font-black uppercase tracking-[.12em] text-[#F1EDE9] transition-colors hover:bg-[#FFB200] hover:text-[#773331]"
              href={getRoute(locale, "runs")}
            >
              Voir les sorties
            </Link>
          </aside>

          <div className="min-w-0">
            {prochaines !== undefined ? <ProchainesDates locale={locale} runs={prochaines} /> : null}

            <div className="grid gap-14">
              {article.sections.map((section, index) => (
                <section className="scroll-mt-28" id={`section-${index + 1}`} key={section.title}>
                  <h2 className="max-w-[26ch] font-display text-[clamp(1.7rem,3vw,2.3rem)] uppercase leading-[1.12] [text-wrap:balance]">
                    {section.title}
                  </h2>
                  <div className="mt-5 max-w-[66ch] space-y-5 text-[1.15rem] leading-[1.75]">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-16 grid gap-5 border-2 border-[#773331] bg-[#FFB200] p-6 sm:p-8">
              <p className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] uppercase leading-[1.1]">Envie d’essayer ?</p>
              <p className="max-w-[52ch] text-lg leading-relaxed">Choisis ta prochaine sortie, ou pose-nous une question avant de venir.</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <PrimaryLink href={getRoute(locale, "runs")}>Voir les prochaines sorties</PrimaryLink>
                <PrimaryLink href={getRoute(locale, "contact")} secondary>
                  Contacter le club
                </PrimaryLink>
              </div>
            </div>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}

function ProchainesDates({ locale, runs }: { locale: Locale; runs: RunEvent[] | null }) {
  return (
    <section aria-labelledby="prochaines-dates" className="mb-14 border-2 border-[#773331] bg-[#F1EDE9] p-5 shadow-[8px_8px_0_#EBA0CD] sm:p-6">
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
        <p className="mt-4 font-bold">{runs === null ? "Impossible de charger les dates pour le moment." : "Les prochaines dates arrivent bientôt."}</p>
      )}
      <Link className="mt-4 inline-flex min-h-11 items-center font-mono text-xs font-black uppercase tracking-[.12em] underline decoration-2 underline-offset-4" href={getRoute(locale, "runs")}>
        S’inscrire à une sortie
      </Link>
    </section>
  );
}
