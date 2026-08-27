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

// La page « a propos » et la page « communaute » disaient la meme chose sur
// deux URL differentes. Elles sont fusionnees sur /communaute, qui vise une
// requete reelle. Redirection permanente pour ne casser aucun lien existant.
export default async function AboutPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  permanentRedirect(getRoute(locale, "community"));
}
