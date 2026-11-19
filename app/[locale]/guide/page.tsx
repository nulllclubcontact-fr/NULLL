import type { Metadata } from "next";
import { CarteGuide } from "../../../components/guide-view";
import "../../../components/home-experience.css";
import { SiteShell } from "../../../components/site-shell";
import { StructuredData } from "../../../components/StructuredData";
import { GUIDES } from "../../../lib/guides";
import { resolveLocale } from "../../../lib/locale";
import { buildBreadcrumbSchema, buildPageMetadata, getSiteUrl } from "../../../lib/seo";
import { getRoute, getSiteCopy } from "../../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const meta = getSiteCopy(locale).meta.guides;
  return buildPageMetadata({ locale, routeKey: "guides", title: meta.title, description: meta.description });
}

const COULEURS = ["st-pink", "st-yellow", "st-blue", "st-lime"];

export default async function GuidesPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const base = getRoute(locale, "guides");

  return (
    <SiteShell current="guides" locale={locale} pathname={base}>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Accueil", url: getRoute(locale, "home") },
            { name: "Guides", url: base }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Guides locaux d’Aix-en-Provence",
            itemListElement: GUIDES.map((guide, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: guide.titre,
              url: `${getSiteUrl()}${guide.chemin}`
            }))
          }
        ]}
      />

      <div className="home-journey hx-sans-hero">
        <header className="hx-page-head">
          <h1 className="hx-stack">
            <span className="st st-blue">Nos guides</span>
            <span className="st st-yellow st-xl">d’Aix-en-Provence</span>
          </h1>
          <p>Courir, rencontrer du monde, sortir : tout ce qu’on aurait aimé savoir en arrivant à Aix, écrit par le club.</p>
        </header>

        <section className="hx-news !pt-4" aria-label="Tous les guides">
          <ol className="hx-news-list hx-guides-list">
            {GUIDES.map((guide, index) => (
              <li key={guide.slug}>
                <CarteGuide couleur={COULEURS[index % COULEURS.length]} guide={guide} />
              </li>
            ))}
          </ol>
        </section>
      </div>
    </SiteShell>
  );
}
