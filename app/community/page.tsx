import { BrandHeader } from "../../components/BrandHeader";
import { BrutalButton } from "../../components/BrutalButton";
import { LocalizedText } from "../../components/LocalizedText";
import { PageStamp } from "../../components/PageStamp";
import { PosterPhoto } from "../../components/PosterPhoto";

const principles = [
  { fr: "Tu n'as pas besoin d'etre fast.", en: "You don't need to be fast." },
  { fr: "Tu n'as pas besoin du gear.", en: "You don't need the gear." },
  { fr: "Tu dois juste show up.", en: "You just need to show up." }
] as const;

const rituals = [
  {
    step: "01.",
    title: "ARRIVE SOLO",
    titleFr: "ARRIVE SOLO",
    text: "No group chat needed. Stand near the black tees. Say your name if you want.",
    textFr: "Pas besoin de group chat. Repere les black tees. Dis ton name si tu veux."
  },
  {
    step: "02.",
    title: "RUN EASY",
    titleFr: "RUN EASY",
    text: "We move at talking speed. The pace is social, not heroic.",
    textFr: "On bouge a talking speed. Le pace est social, pas heroic."
  },
  {
    step: "03.",
    title: "STAY AFTER",
    titleFr: "STAY AFTER",
    text: "The run ends. The point starts. Water, noise, names, plans.",
    textFr: "Le run finit. Le point starts. Eau, noise, names, plans."
  }
] as const;

