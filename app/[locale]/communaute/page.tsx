import { CommunityPageView } from "../../../components/LocalizedPageViews";
import { resolveLocale } from "../../../lib/locale";
import { generateMetadata } from "../community/page";

export { generateMetadata };

// Le recit bascule seul apres la premiere sortie (lib/site-content.ts) :
// la page statique se regenere au plus tard toutes les heures.
export const revalidate = 3600;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedCommunityPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  return <CommunityPageView locale={locale} />;
}
