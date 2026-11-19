import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "../../../../components/ArrowIcon";
import "../../../../components/home-experience.css";
import { StructuredData } from "../../../../components/StructuredData";
import { SiteShell } from "../../../../components/site-shell";
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
  // Facon magazine : une photo apres chaque section (sauf la derniere),
  // le reste en galerie a la fin.
  const nbDansLeTexte = Math.max(0, actu.sections.length - 1);
  const photosDansLeTexte = galerie.slice(0, nbDansLeTexte);
  const photosEnGalerie = galerie.slice(nbDansLeTexte);
  const mots = actu.sections.flatMap((section) => section.paragraphes).join(" ").split(/\s+/).length;
  const minutes = Math.max(1, Math.round(mots / 200));

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

      <div className="home-journey">
        {/* ---------- OUVERTURE : rubrique, titre accrocheur, chapo ---------- */}
        <section className="hx-hero hx-hero-bas !min-h-[min(92svh,900px)]" aria-labelledby="article-titre">
          <Image alt={actu.image.alt} className="object-cover" fill priority sizes="100vw" src={actu.image.src} />
          <div className="hx-hero-shade" aria-hidden="true" />
          <div className="hx-hero-copy">
            <p className="st st-yellow">{actu.rubrique ?? "Actu"}</p>
            <h1 className="mt-4 w-full max-w-[1100px] -rotate-1 [overflow-wrap:normal] [text-wrap:balance]" id="article-titre">
              <span className="st st-pink st-long">{actu.titre}</span>
            </h1>
            <p className="mt-7 max-w-[54ch] text-[clamp(1.15rem,1.7vw,1.5rem)] font-normal leading-[1.45] text-white">{actu.resume}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-bold uppercase tracking-[.14em] text-white/75">
              <span>Par la team NULLL</span>
              <span aria-hidden="true">·</span>
              <time dateTime={actu.date}>{formaterDateActu(actu.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{minutes} min de lecture</span>
            </p>
          </div>
        </section>

        <article className="px-[max(5vw,20px)] pb-24 pt-16 sm:pt-20">
          {actu.sections.map((section, index) => {
            const photo = photosDansLeTexte[index];
            const verticale = photo ? photo.hauteur > photo.largeur : false;
            const texte = (
              <section className={verticale ? "" : "mx-auto max-w-[680px]"}>
                <h2 className={`st ${COULEURS[index % COULEURS.length]} ${index === 0 ? "" : "mt-4"}`}>{section.titre}</h2>
                <div className="mt-6 space-y-6 text-[1.13rem] leading-[1.8] text-white/88">
                  {section.paragraphes.map((paragraphe, numero) =>
                    index === 0 && numero === 0 ? (
                      // Le premier paragraphe ouvre l'article : simplement plus grand.
                      <p className="text-[clamp(1.3rem,2vw,1.55rem)] leading-[1.6] text-white" key={paragraphe}>
                        <Texte texte={paragraphe} />
                      </p>
                    ) : (
                      <p key={paragraphe}>
                        <Texte texte={paragraphe} />
                      </p>
                    )
                  )}
                </div>
                {section.citation ? (
                  <blockquote className={verticale ? "mt-10" : "mx-auto my-14 max-w-[680px] text-center"}>
                    <p className="-rotate-1 [text-wrap:balance]">
                      <span className="st st-long !bg-[#FFC531] !text-[clamp(22px,2.6vw,34px)] !leading-[1.35] !text-[#141116]">{section.citation}</span>
                    </p>
                  </blockquote>
                ) : null}
              </section>
            );
            const figure = photo ? (
              <figure className={verticale ? "mx-auto w-full max-w-[420px]" : "mx-auto my-16 max-w-[1100px]"}>
                <div className={`overflow-hidden rounded-[2px] ${index % 2 === 0 ? "rotate-[.8deg]" : "-rotate-[.8deg]"}`}>
                  <Image alt={photo.alt} className="h-auto w-full" height={photo.hauteur} sizes={verticale ? "(min-width: 1024px) 420px, 90vw" : "(min-width: 1100px) 1100px, 100vw"} src={photo.src} width={photo.largeur} />
                </div>
                <figcaption className="mt-4 text-center font-hand text-[1.5rem] leading-snug text-white/70">{photo.alt}</figcaption>
              </figure>
            ) : null;

            // Photo verticale : le texte se met a cote, la photo alterne de cote.
            if (verticale) {
              return (
                <div className={`mx-auto my-16 grid max-w-[1100px] items-center gap-12 lg:gap-16 ${index % 2 === 0 ? "lg:grid-cols-[minmax(0,1fr)_420px]" : "lg:grid-cols-[420px_minmax(0,1fr)]"}`} key={section.titre}>
                  <div className={index % 2 === 0 ? "" : "lg:order-2"}>{texte}</div>
                  <div className={index % 2 === 0 ? "" : "lg:order-1"}>{figure}</div>
                </div>
              );
            }
            return (
              <div key={section.titre}>
                {texte}
                {figure ?? <div className="h-14" />}
              </div>
            );
          })}

          {actu.tuto ? (
            <section aria-labelledby="tuto-titre" className="mx-auto mt-6 max-w-[900px]">
              <h2 className="st st-blue" id="tuto-titre">{actu.tuto.titre}</h2>
              {actu.tuto.video ? (
                <figure className="mt-8 w-full max-w-[20rem] overflow-hidden rounded-[2px]">
                  <video
                    aria-label={actu.tuto.video.description}
                    autoPlay
                    className="block h-auto w-full"
                    height={1558}
                    loop
                    muted
                    playsInline
                    poster={actu.tuto.video.poster}
                    preload="metadata"
                    src={actu.tuto.video.src}
                    width={720}
                  />
                </figure>
              ) : null}
              <ol className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
                {actu.tuto.etapes.map((etape, index) => (
                  <li className="grid content-start gap-4" key={etape.titre}>
                    <Image alt={etape.image.alt} className="h-auto w-full max-w-[20rem] rounded-[2px]" height={etape.image.hauteur} sizes="(min-width: 640px) 280px, 90vw" src={etape.image.src} width={etape.image.largeur} />
                    <h3 className="font-display text-xl uppercase leading-[1.1]">
                      <span className="mr-2 inline-grid size-8 place-items-center rounded-[2px] bg-[#FFC531] font-mono text-sm font-bold text-[#141116]">{index + 1}</span>
                      {etape.titre}
                    </h3>
                    <p className="text-[1.05rem] leading-[1.65] text-white/85">{etape.texte}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {photosEnGalerie.length > 0 ? (
            <section aria-labelledby="galerie-titre" className="mx-auto mt-10 max-w-[1100px]">
              <h2 className="st st-lime" id="galerie-titre">
                La galerie <span className="font-mono text-sm">({photosEnGalerie.length})</span>
              </h2>
              <ul className="mt-8 columns-2 gap-4 sm:columns-3 [&>li]:mb-4">
                {photosEnGalerie.map((photo) => (
                  <li className="break-inside-avoid" key={photo.src}>
                    <a className="block overflow-hidden rounded-[2px] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC531]" href={photo.src} rel="noopener" target="_blank">
                      <Image alt={photo.alt} className="h-auto w-full" height={photo.hauteur} sizes="(min-width: 1024px) 360px, 50vw" src={photo.src} width={photo.largeur} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mx-auto mt-16 max-w-[680px]">
            {actu.appels && actu.appels.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {actu.appels.map((appel) => {
                  const externe = appel.href.startsWith("http");
                  return appel.href.startsWith("/") ? (
                    <Link className="hx-pill" href={appel.href} key={appel.href}>
                      <span>{appel.label}</span>
                      <ArrowIcon />
                    </Link>
                  ) : (
                    <a className="hx-pill" href={appel.href} key={appel.href} {...(externe ? { rel: "noopener noreferrer", target: "_blank" } : {})}>
                      <span>{appel.label}</span>
                      <span aria-hidden="true">{externe ? "↗" : "→"}</span>
                    </a>
                  );
                })}
              </div>
            ) : null}
            {actu.source ? (
              <p className="mt-10 font-mono text-xs font-bold uppercase tracking-[.12em] text-white/70">
                <a className="underline decoration-2 underline-offset-4 hover:text-[#FFC531]" href={actu.source.url} rel="noreferrer noopener" target="_blank">
                  {actu.source.label} ↗
                </a>
              </p>
            ) : null}
          </div>

          {/* Fin d'article : l'appel du samedi, en grande etiquette rose. */}
          <aside className="mx-auto mt-20 flex max-w-[1100px] flex-col items-center gap-5 rounded-[2px] bg-[#E8459E] px-6 py-14 text-center">
            <p className="st st-yellow st-lg">On court samedi ?</p>
            <p className="max-w-md text-lg font-bold text-white">Choisis ta sortie, reçois ton QR code, et viens comme tu es.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link className="hx-pill" href={getRoute(locale, "runs")}>
                <span>Voir les sorties</span>
                <ArrowIcon />
              </Link>
              <Link className="inline-flex min-h-[62px] items-center rounded-[2px] border border-white/70 px-5 font-mono text-xs font-bold uppercase tracking-[.1em] text-white transition-colors hover:bg-white hover:text-[#141116]" href={base}>
                Toutes les actus
              </Link>
            </div>
          </aside>
        </article>
      </div>
    </SiteShell>
  );
}

const COULEURS = ["st-yellow", "st-blue", "st-lime", "st-cream"];

/** Paragraphe : **texte** devient un surlignage facon etiquette. */
function Texte({ texte }: { texte: string }) {
  const morceaux = texte.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {morceaux.map((morceau, index) =>
        morceau.startsWith("**") && morceau.endsWith("**") ? (
          <mark className="surligne" key={index}>
            {morceau.slice(2, -2)}
          </mark>
        ) : (
          <span key={index}>{morceau}</span>
        )
      )}
    </>
  );
}
