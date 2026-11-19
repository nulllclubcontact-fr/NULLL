import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideView } from "../../../../components/guide-view";
import { getGuide, guidesDeLaRubrique } from "../../../../lib/guides";
import { resolveLocale } from "../../../../lib/locale";
import { buildGuideMetadata } from "../../../../lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Seuls les guides ecrits existent : une autre adresse est une 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return guidesDeLaRubrique().map((guide) => ({ slug: guide.slug }));
}

function trouver(slug: string) {
  const guide = getGuide(slug);
  // Les guides qui gardent leur ancienne adresse ne sont pas servis ici.
  if (!guide || !guide.chemin.startsWith("/fr/guide/")) notFound();
  return guide;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return buildGuideMetadata(trouver((await params).slug));
}

export default async function GuidePage({ params }: PageProps) {
  const { locale, slug } = await params;
  return <GuideView guide={trouver(slug)} locale={resolveLocale(locale)} />;
}
