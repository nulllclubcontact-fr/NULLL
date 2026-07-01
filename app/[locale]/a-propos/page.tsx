import { AboutPageView } from "../../../components/LocalizedPageViews";
import { resolveLocale } from "../../../lib/locale";
import { getRoute } from "../../../lib/site-content";
import { generateMetadata } from "../about/page";

export { generateMetadata };

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedAboutPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  return <AboutPageView locale={locale} />;
}
