import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./reveal";
import { StructuredData } from "./StructuredData";
import { CheckoutForm } from "./checkout-form";
import { SectionTitle, SiteShell } from "./site-shell";
import { buildBreadcrumbSchema, buildFaqSchema } from "../lib/seo";
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
  const localClubHref = getRoute(locale, "localClub");
  const localRunningHref = getRoute(locale, "localRunning");

  return (
    <SiteShell current="community" locale={locale} pathname={getRoute(locale, "community")}>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "Communauté", url: getRoute(locale, "community") }
        ])}
      />
      {/* Les questions sont de vraies questions de nouveaux venus : elles
          servent le visiteur, et Google peut les afficher en resultat enrichi. */}
      <StructuredData data={buildFaqSchema(page.faq)} />

      {/* ---------------- AFFICHE ---------------- */}
      <section className="relative isolate flex min-h-[80svh] flex-col justify-end overflow-hidden bg-[#120908] text-[#f6eadf]" aria-labelledby="community-title">
        <Image
          alt="Deux membres de NULLL.CLUB dans une rue d’Aix-en-Provence après la sortie du samedi"
          className="object-cover object-[42%_35%]"
          fill
          priority
          sizes="100vw"
          src="/assets/photos/runners-aix.webp"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,9,8,.94)_0%,rgba(18,9,8,.62)_40%,rgba(18,9,8,.2)_75%,rgba(18,9,8,.45)_100%)]" />

        <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-14 pt-24 sm:px-8 sm:pb-20 xl:px-12">
          <h1
            className="hero-rise max-w-[28ch] font-mono text-xs font-black uppercase tracking-[.18em] text-[#ffb000]"
            id="community-title"
            style={{ animationDelay: "80ms" }}
          >
            {page.title}
          </h1>
          <p
            className="hero-rise hero-text-shadow mt-6 max-w-[15ch] font-display text-[clamp(2.7rem,7vw,6.4rem)] uppercase leading-[.85] tracking-[-.04em]"
            style={{ animationDelay: "180ms" }}
          >
            {page.punchline}
          </p>
          <p className="hero-rise hero-text-shadow mt-7 max-w-2xl text-lg leading-relaxed sm:text-xl" style={{ animationDelay: "300ms" }}>
            {page.intro}
          </p>
        </div>
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

          {/* Une feuille de temps : les bordures hautes des trois cellules se
              rejoignent en une seule ligne continue sur md, et les reperes
              carres viennent s'asseoir dessus. Aucune photo — elles etaient
              toutes deja vues ailleurs sur le site. */}
          <ol className="mt-12 grid md:grid-cols-3">
            {page.steps.map((step, index) => (
              <Reveal
                as="li"
                className={`timeline-step relative border-t-2 border-[#351815] pb-10 pt-10 md:pb-0 md:pr-8 ${
                  index > 0 ? "mt-10 md:mt-0 md:border-l-2 md:pl-8" : ""
                }`}
                delay={index * 120}
                key={step.title}
              >
                <span aria-hidden="true" className="timeline-marker" />

                <p className="font-mono text-[.62rem] font-black uppercase tracking-[.24em] text-[#351815]/45">
                  Temps 0{index + 1}
                </p>
                <p className="mt-3 font-display text-[clamp(3.2rem,6vw,5.4rem)] uppercase leading-[.82] tracking-[-.03em]">
                  {step.time}
                </p>
                <h3 className="mt-4 font-display text-[clamp(1.5rem,2.2vw,2.1rem)] uppercase leading-[.95] text-[#d96ab4]">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-[38ch] text-base leading-relaxed text-[#351815]/78">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- ÉDITORIAL ----------------
          Le texte qui porte le referencement : de la prose reelle sur courir
          en groupe a Aix, avec les liens internes vers les guides locaux. La
          bande de photos tient la colonne de droite plutot que d'occuper une
          section a elle seule. */}
      <section className="border-t-2 border-[#351815] bg-[#351815] text-[#f6eadf]" aria-labelledby="community-editorial">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_.85fr] lg:gap-16 xl:px-12">
          <div>
            <h2 className="max-w-[20ch] font-display text-[clamp(2.2rem,4.4vw,4rem)] uppercase leading-[.9] tracking-[-.03em]" id="community-editorial">
              {page.editorialTitle}
            </h2>

            <div className="mt-10 space-y-10">
              {page.editorial.map((bloc) => (
                <Reveal className="border-t-2 border-[#f6eadf]/25 pt-6" key={bloc.heading}>
                  <h3 className="font-display text-[clamp(1.5rem,2.2vw,2.1rem)] uppercase leading-[.95] text-[#ffb000]">{bloc.heading}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-[#f6eadf]/82">{bloc.body}</p>
                </Reveal>
              ))}
            </div>

            <p className="mt-10 text-lg leading-relaxed text-[#f6eadf]/82">
              Pour aller plus loin :{" "}
              <Link className="underline decoration-2 underline-offset-4 transition-colors hover:text-[#ffb000] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]" href={localClubHref}>
                le run club à Aix-en-Provence
              </Link>
              ,{" "}
              <Link className="underline decoration-2 underline-offset-4 transition-colors hover:text-[#ffb000] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]" href={localRunningHref}>
                où courir à Aix-en-Provence
              </Link>{" "}
              et{" "}
              <Link className="underline decoration-2 underline-offset-4 transition-colors hover:text-[#ffb000] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]" href={runsHref}>
                les prochaines sorties
              </Link>
              .
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-3 self-start sm:gap-4">
            {page.photos.map((photo, index) => (
              <li className={`relative overflow-hidden border-2 border-[#f6eadf]/25 ${index % 3 === 0 ? "aspect-[4/5]" : "aspect-square"}`} key={photo.src}>
                <Image alt={photo.alt} className={`object-cover ${photo.position}`} fill sizes="(min-width: 1024px) 20vw, 45vw" src={photo.src} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="border-t-2 border-[#351815] bg-[#ffb000] text-[#351815]" aria-labelledby="community-faq">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24 xl:px-12">
          <h2 className="max-w-[14ch] font-display text-[clamp(2.2rem,4.4vw,4rem)] uppercase leading-[.9] tracking-[-.03em]" id="community-faq">
            {page.faqTitle}
          </h2>

          <dl className="mt-12 border-t-2 border-[#351815]">
            {page.faq.map((entry, index) => (
              <Reveal className="grid gap-3 border-b-2 border-[#351815] py-7 lg:grid-cols-[auto_1fr_1.2fr] lg:items-baseline lg:gap-10" delay={index * 90} key={entry.q}>
                <span className="font-mono text-xs font-black uppercase tracking-[.14em] opacity-55">0{index + 1}</span>
                <dt className="font-display text-[clamp(1.4rem,2.2vw,2rem)] uppercase leading-[.98]">{entry.q}</dt>
                <dd className="text-lg leading-relaxed text-[#351815]/85">{entry.a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- INSTAGRAM + VENIR SAMEDI ---------------- */}
      <section className="border-t-2 border-[#351815] bg-[#1c0d0b] text-[#f6eadf]" aria-labelledby="community-cta">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-16 xl:px-12">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#d96ab4]">{page.social.kicker}</p>
            <h2 className="mt-5 max-w-[14ch] font-display text-[clamp(2.2rem,4.6vw,4.2rem)] uppercase leading-[.88] tracking-[-.03em]" id="community-cta">
              {page.ctaTitle}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#f6eadf]/82">{page.ctaText}</p>
            <Link
              className="mt-8 inline-flex min-h-16 items-center justify-center border-2 border-[#ffb000] bg-[#ffb000] px-7 font-mono text-xs font-black uppercase tracking-[.1em] text-[#351815] transition-colors hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf]"
              href={runsHref}
            >
              Voir les prochaines sorties
            </Link>
          </div>

          <a
            className="social-card group relative flex flex-col justify-between gap-10 overflow-hidden border-2 border-[#f6eadf]/30 p-7 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#d96ab4] sm:p-9"
            href={copy.contact.instagram}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Image
              alt=""
              className="social-card-photo object-cover object-[50%_38%]"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              src="/assets/photos/runs-crew.webp"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(140deg,rgba(18,9,8,.9)_0%,rgba(18,9,8,.6)_100%)]" />
            <span className="relative font-mono text-xs font-black uppercase tracking-[.16em] text-[#f6eadf]/70">{page.social.title}</span>
            <span className="relative">
              <span className="block font-display text-[clamp(2rem,3.4vw,3rem)] uppercase leading-none">{copy.contact.instagramLabel}</span>
              <span className="mt-5 inline-flex items-center gap-4 border-2 border-[#f6eadf] px-5 py-3 font-mono text-xs font-black uppercase tracking-[.12em] transition-colors group-hover:bg-[#f6eadf] group-hover:text-[#351815]">
                {page.social.cta}
                <span aria-hidden="true" className="social-card-arrow">→</span>
              </span>
            </span>
          </a>
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
