import Link from "next/link";
import type { Metadata } from "next";
import { StructuredData } from "../../components/StructuredData";
import { HeroPanel, PrimaryLink, RunCard, SectionTitle, SiteShell } from "../../components/site-shell";
import { buildEventSchema, buildOrganizationSchema, buildPageMetadata, buildSportsLocationSchema } from "../../lib/seo";
import { resolveLocale } from "../../lib/locale";
import { getRoute, getSiteCopy, type Locale } from "../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  return buildPageMetadata({
    locale,
    routeKey: "home",
    title: copy.meta.home.title,
    description: copy.meta.home.description
  });
}

export default async function LocaleHomePage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="home" locale={locale} pathname={`/${locale}`}>
      <StructuredData data={[buildOrganizationSchema(locale), buildSportsLocationSchema(locale)]} />
      <HeroPanel
        actions={
          <>
            <PrimaryLink href={getRoute(locale, "runs")}>{copy.home.hero.primaryCta}</PrimaryLink>
            <PrimaryLink href={getRoute(locale, "community")} secondary>
              {copy.home.hero.secondaryCta}
            </PrimaryLink>
          </>
        }
        facts={copy.home.hero.stats}
        image="/assets/photos/motion-run.png"
        imageAlt={locale === "fr" ? "Coureurs de NULLL.CLUB à Aix-en-Provence" : "NULLL.CLUB runners in Aix-en-Provence"}
        intro={copy.home.hero.intro}
        label={locale === "fr" ? "Accueil / Run club social" : "Home / Social run club"}
        stamp="01"
        title={copy.home.hero.title}
      />

      <section className="shell py-8 lg:py-12">
        <SectionTitle index="02" text={copy.home.sections.nextRunsText} title={copy.home.sections.nextRunsTitle} />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {copy.runs.map((run, index) => (
            <div key={run.id}>
              {index === 0 ? (
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
              ) : null}
              <RunCard locale={locale} run={run} />
            </div>
          ))}
        </div>
      </section>

      <section className="shell py-8 lg:py-12">
        <SectionTitle index="03" title={copy.home.sections.howTitle} />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {copy.home.sections.howSteps.map((step, index) => (
            <article className="panel p-5 lg:p-6" key={step.title}>
              <p className="text-sm uppercase tracking-[0.18em] text-accent">0{index + 1}</p>
              <h3 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-[0.95]">{step.title}</h3>
              <p className="mt-4 text-paper/74">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell py-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="panel p-6 lg:p-8">
            <SectionTitle index="04" text={copy.home.sections.seoBody} title={copy.home.sections.seoTitle} />
            <div className="mt-8 space-y-4">
              {copy.home.promise.map((item) => (
                <p className="border-t border-paper/15 pt-4 text-paper/74" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="panel p-6 lg:p-8">
            <SectionTitle index="05" text={copy.home.sections.merchText} title={copy.home.sections.merchTitle} />
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <PrimaryLink href={getRoute(locale, "merch")}>{locale === "fr" ? "Voir le merch" : "See the merch"}</PrimaryLink>
              <PrimaryLink href={getRoute(locale, "contact")} secondary>
                {locale === "fr" ? "Contacter le club" : "Contact the club"}
              </PrimaryLink>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {copy.home.faq.map((entry) => (
                <article className="border-t border-paper/15 pt-4" key={entry.q}>
                  <h3 className="font-semibold">{entry.q}</h3>
                  <p className="mt-3 text-paper/68">{entry.a}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="shell pb-16 pt-8 lg:pb-20">
        <div className="panel grid gap-6 p-6 lg:grid-cols-[0.82fr_1.18fr] lg:p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-accent">
              {locale === "fr" ? "Pages locales" : "Local pages"}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.8rem,6vw,5rem)] uppercase leading-[0.92]">
              {locale === "fr" ? "Renforcer la présence locale du club." : "Strengthen the club’s local footprint."}
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              { key: "localClub" as const, label: locale === "fr" ? "Run club Aix-en-Provence" : "Aix-en-Provence run club" },
              { key: "localRunning" as const, label: locale === "fr" ? "Courir à Aix-en-Provence" : "Running in Aix-en-Provence" },
              { key: "localEvents" as const, label: locale === "fr" ? "Événements running Aix" : "Aix running events" }
            ].map((entry) => (
              <Link className="primary-link group justify-between" href={getRoute(locale, entry.key)} key={entry.key}>
                <span>{entry.label}</span>
                <span>{locale === "fr" ? "Lire" : "Read"}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
