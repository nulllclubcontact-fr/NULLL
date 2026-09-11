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
      <section className="border-b-2 border-[#773331] bg-[#3A1A18] text-[#F1EDE9]" aria-labelledby="contact-title">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:gap-16 xl:px-12">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[.2em] text-[#FFB200] [word-spacing:.22em]">
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
                    className={`letter-rise ${lettre === "." ? "text-[#EBA0CD]" : ""}`}
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
            <p className="text-lg leading-relaxed text-[#F1EDE9]">{page.intro}</p>
            {/* Orienter avant de faire ecrire : la plupart des questions
                sont deja traitees ailleurs sur le site. */}
            <p className="mt-6 border-t-2 border-[#F1EDE9]/25 pt-6 text-base leading-relaxed text-[#F1EDE9]/70">
              Pour venir courir, pas besoin de nous écrire : tout est sur{" "}
              <Link
                className="font-bold text-[#FFB200] underline decoration-2 underline-offset-4 transition-colors hover:text-[#F1EDE9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFB200]"
                href={runsHref}
              >
                les sorties
              </Link>{" "}
              et{" "}
              <Link
                className="font-bold text-[#FFB200] underline decoration-2 underline-offset-4 transition-colors hover:text-[#F1EDE9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFB200]"
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
      <section className="border-b-2 border-[#773331] bg-[#773331] text-[#F1EDE9]" aria-labelledby="contact-partenaires">
        <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-20 xl:px-12">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[.2em] text-[#EBA0CD] [word-spacing:.22em]">
              Commerçants d’Aix
            </p>
            <h2
              className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[1.12] tracking-[-.03em]"
              id="contact-partenaires"
            >
              Deviens <span className="text-[#FFB200]">partenaire.</span>
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-[#F1EDE9]">
              Un groupe qui court tous les samedis matin à Aix, et qui cherche où aller ensuite. Café, boulangerie,
              restaurant, magasin de sport : le club peut envoyer ses membres chez toi.
            </p>
            <Link
              className="mt-9 inline-flex min-h-16 items-center justify-between gap-10 border-2 border-[#F1EDE9]/60 px-6 font-mono text-xs font-black uppercase tracking-[.1em] transition-colors [word-spacing:.12em] hover:border-[#F1EDE9] hover:bg-[#F1EDE9] hover:text-[#773331] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#FFB200]"
              href="/pro/login"
            >
              <span>Déjà partenaire : espace pro</span>
              <ArrowIcon />
            </Link>
          </div>

          <dl className="h-fit border-t-2 border-[#F1EDE9]/25">
            {[
              {
                titre: "On en parle d’abord",
                texte: "Écris-nous : on regarde ensemble ce qui a du sens pour ton commerce et pour les membres."
              },
              {
                titre: "Rien à installer",
                texte: "Tout passe par un téléphone et ton espace pro. Pas d’application, pas de matériel."
              },
              {
                titre: "Des gens du coin",
                texte: "Des coureurs d’Aix qui se retrouvent chaque samedi, et qui aiment prolonger le moment."
              }
            ].map((point) => (
              <div className="border-b-2 border-[#F1EDE9]/25 py-6" key={point.titre}>
                <dt className="font-display text-[clamp(1.3rem,1.9vw,1.6rem)] uppercase leading-[1.12] tracking-[-.02em] text-[#FFB200]">
                  {point.titre}
                </dt>
                <dd className="mt-3 max-w-[52ch] text-base leading-relaxed text-[#F1EDE9]">{point.texte}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- ÉCRIRE ----------------
          Bande sombre pleine largeur : le titre a gauche, les champs a
          droite. Le formulaire n'a plus de cadre, la bande fait le cadre. */}
      <section className="bg-[#3A1A18] text-[#F1EDE9]" aria-labelledby="contact-write">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[.9fr_1.1fr] lg:gap-20 xl:px-12">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[.2em] text-[#EBA0CD] [word-spacing:.22em]">
              Message direct
            </p>
            <h2
              className="mt-6 font-display text-[clamp(2.6rem,6vw,5rem)] uppercase leading-[1.12] tracking-[-.035em] text-[#FFB200]"
              id="contact-write"
            >
              Écris-nous.
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-[#F1EDE9]/75">
              Le message part directement d’ici, sans passer par ta messagerie. On répond à l’adresse que tu laisses.
            </p>
          </div>

          <ContactMailForm />
        </div>
      </section>
    </SiteShell>
  );
}
