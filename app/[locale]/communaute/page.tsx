import { redirect } from "next/navigation";
import { CommunityPageView, generateMetadata } from "../community/page";
import { resolveLocale } from "../../../lib/locale";
import { getRoute } from "../../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export { generateMetadata };

export default async function LocalizedCommunityPage(props: PageProps) {
  const locale = resolveLocale((await props.params).locale);
  if (locale === "eng") {
    redirect(getRoute(locale, "community"));
  }
  return <CommunityPageView locale={locale} />;
}
