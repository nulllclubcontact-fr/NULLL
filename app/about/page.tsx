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
    titleFr: "A FITNESS BRAND",
    text: "No transformation promise. No perfect mornings. No cult of discipline.",
    textFr: "No transformation promise. Pas de perfect morning. Pas de culte de la perf."
  },
  {
    label: "YES",
    labelFr: "OUI",
    title: "A SOCIAL EXCUSE",
    titleFr: "A SOCIAL EXCUSE",
    text: "The run is the entry point. The real thing is who you meet on the way.",
    textFr: "Le run est l'entree. Le vrai sujet, c'est who you meet on the way."
  },
  {
    label: "NOT",
    labelFr: "NON",
    title: "A CLOSED CIRCLE",
    titleFr: "A CLOSED CIRCLE",
    text: "No membership aura. No inner circle. Come once, come badly, come back.",
    textFr: "No membership aura. Pas d'inner circle. Come once, run badly, come back."
  },
  {
    label: "YES",
    labelFr: "OUI",
    title: "AIX OUTSIDE",
    titleFr: "AIX DEHORS",
    text: "A small city gets louder when people stop acting like strangers.",
    textFr: "Une small city devient louder quand les gens arretent de rester strangers."
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
      <section className="poster-frame grid min-h-[calc(100svh-82px)] grid-cols-1 lg:grid-cols-[0.48fr_0.52fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-6 xl:p-7">
          <PageStamp index="05.">
            <LocalizedText en="Manifesto" fr="Manifeste" />
          </PageStamp>
          <h1 className="brutal-title mt-7 font-display text-[clamp(2.9rem,6.4vw,6.8rem)] uppercase">
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
              fr="NULLL.CLUB rapproche les gens avec sport as an excuse. On run parce que ca donne un meeting point a la ville."
            />
          </p>
          <div className="mt-8">
            <BrutalButton href="/runs" variant="pink">
              <LocalizedText en="MAKE IT REAL" fr="MAKE IT REAL" />
            </BrutalButton>
          </div>
        </div>

        <div className="grid-paper flex flex-col justify-between p-5 lg:p-8">
          <div className="font-mono text-[clamp(1.12rem,2vw,2.15rem)] font-black leading-snug">
            <p className="copy-safe border-b border-dashed border-white/30 py-3">
              <LocalizedText en="We are not here to perform." fr="On n'est pas here to perform." />
            </p>
            <p className="copy-safe border-b border-dashed border-white/30 py-3">
              <LocalizedText en="We are here to show up." fr="On est here to show up." />
            </p>
            <p className="copy-safe border-b border-dashed border-white/30 py-3">
              <LocalizedText en="To run badly, talk loudly, meet strangers," fr="To run badly, parler fort, meet strangers," />
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
                    sweat ensemble et leave <span className="whitespace-nowrap bg-shock px-2 text-black">less alone.</span>
                  </>
                }
              />
            </p>
          </div>
          <div className="mt-8 grid grid-cols-[78px_1fr] items-center gap-5 border-2 border-white p-5">
            <Image alt="" aria-hidden="true" className="h-20 w-auto" height={197} src="/assets/brand/nulll-mark.png" width={151} />
            <p className="copy-safe font-mono text-sm uppercase text-white/70">
              <LocalizedText
                en="Not a club in the clean sense. A social accident. A reason to meet."
                fr="Pas un club clean. A social accident. Une raison de se croiser."
              />
            </p>
          </div>
        </div>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.34fr_0.66fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-6 xl:p-7">
          <PageStamp index="05B.">
            <LocalizedText en="Position" fr="Position" />
          </PageStamp>
          <h2 className="brutal-title mt-6 font-display text-[clamp(2.6rem,5vw,5.2rem)] uppercase">
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
                  WHAT IT IS.
                  <br />
                  WHAT IT ISN'T.
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
              <h3 className="brutal-title mt-6 font-display text-[clamp(2rem,3.1vw,3rem)] uppercase">
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
        <div className="border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-6 xl:p-7">
          <p className="copy-safe max-w-5xl font-mono text-[clamp(1.08rem,2vw,2.1rem)] font-black uppercase leading-tight">
            <LocalizedText
              en="The performance part can wait outside. The people part starts here: one city, one excuse, one shared pace."
              fr="La performance peut wait outside. Le people part starts here : une ville, une excuse, un shared pace."
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

