import { redirect } from "next/navigation";
import { CheckoutPageView } from "../../../components/LocalizedPageViews";
import { resolveLocale } from "../../../lib/locale";
import { BOUTIQUE_OUVERTE } from "../../../lib/shop";
import { getRoute } from "../../../lib/site-content";
import { generateMetadata } from "../checkout/page";

export { generateMetadata };

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedCheckoutPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);

  // Boutique fermee : le formulaire de commande n'a rien a proposer.
  if (!BOUTIQUE_OUVERTE) {
    redirect(getRoute(locale, "merch"));
  }

  return <CheckoutPageView locale={locale} />;
}
