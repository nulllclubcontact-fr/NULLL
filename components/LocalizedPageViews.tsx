import Image from "next/image";
import Link from "next/link";
import { StructuredData } from "./StructuredData";
import { CheckoutForm } from "./checkout-form";
import { SectionTitle, SiteShell } from "./site-shell";
import { buildBreadcrumbSchema } from "../lib/seo";
import { getRoute, getSiteCopy, type Locale } from "../lib/site-content";

export function AboutPageView({ locale }: { locale: Locale }) {
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="about" locale={locale} pathname={getRoute(locale, "about")}>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "À propos", url: getRoute(locale, "about") }
        ])}
      />
      <section className="mx-auto grid w-full max-w-none gap-8 px-4 py-10 sm:px-6 xl:grid-cols-[0.92fr_1.08fr] xl:px-8 xl:py-14">
        <div>
          <SectionTitle as="h1" index="08" text={copy.aboutPage.intro} title={copy.aboutPage.title} />
          <div className="mt-8 border-2 border-[#351815] bg-[#d96ab4] p-5 font-mono text-sm font-black uppercase leading-tight">
            Ecole, metro, boulot dehors. Musique, sueur, lien social dedans.
          </div>
        </div>
        <div className="relative min-h-[520px] overflow-hidden border-2 border-[#351815] bg-[#351815]">
          <Image alt="Portrait lifestyle avec lunettes miroir" className="object-cover" fill sizes="(min-width: 1280px) 54vw, 100vw" src="/assets/photos/editorial-glasses.webp" />
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-none gap-4 px-4 pb-14 sm:px-6 md:grid-cols-2 xl:px-8">
        {copy.aboutPage.values.map((value, index) => (
          <article className="border-2 border-[#351815] bg-[#f6eadf] p-6 transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#ffb000] lg:p-8" key={value.title}>
            <p className="font-mono text-xs font-black uppercase text-[#d96ab4]">{String(index + 1).padStart(2, "0")} / Valeur</p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,4.6vw,3.8rem)] uppercase leading-[0.96]">{value.title}</h2>
            <p className="mt-4 text-lg font-bold leading-tight text-[#351815]/72">{value.text}</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}

