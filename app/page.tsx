import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "../components/ArrowIcon";
import { BrandHeader } from "../components/BrandHeader";
import { BrutalButton } from "../components/BrutalButton";
import { LocalizedText } from "../components/LocalizedText";
import { PageStamp } from "../components/PageStamp";
import { PosterPhoto } from "../components/PosterPhoto";
import { merchItems } from "../lib/content";

const routeCards = [
  { href: "/runs", label: "Runs", labelFr: "Runs", text: "Next runs, place, pace, rule.", textFr: "Dates, spot, pace, rule." },
  { href: "/community", label: "Community", labelFr: "Community", text: "Come alone. Leave connected.", textFr: "Come alone. Leave connected." },
  { href: "/merch", label: "Merch", labelFr: "Merch", text: "Wear the club. Support the runs.", textFr: "Wear the club. Support les runs." },
  { href: "/about", label: "About", labelFr: "A propos", text: "Sport is the pretext.", textFr: "Sport is the pretext." }
] as const;

const homeMerchVisuals = {
  black: {
    image: "/assets/merch/tee-black-blank.png",
    overlay: "logo",
    title: "BLACKOUT SIGNAL"
  },
  white: {
    image: "/assets/merch/tee-white-blank.png",
    overlay: "run",
    title: "RUN BAD / WHITE"
  },
  warning: {
    image: "/assets/merch/tee-black-blank.png",
    overlay: "warning",
    title: "NO EXCUSE BLACK"
  }
} as const;

