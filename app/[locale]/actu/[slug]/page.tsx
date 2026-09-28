import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "../../../../components/StructuredData";
import { PrimaryLink, SiteShell } from "../../../../components/site-shell";
import { actus, formaterDateActu, getActu } from "../../../../lib/actus";
import { resolveLocale } from "../../../../lib/locale";
import {
  buildActuMetadata,
  buildBreadcrumbSchema,
  buildNewsArticleSchema,
} from "../../../../lib/seo";
import { getRoute } from "../../../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Seules les actus ecrites existent : une autre adresse est une 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return actus.map((actu) => ({ slug: actu.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: brut, slug } = await params;
  const locale = resolveLocale(brut);
  const actu = getActu(slug);
  if (!actu) notFound();
  return buildActuMetadata({
    ...actu,
    url: `${getRoute(locale, "news")}/${actu.slug}`,
  });
}

export default async function ActuArticlePage({ params }: PageProps) {
  const { locale: brut, slug } = await params;
  const locale = resolveLocale(brut);
  const actu = getActu(slug);
  if (!actu) notFound();

  const base = getRoute(locale, "news");
  const url = `${base}/${actu.slug}`;
  // La photo principale est deja en tete d'article : pas deux fois.
  const galerie = (actu.galerie ?? []).filter(
    (photo) => photo.src !== actu.image.src,
  );

  return (
    <SiteShell current="news" locale={locale} pathname={url}>
      <StructuredData
        data={[
          buildNewsArticleSchema({ ...actu, url }),
          buildBreadcrumbSchema([
            { name: "Accueil", url: getRoute(locale, "home") },
            { name: "Actu", url: base },
            { name: actu.titre, url },
          ]),
        ]}
      />

      <article>
        <header className="border-b-2 border-[#773331] bg-[#EBA0CD]">
          <div className="shell max-w-[1180px] py-12 sm:py-16 lg:py-20">
            <p className="font-mono text-xs font-black uppercase tracking-[.16em]">
              <Link
                className="underline decoration-2 underline-offset-4"
                href={base}
              >
                Actu
              </Link>
              {" · "}
              <time dateTime={actu.date}>{formaterDateActu(actu.date)}</time>
            </p>
            <h1 className="mt-5 max-w-[22ch] font-display text-[clamp(2.4rem,6vw,4.6rem)] uppercase leading-[1.08] tracking-[-.01em] [text-wrap:balance]">
              {actu.titre}
            </h1>
            <p className="mt-7 max-w-[60ch] text-[clamp(1.15rem,1.6vw,1.35rem)] font-bold leading-relaxed">
              {actu.resume}
            </p>
          </div>
        </header>

        {/* La grille est dans son propre bloc : « .shell.grid » (globals.css)
            force une seule colonne et l'emporterait sur lg:grid-cols. */}
        <div className="shell max-w-[1180px] py-12 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
            <div className="min-w-0">
              <figure className="relative mb-12 mr-2 aspect-[4/3] border-2 border-[#773331] shadow-[8px_8px_0_#FFB200] sm:mr-0">
                <Image
                  alt={actu.image.alt}
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 720px, 100vw"
                  src={actu.image.src}
                />
              </figure>
              <div className="grid gap-14">
                {actu.sections.map((section) => (
                  <section key={section.titre}>
                    <h2 className="max-w-[26ch] font-display text-[clamp(1.7rem,3vw,2.3rem)] uppercase leading-[1.12] [text-wrap:balance]">
                      {section.titre}
                    </h2>
                    <div className="mt-5 max-w-[66ch] space-y-5 text-[1.15rem] leading-[1.75]">
                      {section.paragraphes.map((paragraphe) => (
                        <p key={paragraphe}>{paragraphe}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
              {galerie.length > 0 ? (
                <section aria-labelledby="galerie-titre" className="mt-16">
                  <h2
                    className="font-display text-[clamp(1.7rem,3vw,2.3rem)] uppercase leading-[1.12]"
                    id="galerie-titre"
                  >
                    En images{" "}
                    <span className="font-mono text-xs font-black tracking-[.14em]">
                      ({galerie.length})
                    </span>
                  </h2>
                  <ul className="mt-6 columns-2 gap-3 sm:columns-3 [&>li]:mb-3">
                    {galerie.map((photo) => (
                      <li className="break-inside-avoid" key={photo.src}>
                        <a
                          className="block border-2 border-[#773331] transition-transform hover:-translate-y-1 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#773331]"
                          href={photo.src}
                          rel="noopener"
                          target="_blank"
                        >
                          <Image
                            alt={photo.alt}
                            className="h-auto w-full"
                            height={photo.hauteur}
                            sizes="(min-width: 1024px) 240px, 50vw"
                            src={photo.src}
                            width={photo.largeur}
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {actu.source ? (
                <p className="mt-12 font-mono text-xs font-black uppercase tracking-[.12em]">
                  <a
                    className="underline decoration-2 underline-offset-4"
                    href={actu.source.url}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {actu.source.label} ↗
                  </a>
                </p>
              ) : null}
            </div>

            <aside className="grid gap-5 self-start border-2 border-[#773331] bg-[#FFB200] p-6 lg:sticky lg:top-28">
              <p className="font-display text-[clamp(1.7rem,3vw,2.2rem)] uppercase leading-[1.1]">
                On court samedi ?
              </p>
              <p className="text-lg leading-relaxed">
                Choisis ta sortie, reçois ton QR code, et viens comme tu es.
              </p>
              <PrimaryLink href={getRoute(locale, "runs")}>
                Voir les sorties
              </PrimaryLink>
              <PrimaryLink href={base} secondary>
                Toutes les actus
              </PrimaryLink>
            </aside>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
