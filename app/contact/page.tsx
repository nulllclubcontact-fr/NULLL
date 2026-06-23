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
    text: "Le fastest signal pour les prochains runs.",
    textEn: "Fastest signal for the next runs."
  },
  {
    label: "EMAIL",
    href: `mailto:${contactInfo.email}?subject=NULLL.CLUB%20contact`,
    value: contactInfo.email,
    text: "Merch, collab, photos, weird ideas mais humaines.",
    textEn: "Merch, collabs, photos and human weird ideas."
  },
  {
    label: "LINKEDIN",
    href: contactInfo.linkedin,
    value: "NULLL CLUB",
    text: "Pour projects, partners et traces officielles.",
    textEn: "For projects, partners and official traces."
  }
] as const;

const questions = [
  ["Can I come alone ?", "Oui. Almost recommended.", "Can I come alone?", "Yes. It is almost the point."],
  ["Need to be fast ?", "Non. Social pace, ego dehors.", "Do I need to be fast?", "No. Social pace, ego outside."],
  ["Start spot ?", "Aix-en-Provence. Exact spot sur Instagram.", "Where is the start?", "Aix-en-Provence. Exact spot on Instagram."],
  ["Je peux film ?", "Ask first. Keep it human.", "Can I film?", "Ask first. Keep it human."]
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
            <h1 className="display-safe mt-7 font-display text-[clamp(2.8rem,5.4vw,6rem)] uppercase">
              <LocalizedText en="THE RUNS HAPPEN OUTSIDE." fr="THE RUNS HAPPEN OUTSIDE." />
              <br />
              <LocalizedText en="THE CHAOS STARTS" fr="THE CHAOS STARTS" /> <span className="text-shock">
                <LocalizedText en="HERE." fr="HERE." />
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
                fr="Tu veux le next run ? Instagram ou email. Come alone, ca suffit."
              />
            </p>
          </div>
          <div className="mt-6">
            <BrutalButton href="/runs" variant="pink">
              <LocalizedText en="SEE RUNS" fr="SEE RUNS" />
            </BrutalButton>
          </div>
        </aside>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.36fr_0.64fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="06B.">
            <LocalizedText en="Doors" fr="Channels" />
          </PageStamp>
          <h2 className="display-safe mt-6 font-display text-[clamp(2.75rem,5.6vw,5.8rem)] uppercase">
            <LocalizedText en="CHOOSE" fr="PICK" />
            <br />
            <LocalizedText en="YOUR DOOR." fr="TON SIGNAL." />
          </h2>
          <p className="mt-5 font-mono text-base uppercase leading-relaxed text-white/70">
            <LocalizedText
              en="No form maze. No club secretary. Pick the signal and say it straight."
              fr="Pas de form maze. Pas de standard. Pick le channel et dis-le straight."
            />
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
          {contactRoutes.map((route) => (
            <a
              className="group min-h-56 min-w-0 border-b-2 border-white p-5 transition hover:bg-shock hover:text-black lg:border-b-0 lg:border-r-2 2xl:last:border-r-0"
              href={route.href}
              key={route.label}
            >
              <p className="font-mono text-xs uppercase text-shock group-hover:text-black">{route.label}</p>
              <h3 className="display-nowrap mt-6 font-display text-[clamp(1.35rem,2vw,2.25rem)] uppercase">{route.value}</h3>
              <p className="copy-safe mt-5 font-mono text-sm uppercase leading-relaxed opacity-75">
                <LocalizedText en={route.textEn} fr={route.text} />
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.58fr_0.42fr]">
        <div className="border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <p className="display-safe font-display text-[clamp(2.65rem,5.8vw,5.8rem)] uppercase">
            <LocalizedText en="ASK LESS." fr="ASK LESS." />
            <br />
            <LocalizedText en="SHOW UP" fr="SHOW UP" /> <span className="text-shock">
              <LocalizedText en="MORE." fr="MORE." />
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

