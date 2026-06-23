import type { Metadata } from "next";
import { MerchExperience } from "../../../components/merch-experience";
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
  return buildPageMetadata({
    locale,
    routeKey: "merch",
    title: copy.meta.merch.title,
    description: copy.meta.merch.description
  });
}

export default async function MerchPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="merch" locale={locale} pathname={getRoute(locale, "merch")}>
      <section className="shell py-10 lg:py-14">
        <SectionTitle as="h1" index="10" text={copy.merchPage.intro} title={copy.merchPage.title} />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {copy.merchPage.trust.map((item) => (
            <div className="panel p-4" key={item}>
              <p>{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <MerchExperience locale={locale} />
        </div>
      </section>
    </SiteShell>
  );
}
