import Image from "next/image";
import { Reveal } from "./Reveal";

const cameraProof = "/assets/photos/camera-proof.png";
const runSunset = "/assets/photos/run-sunset.png";

export function Community() {
  return (
    <section className="border-b-2 border-black bg-white text-black" id="community">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid-paper-dark border-b-2 border-black p-4 sm:p-6 lg:border-b-0 lg:border-r-2 lg:p-8">
          <Reveal>
            <p className="mb-5 font-mono text-sm uppercase">03 / Community</p>
            <h2 className="font-display text-[clamp(4rem,10.5vw,10rem)] uppercase leading-[0.82]">
              COME ALONE.
              <br />
              LEAVE CONNECTED.
            </h2>
          </Reveal>
          <Reveal className="mt-10 max-w-2xl font-mono text-[clamp(1.35rem,3vw,3rem)] font-bold leading-tight" delay={0.08}>
            You don&apos;t need to be fast.
            <br />
            You don&apos;t need the gear.
            <br />
            You just need to show up.
          </Reveal>
          <Reveal className="mt-10 grid max-w-3xl grid-cols-1 border-2 border-black font-mono text-sm uppercase sm:grid-cols-3" delay={0.12}>
            <div className="border-b-2 border-black p-4 sm:border-b-0 sm:border-r-2">Strangers</div>
            <div className="border-b-2 border-black p-4 sm:border-b-0 sm:border-r-2">Sweat</div>
            <div className="bg-rust p-4">Less alone</div>
          </Reveal>
        </div>
        <div className="relative min-h-[680px] overflow-hidden bg-black p-4 sm:p-6 lg:p-8">
          <Reveal className="relative z-10 ml-auto aspect-[4/5] w-full max-w-md border-2 border-white bg-black md:mr-6" delay={0.04}>
            <Image
              alt="Two runners in Aix-en-Provence at sunset"
              className="image-warm h-full w-full object-cover"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              src={runSunset}
            />
            <div className="absolute left-3 top-3 border-2 border-white bg-black px-3 py-2 font-mono text-xs uppercase text-rust">
              Not fitness. Contact.
            </div>
          </Reveal>
          <Reveal className="relative z-20 -mt-24 aspect-[4/5] w-[72%] border-2 border-white bg-black md:w-[58%]" delay={0.12}>
            <Image
              alt="Camera screen documenting the NULLL.CLUB run"
              className="image-grit h-full w-full object-cover"
              fill
              sizes="(min-width: 1024px) 24vw, 72vw"
              src={cameraProof}
            />
          </Reveal>
          <div className="absolute bottom-6 right-6 z-30 max-w-xs border-2 border-white bg-white p-4 font-mono text-sm uppercase text-black hard-shadow">
            AIX IS TOO SMALL TO STAY ALONE.
          </div>
        </div>
      </div>
    </section>
  );
}
