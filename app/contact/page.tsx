import { BrandHeader } from "../../components/BrandHeader";
import { BrutalButton } from "../../components/BrutalButton";
import { LocalizedText } from "../../components/LocalizedText";
import { PageStamp } from "../../components/PageStamp";
import { PosterPhoto } from "../../components/PosterPhoto";
import { contactInfo } from "../../lib/content";

const contactRoutes = [
  {
    label: "INSTAGRAM",
    href: contactInfo.instagram,
    value: contactInfo.instagramLabel,
    text: "Le signal le plus rapide pour les prochains runs.",
    textEn: "Fastest signal for the next runs."
  },
  {
    label: "EMAIL",
    href: `mailto:${contactInfo.email}?subject=NULLL.CLUB%20contact`,
    value: contactInfo.email,
    text: "Merch, collab, photos, idee bizarre mais humaine.",
    textEn: "Merch, collabs, photos and human weird ideas."
  },
  {
    label: "LINKEDIN",
    href: contactInfo.linkedin,
    value: "NULLL CLUB",
    text: "Pour les projets, partenaires et traces officielles.",
    textEn: "For projects, partners and official traces."
  }
] as const;

const questions = [
  ["Je peux venir seul ?", "Oui. C'est presque le principe.", "Can I come alone?", "Yes. It is almost the point."],
  ["Je dois etre rapide ?", "Non. Rythme social, ego dehors.", "Do I need to be fast?", "No. Social pace, ego outside."],
  ["Le depart est ou ?", "Aix-en-Provence. Lieu exact sur Instagram.", "Where is the start?", "Aix-en-Provence. Exact spot on Instagram."],
  ["Je peux filmer ?", "Demande avant. On garde ca humain.", "Can I film?", "Ask first. Keep it human."]
] as const;

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BrandHeader current="contact" />
      <section className="poster-frame grid grid-cols-1 lg:min-h-[640px] lg:grid-cols-[0.62fr_0.38fr]">
        <div className="grid-paper flex flex-col justify-between border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <div>
            <PageStamp index="06.">
              <LocalizedText en="Contact / Social" fr="Contact / Social" />
            </PageStamp>
            <h1 className="display-safe mt-7 font-display text-[clamp(3rem,6.5vw,7.4rem)] uppercase">
              <LocalizedText en="THE RUNS HAPPEN OUTSIDE." fr="LES RUNS SE PASSENT DEHORS." />
              <br />
              <LocalizedText en="THE CHAOS STARTS" fr="LE SIGNAL COMMENCE" /> <span className="text-shock">
                <LocalizedText en="HERE." fr="ICI." />
              </span>
            </h1>
          </div>
          <div className="mt-8 grid grid-cols-1 border-2 border-white font-mono uppercase md:grid-cols-2">
            <a className="min-h-32 border-b-2 border-white p-5 transition hover:bg-shock hover:text-black md:border-b-0 md:border-r-2" href={contactInfo.instagram}>
              Instagram
              <br />
              {contactInfo.instagramLabel}
            </a>
            <a className="min-h-32 p-5 transition hover:bg-shock hover:text-black" href={`mailto:${contactInfo.email}`}>
              Email
              <br />
              {contactInfo.email}
            </a>
          </div>
        </div>
        <aside className="p-5 lg:p-8">
          <PosterPhoto alt="NULLL.CLUB run proof" className="aspect-[4/5]" src="/assets/photos/motion-run.png" stamp="AIX // REC" />
          <div className="mt-6 border-2 border-white p-5 font-mono uppercase">
            <p className="text-shock">Aix-en-Provence</p>
            <p className="mt-3 text-xl font-black">43.5298 N, 5.4474 E</p>
            <p className="mt-5 text-sm text-white/65">
              <LocalizedText
                en="Want the next run? Ask on Instagram or email. Come alone, that is enough."
                fr="Tu veux le prochain run ? Instagram ou email. Viens seul, ca suffit."
              />
            </p>
          </div>
          <div className="mt-6">
            <BrutalButton href="/runs" variant="pink">
              <LocalizedText en="SEE RUNS" fr="VOIR LES RUNS" />
            </BrutalButton>
          </div>
        </aside>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.36fr_0.64fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="06B.">
            <LocalizedText en="Doors" fr="Canaux" />
          </PageStamp>
          <h2 className="display-safe mt-6 font-display text-[clamp(3.2rem,7vw,7rem)] uppercase">
            <LocalizedText en="CHOOSE" fr="CHOISIS" />
            <br />
            <LocalizedText en="YOUR DOOR." fr="LE SIGNAL." />
          </h2>
          <p className="mt-5 font-mono text-base uppercase leading-relaxed text-white/70">
            <LocalizedText
              en="No form maze. No club secretary. Pick the signal and say it straight."
              fr="Pas de formulaire labyrinthe. Pas de standard. Choisis le canal et parle clair."
            />
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {contactRoutes.map((route) => (
            <a
              className="group min-h-56 border-b-2 border-white p-5 transition hover:bg-shock hover:text-black md:border-b-0 md:border-r-2 md:last:border-r-0"
              href={route.href}
              key={route.label}
            >
              <p className="font-mono text-xs uppercase text-shock group-hover:text-black">{route.label}</p>
              <h3 className="display-safe mt-6 font-display text-[clamp(2.3rem,4.2vw,4.2rem)] uppercase">{route.value}</h3>
              <p className="mt-5 font-mono text-sm uppercase leading-relaxed opacity-75">
                <LocalizedText en={route.textEn} fr={route.text} />
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.58fr_0.42fr]">
        <div className="border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <p className="display-safe font-display text-[clamp(3rem,7vw,7rem)] uppercase">
            <LocalizedText en="ASK LESS." fr="PARLE CLAIR." />
            <br />
            <LocalizedText en="SHOW UP" fr="VIENS" /> <span className="text-shock">
              <LocalizedText en="MORE." fr="VRAIMENT." />
            </span>
          </p>
        </div>
        <div className="grid-paper">
          {questions.map(([questionFr, answerFr, questionEn, answerEn]) => (
            <div className="grid grid-cols-1 border-b-2 border-white font-mono uppercase md:grid-cols-[0.48fr_0.52fr]" key={questionFr}>
              <div className="border-b-2 border-white p-4 text-white/65 md:border-b-0 md:border-r-2">
                <LocalizedText en={questionEn} fr={questionFr} />
              </div>
              <div className="p-4 font-black">
                <LocalizedText en={answerEn} fr={answerFr} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