const featuredMerch = merchItems[0];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BrandHeader current="home" />
      <section className="poster-frame grid min-h-[calc(100vh-98px)] grid-cols-1 lg:grid-cols-[1.06fr_0.94fr]">
        <div className="grid-paper flex flex-col justify-between border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <div>
            <PageStamp index="01.">
              <LocalizedText en="Home / Signal" fr="Accueil / Signal" />
            </PageStamp>
            <h1 className="brutal-title mt-8 whitespace-nowrap font-display text-[clamp(3.05rem,11.4vw,10.8rem)] uppercase">
              NULLL.CLUB
            </h1>
            <div className="copy-safe mt-5 border-2 border-white px-4 py-3 font-mono text-[clamp(1.05rem,2.35vw,2.25rem)] font-black uppercase leading-tight">
              <LocalizedText
                en={
                  <>
                    RUNNING IS JUST THE <span className="text-shock">EXCUSE.</span>
                  </>
                }
                fr={
                  <>
                    RUNNING IS JUST THE <span className="text-shock">EXCUSE.</span>
                  </>
                }
              />
            </div>
            <p className="copy-safe mt-5 max-w-2xl font-mono text-lg leading-relaxed text-white/80">
              <LocalizedText
                en="Aix-en-Provence social run club. We run, we meet, we make it real."
                fr="Social run club a Aix-en-Provence. On run, on meet, on make it real."
              />
            </p>
            <div className="mt-7 flex flex-col gap-4 sm:flex-row">
              <BrutalButton href="/runs" variant="pink">
                <LocalizedText en="JOIN THE NEXT RUN" fr="JOIN LE PROCHAIN RUN" />
              </BrutalButton>
              <BrutalButton href="/merch">
                <LocalizedText en="SEE THE MERCH" fr="SEE THE MERCH" />
              </BrutalButton>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 border-2 border-white font-mono text-sm uppercase sm:grid-cols-3">
            <div className="border-b-2 border-white p-4 text-shock sm:border-b-0 sm:border-r-2">
              <LocalizedText
                en={
                  <>
                    No pace.
                    <br />
                    No ego.
                    <br />
                    No excuse.
                  </>
                }
                fr={
                  <>
                    No pace.
                    <br />
                    No ego.
                    <br />
                    No excuse.
                  </>
                }
              />
            </div>
            <div className="border-b-2 border-white p-4 sm:border-b-0 sm:border-r-2">
              <LocalizedText
                en={
                  <>
                    Run bad.
                    <br />
                    Meet people.
                  </>
                }
                fr={
                  <>
                    Run bad.
                    <br />
                    Meet people.
                  </>
                }
              />
            </div>
            <div className="p-4">
              <LocalizedText
                en={
                  <>
                    Make it real.
                    <br />
                    43.5298 N
                  </>
                }
                fr={
                  <>
                    Make it real.
                    <br />
                    43.5298 N
                  </>
                }
              />
            </div>
          </div>
        </div>

        <div className="relative min-h-[560px] bg-black p-3">
          <PosterPhoto
            alt="NULLL.CLUB runners in motion"
            className="h-full min-h-[540px]"
            priority
            src="/assets/photos/motion-run.png"
            stamp="12.09.2026"
          />
          <Image
            alt=""
            aria-hidden="true"
            className="absolute bottom-16 left-10 h-auto w-36 object-contain"
            height={116}
            src="/assets/brand/nulll-logo.png"
            width={252}
          />
        </div>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="02.">
            <LocalizedText en="Navigation" fr="Navigation" />
          </PageStamp>
          <h2 className="brutal-title mt-6 font-display text-[clamp(3.1rem,8vw,8rem)] uppercase">
            <LocalizedText
              en={
                <>
                  Pick a page.
                  <br />
                  Stay sharp.
                </>
              }
              fr={
                <>
                  Pick ta page.
                  <br />
                  Stay sharp.
                </>
              }
            />
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {routeCards.map((card) => (
            <Link
              className="group min-h-48 border-b-2 border-white p-5 transition hover:bg-shock hover:text-black sm:odd:border-r-2"
              href={card.href}
              key={card.href}
            >
              <div className="flex items-start justify-between gap-6">
                <h3 className="brutal-title font-display text-[clamp(2.8rem,5vw,4rem)] uppercase">
                  <LocalizedText en={card.label} fr={card.labelFr} />
                </h3>
                <ArrowIcon />
              </div>
              <p className="copy-safe mt-8 font-mono text-sm uppercase opacity-75">
                <LocalizedText en={card.text} fr={card.textFr} />
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="poster-frame grid grid-cols-1 border-t-0 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="03.">
            <LocalizedText en="Home / Merch signal" fr="Accueil / Merch signal" />
          </PageStamp>
          <h2 className="brutal-title mt-6 font-display text-[clamp(3.4rem,8.6vw,8.5rem)] uppercase">
            <LocalizedText
              en={
                <>
                  ONE TEE.
                  <br />
                  FULL DROP THERE.
                </>
              }
              fr={
                <>
                  ONE TEE.
                  <br />
                  FULL DROP APRES.
                </>
              }
            />
          </h2>
          <p className="copy-safe mt-5 border-t-2 border-white pt-5 font-mono text-lg uppercase leading-tight text-white/80">
            <LocalizedText
              en={
                <>
                  Homepage shows one signal. The full drop keeps every t-shirt.
                </>
              }
              fr="L'accueil montre one signal. Le full drop garde tous les tees."
            />
          </p>
          <div className="mt-6 grid grid-cols-[1fr_82px] border-2 border-white font-mono text-sm uppercase">
            <div className="p-4">
              <LocalizedText
                en={
                  <>
                    Drop 001
                    <br />
                    Featured tee
                    <br />
                    Full drop on merch
                  </>
                }
                fr={
                  <>
                    Drop 001
                    <br />
                    Featured tee
                    <br />
                    DJ sets apres run
                  </>
                }
              />
            </div>
            <div className="grid place-items-center border-l-2 border-white text-4xl text-shock">+</div>
          </div>
          <div className="mt-6">
            <BrutalButton href="/merch" variant="pink">
                <LocalizedText en="SEE FULL DROP" fr="SEE FULL DROP" />
            </BrutalButton>
          </div>
        </div>

        <div className="grid-paper-dark grid grid-cols-1 gap-3 bg-white p-3 text-black md:grid-cols-[0.72fr_0.28fr]">
          <HomeMerchCard item={featuredMerch} />
          <div className="grid border-2 border-black font-mono uppercase">
            <div className="border-b-2 border-black p-4">
              <p className="text-xs">DROP 001</p>
              <p className="copy-safe mt-4 text-2xl font-black leading-tight">
                <LocalizedText en="3 TEES WAITING ON THE MERCH PAGE." fr="3 TEES WAITING SUR LA PAGE MERCH." />
              </p>
            </div>
            <Link className="group flex min-h-28 items-end justify-between gap-4 p-4 transition hover:bg-shock" href="/merch">
              <span className="copy-safe text-sm font-black">
                <LocalizedText en="FULL DROP" fr="DROP COMPLET" />
              </span>
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function HomeMerchCard({ item }: { item: (typeof merchItems)[number] }) {
  const visual = homeMerchVisuals[item.variant];

  return (
    <Link
      className="group border-2 border-white bg-white text-black transition hover:-translate-y-2 hover:shadow-[8px_8px_0_#ff3fb4]"
      href="/merch"
    >
      <div className="relative aspect-[1.18/1] overflow-hidden border-b-2 border-black md:aspect-[1.35/1]">
        <Image alt={visual.title} className="object-cover" fill sizes="(min-width: 768px) 42vw, 100vw" src={visual.image} />
        <div className="absolute left-3 top-3 font-mono text-xs uppercase">001.</div>
        <div className="absolute right-3 top-3 bg-shock px-2 py-1 font-mono text-xs uppercase text-black">
          <LocalizedText en="Featured" fr="Selection" />
        </div>
        {visual.overlay === "logo" ? (
          <Image
            alt=""
            aria-hidden="true"
            className="absolute left-1/2 top-[43%] h-auto w-[42%] -translate-x-1/2 object-contain"
            height={116}
            src="/assets/brand/nulll-logo.png"
            width={252}
          />
        ) : null}
        {visual.overlay === "run" ? (
          <div className="absolute left-1/2 top-[34%] -translate-x-1/2 text-center font-display text-[clamp(2rem,4vw,3.1rem)] uppercase leading-[0.84] text-black">
            RUN BAD
            <br />
            MEET PEOPLE
          </div>
        ) : null}
        {visual.overlay === "warning" ? (
          <div className="absolute left-1/2 top-[31%] -translate-x-1/2 text-center font-display text-[clamp(2rem,4vw,3.1rem)] uppercase leading-[0.84] text-white">
            NO PACE
            <br />
            NO EGO
            <br />
            NO EXCUSE
          </div>
        ) : null}
      </div>
      <div className="bg-black p-3 text-white">
        <div className="flex items-center justify-between gap-3 border-b-2 border-white pb-2 font-mono text-sm uppercase">
          <h3 className="copy-safe">{item.name}</h3>
          <span className="text-shock">{item.price}</span>
        </div>
        <p className="copy-safe mt-3 min-h-12 font-mono text-xs uppercase text-white/65">
          <LocalizedText en={item.caption} fr="Club logo. Heavy cotton. Signal simple." />
        </p>
      </div>
    </Link>
  );
}
