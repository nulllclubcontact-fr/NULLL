import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StructuredData } from "../../../components/StructuredData";
import { ArrowIcon } from "../../../components/ArrowIcon";
import { PrimaryLink, RunCard, SiteShell } from "../../../components/site-shell";
import { resolveLocale } from "../../../lib/locale";
import { buildBreadcrumbSchema, buildEventSchema, buildFaqSchema, buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy, type RunEvent } from "../../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  return buildPageMetadata({
    locale,
    routeKey: "runs",
    title: copy.meta.runs.title,
    description: copy.meta.runs.description
  });
}

export default async function RunsPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  const firstRun = copy.runs[0];
  const laterRuns = copy.runs.slice(1);

  return (
    <SiteShell current="runs" locale={locale} pathname={getRoute(locale, "runs")}>
      <StructuredData
        data={buildEventSchema({
          locale,
          name: firstRun.title,
          description: firstRun.summary,
          startDate: firstRun.isoDate,
          locationName: firstRun.location,
          address: firstRun.address,
          route: getRoute(locale, "runs")
        })}
      />
      <StructuredData data={buildFaqSchema(copy.runsPage.faq)} />
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "Runs", url: getRoute(locale, "runs") }
        ])}
      />

      <section className="relative overflow-hidden border-b-2 border-[#351815] bg-[#f6eadf]">
        <div className="absolute -left-24 top-24 hidden w-[38vw] -rotate-6 opacity-[0.08] xl:block">
          <Image alt="" aria-hidden="true" height={784} src="/assets/nulll-new/n-burgundy.png" width={900} />
        </div>
        <div className="mx-auto grid min-h-[calc(100svh-82px)] w-full max-w-none grid-cols-1 xl:grid-cols-[0.98fr_1.02fr]">
          <div className="relative z-10 flex flex-col justify-between border-b-2 border-[#351815] px-4 py-7 sm:px-6 xl:border-b-0 xl:border-r-2 xl:px-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[0.72rem] font-black uppercase leading-none sm:text-xs">
                <span className="border-2 border-[#351815] bg-[#351815] px-3 py-2 text-[#f6eadf]">Run 001</span>
                <span className="border-2 border-[#351815] bg-[#ffb000] px-3 py-2">{firstRun.date}</span>
                <span className="border-2 border-[#351815] px-3 py-2">{firstRun.time}</span>
              </div>

              <h1 className="mt-8 max-w-5xl font-display text-[clamp(4.8rem,12.5vw,12rem)] uppercase leading-[0.92]">
                First
                <br />
                Run
              </h1>

              <p className="mt-7 max-w-2xl text-[clamp(1.3rem,2.2vw,2.35rem)] font-black uppercase leading-[0.96]">
                Le premier vrai rendez-vous NULLL.CLUB. Tu viens seul, tu repars avec des noms, du bruit, une raison de revenir.
              </p>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-[1fr_260px] xl:items-end">
              <RunInfoPanel run={firstRun} />
              <Link
                className="group inline-flex min-h-16 items-center justify-between gap-4 border-2 border-[#351815] bg-[#351815] px-5 py-4 font-mono text-sm font-black uppercase text-[#f6eadf] transition hover:-translate-y-1 hover:bg-[#ffb000] hover:text-[#351815]"
                href={getRoute(locale, "contact")}
              >
                <span>Je veux le spot exact</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[760px] overflow-hidden bg-[#351815] p-3 sm:p-5 xl:min-h-full">
            <Image
              alt="Premier run NULLL.CLUB"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1280px) 52vw, 100vw"
              src="/assets/nulll-new/run-finish.png"
            />
            <div className="absolute inset-3 border-2 border-[#f6eadf] sm:inset-5" />
            <div className="absolute left-6 top-6 z-10 border-2 border-[#351815] bg-[#ffb000] px-3 py-2 font-mono text-xs font-black uppercase text-[#351815]">
              Aucun ecouteur
            </div>
            <div className="absolute bottom-8 left-8 right-8 z-10 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <div className="bg-[#f6eadf] p-5 text-[#351815]">
                <p className="font-mono text-xs font-black uppercase">{firstRun.location}</p>
                <p className="mt-2 font-display text-[clamp(2.8rem,6vw,5.8rem)] uppercase leading-[0.94]">{firstRun.distance}</p>
              </div>
              <div className="bg-[#d96ab4] px-4 py-3 font-mono text-xs font-black uppercase text-[#351815]">
                {firstRun.pace}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-[#351815] bg-[#351815] py-3 text-[#f6eadf]">
        <div className="flex overflow-hidden font-display text-[clamp(2.4rem,5.8vw,5.4rem)] uppercase leading-none">
          <div className="animate-[marquee_24s_linear_infinite] whitespace-nowrap">
            FIRST RUN / NO HEADPHONES / SHARED SPEAKER / COME ALONE / LEAVE CONNECTED / {firstRun.date} /&nbsp;
          </div>
          <div className="animate-[marquee_24s_linear_infinite] whitespace-nowrap" aria-hidden="true">
            FIRST RUN / NO HEADPHONES / SHARED SPEAKER / COME ALONE / LEAVE CONNECTED / {firstRun.date} /&nbsp;
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-none gap-6 px-4 py-10 sm:px-6 xl:grid-cols-[0.45fr_0.55fr] xl:px-8 xl:py-14">
        <div className="border-2 border-[#351815] bg-[#ffb000] p-6 xl:p-8">
          <p className="font-mono text-xs font-black uppercase">Pourquoi c’est different</p>
          <h2 className="mt-5 font-display text-[clamp(3.2rem,6.8vw,6.4rem)] uppercase leading-[0.94]">
            Pas juste courir.
          </h2>
          <p className="mt-6 text-xl font-black uppercase leading-tight text-[#351815]/78">
            On coupe la semaine en deux: plus d’ecouteurs, une enceinte, un groupe, une ville, un pretexte pour parler.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {copy.runsPage.checklist.map((item, index) => (
            <div className={`${index === 0 ? "bg-[#d96ab4]" : "bg-[#f6eadf]"} min-h-32 border-2 border-[#351815] p-5 font-mono text-sm font-black uppercase transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#d96ab4]`} key={item}>
              <span className="block text-xs opacity-60">0{index + 1}</span>
              <span className="mt-5 block">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-none px-4 pb-14 sm:px-6 xl:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 border-t-2 border-[#351815] pt-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs font-black uppercase text-[#d96ab4]">Calendar</p>
            <h2 className="mt-3 font-display text-[clamp(3rem,6.2vw,6rem)] uppercase leading-[0.94]">
              Les prochains rendez-vous.
            </h2>
          </div>
          <PrimaryLink href={getRoute(locale, "contact")}>{copy.runsPage.cta}</PrimaryLink>
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <FeaturedRunCard run={firstRun} />
          {laterRuns.map((run) => (
            <div key={run.id}>
              <StructuredData
                data={buildEventSchema({
                  locale,
                  name: run.title,
                  description: run.summary,
                  startDate: run.isoDate,
                  locationName: run.location,
                  address: run.address,
                  route: getRoute(locale, "runs")
                })}
              />
              <RunCard run={run} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-none px-4 pb-14 sm:px-6 xl:px-8">
        <div className="grid gap-6 border-2 border-[#351815] bg-[#351815] p-6 text-[#f6eadf] xl:grid-cols-[0.7fr_1.3fr] xl:p-8">
          <div>
            <p className="font-mono text-xs font-black uppercase text-[#ffb000]">
              FAQ run club
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.6rem,5.2vw,4.5rem)] uppercase leading-[0.96]">
              Les reponses qui levent les freins.
            </h2>
          </div>
          <div className="grid gap-4">
            {copy.runsPage.faq.map((entry) => (
              <article className="border-t-2 border-[#f6eadf] pt-4" key={entry.q}>
                <h3 className="text-xl font-black">{entry.q}</h3>
                <p className="mt-3 text-[#f6eadf]/70">{entry.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function RunInfoPanel({ run }: { run: RunEvent }) {
  const rows = [
    ["Date", run.date],
    ["Heure", run.time],
    ["Lieu", run.location],
    ["Regle", "Zero ecouteurs"]
  ];

  return (
    <div className="border-2 border-[#351815] bg-[#f6eadf] font-mono text-xs font-black uppercase">
      {rows.map(([label, value]) => (
        <div className="grid grid-cols-[96px_1fr] border-b-2 border-[#351815] last:border-b-0" key={label}>
          <div className="bg-[#ffb000] p-3">{label}</div>
          <div className="p-3">{value}</div>
        </div>
      ))}
    </div>
  );
}

function FeaturedRunCard({ run }: { run: RunEvent }) {
  return (
    <article className="relative overflow-hidden border-2 border-[#351815] bg-[#351815] p-5 text-[#f6eadf] shadow-[8px_8px_0_#ffb000]">
      <p className="font-mono text-xs font-black uppercase text-[#ffb000]">Run 001 / Featured</p>
      <h3 className="mt-4 font-display text-[clamp(2.7rem,4.6vw,4.8rem)] uppercase leading-[0.94]">{run.title}</h3>
      <p className="mt-5 font-bold text-[#f6eadf]/72">{run.summary}</p>
      <div className="mt-6 grid gap-2 font-mono text-xs font-black uppercase">
        <div className="flex justify-between border-t-2 border-[#f6eadf] pt-3"><span>Distance</span><span>{run.distance}</span></div>
        <div className="flex justify-between border-t-2 border-[#f6eadf] pt-3"><span>Allure</span><span>{run.pace}</span></div>
        <div className="flex justify-between border-t-2 border-[#f6eadf] pt-3"><span>Apres</span><span>{run.afterRun}</span></div>
      </div>
    </article>
  );
}
