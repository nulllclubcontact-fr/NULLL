import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { resolveLocale } from "../../../lib/locale";
import { buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy } from "../../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

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

export default async function AixRunningEventsPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  redirect(getRoute(locale, "localEvents"));
}
