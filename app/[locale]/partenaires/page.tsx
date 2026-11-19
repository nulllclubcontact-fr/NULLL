import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "../../../components/ArrowIcon";
import { ContactMailForm } from "../../../components/contact-mail-form";
import { FaqAccordeon } from "../../../components/faq-accordeon";
import { RubanVitesse } from "../../../components/ruban-vitesse";
import { StructuredData } from "../../../components/StructuredData";
import "../../../components/home-experience.css";
import { SiteShell } from "../../../components/site-shell";
import { resolveLocale } from "../../../lib/locale";
import { partenairesVisibles } from "../../../lib/partenaires";
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
    routeKey: "partners",
    title: copy.meta.partners.title,
    description: copy.meta.partners.description
  });
}

/*
 * Rien d'invente ici : pas de chiffres d'audience ni de tarifs. Les formats
 * proposes reprennent ce que le club fait deja (ravito Red Bull et Bee Zen,
 * jeu concours avec Aix Ynov Campus, espace pro) ou ce qu'il propose deja
 * aux commerces d'Aix.
 */
const FORMATS = [
  {
    titre: "Le ravito",
    texte: "Des boissons ou des snacks à l’arrivée, au moment où tout le monde reste discuter. C’est ce que font Red Bull et Bee Zen aujourd’hui.",
    fond: "bg-[#FFC531] text-[#141116]",
    angle: -1.6
  },
  {
    titre: "Un jeu concours",
    texte: "Avec Aix Ynov Campus, on a fait gagner dix places pour Les Bacchantes à nos membres. On peut imaginer le tien.",
    fond: "bg-[#E8459E] text-white",
    angle: 1.2
  },
  {
    titre: "Une sortie chez toi",
    texte: "Tu tiens un commerce à Aix ? Parlons d’une façon de se retrouver après les sorties.",
    fond: "bg-[#D7F04A] text-[#141116]",
    angle: -0.8
  },
  {
    titre: "Ton espace pro",
    texte: "Chaque partenaire a son espace sur le site, qui regroupe les opérations enregistrées auprès du club.",
    fond: "bg-[#1F7FE0] text-white",
    angle: 1.5
  }
];

const ETAPES = [
  { titre: "Tu nous écris", texte: "Présente ta marque ou ton commerce, et ce que tu imagines avec le club." },
  { titre: "On en parle", texte: "On te répond, et on cherche ensemble le format qui colle à nos samedis." },
  { titre: "On se retrouve au départ", texte: "Le plus simple pour sentir l’ambiance : venir voir une sortie." }
];

