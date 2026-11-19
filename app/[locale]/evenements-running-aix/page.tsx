import type { Metadata } from "next";
import { GuideView } from "../../../components/guide-view";
import { getGuide } from "../../../lib/guides";
import { resolveLocale } from "../../../lib/locale";
import { listPublicRuns } from "../../../lib/races/repo";
import { buildGuideMetadata } from "../../../lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

// Les dates viennent de la base : meme regeneration que la page Sorties.
export const revalidate = 60;

const guide = getGuide("evenements-running-aix")!;

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata(guide);
}

export default async function LocalEventsPage({ params }: PageProps) {
  // La page d'agenda montre les vraies dates, lues en base.
  return <GuideView guide={guide} locale={resolveLocale((await params).locale)} prochaines={await listPublicRuns()} />;
}
