import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StructuredData } from "../../components/StructuredData";
import { ArrowIcon } from "../../components/ArrowIcon";
import { SiteShell } from "../../components/site-shell";
import { buildOrganizationSchema, buildPageMetadata, buildSportsLocationSchema } from "../../lib/seo";
import { resolveLocale } from "../../lib/locale";
import { getRoute, getSiteCopy, type Locale } from "../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  return buildPageMetadata({
    locale,
    routeKey: "home",
    title: copy.meta.home.title,
    description: copy.meta.home.description
  });
}

const clubRules = ["No headphones", "No lonely run", "Music outside", "Real talk"];

export default async function LocaleHomePage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);

  return (
    <SiteShell current="home" locale={locale} pathname={`/${locale}`}>
      <StructuredData data={[buildOrganizationSchema(locale), buildSportsLocationSchema(locale)]} />
      <section className="mx-auto grid min-h-[calc(100svh-82px)] w-full max-w-[1760px] grid-cols-1 border-b-2 border-[#351815] lg:grid-cols-[0.94fr_1.06fr]">
        <div className="flex min-h-[680px] flex-col justify-between border-b-2 border-[#351815] px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r-2 lg:px-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[0.72rem] font-black uppercase leading-none sm:text-xs">
              <span className="border-2 border-[#351815] bg-[#351815] px-3 py-2 text-[#f6eadf]">01</span>
              <span className="border-2 border-[#351815] px-3 py-2">Aix-en-Provence</span>
              <span className="border-2 border-[#351815] bg-[#ffb000] px-3 py-2">Run club social</span>
            </div>
            <h1 className="mt-8 max-w-4xl font-display text-[clamp(4.2rem,11vw,10.8rem)] uppercase leading-[0.92]">
              RUN.
              <br />
              MEET.
              <br />
              REPEAT.
            </h1>
            <p className="mt-6 max-w-2xl text-[clamp(1.2rem,2.1vw,2rem)] font-black uppercase leading-[0.98]">
              {locale === "fr"
                ? "Un running club social pour sortir de la bulle ecole, metro, boulot."
                : "A social running club for people who need to get out of the weekly bubble."}
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="border-2 border-[#351815] bg-[#d96ab4] p-4 font-mono text-sm font-black uppercase leading-tight sm:p-5">
              {locale === "fr" ? "Runs en groupe. Enceinte commune. Zero ecouteurs. Le sport est le pretexte, la famille est le sujet." : "Group runs. Shared speaker. Zero headphones. Sport is the excuse, family is the point."}
            </div>
            <div className="flex flex-col gap-3 sm:min-w-56">
              <HomeLink href={getRoute(locale, "runs")}>{locale === "fr" ? "Rejoindre un run" : "Join a run"}</HomeLink>
              <HomeLink href={getRoute(locale, "community")} light>{locale === "fr" ? "Voir l'esprit" : "Feel the mood"}</HomeLink>
            </div>
          </div>
        </div>
        <div className="relative min-h-[720px] overflow-hidden bg-[#351815] p-3 sm:p-5 lg:min-h-full">
          <Image alt="NULLL.CLUB community after a race" className="object-cover" fill priority sizes="(min-width: 1024px) 54vw, 100vw" src="/assets/nulll-new/run-finish.png" />
          <div className="absolute inset-3 border-2 border-[#f6eadf] sm:inset-5" />
          <div className="absolute bottom-8 left-8 right-8 z-10 bg-[#f6eadf] p-5 text-[#351815]">
            <p className="font-mono text-xs font-black uppercase">Next mood</p>
            <p className="mt-2 font-display text-[clamp(2.6rem,5vw,4.8rem)] uppercase leading-[0.92]">Make it real</p>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-[#351815] bg-[#351815] py-3 text-[#f6eadf]">
        <div className="flex overflow-hidden font-display text-[clamp(2.2rem,5vw,4.8rem)] uppercase leading-none">
          <div className="animate-[marquee_24s_linear_infinite] whitespace-nowrap">RUN TOGETHER / NO HEADPHONES / MUSIC OUTSIDE / COME ALONE LEAVE CONNECTED / DROP 001 /&nbsp;</div>
          <div className="animate-[marquee_24s_linear_infinite] whitespace-nowrap" aria-hidden="true">RUN TOGETHER / NO HEADPHONES / MUSIC OUTSIDE / COME ALONE LEAVE CONNECTED / DROP 001 /&nbsp;</div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1760px] grid-cols-1 border-b-2 border-[#351815] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b-2 border-[#351815] p-5 sm:p-8 lg:border-b-0 lg:border-r-2 lg:p-10">
          <p className="font-mono text-xs font-black uppercase">02 / why we run</p>
          <h2 className="mt-5 max-w-4xl font-display text-[clamp(3.4rem,7.4vw,7.2rem)] uppercase leading-[0.94]">
            {locale === "fr" ? "Pas la perf. La presence." : "Not performance. Presence."}
          </h2>
          <p className="mt-6 max-w-xl text-xl font-bold leading-tight sm:text-2xl">
            {locale === "fr"
              ? "NULLL.CLUB melange deux mondes: ecole, metro, boulot d'un cote; sueur, musique et vraies rencontres de l'autre."
              : "NULLL.CLUB mixes two worlds: school, metro, work on one side; sweat, music and real people on the other."}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <PhotoTile alt="Smiling NULLL.CLUB mood" src="/assets/nulll-new/smile-sun.png" title="social" />
          <div className="flex min-h-[430px] flex-col justify-between border-b-2 border-[#351815] bg-[#ffb000] p-5 sm:border-l-2 sm:p-7">
            <Image alt="NULLL N" className="h-auto w-32" height={784} src="/assets/nulll-new/n-burgundy.png" width={900} />
            <div>
              <p className="font-display text-[clamp(3rem,6.6vw,5.8rem)] uppercase leading-[0.94]">No bubble</p>
              <p className="mt-4 font-mono text-sm font-black uppercase leading-tight">
                {locale === "fr" ? "Ici tu ne disparais pas derriere tes ecouteurs." : "You do not disappear behind headphones here."}
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
          <PhotoTile alt="Poolside NULLL.CLUB after-run mood" src="/assets/nulll-new/pool-legs.png" title="after run" />
        </div>
      </section>
    </SiteShell>
  );
}

function HomeLink({ children, href, light = false }: { children: React.ReactNode; href: string; light?: boolean }) {
  return (
    <Link className={`${light ? "bg-[#f6eadf] text-[#351815] hover:bg-[#351815] hover:text-[#f6eadf]" : "bg-[#351815] text-[#f6eadf] hover:bg-[#ffb000] hover:text-[#351815]"} group inline-flex min-h-14 items-center justify-between gap-4 border-2 border-[#351815] px-4 py-3 font-mono text-sm font-black uppercase transition hover:-translate-y-1`} href={href}>
      <span>{children}</span>
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
