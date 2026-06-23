import { redirect } from "next/navigation";
import { AboutPageView, generateMetadata } from "../about/page";
import { resolveLocale } from "../../../lib/locale";
import { getRoute } from "../../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export { generateMetadata };

export default async function LocalizedAboutPage(props: PageProps) {
  const locale = resolveLocale((await props.params).locale);
  if (locale === "eng") {
    redirect(getRoute(locale, "about"));
  }
  return <AboutPageView locale={locale} />;
}
