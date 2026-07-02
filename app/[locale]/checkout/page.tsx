import type { Metadata } from "next";
import { redirect } from "next/navigation";
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

export default async function CheckoutPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  redirect(getRoute(locale, "checkout"));
}
