import { BrandHeader } from "../../components/BrandHeader";
import { BrutalButton } from "../../components/BrutalButton";
import { PageStamp } from "../../components/PageStamp";
import { PosterPhoto } from "../../components/PosterPhoto";

const contactRoutes = [
  {
    label: "NEXT RUN",
    href: "https://www.instagram.com/nulll.club",
    value: "@nulll.club",
    text: "Fastest way to catch the next drop."
  },
  {
    label: "MERCH / COLLAB",
    href: "mailto:nulll.club@proton.me?subject=NULLL.CLUB%20contact",
    value: "nulll.club@proton.me",
    text: "For tees, photos, local collabs and weird ideas."
  },
  {
    label: "COME ALONE",
    href: "/community",
    value: "READ THE CODE",
    text: "New here? Good. That is exactly the point."
  }
] as const;

const questions = [
  ["Can I come alone?", "Yes. It is almost recommended."],
  ["Do I need to be fast?", "No. Pace is no ego."],
  ["Where is the start?", "Aix-en-Provence. Exact drop on Instagram."],
  ["Can I shoot photos?", "Ask first. Keep it human."]
] as const;

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BrandHeader current="contact" />
      <section className="poster-frame grid min-h-[calc(100vh-98px)] grid-cols-1 lg:grid-cols-[0.62fr_0.38fr]">
        <div className="grid-paper flex flex-col justify-between border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <div>
            <PageStamp index="06.">Contact / Social</PageStamp>
            <h1 className="mt-7 break-words font-display text-[clamp(3rem,7.2vw,8.4rem)] uppercase leading-[0.78]">
              THE RUNS HAPPEN OUTSIDE.
              <br />
              THE CHAOS STARTS <span className="text-shock">HERE.</span>
            </h1>
          </div>
          <div className="mt-8 grid grid-cols-1 border-2 border-white font-mono uppercase md:grid-cols-2">
            <a className="min-h-40 border-b-2 border-white p-5 transition hover:bg-shock hover:text-black md:border-b-0 md:border-r-2" href="https://www.instagram.com/nulll.club">
              Instagram
              <br />
              @nulll.club
            </a>
            <a className="min-h-40 p-5 transition hover:bg-shock hover:text-black" href="mailto:nulll.club@proton.me">
              Email
              <br />
              nulll.club@proton.me
            </a>
          </div>
        </div>
        <aside className="p-5 lg:p-8">
          <PosterPhoto alt="NULLL.CLUB run proof" className="aspect-[4/5]" src="/assets/photos/motion-run.png" stamp="AIX // REC" />
          <div className="mt-6 border-2 border-white p-5 font-mono uppercase">
            <p className="text-shock">Aix-en-Provence</p>
            <p className="mt-3 text-xl font-black">43.5298 N, 5.4474 E</p>
            <p className="mt-5 text-sm text-white/65">Want the next drop? Ask on Instagram or email. Come alone, that is enough.</p>
          </div>
          <div className="mt-6">
            <BrutalButton href="/runs" variant="pink">
              SEE RUNS
            </BrutalButton>
          </div>
        </aside>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.36fr_0.64fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="06B.">Doors</PageStamp>
          <h2 className="mt-6 break-words font-display text-[clamp(3.5rem,8vw,8rem)] uppercase leading-[0.78]">
            CHOOSE
            <br />
            YOUR DOOR.
          </h2>
          <p className="mt-5 font-mono text-base uppercase leading-relaxed text-white/70">
            No form maze. No club secretary. Pick the signal and say it straight.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {contactRoutes.map((route) => (
            <a
              className="group min-h-72 border-b-2 border-white p-5 transition hover:bg-shock hover:text-black md:border-b-0 md:border-r-2 md:last:border-r-0"
              href={route.href}
              key={route.label}
            >
              <p className="font-mono text-xs uppercase text-shock group-hover:text-black">{route.label}</p>
              <h3 className="mt-8 break-words font-display text-[clamp(2.7rem,5vw,4.8rem)] uppercase leading-[0.8]">{route.value}</h3>
              <p className="mt-6 font-mono text-sm uppercase leading-relaxed opacity-75">{route.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.58fr_0.42fr]">
        <div className="border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <p className="break-words font-display text-[clamp(3.2rem,8vw,8rem)] uppercase leading-[0.78]">
            ASK LESS.
            <br />
            SHOW UP <span className="text-shock">MORE.</span>
          </p>
        </div>
        <div className="grid-paper">
          {questions.map(([question, answer]) => (
            <div className="grid grid-cols-1 border-b-2 border-white font-mono uppercase md:grid-cols-[0.48fr_0.52fr]" key={question}>
              <div className="border-b-2 border-white p-4 text-white/65 md:border-b-0 md:border-r-2">{question}</div>
              <div className="p-4 font-black">{answer}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
