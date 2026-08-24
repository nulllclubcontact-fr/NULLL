import Image from "next/image";
import Link from "next/link";
import type { RunEvent } from "../lib/site-content";
import { ArrowIcon } from "./ArrowIcon";

type HomeExperienceProps = {
  runs: RunEvent[];
  runsHref: string;
  communityHref: string;
  merchHref: string;
  aboutHref: string;
  contactHref: string;
  instagram: string;
  instagramLabel: string;
};


export function HomeExperience({
  runs,
  runsHref,
  communityHref,
  merchHref,
  aboutHref,
  contactHref,
  instagram,
  instagramLabel
}: HomeExperienceProps) {
  const nextRun = runs[0];

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-[#120908] text-[#f6eadf]" aria-labelledby="home-title">
        <Image
          alt="Le groupe NULLL.CLUB court dans une rue d’Aix-en-Provence au lever du soleil"
          className="hero-photo object-cover object-[62%_center]"
          fill
          priority
          sizes="100vw"
          src="/assets/photos/hero-nulll-aix-v2.png"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(18,9,8,.82)_0%,rgba(18,9,8,.55)_34%,rgba(18,9,8,.12)_62%,rgba(18,9,8,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(18,9,8,.75),transparent)]" />

        <div className="relative mx-auto flex max-w-[1800px] flex-col px-5 pb-5 pt-6 sm:px-8 sm:pb-8 sm:pt-8 xl:px-12">
          <div className="flex items-center justify-between gap-4 border-b border-[#f6eadf]/45 pb-4 font-mono text-[.68rem] font-black uppercase tracking-[.1em] sm:text-xs">
            <span>Social sport club · Aix-en-Provence</span>
            <span className="text-[#ffb000]">Ouvert à tous · Gratuit</span>
          </div>

          <div className="max-w-3xl py-16 sm:py-24">
            <h1 className="home-title font-display uppercase tracking-[-.03em]" id="home-title">
              <span className="hero-rise" style={{ animationDelay: "80ms" }}>On court ensemble,</span>
              <span className="hero-rise text-[#d96ab4]" style={{ animationDelay: "200ms" }}>tous les samedis.</span>
            </h1>
            <p className="hero-rise mt-7 max-w-md text-lg font-bold leading-snug sm:text-xl" style={{ animationDelay: "340ms" }}>
              On vient pour courir. On revient pour les gens.
            </p>

            <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "450ms" }}>
              <Link
                className="group inline-flex min-h-16 items-center justify-between gap-10 border-2 border-[#ffb000] bg-[#ffb000] px-6 font-mono text-xs font-black uppercase text-[#351815] transition-colors hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf]"
                href={runsHref}
              >
                <span>Je viens samedi</span>
                <ArrowIcon />
              </Link>
              <Link
                className="group inline-flex min-h-16 items-center justify-between gap-10 border-2 border-[#f6eadf]/60 px-6 font-mono text-xs font-black uppercase transition-colors hover:border-[#f6eadf] hover:bg-[#f6eadf] hover:text-[#351815] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
                href={aboutHref}
              >
                <span>Le club</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>

          {/* Prochaine sortie — l'essentiel, rien de plus */}
          <div className="hero-rise grid border-2 border-[#351815] bg-[#f6eadf] text-[#351815] md:grid-cols-[1.3fr_.55fr_.6fr_1fr_auto]" style={{ animationDelay: "560ms" }}>
            <RunDatum emphasis label="Prochaine sortie" value={nextRun.date} />
            <RunDatum label="Heure" value={nextRun.time} />
            <RunDatum label="Distance" value={nextRun.distance} />
            <RunDatum label="Départ" value={nextRun.location} />
            <Link
              className="group flex min-h-20 items-center justify-between gap-8 bg-[#d96ab4] px-5 font-mono text-xs font-black uppercase text-[#351815] transition-colors hover:bg-[#351815] hover:text-[#f6eadf] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#ffb000] md:min-h-0 md:px-7"
              href={runsHref}
            >
              <span>Je viens</span>
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- LES PROCHAINES DATES ---------------- */}
      <section className="bg-[#f6eadf] text-[#351815]" aria-labelledby="home-next-runs">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24 xl:px-12">
          <div className="flex flex-col gap-5 border-b-2 border-[#351815] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-[clamp(2.6rem,5.5vw,5rem)] uppercase leading-[.9] tracking-[-.025em]" id="home-next-runs">
              Les prochaines <span className="text-[#d96ab4]">dates.</span>
            </h2>
            <p className="max-w-sm text-lg font-bold leading-snug">Rendez-vous au même endroit, chaque samedi matin.</p>
          </div>

          <ol className="mt-10 grid gap-4 lg:grid-cols-3">
            {runs.map((run, index) => (
              <li key={run.id}>
                <article className={`flex h-full flex-col justify-between gap-6 border-2 border-[#351815] p-6 sm:p-7 ${index === 0 ? "bg-[#ffb000]" : ""}`}>
                  <div>
                    <p className="font-mono text-[.62rem] font-black uppercase tracking-[.1em] opacity-70">
                      {index === 0 ? "Prochaine sortie" : `Sortie ${index + 1}`}
                    </p>
                    <p className="mt-3 font-display text-3xl uppercase leading-none sm:text-4xl">{run.date}</p>
                    <p className="mt-4 font-mono text-xs font-black uppercase tracking-[.06em]">
                      {run.time} · {run.distance} · {run.pace}
                    </p>
                    <p className="mt-2 font-mono text-xs font-black uppercase tracking-[.06em] opacity-70">{run.location}</p>
                  </div>

                  <Link
                    className="group inline-flex min-h-14 items-center justify-between gap-6 border-2 border-[#351815] px-5 font-mono text-xs font-black uppercase transition-colors hover:bg-[#351815] hover:text-[#f6eadf] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#d96ab4]"
                    href={runsHref}
                  >
                    <span>{index === 0 ? "Je viens" : "Détails"}</span>
                    <ArrowIcon />
                  </Link>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- ALLER PLUS LOIN ---------------- */}
      <section className="bg-[#120908] text-[#f6eadf]" aria-labelledby="home-explore">
        <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 sm:py-18 xl:px-12">
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,4rem)] uppercase leading-[.9] tracking-[-.025em]" id="home-explore">
            Le reste du <span className="text-[#d96ab4]">club.</span>
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ExploreCard href={communityHref} label="Communauté" text="Qui vient, et ce qui se passe entre les runs." />
            <ExploreCard href={merchHref} label="Merch" text="Les pièces du club, quand elles sont dispo." />
            <ExploreCard href={aboutHref} label="À propos" text="D’où vient NULLL.CLUB." />
          </div>
        </div>
      </section>

      {/* ---------------- BANDEAU DÉFILANT ---------------- */}
      <Link
        aria-label={`Je viens samedi — prochaine sortie le ${nextRun.date} à ${nextRun.time}, ${nextRun.location}, ${nextRun.distance}, ${nextRun.pace}. Ouvert à tous, gratuit.`}
        className="marquee group block border-y-2 border-[#351815] bg-[#ffb000] py-5 text-[#351815] transition-colors hover:bg-[#351815] hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#351815]"
        href={runsHref}
      >
        <div className="marquee-track" aria-hidden="true">
          {[0, 1].map((copyIndex) => (
            <div className="marquee-run" key={copyIndex}>
              {[
                { big: "Je viens samedi", meta: nextRun.time },
                { big: "Ouvert à tous", meta: nextRun.location },
                { big: "Allure conversation", meta: nextRun.distance },
                { big: "Gratuit", meta: nextRun.date }
              ].map((segment) => (
                <span className="marquee-item" key={segment.big}>
                  <span className="font-display text-[clamp(1.6rem,3.2vw,2.8rem)] uppercase leading-none tracking-[-.02em]">
                    {segment.big}
                  </span>
                  <span className="font-mono text-xs font-black uppercase tracking-[.12em] opacity-70">{segment.meta}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </Link>
    </>
  );
}

function RunDatum({ emphasis = false, label, value }: { emphasis?: boolean; label: string; value: string }) {
  return (
    <div className={`${emphasis ? "bg-[#ffb000]" : ""} border-b border-[#351815] px-5 py-4 last:border-b-0 md:border-b-0 md:border-r`}>
      <p className="font-mono text-[.62rem] font-black uppercase tracking-[.08em] opacity-65">{label}</p>
      <p className={`${emphasis ? "text-xl sm:text-2xl" : "text-lg"} mt-1 font-black uppercase leading-tight`}>{value}</p>
    </div>
  );
}

function ExploreCard({ href, label, text }: { href: string; label: string; text: string }) {
  return (
    <Link
      className="group flex items-center justify-between gap-6 border-2 border-[#f6eadf]/30 p-6 transition-colors hover:border-[#ffb000] hover:bg-[#1c0f0d] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
      href={href}
    >
      <div>
        <h3 className="font-display text-3xl uppercase leading-none">{label}</h3>
        <p className="mt-3 max-w-xs text-base font-bold leading-relaxed opacity-75">{text}</p>
      </div>
      <span className="text-[#ffb000]">
        <ArrowIcon />
      </span>
    </Link>
  );
}
