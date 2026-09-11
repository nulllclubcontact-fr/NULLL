import type { Metadata } from "next";
import { resolveLocale } from "../../../lib/locale";
import { listPublicRuns } from "../../../lib/races/repo";
import { buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy } from "../../../lib/site-content";
import { SeoArticleView } from "../../shared/SeoArticleView";

type PageProps = {
  params: Promise<{ locale: string }>;
};

// Les dates viennent de la base : meme regeneration que la page Sorties.
export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const article = getSiteCopy(locale).articles.find((entry) => entry.key === "localEvents")!;
  return buildPageMetadata({
    locale,
    routeKey: "localEvents",
    title: article.title,
    description: article.description
  });
}

export default async function LocalEventsPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const article = getSiteCopy(locale).articles.find((entry) => entry.key === "localEvents")!;

  // La page s'appelait « agenda » sans montrer une seule date.
  return <SeoArticleView article={article} locale={locale} pathname={getRoute(locale, "localEvents")} prochaines={await listPublicRuns()} />;
}
