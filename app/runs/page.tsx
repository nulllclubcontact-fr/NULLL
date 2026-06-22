import Image from "next/image";
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
            <div className="vertical-copy absolute left-5 top-8 text-shock">2026/09/12 19:00:00</div>
            <div className="vertical-copy absolute bottom-24 left-5 text-white/70">Aix-en-Provence, France</div>
          </div>
          <div className="flex items-start justify-between gap-6">
            <h1 className="display-safe font-display text-[clamp(4rem,11vw,11rem)] uppercase">RUNS</h1>
            <PageStamp index="02.">
              <LocalizedText en="Aix social run club" fr="Aix social run club" />
            </PageStamp>
          </div>
          <div className="my-5 rotate-[-1deg] border-2 border-white p-3 text-center font-mono text-lg font-black uppercase tonic-shadow">
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
    <article className="grid grid-cols-[84px_1fr] gap-3">
      <div className="grid place-items-center border-2 border-white bg-white py-2 text-center font-mono uppercase text-black">
        <span className="text-sm font-black">
          <LocalizedText en={weekdayEn} fr={weekday} />
        </span>
        <span className="font-display text-6xl leading-none">{day}</span>
        <span className="text-sm font-black">
          <LocalizedText en={monthEn} fr={month} />
        </span>
      </div>
      <div className="grid border-2 border-white md:grid-cols-[1fr_180px]">
        <div className="p-3">
          <div className="flex items-start justify-between gap-4 border-b-2 border-white pb-2">
            <h2 className="display-safe font-display text-[clamp(2.8rem,5vw,4.7rem)] uppercase">
              <LocalizedText en={run.titleEn} fr={run.title} />
            </h2>
            <span className="font-mono text-sm text-shock">{run.time}</span>
          </div>
          <dl className="mt-3 grid grid-cols-[92px_1fr] gap-y-1 font-mono text-xs uppercase">
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
