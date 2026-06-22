import { Reveal } from "./Reveal";

const manifestoLines = [
  "We are not here to perform.",
  "We are here to show up.",
  "To run badly, talk loudly, meet strangers,",
  "sweat together and leave less alone."
] as const;

export function Manifesto() {
  return (
    <section className="grid-paper-dark border-b-2 border-black bg-white text-black" id="manifesto">
      <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-b-2 border-black p-4 sm:p-6 lg:border-b-0 lg:border-r-2 lg:p-8">
          <div className="mb-6 inline-flex border-2 border-black bg-black px-4 py-2 font-mono text-sm uppercase text-white">
            01 / Manifesto
          </div>
          <Reveal>
            <h2 className="font-display text-[clamp(4.4rem,12vw,11rem)] uppercase leading-[0.82]">
              WE DON&apos;T
              <br />
              <span className="strike-mark">PERFORM.</span>
            </h2>
          </Reveal>
        </div>
        <div className="flex min-h-[560px] flex-col justify-center p-4 sm:p-8 lg:p-12">
          <Reveal>
            <div className="font-mono text-[clamp(1.45rem,3.8vw,4.5rem)] font-bold leading-[1.08]">
              {manifestoLines.map((line) => (
                <p className="border-b-2 border-dashed border-black/35 py-3" key={line}>
                  {line}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal className="mt-10 grid grid-cols-2 border-2 border-black font-mono text-xs uppercase sm:grid-cols-4" delay={0.12}>
            <div className="border-b-2 border-black p-3 sm:border-b-0 sm:border-r-2">No finish line</div>
            <div className="border-b-2 border-black p-3 sm:border-b-0 sm:border-r-2">No tryouts</div>
            <div className="border-r-2 border-black p-3">No perfect pace</div>
            <div className="bg-rust p-3 text-black">Make it real</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
