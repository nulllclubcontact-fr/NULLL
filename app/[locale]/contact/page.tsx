import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "../../../components/ArrowIcon";
import { ContactChannels } from "../../../components/contact-channels";
import { StructuredData } from "../../../components/StructuredData";
import { ContactMailForm } from "../../../components/contact-mail-form";
import { RubanVitesse } from "../../../components/ruban-vitesse";
import "../../../components/home-experience.css";
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

      <div className="home-journey">
        <section className="hx-hero" aria-labelledby="contact-title">
          <Image
            alt="Une coureuse de Nulll Club en sweat jaune raconte sa sortie au groupe"
            className="object-cover object-[50%_35%]"
            fill
            priority
            sizes="100vw"
            src="/assets/actus/quatrieme-run/07.webp"
          />
          <div className="hx-hero-shade" aria-hidden="true" />
          <div className="hx-hero-copy">
            <h1 className="hx-hero-title" id="contact-title">
              <span className="st st-yellow hx-hero-kicker">Une question ?</span>
              <span className="st st-pink">Parle-nous</span>
            </h1>
            <p className="hx-hero-support">{page.intro}</p>
            <p className="mt-5 max-w-xl text-base text-white/85">
              Pour les dates et les infos pratiques, regarde <Link className="font-bold text-[#FFC531] underline decoration-2 underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]" href={runsHref}>les sorties</Link> et{" "}
              <Link className="font-bold text-[#FFC531] underline decoration-2 underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]" href={communityHref}>la page du club</Link>.
            </p>
          </div>
        </section>

        {/* ---------------- LES CANAUX ---------------- */}
        <section className="px-[max(5vw,20px)] pb-24 pt-28" aria-labelledby="contact-canaux">
          <div className="mx-auto max-w-[1300px]">
            <h2 className="hx-stack" id="contact-canaux">
              <span className="st st-cream">{page.title}</span>
              <span className="st st-yellow st-xl">Nos canaux</span>
            </h2>
            <div className="mt-14">
              <ContactChannels channels={page.channels} />
            </div>
          </div>
        </section>

        <RubanVitesse className="hx-ruban" texte="Une question avant samedi ? On répond ✱ " />

        {/* ---------------- COMMERCANTS ---------------- */}
        <section className="px-[max(5vw,20px)] py-24 sm:py-28" aria-labelledby="contact-partenaires">
          <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <h2 className="hx-stack hx-stack-left" id="contact-partenaires">
                <span className="st st-blue">Commerçants d’Aix</span>
                <span className="st st-pink st-xl">Deviens partenaire</span>
              </h2>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/85">
                Tu tiens un commerce à Aix ? Parlons d’une façon de se retrouver après les sorties.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a className="hx-pill" href={`mailto:${copy.contact.email}?subject=${encodeURIComponent("Devenir partenaire")}`}>
                  <span>Devenir partenaire</span>
                  <ArrowIcon />
                </a>
                <Link className="inline-flex min-h-[62px] items-center rounded-[2px] border border-white/30 px-5 font-mono text-xs font-bold uppercase tracking-[.1em] transition-colors hover:border-white hover:bg-white hover:text-[#141116]" href="/pro/login">
                  Déjà partenaire : espace pro
                </Link>
              </div>
            </div>
            <dl className="grid gap-4">
              {[
                { titre: "Parlons de ton commerce", texte: "Écris-nous pour discuter d’un partenariat avec le club.", c: "st-yellow" },
                { titre: "Tes passages en un endroit", texte: "Ton espace partenaire regroupe les opérations enregistrées auprès du club.", c: "st-lime" }
              ].map((point) => (
                <div className="rounded-[2px] border border-white/10 bg-[#1E1A21] p-6 sm:p-8" key={point.titre}>
                  <dt className={`st ${point.c}`}>{point.titre}</dt>
                  <dd className="mt-4 text-base leading-relaxed text-white/85">{point.texte}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------- ÉCRIRE ---------------- */}
        <section className="bg-[#1E1A21] px-[max(5vw,20px)] py-24 sm:py-28" aria-labelledby="contact-write">
          <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <div>
              <h2 className="hx-stack hx-stack-left" id="contact-write">
                <span className="st st-cream">Message direct</span>
                <span className="st st-yellow st-xl">Écris-nous</span>
              </h2>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-white/80">
                Le message part directement d’ici, sans passer par ta messagerie. On répond à l’adresse que tu laisses.
              </p>
            </div>
            <ContactMailForm />
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
