import Image from "next/image";
import logoWhite from "../Logo_basics/Logo Typo Blanc fond Noir.png";
import { BrutalButton } from "./BrutalButton";
import { Reveal } from "./Reveal";
import { SiteHeader } from "./SiteHeader";

const motionRun = "/assets/photos/motion-run.png";

const manifestoLines = [
  "We are not here to perform.",
  "We are here to show up.",
  "To run badly, talk loudly, meet strangers,",
  "sweat together and leave less alone."
] as const;

export function Hero() {
  return (
    <section className="grid-paper relative overflow-hidden border-2 border-white bg-black text-white" id="top">
      <SiteHeader />
      <div className="relative z-10 grid grid-cols-1 border-b-2 border-white lg:min-h-[540px] lg:grid-cols-[minmax(0,1.06fr)_minmax(440px,0.94fr)]">
        <div className="flex flex-col justify-between border-b-2 border-white p-4 sm:p-6 lg:border-b-0 lg:border-r-2 lg:p-8">
          <Reveal>
            <h1 className="whitespace-nowrap font-display text-[clamp(4.7rem,11.7vw,11rem)] uppercase leading-[0.78] text-white">
              NULLL.CLUB
            </h1>
          </Reveal>

          <div className="mt-5 max-w-4xl">
            <Reveal delay={0.08}>
              <div className="mb-4 flex max-w-[760px] items-center justify-between border-2 border-white bg-black px-3 py-2 font-mono text-[clamp(1.05rem,2.25vw,2.25rem)] font-black uppercase leading-none text-white">
                <span className="whitespace-nowrap">RUNNING IS JUST THE EXCUSE.</span>
                <span className="ml-4 hidden h-7 w-7 place-items-center border border-white text-sm sm:grid">+</span>
              </div>
            </Reveal>
            <Reveal className="max-w-2xl font-mono text-base leading-relaxed text-white sm:text-xl" delay={0.14}>
              Social run club a Aix-en-Provence. On court, on se rencontre, on rend ca reel.
            </Reveal>
            <Reveal className="mt-6 flex flex-col gap-4 sm:flex-row" delay={0.2}>
              <BrutalButton href="#runs">JOIN THE NEXT RUN</BrutalButton>
              <BrutalButton href="#merch">SEE THE MERCH</BrutalButton>
            </Reveal>
          </div>

          <div className="mt-8 grid grid-cols-1 border-2 border-white font-mono text-sm uppercase sm:grid-cols-3">
            <div className="border-b-2 border-white p-4 text-rust sm:border-b-0 sm:border-r-2">
              NO PACE.
              <br />
              NO EGO.
              <br />
              NO EXCUSE.
            </div>
            <div className="border-b-2 border-white p-4 sm:border-b-0 sm:border-r-2">
              RUN BAD.
              <br />
              MEET PEOPLE.
            </div>
            <div className="p-4">
              MAKE IT REAL.
              <br />
              12.09.2026
            </div>
          </div>
        </div>

        <div className="relative min-h-[500px] overflow-hidden bg-black p-3 text-white lg:min-h-full">
          <div className="absolute left-8 top-7 z-20 flex items-center gap-2 font-mono text-sm uppercase">
            <span className="h-3 w-3 rounded-full bg-rust" />
            REC
          </div>
          <div className="relative h-full min-h-[476px] border-2 border-white bg-black">
            <Image
              alt="Blurred NULLL.CLUB runners in motion"
              className="image-grit h-full w-full object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              src={motionRun}
            />
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-[1fr_auto] border-t-2 border-white bg-black/90 font-mono text-xs uppercase text-white sm:text-sm">
              <div className="p-4">Aix-en-Provence // Social Run Club</div>
              <div className="border-l-2 border-white p-4 text-rust">12.09.2026</div>
            </div>
          </div>
          <Image
            alt=""
            aria-hidden="true"
            className="absolute bottom-8 left-6 h-auto w-40 opacity-90 mix-blend-difference"
            src={logoWhite}
          />
          <div className="vertical-copy absolute right-5 top-16 z-20 font-mono text-xs uppercase text-rust">
            Aix-en-Provence
          </div>
        </div>
      </div>
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[0.28fr_0.52fr_0.2fr]">
        <div className="border-b-2 border-white p-4 sm:p-6 lg:border-b-0 lg:border-r-2">
          <div className="mb-4 flex items-center gap-4 font-mono text-sm uppercase">
            <span className="bg-white px-3 py-2 font-black text-black">01.</span>
            <span>Manifesto</span>
            <span className="text-2xl">+</span>
          </div>
          <Reveal>
            <h2 className="font-display text-[clamp(4rem,8vw,7.8rem)] uppercase leading-[0.83]">
              WE DON&apos;T
              <br />
              PERFORM.
            </h2>
          </Reveal>
        </div>
        <Reveal className="border-b-2 border-white p-4 sm:p-6 lg:border-b-0 lg:border-r-2" delay={0.08}>
          <div className="font-mono text-[clamp(1.15rem,2.4vw,2.15rem)] font-bold leading-tight">
            {manifestoLines.map((line) => (
              <p className="border-b border-dashed border-white/25 py-2" key={line}>
                {line}
              </p>
            ))}
          </div>
        </Reveal>
        <div className="relative min-h-[230px] overflow-hidden p-6">
          <div className="absolute inset-y-4 left-8 w-24 rotate-6 bg-white/70" />
          <div className="absolute inset-y-10 right-8 w-20 -rotate-6 bg-white/45" />
          <div className="relative mt-12 rotate-[-3deg] bg-rust px-4 py-5 text-center font-mono text-3xl font-black uppercase leading-none text-black">
            MAKE
            <br />
            IT REAL
          </div>
        </div>
      </div>
    </section>
  );
}
