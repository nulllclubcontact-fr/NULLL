import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StructuredData } from "../../../components/StructuredData";
import "../../../components/home-experience.css";
import { SiteShell } from "../../../components/site-shell";
import { formaterDateActu, listActus } from "../../../lib/actus";
import { resolveLocale } from "../../../lib/locale";
import { buildBreadcrumbSchema, buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy } from "../../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const meta = getSiteCopy(locale).meta.news;
  return buildPageMetadata({ locale, routeKey: "news", title: meta.title, description: meta.description });
}

export default async function ActuPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const base = getRoute(locale, "news");
  const liste = listActus();

  return (
    <SiteShell current="news" locale={locale} pathname={base}>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "Actu", url: base }
        ])}
      />

      <div className="home-journey hx-sans-hero">
        <header className="hx-page-head">
          <h1 className="hx-stack">
            <span className="st st-blue">Ce qui bouge</span>
            <span className="st st-yellow st-xl">au club !!!</span>
          </h1>
          <p>Les nouvelles du club : les sorties, les annonces, la vie du samedi.</p>
        </header>

        <section className="hx-news !pt-4" aria-label="Toutes les actus">
          <ol className="hx-news-list">
            {liste.map((actu, index) => (
              <li key={actu.slug}>
                <Link className="hx-news-card" href={`${base}/${actu.slug}`}>
                  <span className="hx-news-photo">
                    <Image alt={actu.image.alt} fill sizes="(max-width: 760px) 92vw, 33vw" src={actu.image.src} />
                  </span>
                  <span className={`st ${["st-pink", "st-yellow", "st-blue"][index % 3]} hx-news-date`}>
                    <time dateTime={actu.date}>{formaterDateActu(actu.date)}</time>
                  </span>
                  <h2 className="st st-cream hx-news-title">{actu.titre}</h2>
                  <p className="hx-news-text">{actu.resume}</p>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </SiteShell>
  );
}
