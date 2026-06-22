import Image from "next/image";
import { BrandHeader } from "../../components/BrandHeader";
import { BrutalButton } from "../../components/BrutalButton";
import { LocalizedText } from "../../components/LocalizedText";
import { PageStamp } from "../../components/PageStamp";

const positions = [
  {
    label: "NOT",
    labelFr: "NON",
    title: "A FITNESS BRAND",
    titleFr: "UNE MARQUE FITNESS",
    text: "No transformation promise. No perfect mornings. No cult of discipline.",
    textFr: "Pas de promesse miracle. Pas de matin parfait. Pas de culte de la perf."
  },
  {
    label: "YES",
    labelFr: "OUI",
    title: "A SOCIAL EXCUSE",
    titleFr: "UN PRETEXTE SOCIAL",
    text: "The run is the entry point. The real thing is who you meet on the way.",
    textFr: "Le run est l'entree. Le vrai sujet, c'est qui tu rencontres en route."
  },
  {
    label: "NOT",
    labelFr: "NON",
    title: "A CLOSED CIRCLE",
    titleFr: "UN CERCLE FERME",
    text: "No membership aura. No inner circle. Come once, come badly, come back.",
    textFr: "Pas d'aura privee. Pas de cercle interne. Viens une fois, mal, puis reviens."
  },
  {
    label: "YES",
    labelFr: "OUI",
    title: "AIX OUTSIDE",
    titleFr: "AIX DEHORS",
    text: "A small city gets louder when people stop acting like strangers.",
    textFr: "Une petite ville devient plus vivante quand on arrete de rester inconnus."
  }
] as const;

const facts = [
  ["BASE", "AIX-EN-PROVENCE", "BASE", "AIX-EN-PROVENCE"],
  ["PACE", "NO EGO", "RYTHME", "NO EGO"],
  ["STATUS", "COMMUNITY FIRST", "STATUT", "COMMUNAUTE D'ABORD"],
  ["MOTTO", "MAKE IT REAL", "MOTTO", "MAKE IT REAL"]
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BrandHeader current="about" />
      <section className="poster-frame grid min-h-[calc(100vh-98px)] grid-cols-1 lg:grid-cols-[0.48fr_0.52fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="05.">
            <LocalizedText en="Manifesto" fr="Manifeste" />
          </PageStamp>
          <h1 className="brutal-title mt-7 font-display text-[clamp(3.2rem,8.8vw,9.4rem)] uppercase">
            <LocalizedText
              en={
                <>
                  WE DON'T
                  <br />
                  <span className="strike-mark">PERFORM.</span>
                </>
              }
              fr={
                <>
                  ON NE
                  <br />
                  <span className="strike-mark">PERFORME PAS.</span>
                </>
              }
            />
          </h1>
          <p className="copy-safe mt-6 max-w-xl border-t-2 border-white pt-5 font-mono text-base uppercase leading-relaxed text-white/75">
            <LocalizedText
              en="NULLL.CLUB brings people closer with sport as an excuse. We run because it gives the city a meeting point."
              fr="NULLL.CLUB rapproche les gens avec le sport comme excuse. On court parce que ca donne un point de rencontre a la ville."
            />
          </p>
          <div className="mt-8">
            <BrutalButton href="/runs" variant="pink">
              <LocalizedText en="MAKE IT REAL" fr="RENDS CA REEL" />
            </BrutalButton>
          </div>
        </div>

        <div className="grid-paper flex flex-col justify-between p-5 lg:p-8">
          <div className="font-mono text-[clamp(1.25rem,2.55vw,2.85rem)] font-black leading-snug">
            <p className="copy-safe border-b border-dashed border-white/30 py-3">
              <LocalizedText en="We are not here to perform." fr="On n'est pas la pour performer." />
            </p>
            <p className="copy-safe border-b border-dashed border-white/30 py-3">
              <LocalizedText en="We are here to show up." fr="On est la pour venir, vraiment." />
            </p>
            <p className="copy-safe border-b border-dashed border-white/30 py-3">
              <LocalizedText en="To run badly, talk loudly, meet strangers," fr="Pour courir mal, parler fort, rencontrer des inconnus," />
            </p>
            <p className="copy-safe border-b border-dashed border-white/30 py-3">
              <LocalizedText
                en={
                  <>
                    sweat together and leave <span className="whitespace-nowrap bg-shock px-2 text-black">less alone.</span>
                  </>
                }
                fr={
                  <>
                    transpirer ensemble et repartir <span className="whitespace-nowrap bg-shock px-2 text-black">moins seul.</span>
                  </>
                }
              />
            </p>
          </div>
          <div className="mt-8 grid grid-cols-[78px_1fr] items-center gap-5 border-2 border-white p-5">
            <Image alt="" aria-hidden="true" className="h-24 w-auto" height={197} src="/assets/brand/nulll-mark.png" width={151} />
            <p className="copy-safe font-mono text-sm uppercase text-white/70">
              <LocalizedText
                en="Not a club in the clean sense. A social accident. A reason to meet."
                fr="Pas un club au sens propre. Un accident social. Une raison de se croiser."
              />
            </p>
          </div>
        </div>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.34fr_0.66fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="05B.">
            <LocalizedText en="Position" fr="Position" />
          </PageStamp>
          <h2 className="brutal-title mt-6 font-display text-[clamp(3rem,7.2vw,7.4rem)] uppercase">
            <LocalizedText
              en={
                <>
                  WHAT IT IS.
                  <br />
                  WHAT IT ISN'T.
                </>
              }
              fr={
                <>
                  CE QUE C'EST.
                  <br />
                  CE QUE CA N'EST PAS.
                </>
              }
            />
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {positions.map((item) => (
            <article className="min-h-60 border-b-2 border-white p-5 transition hover:bg-shock hover:text-black md:odd:border-r-2" key={item.title}>
              <div className="inline-block border-2 border-current px-3 py-1 font-mono text-xs font-black uppercase">
                <LocalizedText en={item.label} fr={item.labelFr} />
              </div>
              <h3 className="brutal-title mt-6 font-display text-[clamp(2.45rem,4.8vw,4.3rem)] uppercase">
                <LocalizedText en={item.title} fr={item.titleFr} />
              </h3>
              <p className="copy-safe mt-5 font-mono text-sm uppercase leading-relaxed opacity-75">
                <LocalizedText en={item.text} fr={item.textFr} />
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.62fr_0.38fr]">
        <div className="border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <p className="copy-safe max-w-5xl font-mono text-[clamp(1.15rem,2.45vw,2.6rem)] font-black uppercase leading-tight">
            <LocalizedText
              en="The performance part can wait outside. The people part starts here: one city, one excuse, one shared pace."
              fr="La performance peut attendre dehors. Le vrai sujet commence ici : une ville, une excuse, un rythme commun."
            />
          </p>
        </div>
        <div className="grid grid-cols-2 font-mono text-sm uppercase">
          {facts.map(([labelEn, valueEn, labelFr, valueFr]) => (
            <div className="copy-safe min-h-28 border-b-2 border-white p-4 odd:border-r-2" key={labelEn}>
              <p className="text-shock">
                <LocalizedText en={labelEn} fr={labelFr} />
              </p>
              <p className="mt-4 font-black">
                <LocalizedText en={valueEn} fr={valueFr} />
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
