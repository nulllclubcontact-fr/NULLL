import { slogans } from "../lib/content";
import { BrutalButton } from "./BrutalButton";
import { Marquee } from "./Marquee";
import { Reveal } from "./Reveal";

export function Social() {
  return (
    <section className="border-b-2 border-black bg-white text-black" id="social">
      <Marquee inverted items={slogans} />
      <div className="grid-paper-dark grid min-h-[620px] grid-cols-1 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col justify-between border-b-2 border-black p-4 sm:p-8 lg:border-b-0 lg:border-r-2">
          <Reveal>
            <p className="mb-6 font-mono text-sm uppercase">05 / Instagram</p>
            <h2 className="font-display text-[clamp(4.5rem,13vw,13rem)] uppercase leading-[0.8]">
              THE RUNS HAPPEN OUTSIDE.
              <br />
              THE CHAOS STARTS HERE.
            </h2>
          </Reveal>
          <Reveal className="mt-10" delay={0.1}>
            <BrutalButton href="https://www.instagram.com/nulll.club" variant="dark">
              INSTAGRAM
            </BrutalButton>
          </Reveal>
        </div>
        <div className="flex flex-col justify-between bg-black p-4 font-mono text-sm uppercase text-white sm:p-6 lg:p-8">
          <div className="border-2 border-white p-4 text-rust">DROP LOG</div>
          <div className="space-y-4">
            <p className="border-b-2 border-white pb-4">Stories first. Calendar later.</p>
            <p className="border-b-2 border-white pb-4">DM open for slow runners, loud talkers, and new people.</p>
            <p>Make the online mess become an offline thing.</p>
          </div>
          <div className="border-2 border-white p-4">NULLL.CLUB // AIX // MAKE IT REAL.</div>
        </div>
      </div>
    </section>
  );
}
