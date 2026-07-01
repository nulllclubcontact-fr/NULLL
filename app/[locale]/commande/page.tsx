import { CheckoutPageView } from "../../../components/LocalizedPageViews";
import { resolveLocale } from "../../../lib/locale";
import { generateMetadata } from "../checkout/page";

export { generateMetadata };

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedCheckoutPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  return <CheckoutPageView locale={locale} />;
}
