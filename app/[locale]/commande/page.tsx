import { redirect } from "next/navigation";
import { CheckoutPageView, generateMetadata } from "../checkout/page";
import { resolveLocale } from "../../../lib/locale";
import { getRoute } from "../../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export { generateMetadata };

export default async function LocalizedCheckoutPage(props: PageProps) {
  const locale = resolveLocale((await props.params).locale);
  if (locale === "eng") {
    redirect(getRoute(locale, "checkout"));
  }
  return <CheckoutPageView locale={locale} />;
}
