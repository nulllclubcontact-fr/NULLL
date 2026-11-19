import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "../../../components/ArrowIcon";
import { StructuredData } from "../../../components/StructuredData";
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

      <header className="border-b border-white/10 bg-[#141116]">
        <div className="shell max-w-[1180px] py-12 sm:py-16 lg:py-20">
          <p className="font-mono text-xs font-black uppercase tracking-[.16em]">Actu · Nulll Club</p>
          <h1 className="da-stack mt-5"><span className="st st-blue">Ce qui bouge</span><span className="st st-yellow st-xl">au club !!!</span></h1>
          <p className="mt-6 max-w-[52ch] text-[clamp(1.1rem,1.6vw,1.3rem)] font-bold leading-relaxed">
            Les nouvelles du club : les sorties, les annonces, la vie du samedi.
          </p>
        </div>
      </header>

      <div className="shell max-w-[1180px] py-12 sm:py-16">
        <ol className="grid gap-8 md:grid-cols-2">
          {liste.map((actu) => (
            <li key={actu.slug}>
              <Link
                className="group grid h-full border-2 border-white/15 bg-[#141116] transition-colors hover:bg-[#FFC531] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]"
                href={`${base}/${actu.slug}`}
              >
                <span className="relative block aspect-[4/3] border-b-2 border-white/15">
                  <Image alt={actu.image.alt} className="object-cover" fill sizes="(min-width: 768px) 560px, 100vw" src={actu.image.src} />
                </span>
                <span className="grid gap-4 p-6">
                  <time className="font-mono text-xs font-black uppercase tracking-[.16em]" dateTime={actu.date}>
                    {formaterDateActu(actu.date)}
                  </time>
                  <span className="font-display text-[clamp(1.7rem,3vw,2.3rem)] uppercase leading-[1.1]">{actu.titre}</span>
                  <span className="text-lg leading-relaxed">{actu.resume}</span>
                  <span className="inline-flex items-center gap-3 font-mono text-xs font-black uppercase tracking-[.12em]">
                    Lire l’actu <ArrowIcon />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </SiteShell>
  );
}