const codes = [
  ["NO EGO CHECK", "NO EGO CHECK"],
  ["NO GEAR TEST", "NO GEAR TEST"],
  ["NO PRIVATE CIRCLE", "NO PRIVATE CIRCLE"],
  ["NO PERFECT RUNNERS", "NO PERFECT RUNNERS"]
] as const;

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BrandHeader current="community" />
      <section className="poster-frame grid min-h-[calc(100svh-82px)] grid-cols-1 lg:grid-cols-[0.56fr_0.44fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-6 xl:p-7">
          <PageStamp index="03.">
            <LocalizedText en="Community manifesto" fr="Community manifesto" />
          </PageStamp>
          <h1 className="display-safe mt-7 font-display text-[clamp(3rem,7.4vw,8rem)] uppercase">
            COMMUNITY
          </h1>
          <div className="mt-5 border-2 border-white p-4 font-mono text-[clamp(1.12rem,2.1vw,2.1rem)] font-black leading-tight">
            {principles.map((line) => (
              <p className="border-b border-dashed border-white/30 py-2 last:border-b-0" key={line.en}>
                {line.en.includes("show up") ? (
                  <>
                    <LocalizedText en="You just need to" fr="Tu dois juste" /> <span className="bg-shock px-2 text-black">
                      <LocalizedText en="show up." fr="show up." />
                    </span>
                  </>
                ) : (
                  <LocalizedText en={line.en} fr={line.fr} />
                )}
              </p>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Slogan title="COME ALONE." titleFr="COME ALONE." text="No perfect friend group required. The run makes the room." textFr="Pas besoin du friend group parfait. Le run makes the room." />
            <Slogan title="LEAVE CONNECTED." titleFr="LEAVE CONNECTED." text="Names, breath, jokes, bad pace, real people." textFr="Names, souffle, jokes, bad pace, real people." />
          </div>
          <div className="mt-6 grid grid-cols-2 border-2 border-white font-mono text-xs uppercase md:grid-cols-4">
            {codes.map(([fr, en]) => (
              <div className="border-b-2 border-white p-3 odd:border-r-2 md:border-b-0 md:border-r-2 md:last:border-r-0" key={en}>
                <LocalizedText en={en} fr={fr} />
              </div>
            ))}
          </div>
        </div>

        <aside className="grid-paper p-5 lg:p-8">
          <div className="grid grid-cols-2 gap-3">
            <PosterPhoto alt="Two runners in Aix" className="aspect-[4/5]" src="/assets/photos/run-sunset.png" stamp="00:02:17" />
            <PosterPhoto alt="Camera documentation" className="mt-10 aspect-[4/5]" src="/assets/photos/camera-proof.png" stamp="REC" />
          </div>
          <div className="mt-6 min-w-0 border-2 border-white p-5">
            <p className="display-safe font-display text-[clamp(2rem,3.35vw,3.35rem)] uppercase leading-[0.84]">
              <LocalizedText en="SPORT IS" fr="SPORT IS" />
              <br />
              <LocalizedText en="THE" fr="THE" /> <span className="text-shock">
                <LocalizedText en="PRETEXT." fr="PRETEXT." />
              </span>
            </p>
            <p className="mt-4 font-mono text-sm uppercase text-white/65">
              <LocalizedText
                en="People are the reason. Aix is too small to stay alone."
                fr="People are the reason. Aix is too small to stay alone."
              />
            </p>
          </div>
          <div className="mt-6">
            <BrutalButton href="/runs" variant="pink">
              <LocalizedText en="JOIN A RUN" fr="JOIN A RUN" />
            </BrutalButton>
          </div>
        </aside>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.4fr_0.6fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-6 xl:p-7">
          <PageStamp index="03B.">
            <LocalizedText en="How it works" fr="How it works" />
          </PageStamp>
          <h2 className="display-safe mt-6 font-display text-[clamp(2.8rem,5.6vw,5.8rem)] uppercase">
            <LocalizedText en="THE SOCIAL PART" fr="THE SOCIAL PART" />
            <br />
            <LocalizedText en="IS NOT OPTIONAL." fr="N'EST PAS OPTIONNELLE." />
          </h2>
          <p className="mt-6 max-w-xl font-mono text-base uppercase leading-relaxed text-white/70">
            <LocalizedText
              en="NULLL.CLUB is not a leaderboard. It is a repeated excuse to cross the same city with new people."
              fr="NULLL.CLUB n'est pas un leaderboard. C'est une excuse pour cross la meme ville avec de new people."
            />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {rituals.map((ritual) => (
            <article className="group min-h-72 border-b-2 border-white p-5 transition hover:bg-shock hover:text-black md:border-b-0 md:border-r-2 md:last:border-r-0" key={ritual.step}>
              <div className="font-mono text-sm uppercase">{ritual.step}</div>
              <h3 className="display-safe mt-8 font-display text-[clamp(2.35rem,4.2vw,4.2rem)] uppercase">
                <LocalizedText en={ritual.title} fr={ritual.titleFr} />
              </h3>
              <p className="mt-6 font-mono text-sm uppercase leading-relaxed opacity-75">
                <LocalizedText en={ritual.text} fr={ritual.textFr} />
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.68fr_0.32fr]">
        <div className="border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-6 xl:p-7">
          <p className="display-safe font-display text-[clamp(2.8rem,6vw,6.2rem)] uppercase">
            <LocalizedText en="AIX IS TOO SMALL" fr="AIX IS TOO SMALL" />
            <br />
            <LocalizedText en="TO STAY" fr="TO STAY" /> <span className="text-shock">
              <LocalizedText en="ALONE." fr="ALONE." />
            </span>
          </p>
        </div>
        <div className="grid-paper p-5 lg:p-8">
          <p className="font-mono text-xl uppercase leading-tight">
            <LocalizedText
              en="Bring yourself. Bring one friend if you have one. We handle the rest badly enough to make it real."
              fr="Ramene-toi. Ramene un pote si tu en as un. We handle the rest badly enough to make it real."
            />
          </p>
          <div className="mt-6">
            <BrutalButton href="/contact" variant="pink">
              <LocalizedText en="TALK TO US" fr="TALK TO US" />
            </BrutalButton>
          </div>
        </div>
      </section>
    </main>
  );
}

function Slogan({ text, textFr, title, titleFr }: { text: string; textFr: string; title: string; titleFr: string }) {
  return (
    <article className="border-2 border-white p-4 transition hover:bg-shock hover:text-black">
      <h2 className="display-safe font-display text-[clamp(2.8rem,5vw,4rem)] uppercase">
        <LocalizedText en={title} fr={titleFr} />
      </h2>
      <p className="mt-4 font-mono text-sm uppercase opacity-75">
        <LocalizedText en={text} fr={textFr} />
      </p>
    </article>
  );
}

