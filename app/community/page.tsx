import { BrandHeader } from "../../components/BrandHeader";
import { BrutalButton } from "../../components/BrutalButton";
import { PageStamp } from "../../components/PageStamp";
import { PosterPhoto } from "../../components/PosterPhoto";

const principles = [
  "You don't need to be fast.",
  "You don't need the gear.",
  "You just need to show up."
] as const;

const rituals = [
  {
    step: "01.",
    title: "ARRIVE SOLO",
    text: "No group chat needed. Stand near the black tees. Say your name if you want."
  },
  {
    step: "02.",
    title: "RUN EASY",
    text: "We move at talking speed. The pace is social, not heroic."
  },
  {
    step: "03.",
    title: "STAY AFTER",
    text: "The run ends. The point starts. Water, noise, names, plans."
  }
] as const;

const codes = ["NO EGO CHECK", "NO GEAR TEST", "NO PRIVATE CIRCLE", "NO PERFECT RUNNERS"] as const;

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BrandHeader current="community" />
      <section className="poster-frame grid min-h-[calc(100vh-98px)] grid-cols-1 lg:grid-cols-[0.56fr_0.44fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="03.">Community manifesto</PageStamp>
          <h1 className="mt-7 break-words font-display text-[clamp(3.25rem,10vw,11rem)] uppercase leading-[0.76]">
            COMMUNITY
          </h1>
          <div className="mt-6 border-2 border-white p-5 font-mono text-[clamp(1.25rem,3vw,3rem)] font-black leading-tight">
            {principles.map((line) => (
              <p className="border-b border-dashed border-white/30 py-2 last:border-b-0" key={line}>
                {line.includes("show up") ? (
                  <>
                    You just need to <span className="bg-shock px-2 text-black">show up.</span>
                  </>
                ) : (
                  line
                )}
              </p>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Slogan title="COME ALONE." text="No perfect friend group required. The run makes the room." />
            <Slogan title="LEAVE CONNECTED." text="Names, breath, jokes, bad pace, real people." />
          </div>
          <div className="mt-6 grid grid-cols-2 border-2 border-white font-mono text-xs uppercase md:grid-cols-4">
            {codes.map((code) => (
              <div className="border-b-2 border-white p-3 odd:border-r-2 md:border-b-0 md:border-r-2 md:last:border-r-0" key={code}>
                {code}
              </div>
            ))}
          </div>
        </div>

        <aside className="grid-paper p-5 lg:p-8">
          <div className="grid grid-cols-2 gap-3">
            <PosterPhoto alt="Two runners in Aix" className="aspect-[4/5]" src="/assets/photos/run-sunset.png" stamp="00:02:17" />
            <PosterPhoto alt="Camera documentation" className="mt-10 aspect-[4/5]" src="/assets/photos/camera-proof.png" stamp="REC" />
          </div>
          <div className="mt-6 border-2 border-white p-5">
              <p className="break-words font-display text-[clamp(2.7rem,6vw,6rem)] uppercase leading-[0.82]">
              SPORT IS
              <br />
              THE <span className="text-shock">PRETEXT.</span>
            </p>
            <p className="mt-4 font-mono text-sm uppercase text-white/65">
              People are the reason. Aix is too small to stay alone.
            </p>
          </div>
          <div className="mt-6">
            <BrutalButton href="/runs" variant="pink">
              JOIN A RUN
            </BrutalButton>
          </div>
        </aside>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.4fr_0.6fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="03B.">How it works</PageStamp>
          <h2 className="mt-6 break-words font-display text-[clamp(3.2rem,8vw,8rem)] uppercase leading-[0.78]">
            THE SOCIAL PART
            <br />
            IS NOT OPTIONAL.
          </h2>
          <p className="mt-6 max-w-xl font-mono text-base uppercase leading-relaxed text-white/70">
            NULLL.CLUB is not a leaderboard. It is a repeated excuse to cross the same city with new people.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {rituals.map((ritual) => (
            <article className="group min-h-72 border-b-2 border-white p-5 transition hover:bg-shock hover:text-black md:border-b-0 md:border-r-2 md:last:border-r-0" key={ritual.step}>
              <div className="font-mono text-sm uppercase">{ritual.step}</div>
              <h3 className="mt-8 font-display text-[clamp(3rem,6vw,5.5rem)] uppercase leading-[0.8]">{ritual.title}</h3>
              <p className="mt-6 font-mono text-sm uppercase leading-relaxed opacity-75">{ritual.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.68fr_0.32fr]">
        <div className="border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <p className="break-words font-display text-[clamp(3.2rem,9vw,9rem)] uppercase leading-[0.78]">
            AIX IS TOO SMALL
            <br />
            TO STAY <span className="text-shock">ALONE.</span>
          </p>
        </div>
        <div className="grid-paper p-5 lg:p-8">
          <p className="font-mono text-xl uppercase leading-tight">
            Bring yourself. Bring one friend if you have one. We handle the rest badly enough to make it real.
          </p>
          <div className="mt-6">
            <BrutalButton href="/contact" variant="pink">
              TALK TO US
            </BrutalButton>
          </div>
        </div>
      </section>
    </main>
  );
}

function Slogan({ text, title }: { text: string; title: string }) {
  return (
    <article className="border-2 border-white p-4 transition hover:bg-shock hover:text-black">
      <h2 className="font-display text-5xl uppercase leading-none">{title}</h2>
      <p className="mt-4 font-mono text-sm uppercase opacity-75">{text}</p>
    </article>
  );
}