export default async function PartenairesPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  const email = copy.contact.email;

  const faq = [
    {
      q: "Faut-il être une grande marque ?",
      a: "Non. Les commerces d’Aix sont les bienvenus. Ce qui compte, c’est l’envie de faire partie du samedi."
    },
    {
      q: "Qui me répond ?",
      a: `L’équipe du club : Tobias, Tom et Romane. Écris-nous avec le formulaire de cette page ou à ${email}.`
    },
    {
      q: "Je suis déjà partenaire, où est mon espace ?",
      a: "Connecte-toi à l’espace pro : il regroupe les opérations enregistrées auprès du club."
    }
  ];

  return (
    <SiteShell current="partners" locale={locale} pathname={getRoute(locale, "partners")}>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "Devenir partenaire", url: getRoute(locale, "partners") }
        ])}
      />

      <div className="home-journey">
        {/* ---------------- OUVERTURE ---------------- */}
        <section className="hx-hero hx-hero-bas" aria-labelledby="partenaires-titre">
          <Image
            alt="Le ravito après une sortie de Nulll Club, au parc"
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src="/assets/actus/quatrieme-run/01.webp"
          />
          <div className="hx-hero-shade" aria-hidden="true" />
          <div className="hx-hero-copy">
            <p className="st st-yellow">Devenir partenaire</p>
            <h1 className="hx-hero-title" id="partenaires-titre">
              <span className="st st-cream">Sois là quand</span>
              <span className="st st-pink">Aix se retrouve</span>
            </h1>
            <p className="hx-hero-support">
              Un samedi sur deux, des Aixois courent ensemble, puis restent pour les gens. Ta marque ou ton commerce peut faire partie de ce moment.
            </p>
            <div className="hx-hero-cta">
              <a className="hx-pill" href="#partenaire-ecrire">
                <span>Nous écrire</span>
                <ArrowIcon />
              </a>
            </div>
          </div>
        </section>

        {/* ---------------- ILS SONT DEJA LA ---------------- */}
        <section className="px-[max(5vw,20px)] py-24 sm:py-28" aria-labelledby="partenaires-actuels">
          <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <h2 className="hx-stack hx-stack-left" id="partenaires-actuels">
                <span className="st st-blue">Ils sont déjà là</span>
                <span className="st st-lime st-lg">Canette en main</span>
              </h2>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/85">
                <strong className="text-white">Red Bull</strong> et <strong className="text-white">Bee Zen</strong> soutiennent le club. On les retrouve après les sorties, quand personne n’a envie de repartir.
              </p>
              <ul className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
                {partenairesVisibles.map((partenaire) => (
                  <li key={partenaire.nom}>
                    <a className="block opacity-90 transition-opacity hover:opacity-100" href={partenaire.url} rel="sponsored noopener noreferrer" target="_blank">
                      <Image
                        alt={partenaire.nom}
                        className="h-[calc(44px*var(--echelle,1))] w-auto [filter:brightness(0)_invert(1)]"
                        height={Math.round(44 * (partenaire.echelle ?? 1))}
                        src={partenaire.logo}
                        style={{ "--echelle": partenaire.echelle ?? 1 } as React.CSSProperties}
                        unoptimized={partenaire.logo.endsWith(".svg")}
                        width={Math.round(44 * (partenaire.echelle ?? 1) * partenaire.ratio)}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto grid w-full max-w-[560px] grid-cols-2 gap-5">
              <figure className="relative -rotate-2">
                <Image alt="Une coureuse en lunettes de soleil attrape une Red Bull" className="h-auto w-full rounded-[2px]" height={1600} sizes="(min-width: 1024px) 270px, 45vw" src="/assets/actus/bienvenue/16.webp" width={1200} />
                <figcaption className="st st-yellow absolute -bottom-4 left-3" style={{ "--r": "-3deg" } as React.CSSProperties}>Red Bull</figcaption>
              </figure>
              <figure className="relative mt-16 rotate-2">
                <Image alt="Deux coureurs font les pitres avec une Bee Zen" className="h-auto w-full rounded-[2px]" height={1600} sizes="(min-width: 1024px) 270px, 45vw" src="/assets/actus/bienvenue/18.webp" width={1066} />
                <figcaption className="st st-pink absolute -bottom-4 right-3" style={{ "--r": "3deg" } as React.CSSProperties}>Bee Zen</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <RubanVitesse className="hx-ruban" texte="Red Bull ✱ Bee Zen ✱ et toi ? ✱ " />

        {/* ---------------- FORMATS ---------------- */}
        <section className="px-[max(5vw,20px)] py-24 sm:py-28" aria-labelledby="partenaires-formats">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="hx-stack" id="partenaires-formats">
              <span className="st st-cream">Comment</span>
              <span className="st st-yellow st-lg">on peut s’associer</span>
            </h2>
            <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {FORMATS.map((format, index) => (
                <li className={`flex flex-col rounded-[2px] px-7 py-8 ${format.fond} ${index % 2 === 1 ? "lg:mt-10" : ""}`} key={format.titre} style={{ rotate: `${format.angle}deg` }}>
                  <span className="font-mono text-xs font-bold tracking-[.14em] opacity-70">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-[clamp(1.6rem,2.2vw,2rem)] uppercase leading-[1.05]">{format.titre}</h3>
                  <p className="mt-4 text-base font-medium leading-relaxed">{format.texte}</p>
                </li>
              ))}
            </ul>
            <p className="mt-16 text-center font-hand text-[1.8rem] text-white/80">Une autre idée ? On écoute.</p>
          </div>
        </section>

        {/* ---------------- ETAPES ---------------- */}
        <section className="bg-[#1E1A21] px-[max(5vw,20px)] py-24 sm:py-28" aria-labelledby="partenaires-etapes">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="hx-stack hx-stack-left" id="partenaires-etapes">
              <span className="st st-pink">Comment ça se passe</span>
            </h2>
            <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {ETAPES.map((etape, index) => (
                <li key={etape.titre}>
                  <span className="inline-grid size-12 place-items-center rounded-[2px] bg-[#FFC531] font-display text-2xl text-[#141116]" style={{ rotate: `${index % 2 === 0 ? -4 : 4}deg` }}>
                    {index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-2xl uppercase leading-[1.1]">{etape.titre}</h3>
                  <p className="mt-3 max-w-xs text-[1.05rem] leading-relaxed text-white/80">{etape.texte}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- ECRIRE ---------------- */}
        <section className="px-[max(5vw,20px)] py-24 sm:py-28" aria-labelledby="partenaire-ecrire" id="partenaire-ecrire">
          <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <div>
              <h2 className="hx-stack hx-stack-left">
                <span className="st st-cream">On commence ?</span>
                <span className="st st-yellow st-lg">Écris-nous</span>
              </h2>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-white/85">
                Dis-nous qui tu es et ce que tu imagines avec le club. Le message part d’ici, on répond à l’adresse que tu laisses.
              </p>
              <p className="mt-6 text-base text-white/70">
                Ou directement :{" "}
                <a className="font-bold text-[#FFC531] underline decoration-2 underline-offset-4 hover:text-white" href={`mailto:${email}?subject=${encodeURIComponent("Devenir partenaire")}`}>
                  {email}
                </a>
              </p>
              <Link className="mt-8 inline-flex min-h-[54px] items-center rounded-[2px] border border-white/30 px-5 font-mono text-xs font-bold uppercase tracking-[.1em] transition-colors hover:border-white hover:bg-white hover:text-[#141116]" href="/pro/login">
                Déjà partenaire : espace pro
              </Link>
            </div>
            <ContactMailForm />
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="px-[max(5vw,20px)] pb-28" aria-labelledby="partenaires-faq">
          <div className="mx-auto max-w-[900px]">
            <h2 className="hx-stack" id="partenaires-faq">
              <span className="st st-lime st-lg">Questions</span>
            </h2>
            <div className="mt-12">
              <FaqAccordeon entrees={faq} nom="faq-partenaires" />
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
