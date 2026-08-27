import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
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

export default async function AboutPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  // Vise directement la cible finale : enchainer about -> a-propos -> communaute
  // ferait une chaine de redirections, que Google deconseille.
  permanentRedirect(getRoute(locale, "community"));
}
