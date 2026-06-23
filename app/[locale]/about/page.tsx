import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SectionTitle, SiteShell } from "../../../components/site-shell";
import { resolveLocale } from "../../../lib/locale";
import { buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy } from "../../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  return buildPageMetadata({
    locale,
    routeKey: "about",
    title: copy.meta.about.title,
    description: copy.meta.about.description
  });
}

export function AboutPageView({ locale }: { locale: "fr" | "eng" }) {
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="about" locale={locale} pathname={getRoute(locale, "about")}>
      <section className="shell py-10 lg:py-14">
        <SectionTitle as="h1" index="08" text={copy.aboutPage.intro} title={copy.aboutPage.title} />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {copy.aboutPage.values.map((value) => (
            <article className="panel p-6 lg:p-8" key={value.title}>
              <p className="text-sm uppercase tracking-[0.18em] text-accent">{locale === "fr" ? "Valeur" : "Value"}</p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.4rem)] uppercase leading-[0.92]">{value.title}</h2>
              <p className="mt-4 text-paper/72">{value.text}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

export default async function AboutPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  if (locale === "fr") {
    redirect(getRoute(locale, "about"));
  }
  return <AboutPageView locale={locale} />;
}