export function CommunityPageView({ locale }: { locale: Locale }) {
  const copy = getSiteCopy(locale);
  const page = copy.communityPage;
  const runsHref = getRoute(locale, "runs");

  // Le mur de photos : c'est ce qui manquait le plus a une page « communaute »,
  // qui ne montrait qu'un seul portrait. Tailles volontairement inegales pour
  // eviter la grille sage.
  const gallery = [
    { src: "/assets/photos/runs-crew.webp", alt: "Le groupe NULLL.CLUB réuni après une sortie", span: "sm:col-span-2 sm:row-span-2" },
    { src: "/assets/photos/motion-run.webp", alt: "Coureuse du club en pleine foulée", span: "" },
    { src: "/assets/photos/editorial-glasses.webp", alt: "Portrait d’un membre du club après le run", span: "" },
    { src: "/assets/photos/runs-golden.webp", alt: "Sortie du club au lever du soleil sur un chemin d’Aix", span: "sm:col-span-2" },
    { src: "/assets/photos/runner-portrait.webp", alt: "Portrait d’un coureur NULLL.CLUB à Aix-en-Provence", span: "" }
  ];

  return (
    <SiteShell current="community" locale={locale} pathname={getRoute(locale, "community")}>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "Communauté", url: getRoute(locale, "community") }
        ])}
      />

      {/* ---------------- AFFICHE D'OUVERTURE ----------------
          Photo de groupe plein cadre plutot qu'un portrait isole a cote d'un
          titre de quatre lignes : une page communaute doit montrer du monde. */}
      <section className="relative isolate overflow-hidden bg-[#120908] text-[#f6eadf]" aria-labelledby="community-title">
        <Image
          alt="Les membres de NULLL.CLUB courent ensemble dans une rue d’Aix-en-Provence"
          className="object-cover object-[58%_center]"
          fill
          priority
          sizes="100vw"
          src="/assets/photos/runners-aix.webp"
        />
        <div className="absolute inset-0 bg-[linear-gradient(96deg,rgba(18,9,8,.92)_0%,rgba(18,9,8,.72)_46%,rgba(18,9,8,.25)_100%)]" />

        <div className="relative mx-auto max-w-[1600px] px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 xl:px-12">
          <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#ffb000]">La communauté</p>
          <h1
            className="mt-5 max-w-[16ch] font-display text-[clamp(2.6rem,6.4vw,6rem)] uppercase leading-[.86] tracking-[-.035em]"
            id="community-title"
          >
            {page.title}
          </h1>
          <p className="mt-7 max-w-xl text-lg font-bold leading-snug sm:text-xl">{page.intro}</p>

          <ul className="mt-9 flex flex-wrap gap-2.5">
            {page.tags.map((tag) => (
              <li className="border-2 border-[#f6eadf]/45 px-4 py-2.5 font-mono text-xs font-black uppercase tracking-[.12em]" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- LES REPÈRES ----------------
          Les informations pratiques d'abord : quelqu'un qui hesite a venir
          cherche l'heure et le lieu avant la philosophie du club. */}
      <section className="border-y-2 border-[#351815] bg-[#ffb000] text-[#351815]" aria-label="Informations pratiques">
        <dl className="mx-auto grid max-w-[1600px] gap-px bg-[#351815] sm:grid-cols-2 lg:grid-cols-4">
          {page.facts.map((fact) => (
            <div className="bg-[#ffb000] px-5 py-6 sm:px-6" key={fact.label}>
              <dt className="font-mono text-xs font-black uppercase tracking-[.14em] opacity-65">{fact.label}</dt>
              <dd className="mt-2 font-display text-[clamp(1.4rem,2vw,1.9rem)] uppercase leading-[.95]">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------- UNE PREMIÈRE FOIS ---------------- */}
      <section className="bg-[#f6eadf] text-[#351815]" aria-labelledby="community-steps">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24 xl:px-12">
          <div className="flex flex-col gap-5 border-b-2 border-[#351815] pb-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-[18ch] font-display text-[clamp(2.4rem,5vw,4.6rem)] uppercase leading-[.88] tracking-[-.025em]" id="community-steps">
              Ta première fois, <span className="text-[#d96ab4]">en trois temps.</span>
            </h2>
            <p className="max-w-sm text-lg font-bold leading-snug">Venir seul est la norme, pas l’exception.</p>
          </div>

          <ol className="mt-12 grid gap-px bg-[#351815] md:grid-cols-3">
            {page.steps.map((step, index) => (
              <li className="flex flex-col gap-4 bg-[#f6eadf] px-6 py-8 sm:px-8 sm:py-10" key={step.title}>
                <span aria-hidden="true" className="font-display text-[clamp(3rem,5vw,4.6rem)] leading-[.8] text-[#d96ab4]">
                  0{index + 1}
                </span>
                <h3 className="font-display text-[clamp(1.8rem,2.6vw,2.6rem)] uppercase leading-[.92]">{step.title}</h3>
                <p className="text-lg leading-relaxed text-[#351815]/80">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- CE QUI NE CHANGE PAS ---------------- */}
      <section className="border-t-2 border-[#351815] bg-[#351815] text-[#f6eadf]" aria-labelledby="community-pillars">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24 xl:px-12">
          <h2 className="max-w-[16ch] font-display text-[clamp(2.4rem,5vw,4.6rem)] uppercase leading-[.88] tracking-[-.025em]" id="community-pillars">
            Ce qui ne <span className="text-[#ffb000]">change pas.</span>
          </h2>

          <ul className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-14">
            {page.pillars.map((pillar) => (
              <li className="border-t-2 border-[#f6eadf]/35 pt-6" key={pillar.title}>
                <h3 className="font-display text-[clamp(1.9rem,2.8vw,2.8rem)] uppercase leading-[.92] text-[#ffb000]">{pillar.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-[#f6eadf]/80">{pillar.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- LE MUR DE PHOTOS ---------------- */}
      <section className="bg-[#351815] text-[#f6eadf]" aria-labelledby="community-gallery">
        <div className="mx-auto max-w-[1600px] px-5 pb-16 sm:px-8 sm:pb-24 xl:px-12">
          <h2 className="font-display text-[clamp(2.4rem,5vw,4.6rem)] uppercase leading-[.88] tracking-[-.025em]" id="community-gallery">
            {page.galleryTitle}
          </h2>
          <ul className="mt-8 grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:grid-cols-4 sm:gap-4">
            {gallery.map((photo) => (
              <li className={`relative overflow-hidden border-2 border-[#f6eadf]/25 ${photo.span}`} key={photo.src}>
                <Image alt={photo.alt} className="object-cover" fill sizes="(min-width: 640px) 25vw, 50vw" src={photo.src} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- VENIR SAMEDI ---------------- */}
      <section className="border-t-2 border-[#351815] bg-[#d96ab4] text-[#351815]" aria-labelledby="community-cta">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-center lg:justify-between xl:px-12">
          <div>
            <h2 className="max-w-[16ch] font-display text-[clamp(2.2rem,4.4vw,4rem)] uppercase leading-[.9] tracking-[-.025em]" id="community-cta">
              {page.ctaTitle}
            </h2>
            <p className="mt-5 max-w-md text-lg font-bold leading-snug">{page.ctaText}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Link
              className="inline-flex min-h-16 items-center justify-center border-2 border-[#351815] bg-[#351815] px-7 font-mono text-xs font-black uppercase tracking-[.1em] text-[#f6eadf] transition-colors hover:bg-transparent hover:text-[#351815] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#351815]"
              href={runsHref}
            >
              Voir les prochaines sorties
            </Link>
            <a
              className="inline-flex min-h-16 items-center justify-center border-2 border-[#351815] px-7 font-mono text-xs font-black uppercase tracking-[.1em] transition-colors hover:bg-[#351815] hover:text-[#f6eadf] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#351815]"
              href={copy.contact.instagram}
              rel="noreferrer noopener"
              target="_blank"
            >
              {copy.contact.instagramLabel}
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export function CheckoutPageView({ locale }: { locale: Locale }) {
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="merch" locale={locale} pathname={getRoute(locale, "checkout")}>
      <section className="mx-auto w-full max-w-none px-4 py-10 sm:px-6 xl:px-8 xl:py-14">
        <SectionTitle as="h1" index="11" text={copy.checkoutPage.intro} title={copy.checkoutPage.title} />
        <div className="mt-10 max-w-4xl border-2 border-[#351815] bg-[#f6eadf] p-5 shadow-[8px_8px_0_#ffb000]">
          <CheckoutForm locale={locale} />
        </div>
      </section>
    </SiteShell>
  );
}
