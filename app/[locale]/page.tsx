import type { Metadata } from "next";
import { HomeExperience } from "../../components/home-experience";
import { StructuredData } from "../../components/StructuredData";
import { SiteShell } from "../../components/site-shell";
import { resolveLocale } from "../../lib/locale";
import { buildFaqSchema, buildOrganizationSchema, buildPageMetadata, buildSportsLocationSchema, buildWebSiteSchema } from "../../lib/seo";
import { getRoute, getSiteCopy } from "../../lib/site-content";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  return buildPageMetadata({ locale, routeKey: "home", title: copy.meta.home.title, description: copy.meta.home.description });
}

export default async function LocaleHomePage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="home" locale={locale} pathname={`/${locale}`}>
      <StructuredData data={[buildOrganizationSchema(locale), buildSportsLocationSchema(locale), buildWebSiteSchema(locale), buildFaqSchema(copy.home.faq)]} />
      <HomeExperience
        aboutHref={getRoute(locale, "about")}
        communityHref={getRoute(locale, "community")}
        merchHref={getRoute(locale, "merch")}
        runs={copy.runs}
        runsHref={getRoute(locale, "runs")}
      />
    </SiteShell>
  );
}
