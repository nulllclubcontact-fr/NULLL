import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CommunityPageView } from "../../../components/LocalizedPageViews";
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

export default async function CommunityPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  if (locale === "fr") {
    redirect(getRoute(locale, "community"));
  }
  return <CommunityPageView locale={locale} />;
}
