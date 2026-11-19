import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./reveal";
import { ArrowIcon } from "./ArrowIcon";
import { RubanVitesse } from "./ruban-vitesse";
import "./home-experience.css";
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

      <div className="home-journey">
        {/* ---------------- OUVERTURE ---------------- */}
        <section className="hx-hero" aria-labelledby="club-title">
          <Image
            alt="Le groupe de Nulll Club réuni sur la pelouse après une sortie"
            className="object-cover object-[50%_40%]"
            fill
            priority
            sizes="100vw"
            src="/assets/actus/quatrieme-run/08.webp"
          />
          <div className="hx-hero-shade" aria-hidden="true" />
          <div className="hx-hero-copy">
            <h1 className="hx-hero-title" id="club-title">
              <span className="st st-yellow hx-hero-kicker">{page.title}</span>
              {page.punchlineLines.map((ligne, index) =>
                index === 1 ? (
                  <span className="st st-pink" key={ligne}>{ligne}</span>
                ) : (
                  <span className="st st-cream hx-club-ligne" key={ligne}>{ligne}</span>
                )
              )}
            </h1>
            <p className="hx-hero-support">{page.intro}</p>
          </div>
        </section>

        {/* ---------------- LES FONDATEURS ---------------- */}
        <section className="hx-club" aria-labelledby="club-founders">
          <div className="hx-club-photos">
            <figure className="hx-club-photo hx-club-photo-a">
              <Image
                alt="Tom Brenier et Tobias Ringot, fondateurs de Nulll Club, dans une rue d’Aix-en-Provence"
                className="-scale-x-100 object-[50%_38%]"
                fill
                sizes="(max-width: 760px) 70vw, 30vw"
                src="/assets/photos/fondateurs.webp"
              />
            </figure>
            <figure className="hx-club-photo hx-club-photo-b">
              <Image alt="Discussions autour de la table des boissons après la course" fill sizes="(max-width: 760px) 80vw, 34vw" src="/assets/actus/quatrieme-run/16.webp" />
            </figure>
            <p className="st st-yellow hx-club-first">Le club est parti<br />de deux potes.</p>
          </div>
          <div className="hx-club-copy">
            <h2 className="hx-stack hx-stack-left" id="club-founders">
              <span className="st st-blue">Qui on est</span>
              <span className="st st-pink st-xl">{page.foundersTitle.replace(/\.$/, "")}</span>
            </h2>
            <ul className="hx-facts">
              {page.founders.map((f, index) => (
                <li className={`st ${["st-yellow", "st-cream", "st-lime", "st-pink"][index % 4]}`} key={f.name}>
                  <span className="block font-display text-2xl uppercase leading-none">{f.name}</span>
                  <span className="mt-1 block">{f.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- LA LIGNE DE VIE ---------------- */}
        <section className="px-[max(5vw,20px)] py-24 sm:py-28" aria-labelledby="club-timeline">
          <div className="mx-auto max-w-[1500px]">
            <h2 className="hx-stack" id="club-timeline">
              <span className="st st-cream">D’où ça vient</span>
              <span className="st st-yellow st-xl">{page.timelineTitle.replace(/\.$/, "")}</span>
            </h2>
            <ClubTimeline entries={page.timeline} />
          </div>
        </section>

        <RubanVitesse className="hx-ruban" texte="Le sport n’est qu’un prétexte ✱ Soyons nous, soyons NULLL ✱ " />

        {/* ---------------- LES TROIS L ---------------- */}
        <section className="px-[max(5vw,20px)] py-24 sm:py-28" aria-labelledby="club-letters">
          <div className="mx-auto max-w-[1500px]">
            <h2 className="hx-stack" id="club-letters">
              <span className="st st-blue">Le nom</span>
              <span className="st st-pink st-xl">{page.lettersTitle.replace(/\.$/, "")}</span>
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-center text-lg leading-relaxed text-white/85">{page.lettersIntro}</p>

            <ol className="mt-14 grid gap-5 md:grid-cols-3">
              {page.letters.map((item, index) => (
                <Reveal as="li" className="flex flex-col rounded-[2px] border border-white/10 bg-[#1E1A21] px-6 py-8 sm:px-8 sm:py-10" delay={index * 110} key={item.word}>
                  <p aria-hidden="true" className="font-display text-[clamp(2.6rem,5vw,4.4rem)] uppercase leading-none">
                    {"NULLL".split("").map((lettre, position) => (
                      <span className={position === item.highlight ? "text-[#E8459E]" : "text-white/20"} key={position}>
                        {lettre}
                      </span>
                    ))}
                  </p>
                  <h3 className={`st ${["st-yellow", "st-lime", "st-cream"][index % 3]} mt-6`}>{item.word}</h3>
                  <p className="mt-5 text-base leading-relaxed text-white/85">{item.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- ÉDITORIAL ---------------- */}
        <section className="bg-[#1E1A21] px-[max(5vw,20px)] py-24 sm:py-28" aria-labelledby="club-editorial">
          <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[minmax(0,70ch)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 className="hx-stack hx-stack-left" id="club-editorial">
                <span className="st st-yellow">Rejoindre un club de sport</span>
                <span className="st st-pink st-xl">à Aix-en-Provence</span>
              </h2>
              <div className="mt-12 space-y-10">
                {page.editorial.map((bloc) => (
                  <div key={bloc.heading}>
                    <h3 className="font-display text-[clamp(1.5rem,2.2vw,2.1rem)] uppercase leading-[1.1] text-[#FFC531]">{bloc.heading}</h3>
                    <p className="mt-3 max-w-[68ch] text-lg leading-relaxed text-white/85">{bloc.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-12 max-w-[68ch] text-lg leading-relaxed text-white/85">
                Pour aller plus loin : <Link className="underline decoration-[#E8459E] decoration-2 underline-offset-4 transition-colors hover:text-[#E8459E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]" href={localClubHref}>le run club à Aix-en-Provence</Link>,{" "}
                <Link className="underline decoration-[#E8459E] decoration-2 underline-offset-4 transition-colors hover:text-[#E8459E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]" href={localRunningHref}>où courir à Aix-en-Provence</Link> et{" "}
                <Link className="underline decoration-[#E8459E] decoration-2 underline-offset-4 transition-colors hover:text-[#E8459E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]" href={runsHref}>les prochaines sorties</Link>.
              </p>
            </div>
            <figure className="relative mx-auto w-full max-w-md rotate-2 lg:sticky lg:top-28 lg:mx-0 lg:max-w-none lg:self-start">
              <div className="relative aspect-square overflow-hidden rounded-[2px]">
                <Image alt="Un petit groupe du club reflété dans des lunettes de soleil" className="object-cover object-[50%_72%]" fill sizes="(min-width: 1024px) 38vw, 100vw" src="/assets/photos/editorial-glasses.webp" />
              </div>
              <figcaption className="st st-lime absolute -bottom-4 left-4">Soyons nous</figcaption>
            </figure>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="px-[max(5vw,20px)] py-24 sm:py-28" aria-labelledby="club-faq">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="hx-stack" id="club-faq">
              <span className="st st-cream">On nous demande souvent</span>
              <span className="st st-yellow st-xl">Les questions</span>
            </h2>
            <dl className="mt-14 grid gap-4">
              {page.faq.map((entry, index) => (
                <div className="grid gap-3 rounded-[2px] border border-white/10 bg-[#1E1A21] p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:gap-10" key={entry.q}>
                  <dt className="flex items-baseline gap-4 font-display text-[clamp(1.4rem,2.2vw,2rem)] uppercase leading-[1.1]">
                    <span aria-hidden="true" className="shrink-0 font-mono text-xs font-bold tracking-[.14em] text-[#E8459E]">0{index + 1}</span>
                    <span>{entry.q}</span>
                  </dt>
                  <dd className="text-[1.05rem] leading-relaxed text-white/85">{entry.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------- LE PREMIER RUN + INSTAGRAM ---------------- */}
        <section className="grid gap-5 px-[max(5vw,20px)] pb-28 lg:grid-cols-2" aria-labelledby="club-cta">
          <div className="flex flex-col items-start justify-center rounded-[2px] bg-[#E8459E] p-8 sm:p-12">
            <h2 className="st st-yellow st-xl" id="club-cta">{page.firstRunTitle.replace(/\.$/, "")}</h2>
            <p className="mt-6 max-w-lg text-lg font-bold leading-relaxed text-white">{page.firstRunText}</p>
            <Link className="hx-pill mt-8" href={runsHref}>
              <span>Voir les prochaines sorties</span>
              <ArrowIcon />
            </Link>
          </div>
          <a className="hx-tile !aspect-auto min-h-[420px]" href={copy.contact.instagram} rel="noreferrer noopener" target="_blank">
            <Image alt="" fill sizes="(min-width: 1024px) 45vw, 92vw" src="/assets/actus/bienvenue/18.webp" />
            <span className="hx-tile-shade" aria-hidden="true" />
            <span className="st st-blue">{page.social.title}</span>
            <span className="st st-pink st-xl hx-tile-label">{copy.contact.instagramLabel}</span>
            <span className="st st-cream hx-tile-text">{page.social.cta} →</span>
          </a>
        </section>
      </div>
    </SiteShell>
  );
}

export function CheckoutPageView({ locale }: { locale: Locale }) {
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="merch" locale={locale} pathname={getRoute(locale, "checkout")}>
      <section className="mx-auto w-full max-w-[1600px] px-5 py-10 sm:px-8 xl:px-12 xl:py-14">
        <SectionTitle as="h1" index="11" text={copy.checkoutPage.intro} title={copy.checkoutPage.title} />
        <div className="mt-10 max-w-4xl border-2 border-white/15 bg-[#141116] p-5">
          <CheckoutForm locale={locale} />
        </div>
      </section>
    </SiteShell>
  );
}
