import type { Metadata } from "next";
import { resolveLocale } from "../../../lib/locale";
import { buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy } from "../../../lib/site-content";
import { SeoArticleView } from "../../shared/SeoArticleView";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const article = getSiteCopy(locale).articles.find((entry) => entry.key === "localRunning")!;
  return buildPageMetadata({
    locale,
    routeKey: "localRunning",
    title: article.title,
    description: article.description
  });
}

export default async function LocalRunningPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const article = getSiteCopy(locale).articles.find((entry) => entry.key === "localRunning")!;

  return <SeoArticleView article={article} locale={locale} pathname={getRoute(locale, "localRunning")} />;
}
