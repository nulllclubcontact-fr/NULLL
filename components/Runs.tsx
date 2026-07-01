import Image from "next/image";
import logoWhite from "../Logo_basics/Logo Typo Blanc fond Noir.png";
import { upcomingRuns } from "../lib/content";
import { Reveal } from "./Reveal";

const cameraProof = "/assets/photos/camera-proof.png";
const motionRun = "/assets/photos/motion-run.png";
const runSunset = "/assets/photos/run-sunset.png";

export function Runs() {
  return (
    <section className="relative overflow-hidden border-x-2 border-b-2 border-white bg-black text-white" id="runs">
      <PosterNav />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_0.96fr]">
        <div className="relative border-b-2 border-white p-4 sm:p-5 lg:border-b-0 lg:border-r-2 lg:pl-24">
          <SideTape />
          <div className="mb-3 flex items-start justify-between gap-6">
            <Reveal>
              <h2 className="font-display text-[clamp(4.2rem,9vw,9.4rem)] uppercase leading-[0.94]">RUNS</h2>
            </Reveal>
            <div className="mt-6 hidden font-mono text-sm uppercase lg:block">
              AIX-EN-PROVENCE
              <br />
              SOCIAL RUN CLUB
            </div>
          </div>

          <div className="mb-5 ml-auto mr-0 w-full max-w-md rotate-[-1deg] border-2 border-white bg-black/90 px-6 py-3 text-center font-mono text-lg font-bold uppercase shadow-[8px_8px_0_rgba(255,255,255,0.16)]">
            NO PACE. NO EGO. NO EXCUSE.
          </div>

          <div className="space-y-3">
            {upcomingRuns.map((run, index) => (
              <RunDropCard index={index} key={run.id} run={run} />
            ))}
          </div>

          <Reveal className="mt-5 grid grid-cols-[110px_1fr] border-2 border-dashed border-white p-4 font-mono uppercase" delay={0.08}>
            <div className="grid place-items-center border-r-2 border-white text-5xl">+</div>
            <div className="px-6">
              <p className="text-2xl font-bold">PLUS DE RUNS BIENTOT</p>
              <p className="mt-2 text-sm text-white/70">Future events drop ici</p>
            </div>
          </Reveal>
        </div>

        <div className="grid-paper relative p-4 sm:p-6" id="community">
          <Reveal>
            <div className="grid grid-cols-[1fr_auto] gap-6">
              <h2 className="font-display text-[clamp(3.4rem,6.6vw,6.8rem)] uppercase leading-[0.94]">
                COMMUNITY
              </h2>
              <p className="hidden pt-8 font-mono text-sm uppercase text-white/75 sm:block">
                NULLL.CLUB
                <br />
                Community manifesto
                <br />
                v1.0
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-5 border-2 border-white p-5 font-mono text-[clamp(1.2rem,2.4vw,2.1rem)] font-bold leading-tight" delay={0.08}>
            You don&apos;t need to be fast.
            <br />
            You don&apos;t need the gear.
            <br />
            You just need to <span className="bg-white px-1 text-black">show up.</span>
          </Reveal>

          <div className="mt-5 grid grid-cols-3 gap-0">
            <PhotoFrame alt="Runners blurred at night" className="aspect-[1.25/1]" src={motionRun} stamp="00:02:17" />
            <PhotoFrame alt="NULLL.CLUB runner at sunset" className="aspect-[1.05/1] -rotate-2 scale-105" src={runSunset} />
            <PhotoFrame alt="Camera proof of the club" className="aspect-[1.12/1]" src={cameraProof} stamp="00:06:31" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 border-b-2 border-white pb-6 md:grid-cols-[1fr_0.85fr]">
            <div className="relative border-2 border-rust p-4">
              <div className="absolute inset-2 rounded-[50%] border border-rust" />
              <p className="relative font-display text-[clamp(2.5rem,4.8vw,4.8rem)] uppercase leading-[0.96]">
                COME ALONE.
                <br />
                LEAVE CONNECTED.
              </p>
            </div>
            <div className="flex items-center gap-5 border-l-2 border-white pl-5">
              <p className="font-display text-[clamp(2.4rem,4.6vw,4.6rem)] uppercase leading-[0.96]">
                SPORT IS
                <br />
                THE PRETEXT.
              </p>
              <span className="hidden text-6xl text-rust sm:block">*</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4 font-mono text-sm uppercase text-white/75">
            <span className="text-rust">◎</span>
            <span>43.5297 N, 5.4474 E</span>
            <span>//</span>
            <span>Aix-en-Provence</span>
            <span className="text-right">France +</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PosterNav() {
  return (
    <header className="grid border-b-2 border-white lg:grid-cols-[260px_1fr_260px]">
      <a className="flex h-28 items-center border-b-2 border-white px-8 transition hover:bg-white hover:invert lg:border-b-0 lg:border-r-2" href="#top">
        <Image alt="NULLL.CLUB logo" className="h-auto w-40" src={logoWhite} />
      </a>
      <nav className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-5 font-mono text-sm font-bold uppercase">
        <a href="#runs">[ RUNS ]</a>
        <a href="#community">[ COMMUNITY ]</a>
        <a href="#merch">[ MERCH ]</a>
        <a href="#social">[ INSTAGRAM ]</a>
        <a href="#top">[ ABOUT ]</a>
      </nav>
      <a
        className="m-5 flex min-h-14 items-center justify-between border-2 border-white px-5 py-3 font-mono text-sm font-bold uppercase transition hover:bg-white hover:text-black lg:m-5"
        href="#runs"
      >
        <span className="whitespace-nowrap">JOIN THE NEXT RUN</span>
        <ArrowIconInline />
      </a>
    </header>
  );
}

function SideTape() {
  return (
    <div className="absolute inset-y-0 left-0 hidden w-16 border-r-2 border-white font-mono text-xs uppercase lg:block">
      <div className="vertical-copy absolute left-5 top-8 text-rust">2026/09/12 08:30:00</div>
      <div className="vertical-copy absolute bottom-24 left-5 text-white/75">
        Aix-en-Provence, France / 43.5297 N, 5.4474 E
      </div>
      <div className="absolute bottom-9 left-4 text-3xl text-rust">◎</div>
    </div>
  );
}

function RunDropCard({
  index,
  run
}: {
  index: number;
  run: (typeof upcomingRuns)[number];
}) {
  const parts = run.date.split(" ");
  const weekday = parts[0] ?? "SAM";
  const day = parts[1] ?? "12";
  const month = parts[2] ?? "SEP";

  return (
    <Reveal className="grid grid-cols-[76px_1fr] gap-3" delay={index * 0.04}>
      <div className="grid place-items-center border-2 border-white bg-white py-2 text-center font-mono uppercase text-black">
        <span className="text-sm font-black">{weekday}</span>
        <span className="font-display text-5xl leading-none">{day}</span>
        <span className="text-sm font-black">{month}</span>
      </div>
      <article className="grid border-2 border-white md:grid-cols-[1fr_150px]">
        <div className="p-2.5">
          <div className="flex items-start justify-between gap-4 border-b-2 border-white pb-2">
            <h3 className="font-display text-3xl uppercase leading-none sm:text-4xl">PROCHAIN RUN</h3>
            <span className="font-mono text-sm text-rust">{run.time}</span>
          </div>
          <dl className="mt-2 grid grid-cols-[92px_1fr] gap-y-0.5 font-mono text-xs uppercase">
            <dt>Location:</dt>
            <dd>Aix-en-Provence</dd>
            <dt>Pace:</dt>
            <dd>No ego</dd>
            <dt>Apres:</dt>
            <dd>DJ sets</dd>
            <dt>Rule:</dt>
            <dd>Come as you are</dd>
          </dl>
        </div>
        <div className="relative hidden border-l-2 border-white md:block">
          <Image
            alt={run.title}
            className="image-grit object-cover"
            fill
            sizes="150px"
            src={index === 1 ? motionRun : index === 2 ? runSunset : cameraProof}
          />
        </div>
      </article>
    </Reveal>
  );
}

function ArrowIconInline() {
  return (
    <svg aria-hidden="true" className="h-5 w-8" fill="none" viewBox="0 0 42 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 9H39" stroke="currentColor" strokeLinecap="square" strokeWidth="2" />
      <path d="M31 1L39 9L31 17" stroke="currentColor" strokeLinecap="square" strokeWidth="2" />
    </svg>
  );
}

function PhotoFrame({
  alt,
  className,
  src,
  stamp
}: {
  alt: string;
  className: string;
  src: string;
  stamp?: string;
}) {
  return (
    <div className={`relative border-2 border-white bg-black ${className}`}>
      <Image alt={alt} className="image-grit object-cover" fill sizes="22vw" src={src} />
      {stamp ? <span className="absolute bottom-2 left-2 font-mono text-xs text-rust">{stamp}</span> : null}
      <span className="absolute right-2 top-2 font-mono text-xs uppercase text-white">REC</span>
    </div>
  );
}
