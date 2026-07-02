import type { Metadata } from "next";
import { StructuredData } from "../../../components/StructuredData";
import { MerchExperience } from "../../../components/merch-experience";
import { SectionTitle, SiteShell } from "../../../components/site-shell";
import { resolveLocale } from "../../../lib/locale";
import { buildBreadcrumbSchema, buildPageMetadata } from "../../../lib/seo";
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
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "Merch", url: getRoute(locale, "merch") }
        ])}
      />
      <section className="mx-auto w-full max-w-none px-4 py-10 sm:px-6 xl:px-8 xl:py-14">
        <SectionTitle as="h1" index="10" text={copy.merchPage.intro} title={copy.merchPage.title} />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {copy.merchPage.trust.map((item, index) => (
            <div className={`${index % 2 === 0 ? "bg-[#d96ab4]" : "bg-[#ffb000]"} border-2 border-[#351815] p-4 font-mono text-sm font-black uppercase`} key={item}>
              {item}
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
