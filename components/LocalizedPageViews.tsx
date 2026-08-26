import Image from "next/image";
import Link from "next/link";
import { ClubGallery } from "./club-gallery";
import { Reveal } from "./reveal";
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

  return (
    <SiteShell current="community" locale={locale} pathname={getRoute(locale, "community")}>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "Communauté", url: getRoute(locale, "community") }
        ])}
      />

      {/* ---------------- AFFICHE ----------------
          editorial-glasses : le groupe entier se reflete dans le verre. C'est
          l'image la plus forte du dossier et elle dit exactement le sujet de
          la page. Elle n'etait utilisee nulle part. */}
      <section className="relative isolate flex min-h-[86svh] flex-col justify-end overflow-hidden bg-[#120908] text-[#f6eadf]" aria-labelledby="community-title">
        <Image
          alt="Le groupe NULLL.CLUB se reflète dans le verre miroir des lunettes d’un membre"
          className="object-cover object-[52%_46%]"
          fill
          priority
          sizes="100vw"
          src="/assets/photos/editorial-glasses.webp"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,9,8,.94)_0%,rgba(18,9,8,.6)_38%,rgba(18,9,8,.15)_72%,rgba(18,9,8,.5)_100%)]" />

        <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-14 pt-24 sm:px-8 sm:pb-20 xl:px-12">
          <p className="hero-rise font-mono text-xs font-black uppercase tracking-[.18em] text-[#ffb000]" style={{ animationDelay: "80ms" }}>
            La communauté
          </p>
          <h1
            className="hero-rise hero-text-shadow mt-5 max-w-[15ch] font-display text-[clamp(2.7rem,7vw,6.4rem)] uppercase leading-[.85] tracking-[-.04em]"
            id="community-title"
            style={{ animationDelay: "180ms" }}
          >
            {page.title}
          </h1>
          <p className="hero-rise hero-text-shadow mt-7 max-w-xl text-lg font-bold leading-snug sm:text-xl" style={{ animationDelay: "300ms" }}>
            {page.intro}
          </p>
        </div>
      </section>

      {/* ---------------- BANDEAU DÉFILANT ---------------- */}
      <div
        aria-label={page.ticker}
        className="marquee border-y-2 border-[#351815] bg-[#ffb000] py-4 text-[#351815]"
        role="region"
      >
        <div aria-hidden="true" className="marquee-track font-mono text-xs font-black uppercase tracking-[.16em] sm:text-sm">
          <p className="shrink-0 whitespace-nowrap px-6">{page.ticker}&nbsp;&nbsp;—&nbsp;&nbsp;</p>
          <p className="shrink-0 whitespace-nowrap px-6">{page.ticker}&nbsp;&nbsp;—&nbsp;&nbsp;</p>
        </div>
      </div>

      {/* ---------------- LES REPÈRES ---------------- */}
      <section className="bg-[#351815] text-[#f6eadf]" aria-label="Informations pratiques">
        <dl className="mx-auto grid max-w-[1600px] gap-px bg-[#f6eadf]/25 sm:grid-cols-2 lg:grid-cols-4">
          {page.facts.map((fact) => (
            <div className="bg-[#351815] px-5 py-7 sm:px-6" key={fact.label}>
              <dt className="font-mono text-xs font-black uppercase tracking-[.14em] text-[#ffb000]">{fact.label}</dt>
              <dd className="mt-2 font-display text-[clamp(1.6rem,2.4vw,2.4rem)] uppercase leading-[.95]">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------- TA PREMIÈRE FOIS ---------------- */}
      <section className="border-t-2 border-[#351815] bg-[#f6eadf] text-[#351815]" aria-labelledby="community-steps">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24 xl:px-12">
          <div className="flex flex-col gap-5 border-b-2 border-[#351815] pb-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-[16ch] font-display text-[clamp(2.4rem,5vw,4.6rem)] uppercase leading-[.88] tracking-[-.03em]" id="community-steps">
              Ta première fois, <span className="text-[#d96ab4]">en trois temps.</span>
            </h2>
            <p className="max-w-xs text-lg font-bold leading-snug">Venir seul est la norme, pas l’exception.</p>
          </div>

          <ol className="mt-10 grid gap-6 md:grid-cols-3 md:gap-5">
            {page.steps.map((step, index) => (
              <Reveal as="li" className="step-card group flex flex-col border-2 border-[#351815] bg-[#f6eadf]" delay={index * 110} key={step.title}>
                <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-[#351815]">
                  <Image alt={step.alt} className={`step-photo object-cover ${step.position}`} fill sizes="(min-width: 768px) 33vw, 100vw" src={step.photo} />
                  <span className="absolute left-0 top-0 bg-[#351815] px-4 py-2.5 font-display text-2xl leading-none text-[#f6eadf]">
                    0{index + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-[clamp(1.7rem,2.4vw,2.3rem)] uppercase leading-[.92]">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-[#351815]/78">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- LES 23 AUTRES HEURES ----------------
          Piece interactive : la liste pilote la grande photo au survol, et au
          scroll sur tactile. C'est ce qui donne enfin leur place aux photos
          editoriales du club. */}
      <section className="border-t-2 border-[#351815] bg-[#1c0d0b] text-[#f6eadf]" aria-labelledby="community-gallery">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24 xl:px-12">
          <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#d96ab4]">Autour du run</p>
          <h2 className="mt-5 max-w-[14ch] font-display text-[clamp(2.4rem,5.4vw,5rem)] uppercase leading-[.86] tracking-[-.035em]" id="community-gallery">
            {page.galleryTitle}
          </h2>
          <p className="mt-5 max-w-lg text-lg font-bold leading-snug text-[#f6eadf]/80">{page.galleryIntro}</p>

          <ClubGallery items={page.gallery} />
        </div>
      </section>

      {/* ---------------- CE QUI NE CHANGE PAS ---------------- */}
      <section className="border-t-2 border-[#351815] bg-[#351815] text-[#f6eadf]" aria-labelledby="community-pillars">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24 xl:px-12">
          <h2 className="max-w-[16ch] font-display text-[clamp(2.4rem,5vw,4.6rem)] uppercase leading-[.88] tracking-[-.03em]" id="community-pillars">
            Ce qui ne <span className="text-[#ffb000]">change pas.</span>
          </h2>
          <ul className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-14">
            {page.pillars.map((pillar, index) => (
              <Reveal as="li" className="border-t-2 border-[#f6eadf]/35 pt-6" delay={index * 110} key={pillar.title}>
                <h3 className="font-display text-[clamp(1.9rem,2.8vw,2.8rem)] uppercase leading-[.92] text-[#ffb000]">{pillar.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-[#f6eadf]/80">{pillar.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- VENIR SAMEDI ---------------- */}
      <section className="border-t-2 border-[#351815] bg-[#d96ab4] text-[#351815]" aria-labelledby="community-cta">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-center lg:justify-between xl:px-12">
          <div>
            <h2 className="max-w-[16ch] font-display text-[clamp(2.2rem,4.4vw,4rem)] uppercase leading-[.9] tracking-[-.03em]" id="community-cta">
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
