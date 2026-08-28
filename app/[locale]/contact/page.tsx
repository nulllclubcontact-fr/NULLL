import type { Metadata } from "next";
import Link from "next/link";
import { ContactChannels } from "../../../components/contact-channels";
import { StructuredData } from "../../../components/StructuredData";
import { ContactMailForm } from "../../../components/contact-mail-form";
import { SiteShell } from "../../../components/site-shell";
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
    routeKey: "contact",
    title: copy.meta.contact.title,
    description: copy.meta.contact.description
  });
}

export default async function ContactPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  const page = copy.contactPage;
  const runsHref = getRoute(locale, "runs");
  const communityHref = getRoute(locale, "community");

  return (
    <SiteShell current="contact" locale={locale} pathname={getRoute(locale, "contact")}>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "Contact", url: getRoute(locale, "contact") }
        ])}
      />

      {/* ---------------- EN-TÊTE ----------------
          Bande sombre pleine largeur : le titre occupe la moitie gauche,
          l'orientation la droite. Rien n'est centre, rien ne flotte. */}
      <section className="border-b-2 border-[#351815] bg-[#1c0d0b] text-[#f6eadf]" aria-labelledby="contact-title">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:gap-16 xl:px-12">
          <div>
            <p className="font-mono text-[.62rem] font-black uppercase tracking-[.2em] text-[#ffb000] [word-spacing:.22em]">
              Contact · Aix-en-Provence
            </p>
            {/* Les lettres arrivent en cascade. aria-label porte le mot
                entier : lettre par lettre, un lecteur d'ecran epellerait. */}
            <h1
              aria-label="Parle-nous."
              className="mt-6 font-display text-[clamp(3.4rem,10vw,8rem)] uppercase leading-[1.12] tracking-[-.04em]"
              id="contact-title"
            >
              <span aria-hidden="true">
                {"Parle-nous.".split("").map((lettre, index) => (
                  <span
                    className={`letter-rise ${lettre === "." ? "text-[#d96ab4]" : ""}`}
                    key={`${lettre}-${index}`}
                    style={{ animationDelay: `${120 + index * 45}ms` }}
                  >
                    {lettre}
                  </span>
                ))}
              </span>
            </h1>
          </div>

          <div className="lg:pb-4">
            <p className="text-lg leading-relaxed text-[#f6eadf]/82">{page.intro}</p>
            {/* Orienter avant de faire ecrire : la plupart des questions
                sont deja traitees ailleurs sur le site. */}
            <p className="mt-6 border-t-2 border-[#f6eadf]/25 pt-6 text-base leading-relaxed text-[#f6eadf]/70">
              Pour venir courir, il n’y a rien à demander — tout est sur{" "}
              <Link
                className="font-bold text-[#ffb000] underline decoration-2 underline-offset-4 transition-colors hover:text-[#f6eadf] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
                href={runsHref}
              >
                les sorties
              </Link>{" "}
              et{" "}
              <Link
                className="font-bold text-[#ffb000] underline decoration-2 underline-offset-4 transition-colors hover:text-[#f6eadf] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
                href={communityHref}
              >
                la page du club
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- LES CANAUX ----------------
          Bord a bord, sans conteneur : quatre colonnes sur un seul champ
          de couleur, separees par des filets. Un aplat coherent plutot que
          quatre couleurs sans rapport. */}
      <h2 className="sr-only">{page.title}</h2>
      <ContactChannels channels={page.channels} />

      {/* ---------------- ÉCRIRE ----------------
          Bande sombre pleine largeur : le titre a gauche, les champs a
          droite. Le formulaire n'a plus de cadre, la bande fait le cadre. */}
      <section className="bg-[#1c0d0b] text-[#f6eadf]" aria-labelledby="contact-write">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[.9fr_1.1fr] lg:gap-20 xl:px-12">
          <div>
            <p className="font-mono text-[.62rem] font-black uppercase tracking-[.2em] text-[#d96ab4] [word-spacing:.22em]">
              Message direct
            </p>
            <h2
              className="mt-6 font-display text-[clamp(2.6rem,6vw,5rem)] uppercase leading-[1.12] tracking-[-.035em] text-[#ffb000]"
              id="contact-write"
            >
              Écris-nous.
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-[#f6eadf]/75">
              Le message part directement d’ici, sans passer par ta messagerie. On répond à l’adresse que tu laisses.
            </p>
          </div>

          <ContactMailForm />
        </div>
      </section>
    </SiteShell>
  );
}
