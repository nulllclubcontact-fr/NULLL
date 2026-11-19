import type { Metadata } from "next";
import { GuideView } from "../../../components/guide-view";
import { getGuide } from "../../../lib/guides";
import { resolveLocale } from "../../../lib/locale";
import { buildGuideMetadata } from "../../../lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const guide = getGuide("run-club-aix-en-provence")!;

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata(guide);
}

export default async function LocalClubPage({ params }: PageProps) {
  return <GuideView guide={guide} locale={resolveLocale((await params).locale)} />;
}
