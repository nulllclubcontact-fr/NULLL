import { CommunityPageView } from "../../../components/LocalizedPageViews";
import { resolveLocale } from "../../../lib/locale";
import { generateMetadata } from "../community/page";

export { generateMetadata };

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedCommunityPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  return <CommunityPageView locale={locale} />;
}
