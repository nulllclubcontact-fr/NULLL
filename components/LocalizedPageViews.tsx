import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./reveal";
import { ClubTimeline } from "./club-timeline";
import { StructuredData } from "./StructuredData";
import { CheckoutForm } from "./checkout-form";
import { SectionTitle, SiteShell } from "./site-shell";
import { buildBreadcrumbSchema, buildFaqSchema } from "../lib/seo";
import { getRoute, getSiteCopy, type Locale } from "../lib/site-content";

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
          { name: "Le club", url: getRoute(locale, "community") }
        ])}
      />
      <StructuredData data={buildFaqSchema(page.faq)} />

      {/* ---------------- AFFICHE ---------------- */}
      <section className="relative isolate flex min-h-[78svh] flex-col justify-end overflow-hidden bg-[#120908] text-[#f6eadf]" aria-labelledby="club-title">
        <Image
          alt="Tobias Ringot et Tom Brenier, fondateurs de NULLL.CLUB, dans une rue d’Aix-en-Provence"
          className="object-cover object-[42%_35%]"
          fill
          priority
          sizes="100vw"
          src="/assets/photos/runners-aix.webp"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,9,8,.95)_0%,rgba(18,9,8,.62)_42%,rgba(18,9,8,.2)_76%,rgba(18,9,8,.45)_100%)]" />

        <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-14 pt-24 sm:px-8 sm:pb-20 xl:px-12">
          <h1 className="hero-rise font-mono text-xs font-black uppercase tracking-[.18em] text-[#ffb000]" id="club-title" style={{ animationDelay: "80ms" }}>
            {page.title}
          </h1>
          <p className="hero-rise hero-text-shadow mt-6 max-w-[16ch] font-display text-[clamp(2.6rem,6.6vw,6rem)] uppercase leading-[.86] tracking-[-.04em]" style={{ animationDelay: "180ms" }}>
            {page.punchline}
          </p>
          <p className="hero-rise hero-text-shadow mt-7 max-w-2xl text-lg leading-relaxed sm:text-xl" style={{ animationDelay: "300ms" }}>
            {page.intro}
          </p>
        </div>
      </section>

      {/* ---------------- LA LIGNE DE VIE ---------------- */}
      <section className="border-t-2 border-[#351815] bg-[#1c0d0b] text-[#f6eadf]" aria-labelledby="club-timeline">
        <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 sm:py-24 xl:px-12">
          <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#d96ab4]">D’où ça vient</p>
          <h2 className="mt-5 max-w-[14ch] font-display text-[clamp(2.4rem,5.4vw,5rem)] uppercase leading-[.86] tracking-[-.035em]" id="club-timeline">
            {page.timelineTitle}
          </h2>

          <ClubTimeline entries={page.timeline} />
        </div>
      </section>

      {/* ---------------- LES TROIS L ---------------- */}
      <section className="border-t-2 border-[#351815] bg-[#f6eadf] text-[#351815]" aria-labelledby="club-letters">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24 xl:px-12">
          <div className="flex flex-col gap-5 border-b-2 border-[#351815] pb-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-[14ch] font-display text-[clamp(2.4rem,5vw,4.6rem)] uppercase leading-[.88] tracking-[-.03em]" id="club-letters">
              {page.lettersTitle}
            </h2>
            <p className="max-w-md text-lg font-bold leading-snug">{page.lettersIntro}</p>
          </div>

          <ol className="mt-12 grid gap-px bg-[#351815] md:grid-cols-3">
            {page.letters.map((item, index) => (
              <Reveal as="li" className="flex flex-col bg-[#f6eadf] px-6 py-8 sm:px-8 sm:py-10" delay={index * 110} key={item.word}>
                <span aria-hidden="true" className="font-display text-[clamp(4rem,7vw,6.5rem)] leading-[.72] text-[#d96ab4]">
                  {item.letter}
                </span>
                <h3 className="mt-5 font-display text-[clamp(1.7rem,2.6vw,2.4rem)] uppercase leading-[.94]">{item.word}</h3>
                <p className="mt-4 text-base leading-relaxed text-[#351815]/78">{item.text}</p>
              </Reveal>
            ))}
          </ol>

          {/* Les fondateurs, juste apres : ce sont eux les trois L en pratique. */}
          <div className="mt-14 flex flex-col gap-6 border-t-2 border-[#351815] pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[.16em] opacity-55">{page.foundersTitle}</p>
              <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
                {page.founders.map((f) => (
                  <li key={f.name}>
                    <span className="block font-display text-[clamp(1.5rem,2.2vw,2.1rem)] uppercase leading-none">{f.name}</span>
                    <span className="mt-1 block font-mono text-[.62rem] font-black uppercase tracking-[.18em] opacity-55">{f.role}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="max-w-xs font-mono text-[.62rem] font-black uppercase leading-relaxed tracking-[.14em] opacity-55">
              Association loi 1901 déclarée le 12 mai 2026, publiée au Journal officiel le 23 juin 2026.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- ÉDITORIAL ---------------- */}
      <section className="border-t-2 border-[#351815] bg-[#351815] text-[#f6eadf]" aria-labelledby="club-editorial">
        <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 sm:py-24 xl:px-12">
          <h2 className="max-w-[20ch] font-display text-[clamp(2.2rem,4.4vw,4rem)] uppercase leading-[.9] tracking-[-.03em]" id="club-editorial">
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
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="border-t-2 border-[#351815] bg-[#ffb000] text-[#351815]" aria-labelledby="club-faq">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24 xl:px-12">
          <h2 className="max-w-[14ch] font-display text-[clamp(2.2rem,4.4vw,4rem)] uppercase leading-[.9] tracking-[-.03em]" id="club-faq">
            {page.faqTitle}
          </h2>

          <dl className="mt-12 border-t-2 border-[#351815]">
            {page.faq.map((entry, index) => (
              <Reveal className="grid gap-3 border-b-2 border-[#351815] py-7 lg:grid-cols-[auto_1fr_1.2fr] lg:items-baseline lg:gap-10" delay={index * 80} key={entry.q}>
                <span className="font-mono text-xs font-black uppercase tracking-[.14em] opacity-55">0{index + 1}</span>
                <dt className="font-display text-[clamp(1.4rem,2.2vw,2rem)] uppercase leading-[.98]">{entry.q}</dt>
                <dd className="text-lg leading-relaxed text-[#351815]/85">{entry.a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- LE PREMIER RUN + INSTAGRAM ---------------- */}
      <section className="border-t-2 border-[#351815] bg-[#1c0d0b] text-[#f6eadf]" aria-labelledby="club-cta">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-16 xl:px-12">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#d96ab4]">{page.social.kicker}</p>
            <h2 className="mt-5 max-w-[15ch] font-display text-[clamp(2.2rem,4.6vw,4.2rem)] uppercase leading-[.88] tracking-[-.03em]" id="club-cta">
              {page.firstRunTitle}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#f6eadf]/82">{page.firstRunText}</p>
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
            <Image alt="" className="social-card-photo object-cover object-[50%_38%]" fill sizes="(min-width: 1024px) 40vw, 100vw" src="/assets/photos/runs-crew.webp" />
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
