import type { Metadata } from "next";
import { StructuredData } from "../../../components/StructuredData";
import { MerchExperience } from "../../../components/merch-experience";
import "../../../components/home-experience.css";
import { SiteShell } from "../../../components/site-shell";
import { resolveLocale } from "../../../lib/locale";
import { buildBreadcrumbSchema, buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy, productsByLocale } from "../../../lib/site-content";

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
  const page = copy.merchPage;
  const products = productsByLocale[locale];

  return (
    <SiteShell current="merch" locale={locale} pathname={getRoute(locale, "merch")}>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "Merch", url: getRoute(locale, "merch") }
        ])}
      />

      <div className="home-journey hx-sans-hero">
        <header className="hx-page-head">
          <h1 className="hx-stack">
            <span className="st st-yellow">Merch</span>
            <span className="st st-pink st-xl">{page.title.replace(/\.$/, "")}</span>
          </h1>
          <p>{page.intro}</p>
          <p className="st st-cream">{products.length} pièces · photos d’ambiance, les visuels arrivent</p>
        </header>
        <div className="mx-auto w-full max-w-[1500px] px-[max(5vw,20px)] pb-28">
          <MerchExperience locale={locale} />
        </div>
      </div>
    </SiteShell>
  );
}
