import type { Metadata } from "next";
import { StructuredData } from "../../../components/StructuredData";
import { MerchExperience, MerchNotice } from "../../../components/merch-experience";
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

      <MerchNotice runsHref={getRoute(locale, "runs")} />

      {/* ---------------- LES PIECES ----------------
          Pas d'affiche d'ouverture ici : c'est une page qui vend des
          vetements, la premiere chose a l'ecran doit etre les vetements.
          Le titre tient sur une barre, les pieces demarrent juste dessous. */}
      <section className="bg-[#f6eadf] text-[#351815]">
        <div className="mx-auto w-full max-w-[1600px] px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-10 xl:px-12">
          <div className="flex flex-col gap-5 border-b-2 border-[#351815] pb-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div>
              <h1 className="font-display text-[clamp(2.2rem,4.6vw,3.8rem)] uppercase leading-[.88] tracking-[-.035em]">{page.title}</h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[#351815]/72">{page.intro}</p>
            </div>
            {/* Les photos des cartes sont des images d'ambiance, pas les
                pieces. Dit une fois ici en clair, et rappele sur chaque
                photo par une etiquette. */}
            {/* Le compte est un chapo court : il supporte le .18em du reste
                du site. La mention est une phrase — a cet ecartement les mots
                se detachent les uns des autres. Reglage phrase : lettres
                resserrees, mots elargis. */}
            <p className="shrink-0 font-mono text-[.62rem] font-black uppercase leading-[1.7] text-[#351815]/55 lg:text-right">
              <span className="block tracking-[.18em]">{products.length} pièces en ligne</span>
              <span className="block tracking-[.06em] text-[#351815] [word-spacing:.14em]">
                Photos d’ambiance — les visuels des pièces arrivent
              </span>
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <MerchExperience locale={locale} />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
