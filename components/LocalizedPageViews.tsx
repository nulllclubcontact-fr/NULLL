import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./ArrowIcon";
import { RubanVitesse } from "./ruban-vitesse";
import { FaqAccordeon } from "./faq-accordeon";
import "./home-experience.css";
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
        {/* ---------------- OUVERTURE ----------------
            Titre en bas a gauche, comme un post : la photo respire. */}
        <section className="hx-hero hx-hero-bas" aria-labelledby="club-title">
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
            <p className="st st-yellow">{page.title}</p>
            <h1 className="hx-hero-title" id="club-title">
              {page.punchlineLines.map((ligne, index) => (
                <span className={`st ${index === 1 ? "st-pink" : "st-cream"}`} key={ligne}>{ligne.replace(/\.$/, "")}</span>
              ))}
            </h1>
            <p className="hx-hero-support">{page.intro}</p>
          </div>
        </section>

        {/* ---------------- LES FONDATEURS ---------------- */}
        <section className="px-[max(5vw,20px)] py-24 sm:py-28" aria-labelledby="club-founders">
          <div className="mx-auto grid max-w-[1300px] items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <figure className="relative mx-auto w-full max-w-md -rotate-2 lg:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
                <Image
                  alt="Tom Brenier et Tobias Ringot, fondateurs de Nulll Club, dans une rue d’Aix-en-Provence"
                  className="-scale-x-100 object-cover object-[50%_38%]"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  src="/assets/photos/fondateurs.webp"
                />
              </div>
              <figcaption className="st st-yellow absolute -bottom-5 right-4" style={{ "--r": "3deg" } as React.CSSProperties}>Le club est parti de deux potes</figcaption>
            </figure>
            <div>
              <h2 className="hx-stack hx-stack-left" id="club-founders">
                <span className="st st-blue">Qui on est</span>
                <span className="st st-pink st-xl">{page.foundersTitle.replace(/\.$/, "")}</span>
              </h2>
              <ul className="mt-12 grid gap-5 sm:grid-cols-2">
                {page.founders.map((f, index) => (
                  <li className={`st ${["st-yellow", "st-cream", "st-lime"][index % 3]} !block !w-auto !px-5 !py-4`} key={f.name} style={{ rotate: `${[-1.5, 1.2, -0.8][index % 3]}deg` }}>
                    <span className="block text-[clamp(26px,2.4vw,34px)] leading-none">{f.name}</span>
                    <span className="mt-2 block font-mono text-sm font-bold normal-case tracking-normal">{f.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------- LA LIGNE DE VIE ----------------
            Une etape par bloc, numerotee : la date en etiquette, le titre,
            deux lignes. Les etapes a venir sont en pointilles. */}
        <section className="px-[max(5vw,20px)] py-24 sm:py-28" aria-labelledby="club-timeline">
          <div className="mx-auto max-w-[1300px]">
            <h2 className="hx-stack" id="club-timeline">
              <span className="st st-cream">D’où ça vient</span>
              <span className="st st-yellow st-xl">{page.timelineTitle.replace(/\.$/, "")}</span>
            </h2>
            {/* Chaque etape est une story : photo, barres de progression en
                haut, date en etiquette, titre, deux lignes. Defilement au
                doigt sur telephone, cote a cote sur grand ecran. */}
            <ol className="-mx-[max(5vw,20px)] mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(5vw,20px)] pb-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
              {page.timeline.map((etape, index) => {
                const photos = [
                  "/assets/actus/bienvenue/18.webp",
                  "/assets/actus/quatrieme-run/11.webp",
                  "/assets/actus/quatrieme-run/17.webp",
                  "/assets/actus/bienvenue/01.webp",
                  "/assets/actus/quatrieme-run/16.webp"
                ];
                const couleurs = ["st-yellow", "st-pink", "st-blue", "st-lime", "st-cream"];
                return (
                  <li className="relative isolate flex aspect-[9/15] w-[72vw] max-w-[300px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[6px] p-4 lg:w-auto lg:max-w-none" key={etape.label} style={{ rotate: `${[-1.5, 1, -0.8, 1.4, -1.2][index % 5]}deg` }}>
                    <Image alt="" className="-z-20 object-cover" fill sizes="(min-width: 1024px) 18vw, 72vw" src={photos[index % photos.length]} />
                    <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(20,17,22,.55)_0%,rgba(20,17,22,.1)_30%,rgba(20,17,22,.88)_70%)]" />
                    <div>
                      {/* Barres de progression, comme une story */}
                      <div aria-hidden="true" className="flex gap-1">
                        {page.timeline.map((_, barre) => (
                          <span className={`h-[3px] flex-1 rounded-full ${barre <= index ? "bg-white" : "bg-white/30"}`} key={barre} />
                        ))}
                      </div>
                      <p className="mt-3 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[.1em] text-white/85">
                        <span className="grid size-6 place-items-center rounded-full bg-[#E8459E] text-[9px] text-white">N</span>
                        Nulll Club · {index + 1}/{page.timeline.length}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-3">
                      <span className={`st ${etape.status === "aVenir" ? "st-cream" : couleurs[index % couleurs.length]} !text-[15px]`}>{etape.status === "aVenir" ? `À venir · ${etape.date}` : etape.date}</span>
                      <h3 className="font-display text-[clamp(1.6rem,2vw,2rem)] uppercase leading-[1.02]">{etape.label}</h3>
                      <p className="text-[14px] leading-snug text-white/90">{etape.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
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

            {/* Chaque L devient une grande etiquette, penchee dans un sens
                different : la lettre allumee porte la couleur du texte. */}
            <ol className="mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
              {page.letters.map((item, index) => {
                const style = [
                  { fond: "bg-[#E8459E] text-white", angle: -2.5, decalage: "" },
                  { fond: "bg-[#FFC531] text-[#141116]", angle: 2, decalage: "md:mt-8" },
                  { fond: "bg-[#1F7FE0] text-white", angle: -1.5, decalage: "md:mt-3" }
                ][index % 3];
                return (
                  <li className={`flex flex-col rounded-[2px] px-7 py-8 sm:px-8 sm:py-10 ${style.fond} ${style.decalage}`} key={item.word} style={{ rotate: `${style.angle}deg` }}>
                    <p aria-hidden="true" className="font-display text-[clamp(2.6rem,4.6vw,4.2rem)] uppercase leading-none">
                      {"NULLL".split("").map((lettre, position) => (
                        <span className={position === item.highlight ? "" : "opacity-30"} key={position}>
                          {lettre}
                        </span>
                      ))}
                    </p>
                    <h3 className="mt-4 font-display text-[clamp(2rem,3vw,2.8rem)] uppercase leading-none">{item.word}</h3>
                    <p className="mt-4 text-base font-bold leading-relaxed">{item.text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ---------------- ÉDITORIAL ----------------
            Court : trois idees en une ligne chacune, une photo du club. */}
        <section className="bg-[#1E1A21] px-[max(5vw,20px)] py-20 sm:py-24" aria-labelledby="club-editorial">
          <div className="mx-auto grid max-w-[1300px] items-center gap-12 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
            <div>
              <h2 className="hx-stack hx-stack-left" id="club-editorial">
                <span className="st st-yellow">Rejoindre un club de sport</span>
                <span className="st st-pink st-xl">à Aix-en-Provence</span>
              </h2>
              <ul className="mt-10 grid gap-6">
                {page.editorial.map((bloc) => (
                  <li key={bloc.heading}>
                    <h3 className="font-display text-[clamp(1.3rem,1.8vw,1.6rem)] uppercase leading-[1.1] text-[#FFC531]">{bloc.heading}</h3>
                    <p className="mt-1 max-w-[60ch] text-base leading-relaxed text-white/80">{bloc.body}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-base text-white/80">
                Pour aller plus loin : <Link className="underline decoration-[#E8459E] decoration-2 underline-offset-4 transition-colors hover:text-[#E8459E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]" href={localClubHref}>le run club à Aix</Link>,{" "}
                <Link className="underline decoration-[#E8459E] decoration-2 underline-offset-4 transition-colors hover:text-[#E8459E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]" href={localRunningHref}>où courir à Aix</Link>,{" "}
                <Link className="underline decoration-[#E8459E] decoration-2 underline-offset-4 transition-colors hover:text-[#E8459E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]" href={runsHref}>les prochaines sorties</Link>.
              </p>
            </div>
            <figure className="relative mx-auto w-full max-w-sm rotate-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
                <Image alt="Un membre du club en casquette lève sa canette en riant après une sortie" className="object-cover" fill sizes="(min-width: 1024px) 28vw, 80vw" src="/assets/actus/quatrieme-run/14.webp" />
              </div>
              <figcaption className="st st-lime absolute -bottom-4 left-4" style={{ "--r": "-3deg" } as React.CSSProperties}>Soyons nous</figcaption>
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
            <div className="mt-14">
              <FaqAccordeon accent="text-[#E8459E]" entrees={page.faq} nom="faq-club" />
            </div>
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
