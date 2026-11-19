import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "../../../components/ArrowIcon";
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
      <section className="border-b-2 border-white/15 bg-[#141116] text-white" aria-labelledby="contact-title">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:gap-16 xl:px-12">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[.2em] text-[#FFC531] [word-spacing:.22em]">
              Contact · Aix-en-Provence
            </p>
            {/* Les lettres arrivent en cascade. aria-label porte le mot
                entier : lettre par lettre, un lecteur d'ecran epellerait. */}
            <h1 className="da-stack mt-6" id="contact-title">
              <span className="st st-yellow">Une question ?</span>
              <span className="st st-pink st-xl">Parle-nous</span>
            </h1>
          </div>

          <div className="lg:pb-4">
            <p className="text-lg leading-relaxed text-white">{page.intro}</p>
            {/* Orienter avant de faire ecrire : la plupart des questions
                sont deja traitees ailleurs sur le site. */}
            <p className="mt-6 border-t-2 border-white/25 pt-6 text-base leading-relaxed text-white/70">
              Pour les dates et les informations pratiques, consulte{" "}
              <Link
                className="font-bold text-[#FFC531] underline decoration-2 underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]"
                href={runsHref}
              >
                les sorties
              </Link>{" "}
              et{" "}
              <Link
                className="font-bold text-[#FFC531] underline decoration-2 underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]"
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

      {/* ---------------- RECRUTER DES COMMERCANTS ----------------
          Deplace depuis la page d'identification, ou il noyait les deux
          boutons de connexion. Un commercant qui veut joindre le club
          arrive ici : c'est sa place. */}
      <section className="border-b-2 border-white/15 bg-[#1E1A21] text-white" aria-labelledby="contact-partenaires">
        <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-20 xl:px-12">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[.2em] text-[#E8459E] [word-spacing:.22em]">
              Commerçants d’Aix
            </p>
            <h2
              className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[1.12] tracking-[-.03em]"
              id="contact-partenaires"
            >
              Deviens <span className="text-[#FFC531]">partenaire.</span>
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-white">
              Tu tiens un commerce à Aix ? Parlons d’une façon de se retrouver après les sorties.
            </p>
            <Link
              className="mt-9 inline-flex min-h-16 items-center justify-between gap-10 border-2 border-white/60 px-6 font-mono text-xs font-black uppercase tracking-[.1em] transition-colors [word-spacing:.12em] hover:border-white/15 hover:bg-[#141116] hover:text-white focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]"
              href="/pro/login"
            >
              <span>Déjà partenaire : espace pro</span>
              <ArrowIcon />
            </Link>
          </div>

          <dl className="h-fit border-t-2 border-white/25">
            {[
              {
                titre: "Parlons de ton commerce",
                texte: "Écris-nous pour discuter d’un partenariat avec le club."
              },
              {
                titre: "Tes passages en un endroit",
                texte: "Ton espace partenaire regroupe les opérations enregistrées auprès du club."
              }
            ].map((point) => (
              <div className="border-b-2 border-white/25 py-6" key={point.titre}>
                <dt className="font-display text-[clamp(1.3rem,1.9vw,1.6rem)] uppercase leading-[1.12] tracking-[-.02em] text-[#FFC531]">
                  {point.titre}
                </dt>
                <dd className="mt-3 max-w-[52ch] text-base leading-relaxed text-white">{point.texte}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- ÉCRIRE ----------------
          Bande sombre pleine largeur : le titre a gauche, les champs a
          droite. Le formulaire n'a plus de cadre, la bande fait le cadre. */}
      <section className="bg-[#141116] text-white" aria-labelledby="contact-write">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[.9fr_1.1fr] lg:gap-20 xl:px-12">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[.2em] text-[#E8459E] [word-spacing:.22em]">
              Message direct
            </p>
            <h2
              className="mt-6 font-display text-[clamp(2.6rem,6vw,5rem)] uppercase leading-[1.12] tracking-[-.035em] text-[#FFC531]"
              id="contact-write"
            >
              Écris-nous.
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-white/75">
              Le message part directement d’ici, sans passer par ta messagerie. On répond à l’adresse que tu laisses.
            </p>
          </div>

          <ContactMailForm />
        </div>
      </section>
    </SiteShell>
  );
}
