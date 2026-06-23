import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutForm } from "../../../components/checkout-form";
import { SectionTitle, SiteShell } from "../../../components/site-shell";
import { resolveLocale } from "../../../lib/locale";
import { buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy } from "../../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  return {
    ...buildPageMetadata({
    locale,
    routeKey: "checkout",
    title: copy.meta.checkout.title,
    description: copy.meta.checkout.description
    }),
    robots: {
      index: false,
      follow: false
    }
  };
}

export function CheckoutPageView({ locale }: { locale: "fr" | "eng" }) {
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="merch" locale={locale} pathname={getRoute(locale, "checkout")}>
      <section className="shell py-10 lg:py-14">
        <SectionTitle as="h1" index="11" text={copy.checkoutPage.intro} title={copy.checkoutPage.title} />
        <div className="mt-10">
          <CheckoutForm locale={locale} />
        </div>
      </section>
    </SiteShell>
  );
}

export default async function CheckoutPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  if (locale === "fr") {
    redirect(getRoute(locale, "checkout"));
  }
  return <CheckoutPageView locale={locale} />;
}
