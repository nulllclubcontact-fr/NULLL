import { BrandHeader } from "../../components/BrandHeader";
import { BrutalButton } from "../../components/BrutalButton";
import { LocalizedText } from "../../components/LocalizedText";
import { PageStamp } from "../../components/PageStamp";
import { PosterPhoto } from "../../components/PosterPhoto";

const principles = [
  { fr: "Tu n'as pas besoin d'etre rapide.", en: "You don't need to be fast." },
  { fr: "Tu n'as pas besoin du matos.", en: "You don't need the gear." },
  { fr: "Tu dois juste venir.", en: "You just need to show up." }
] as const;

const rituals = [
  {
    step: "01.",
    title: "ARRIVE SOLO",
    titleFr: "VIENS SOLO",
    text: "No group chat needed. Stand near the black tees. Say your name if you want.",
    textFr: "Pas besoin de groupe. Repere les tees noirs. Dis ton prenom si tu veux."
  },
  {
    step: "02.",
    title: "RUN EASY",
    titleFr: "COURS SIMPLE",
    text: "We move at talking speed. The pace is social, not heroic.",
    textFr: "On avance a vitesse de discussion. Le rythme est social, pas heroique."
  },
  {
    step: "03.",
    title: "STAY AFTER",
    titleFr: "RESTE APRES",
    text: "The run ends. The point starts. Water, noise, names, plans.",
    textFr: "Le run finit. Le vrai truc commence. Eau, bruit, prenoms, plans."
  }
] as const;

const codes = [
  ["PAS D'EGO CHECK", "NO EGO CHECK"],
  ["PAS DE GEAR TEST", "NO GEAR TEST"],
  ["PAS DE CERCLE FERME", "NO PRIVATE CIRCLE"],
  ["PAS DE RUNNER PARFAIT", "NO PERFECT RUNNERS"]
] as const;

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BrandHeader current="community" />
      <section className="poster-frame grid min-h-[calc(100vh-98px)] grid-cols-1 lg:grid-cols-[0.56fr_0.44fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="03.">
            <LocalizedText en="Community manifesto" fr="Manifeste communaute" />
          </PageStamp>
          <h1 className="display-safe mt-7 font-display text-[clamp(3.25rem,9vw,10rem)] uppercase">
            COMMUNITY
          </h1>
          <div className="mt-6 border-2 border-white p-5 font-mono text-[clamp(1.25rem,3vw,3rem)] font-black leading-tight">
            {principles.map((line) => (
              <p className="border-b border-dashed border-white/30 py-2 last:border-b-0" key={line.en}>
                {line.en.includes("show up") ? (
                  <>
                    <LocalizedText en="You just need to" fr="Tu dois juste" /> <span className="bg-shock px-2 text-black">
                      <LocalizedText en="show up." fr="venir." />
                    </span>
                  </>
                ) : (
                  <LocalizedText en={line.en} fr={line.fr} />
                )}
              </p>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Slogan title="COME ALONE." titleFr="VIENS SEUL." text="No perfect friend group required. The run makes the room." textFr="Pas besoin du groupe parfait. Le run cree la place." />
            <Slogan title="LEAVE CONNECTED." titleFr="REPARTEZ LIES." text="Names, breath, jokes, bad pace, real people." textFr="Des prenoms, du souffle, des blagues, un mauvais rythme, des vraies personnes." />
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
          <div className="mt-6 border-2 border-white p-5">
              <p className="break-words font-display text-[clamp(2.7rem,6vw,6rem)] uppercase leading-[0.82]">
              <LocalizedText en="SPORT IS" fr="LE SPORT EST" />
              <br />
              <LocalizedText en="THE" fr="LE" /> <span className="text-shock">
                <LocalizedText en="PRETEXT." fr="PRETEXTE." />
              </span>
            </p>
            <p className="mt-4 font-mono text-sm uppercase text-white/65">
              <LocalizedText
                en="People are the reason. Aix is too small to stay alone."
                fr="Les gens sont la raison. Aix est trop petite pour rester seul."
              />
            </p>
          </div>
          <div className="mt-6">
            <BrutalButton href="/runs" variant="pink">
              <LocalizedText en="JOIN A RUN" fr="REJOINDRE UN RUN" />
            </BrutalButton>
          </div>
        </aside>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.4fr_0.6fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="03B.">
            <LocalizedText en="How it works" fr="Comment ca marche" />
          </PageStamp>
          <h2 className="display-safe mt-6 font-display text-[clamp(3.2rem,7vw,7rem)] uppercase">
            <LocalizedText en="THE SOCIAL PART" fr="LA PARTIE SOCIALE" />
            <br />
            <LocalizedText en="IS NOT OPTIONAL." fr="N'EST PAS OPTIONNELLE." />
          </h2>
          <p className="mt-6 max-w-xl font-mono text-base uppercase leading-relaxed text-white/70">
            <LocalizedText
              en="NULLL.CLUB is not a leaderboard. It is a repeated excuse to cross the same city with new people."
              fr="NULLL.CLUB n'est pas un classement. C'est une excuse repetee pour traverser la meme ville avec de nouvelles personnes."
            />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {rituals.map((ritual) => (
            <article className="group min-h-72 border-b-2 border-white p-5 transition hover:bg-shock hover:text-black md:border-b-0 md:border-r-2 md:last:border-r-0" key={ritual.step}>
              <div className="font-mono text-sm uppercase">{ritual.step}</div>
              <h3 className="display-safe mt-8 font-display text-[clamp(2.7rem,5.2vw,5rem)] uppercase">
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
        <div className="border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <p className="display-safe font-display text-[clamp(3.2rem,8vw,8rem)] uppercase">
            <LocalizedText en="AIX IS TOO SMALL" fr="AIX EST TROP PETITE" />
            <br />
            <LocalizedText en="TO STAY" fr="POUR RESTER" /> <span className="text-shock">
              <LocalizedText en="ALONE." fr="SEUL." />
            </span>
          </p>
        </div>
        <div className="grid-paper p-5 lg:p-8">
          <p className="font-mono text-xl uppercase leading-tight">
            <LocalizedText
              en="Bring yourself. Bring one friend if you have one. We handle the rest badly enough to make it real."
              fr="Ramene-toi. Ramene un ami si tu en as un. On gere le reste assez mal pour que ca devienne reel."
            />
          </p>
          <div className="mt-6">
            <BrutalButton href="/contact" variant="pink">
              <LocalizedText en="TALK TO US" fr="NOUS PARLER" />
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
