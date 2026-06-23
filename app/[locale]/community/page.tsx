import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PosterPhoto } from "../../../components/PosterPhoto";
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
    routeKey: "community",
    title: copy.meta.community.title,
    description: copy.meta.community.description
  });
}

export function CommunityPageView({ locale }: { locale: "fr" | "eng" }) {
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="community" locale={locale} pathname={getRoute(locale, "community")}>
      <section className="shell py-10 lg:py-14">
        <SectionTitle as="h1" index="07" text={copy.communityPage.intro} title={copy.communityPage.title} />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <PosterPhoto
            alt={locale === "fr" ? "Deux membres de NULLL.CLUB à Aix-en-Provence" : "Two NULLL.CLUB members in Aix-en-Provence"}
            className="min-h-[520px]"
            priority
            src="/assets/photos/run-sunset.png"
            stamp="COMMUNITY"
          />
          <div className="grid gap-6">
            {copy.communityPage.pillars.map((pillar) => (
              <article className="panel p-6" key={pillar.title}>
                <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] uppercase leading-[0.92]">{pillar.title}</h2>
                <p className="mt-4 text-paper/72">{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export default async function CommunityPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  if (locale === "fr") {
    redirect(getRoute(locale, "community"));
  }
  return <CommunityPageView locale={locale} />;
}
