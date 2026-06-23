import type { Metadata } from "next";
import { StructuredData } from "../../../components/StructuredData";
import { PrimaryLink, RunCard, SectionTitle, SiteShell } from "../../../components/site-shell";
import { resolveLocale } from "../../../lib/locale";
import { buildEventSchema, buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy } from "../../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  return buildPageMetadata({
    locale,
    routeKey: "runs",
    title: copy.meta.runs.title,
    description: copy.meta.runs.description
  });
}

export default async function RunsPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="runs" locale={locale} pathname={getRoute(locale, "runs")}>
      <section className="shell py-10 lg:py-14">
        <SectionTitle as="h1" index="06" text={copy.runsPage.intro} title={copy.runsPage.title} />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {copy.runsPage.checklist.map((item) => (
            <div className="panel p-4" key={item}>
              <p className="text-lg">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {copy.runs.map((run) => (
            <div key={run.id}>
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
              />
              <RunCard locale={locale} run={run} />
            </div>
          ))}
        </div>
      </section>

      <section className="shell py-8 lg:py-12">
        <div className="panel grid gap-6 p-6 lg:grid-cols-[0.7fr_1.3fr] lg:p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-accent">
              {locale === "fr" ? "FAQ run club" : "Run club FAQ"}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.8rem,6vw,5rem)] uppercase leading-[0.9]">
              {locale === "fr" ? "Les réponses qui lèvent les freins." : "Answers that remove friction."}
            </h2>
          </div>
          <div className="grid gap-4">
            {copy.runsPage.faq.map((entry) => (
              <article className="border-t border-paper/15 pt-4" key={entry.q}>
                <h3 className="text-xl font-semibold">{entry.q}</h3>
                <p className="mt-3 text-paper/70">{entry.a}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <PrimaryLink href={getRoute(locale, "contact")}>{copy.runsPage.cta}</PrimaryLink>
        </div>
      </section>
    </SiteShell>
  );
}
