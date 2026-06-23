import Image from "next/image";
import Link from "next/link";
import { BrandHeader } from "../../components/BrandHeader";
import { BrutalButton } from "../../components/BrutalButton";
import { LocalizedText } from "../../components/LocalizedText";
import { PageStamp } from "../../components/PageStamp";
import { PosterPhoto } from "../../components/PosterPhoto";
import { upcomingRuns } from "../../lib/content";

export default function RunsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BrandHeader current="runs" />
      <section className="poster-frame grid min-h-[calc(100vh-98px)] grid-cols-1 lg:grid-cols-[0.58fr_0.42fr]">
        <div className="grid-paper relative border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:pl-24 lg:pr-8 lg:pt-8">
          <div className="absolute inset-y-0 left-0 hidden w-16 border-r-2 border-white font-mono text-xs uppercase lg:block">
            <div className="vertical-copy absolute left-5 top-8 text-shock">2026/09/12 08:30:00</div>
            <div className="vertical-copy absolute bottom-24 left-5 text-white/70">Aix-en-Provence, France</div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <h1 className="display-safe font-display text-[clamp(3.4rem,18vw,11rem)] uppercase">RUNS</h1>
            <PageStamp index="02.">
              <LocalizedText en="Aix social run club" fr="Aix social run club" />
            </PageStamp>
          </div>
          <div className="my-5 rotate-[-1deg] overflow-hidden whitespace-nowrap border-2 border-white p-3 text-center font-mono text-[clamp(0.62rem,2vw,1.125rem)] font-black uppercase tonic-shadow">
            NO PACE. NO EGO. <span className="text-shock">NO EXCUSE.</span> DJ SETS.
          </div>
          <div className="space-y-3">
            {upcomingRuns.map((run, index) => (
              <RunDrop run={run} index={index} key={run.id} />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-[88px_1fr] border-2 border-dashed border-white p-4 font-mono uppercase">
            <div className="grid place-items-center border-r-2 border-white text-5xl text-shock">+</div>
            <div className="px-5">
              <p className="text-2xl font-bold">
                <LocalizedText en="MORE RUNS COMING SOON" fr="MORE RUNS SOON" />
              </p>
              <p className="mt-2 text-sm text-white/60">
                <LocalizedText en="Future events will appear here" fr="Future events drop ici" />
              </p>
            </div>
          </div>
        </div>
        <aside className="grid-paper p-5 lg:p-8">
          <PosterPhoto
            alt="Running crew documented in Aix"
            className="aspect-[4/3]"
            src="/assets/photos/camera-proof.png"
            stamp="REC 00:06:31"
          />
          <div className="mt-5 border-2 border-white p-5 font-mono uppercase">
            <p className="text-shock">
              <LocalizedText en="NEXT RUN RULES" fr="RULES PROCHAIN RUN" />
            </p>
            <p className="mt-4 text-2xl font-black leading-tight">
              <LocalizedText en="Come as you are." fr="Come as you are." />
              <br />
              <LocalizedText en="Leave less alone." fr="Leave less alone." />
            </p>
            <p className="mt-4 text-sm text-white/65">
              <LocalizedText
                en="No gear check. No performance test. DJ sets after the run."
                fr="No gear check. Pas de perf test. DJ sets apres le run."
              />
            </p>
          </div>
          <div className="mt-5">
            <BrutalButton href="/contact" variant="pink">
              <LocalizedText en="ASK FOR THE NEXT RUN" fr="ASK POUR LE PROCHAIN RUN" />
            </BrutalButton>
          </div>
        </aside>
      </section>
    </main>
  );
}

function RunDrop({ index, run }: { index: number; run: (typeof upcomingRuns)[number] }) {
  const [weekday, day, month] = run.date.split(" ");
  const [weekdayEn, , monthEn] = run.dateEn.split(" ");

  return (
    <article className={`relative grid min-w-0 grid-cols-[76px_minmax(0,1fr)] border-2 sm:grid-cols-[84px_minmax(0,1fr)] ${index === 0 ? "-mt-1 rotate-[-0.25deg] border-shock shadow-[4px_4px_0_#ff3fb4]" : "border-white"}`}>
      <div className={`grid place-items-center border-r-2 py-2 text-center font-mono uppercase ${index === 0 ? "border-shock bg-shock bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.2)_1px,transparent_0)] bg-[length:8px_8px] text-black" : "border-white bg-white text-black"}`}>
        <span className="text-sm font-black">
          <LocalizedText en={weekdayEn} fr={weekday} />
        </span>
        <span className="font-display text-6xl leading-none">{day}</span>
        <span className="text-sm font-black">
          <LocalizedText en={monthEn} fr={month} />
        </span>
      </div>
      <div className="grid min-w-0 bg-black/90 md:grid-cols-[1fr_180px]">
        <div className="relative min-w-0 p-3">
          {index === 0 ? (
            <span className="absolute -top-3 left-3 z-10 inline-flex rotate-[-2deg] border-2 border-black bg-shock px-2 py-1 font-mono text-[10px] font-black uppercase leading-none text-black">
              <LocalizedText en="DATE CONFIRMED!" fr="DATE CONFIRME !" />
            </span>
          ) : null}
          <div className="border-b-2 border-white pb-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <h2 className="display-nowrap font-display text-[clamp(1.75rem,7.4vw,4.15rem)] uppercase">
                <LocalizedText en={run.titleEn} fr={run.title} />
              </h2>
              <div className="flex shrink-0 flex-row items-center justify-between gap-2 font-mono uppercase sm:flex-col sm:items-end">
                <span className="text-sm text-shock">{run.time}</span>
              </div>
            </div>
          </div>
          <dl className="mt-3 grid grid-cols-[78px_minmax(0,1fr)] gap-x-2 gap-y-1 font-mono text-[11px] uppercase sm:grid-cols-[92px_1fr] sm:text-xs">
            <dt>
              <LocalizedText en="Location:" fr="Location:" />
            </dt>
            <dd>Aix-en-Provence</dd>
            <dt>
              <LocalizedText en="Pace:" fr="Pace:" />
            </dt>
            <dd>No ego</dd>
            <dt>
              <LocalizedText en="After:" fr="After:" />
            </dt>
            <dd>DJ sets</dd>
            <dt>
              <LocalizedText en="Rule:" fr="Rule:" />
            </dt>
            <dd>
              <LocalizedText en="Come as you are" fr="Come as you are" />
            </dd>
          </dl>
          {index === 0 ? (
            <Link
className="mt-3 flex w-full rotate-[-0.6deg] items-center justify-between border-2 border-black bg-shock px-3 py-2 font-mono text-[10px] font-black uppercase leading-tight text-black transition hover:bg-white sm:text-[11px]"
              href="/contact"
            >
              <span><LocalizedText en="Know the next run spot" fr="Connaitre le lieu du prochain run" /></span>
              <span aria-hidden="true">-&gt;</span>
            </Link>
          ) : null}
        </div>
        <div className="relative hidden border-l-2 border-white md:block">
          <Image
            alt={run.title}
            className="image-grit object-cover"
            fill
            sizes="180px"
            src={index === 0 ? "/assets/photos/camera-proof.png" : index === 1 ? "/assets/photos/motion-run.png" : "/assets/photos/run-sunset.png"}
          />
        </div>
      </div>
    </article>
  );
}
