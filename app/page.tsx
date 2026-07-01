import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowIcon } from "../components/ArrowIcon";
import { LocalizedText } from "../components/LocalizedText";

const photos = {
  hero: "/assets/nulll-new/run-finish.png",
  smile: "/assets/nulll-new/smile-sun.png",
  pool: "/assets/nulll-new/pool-legs.png",
  water: "/assets/nulll-new/water-face.png",
};

export const metadata: Metadata = {
  title: "NULLL.CLUB | Social Run Club Aix-en-Provence",
  description:
    "NULLL.CLUB est un run club social a Aix-en-Provence pour sortir de la bulle ecole, metro, boulot.",
  openGraph: {
    title: "NULLL.CLUB | Social Run Club Aix-en-Provence",
    description:
      "Runs en groupe, enceinte commune, zero ecouteurs : le sport comme pretexte pour creer une vraie communaute.",
    images: [{ url: "/assets/nulll-new/run-finish.png" }],
  },
};

const clubRules = ["No headphones", "No lonely run", "Music outside", "Real talk", "Aix after class", "Leave connected"];

export default async function Home() {
  return (
    <main className="min-h-screen bg-[#f6eadf] text-[#351815]">
      <HomeHeader />

      <section className="relative overflow-hidden border-b-2 border-[#351815] bg-[#f6eadf]">
        <div className="absolute -right-20 top-20 hidden w-[36vw] rotate-6 opacity-10 lg:block">
          <Image alt="" aria-hidden="true" height={784} src="/assets/nulll-new/n-burgundy.png" width={900} />
        </div>

        <div className="mx-auto grid min-h-[calc(100svh-82px)] w-full max-w-[1760px] grid-cols-1 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="flex min-h-[680px] flex-col justify-between border-b-2 border-[#351815] px-5 py-5 sm:px-8 lg:border-b-0 lg:border-r-2 lg:px-10 lg:py-7">
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[0.72rem] font-black uppercase leading-none sm:text-xs">
                <span className="border-2 border-[#351815] bg-[#351815] px-3 py-2 text-[#f6eadf]">01</span>
                <span className="border-2 border-[#351815] px-3 py-2">Aix-en-Provence</span>
                <span className="border-2 border-[#351815] bg-[#ffb000] px-3 py-2">Run club social</span>
              </div>

              <h1 className="mt-8 max-w-4xl font-display text-[clamp(4.2rem,11vw,10.8rem)] uppercase leading-[0.92] tracking-normal">
                RUN.
                <br />
                MEET.
                <br />
                REPEAT.
              </h1>

              <p className="mt-6 max-w-2xl text-[clamp(1.2rem,2.1vw,2rem)] font-black uppercase leading-[0.98]">
                <LocalizedText
                  en="A social running club for people who need to get out of the weekly bubble."
                  fr="Un running club social pour sortir de la bulle ecole, metro, boulot."
                />
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="border-2 border-[#351815] bg-[#d96ab4] p-4 font-mono text-sm font-black uppercase leading-tight text-[#351815] sm:p-5">
                <LocalizedText
                  en={
                    <>
                      Group runs. Shared speaker. Zero headphones.
                      <br />
                      Sport is the excuse. The family is the point.
                    </>
                  }
                  fr={
                    <>
                      Runs en groupe. Enceinte commune. Zero ecouteurs.
                      <br />
                      Le sport est le pretexte. La famille est le sujet.
                    </>
                  }
                />
              </div>
              <div className="flex flex-col gap-3 sm:min-w-56">
                <HomeLink href="/runs" tone="dark">
                  <LocalizedText en="Join a run" fr="Rejoindre un run" />
                </HomeLink>
                <HomeLink href="/community" tone="light">
                  <LocalizedText en="Feel the mood" fr="Voir l'esprit" />
                </HomeLink>
              </div>
            </div>
          </div>

          <div className="relative min-h-[720px] overflow-hidden bg-[#351815] p-3 sm:p-5 lg:min-h-full">
            <div className="absolute left-5 top-5 z-20 border-2 border-[#f6eadf] bg-[#f6eadf] px-3 py-2 font-mono text-xs font-black uppercase text-[#351815]">
              Rec / no headphones
            </div>
            <Image
              alt="Runner surrounded by the NULLL.CLUB community after a race"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 54vw, 100vw"
              src={photos.hero}
            />
            <div className="absolute inset-3 border-2 border-[#f6eadf] sm:inset-5" />
            <div className="absolute bottom-8 left-8 right-8 z-10 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="bg-[#f6eadf] p-4 text-[#351815] sm:p-5">
                <p className="font-mono text-xs font-black uppercase">Next mood</p>
                <p className="mt-2 font-display text-[clamp(2.6rem,5vw,4.8rem)] uppercase leading-[0.92]">Make it real</p>
              </div>
              <div className="bg-[#ffb000] px-4 py-3 font-mono text-xs font-black uppercase text-[#351815]">43.5298 N</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-[#351815] bg-[#351815] py-3 text-[#f6eadf]">
        <div className="flex overflow-hidden font-display text-[clamp(2.2rem,5vw,4.8rem)] uppercase leading-none">
          <div className="animate-[marquee_24s_linear_infinite] whitespace-nowrap">
            RUN TOGETHER / NO HEADPHONES / MUSIC OUTSIDE / COME ALONE LEAVE CONNECTED / DROP 001 /&nbsp;
          </div>
          <div className="animate-[marquee_24s_linear_infinite] whitespace-nowrap" aria-hidden="true">
            RUN TOGETHER / NO HEADPHONES / MUSIC OUTSIDE / COME ALONE LEAVE CONNECTED / DROP 001 /&nbsp;
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1760px] grid-cols-1 border-b-2 border-[#351815] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b-2 border-[#351815] p-5 sm:p-8 lg:border-b-0 lg:border-r-2 lg:p-10">
          <p className="font-mono text-xs font-black uppercase">02 / why we run</p>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(3.4rem,7.4vw,7.2rem)] uppercase leading-[0.94]">
            <LocalizedText en="Not performance. Presence." fr="Pas la perf. La presence." />
          </h2>
          <p className="mt-6 max-w-xl text-xl font-bold leading-tight sm:text-2xl">
            <LocalizedText
              en="NULLL.CLUB mixes two worlds: school, metro, work on one side; sweat, music and real people on the other. The run is where the week cracks open."
              fr="NULLL.CLUB melange deux mondes: ecole, metro, boulot d'un cote; sueur, musique et vraies rencontres de l'autre. Le run ouvre une breche dans la semaine."
            />
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <PhotoTile alt="Smiling NULLL.CLUB mood" src={photos.smile} title="social" />
          <div className="flex min-h-[430px] flex-col justify-between border-b-2 border-[#351815] bg-[#ffb000] p-5 sm:border-l-2 sm:p-7">
            <Image alt="NULLL N" className="h-auto w-32" height={784} src="/assets/nulll-new/n-burgundy.png" width={900} />
            <div>
              <p className="font-display text-[clamp(3rem,6.6vw,5.8rem)] uppercase leading-[0.94]">No bubble</p>
              <p className="mt-4 font-mono text-sm font-black uppercase leading-tight">
                <LocalizedText en="You do not disappear behind headphones here." fr="Ici tu ne disparais pas derriere tes ecouteurs." />
              </p>
            </div>
          </div>
          <div className="border-b-2 border-[#351815] bg-[#d96ab4] p-5 sm:p-7">
            <p className="font-mono text-xs font-black uppercase">club rules</p>
            <div className="mt-6 grid gap-2">
              {clubRules.map((rule) => (
                <div className="flex items-center justify-between border-2 border-[#351815] bg-[#f6eadf] px-3 py-2 font-mono text-xs font-black uppercase" key={rule}>
                  <span>{rule}</span>
                  <span>+</span>
                </div>
              ))}
            </div>
          </div>
          <PhotoTile alt="Poolside NULLL.CLUB after-run mood" src={photos.pool} title="after run" />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1760px] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[620px] overflow-hidden border-b-2 border-[#351815] lg:border-b-0 lg:border-r-2">
          <Image alt="NULLL.CLUB summer clothing mood" className="object-cover" fill sizes="(min-width: 1024px) 55vw, 100vw" src={photos.water} />
          <div className="absolute inset-0 bg-[#351815]/10" />
        </div>
        <div className="flex min-h-[620px] flex-col justify-between p-5 sm:p-8 lg:p-10">
          <div>
            <p className="font-mono text-xs font-black uppercase">03 / apres le run</p>
            <h2 className="mt-5 font-display text-[clamp(3.4rem,7.6vw,7.2rem)] uppercase leading-[0.94]">
              <LocalizedText en="You came to run. You stay for the people." fr="Tu viens courir. Tu restes pour les gens." />
            </h2>
            <p className="mt-6 max-w-xl text-xl font-bold leading-tight sm:text-2xl">
              <LocalizedText
                en="The point is not to perform alone. The point is to find a rhythm, hear the same music and leave with names you remember."
                fr="Le sujet n'est pas de performer seul. Le sujet, c'est de trouver un rythme, entendre la meme musique et repartir avec des prenoms en tete."
              />
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <HomeLink href="/community" tone="pink">
              <LocalizedText en="Meet the community" fr="Voir la communaute" />
            </HomeLink>
            <HomeLink href="/contact" tone="dark">
              <LocalizedText en="Contact the club" fr="Contacter le club" />
            </HomeLink>
          </div>
        </div>
      </section>
    </main>
  );
}

function HomeHeader() {
  const nav = [
    { href: "/runs", label: "Runs" },
    { href: "/community", label: "Communauté" },
    { href: "/merch", label: "Merch" },
    { href: "/about", label: "À propos" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#351815] bg-[#f6eadf] text-[#351815]">
      <div className="mx-auto grid min-h-20 w-full max-w-[1760px] grid-cols-[1fr_auto] items-stretch lg:grid-cols-[260px_1fr_220px]">
        <Link className="flex items-center border-r-2 border-[#351815] px-4 transition hover:bg-[#ffb000] sm:px-6" href="/">
          <Image alt="NULLL.CLUB" className="h-auto w-36 sm:w-44" height={157} priority src="/assets/nulll-new/logo-burgundy.png" width={1225} />
        </Link>
        <nav aria-label="Main navigation" className="hidden grid-cols-4 font-mono text-xs font-black uppercase lg:grid">
          {nav.map((item) => (
            <Link className="grid place-items-center border-r-2 border-[#351815] px-3 text-center transition hover:bg-[#d96ab4]" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="grid min-h-20 place-items-center bg-[#351815] px-4 font-mono text-xs font-black uppercase text-[#f6eadf] transition hover:bg-[#ffb000] hover:text-[#351815] sm:px-6" href="/runs">
          Prochain run
        </Link>
      </div>
    </header>
  );
}

function HomeLink({ children, href, tone }: { children: ReactNode; href: string; tone: "dark" | "light" | "pink" }) {
  const styles = {
    dark: "border-[#351815] bg-[#351815] text-[#f6eadf] hover:bg-[#ffb000] hover:text-[#351815]",
    light: "border-[#351815] bg-[#f6eadf] text-[#351815] hover:bg-[#351815] hover:text-[#f6eadf]",
    pink: "border-[#351815] bg-[#d96ab4] text-[#351815] hover:bg-[#ffb000]",
  }[tone];

  return (
    <Link
      className={`group inline-flex min-h-14 items-center justify-between gap-4 border-2 px-4 py-3 font-mono text-sm font-black uppercase transition hover:-translate-y-1 ${styles}`}
      href={href}
    >
      <span className="leading-tight">{children}</span>
      <ArrowIcon />
    </Link>
  );
}

function PhotoTile({ alt, src, title }: { alt: string; src: string; title: string }) {
  return (
    <div className="relative min-h-[430px] overflow-hidden border-b-2 border-[#351815]">
      <Image alt={alt} className="object-cover" fill sizes="(min-width: 1024px) 28vw, 100vw" src={src} />
      <div className="absolute left-4 top-4 bg-[#f6eadf] px-3 py-2 font-mono text-xs font-black uppercase text-[#351815]">{title}</div>
    </div>
  );
}
