import Image from "next/image";
import logoBlack from "../Logo_basics/Logo Typo Noir fond Blanc.png";
import logoWhite from "../Logo_basics/Logo Typo Blanc fond Noir.png";
import motionRun from "../photo/1.png";
import { merchItems } from "../lib/content";
import { ArrowIcon } from "./ArrowIcon";
import { Reveal } from "./Reveal";

type MerchVariant = (typeof merchItems)[number]["variant"];

const merchVisuals: Record<
  MerchVariant,
  {
    image: string;
    title: string;
    price: string;
    topLabel: string;
    logo?: "white" | "black";
    slogan?: string;
  }
> = {
  black: {
    image: "/assets/merch/tee-black-blank.png",
    title: "NULLL LOGO TEE",
    price: "35.00",
    topLabel: "001.",
    logo: "white"
  },
  white: {
    image: "/assets/merch/tee-white-blank.png",
    title: "RUN BAD TEE",
    price: "35.00",
    topLabel: "002.",
    logo: "black",
    slogan: "RUN BAD\\A MEET PEOPLE"
  },
  warning: {
    image: "/assets/merch/tee-black-blank.png",
    title: "NO EXCUSE TEE",
    price: "35.00",
    topLabel: "003.",
    slogan: "NO PACE\\A NO EGO\\A NO EXCUSE"
  }
};

export function Merch() {
  return (
    <section className="relative overflow-hidden border-x-2 border-b-2 border-white bg-black text-white" id="merch">
      <MerchNav />
      <div className="grid grid-cols-1 border-b-2 border-white lg:grid-cols-[0.8fr_2.2fr]">
        <div className="grid-paper min-h-[420px] border-b-2 border-white p-6 lg:border-b-0 lg:border-r-2">
          <Reveal>
            <h2 className="font-display text-[clamp(5rem,11vw,12rem)] uppercase leading-[0.78]">
              WEAR
              <br />
              THE CLUB
            </h2>
          </Reveal>
          <p className="mt-5 border-t-2 border-white pt-5 font-mono text-2xl uppercase leading-tight">
            NOT A RUNNING BRAND.
            <br />
            A SOCIAL WARNING.
          </p>
          <div className="mt-5 grid grid-cols-[1fr_90px] border-2 border-white font-mono text-sm uppercase">
            <div className="p-4">
              DROP 001
              <br />
              SUMMER 2026
              <br />
              AIX-EN-PROVENCE
            </div>
            <div className="grid place-items-center border-l-2 border-white text-5xl">◎</div>
          </div>
          <p className="mt-4 font-mono text-xs uppercase text-white/60">All sales support the club and the runs.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-3">
          {merchItems.map((item) => (
            <ProductCard item={item} key={item.id} />
          ))}
        </div>
      </div>

      <div className="grid min-h-[260px] grid-cols-1 border-b-2 border-white lg:grid-cols-[0.36fr_0.37fr_0.27fr]" id="social">
        <div className="relative min-h-[260px] border-b-2 border-white lg:border-b-0 lg:border-r-2">
          <Image alt="Runners outside in Aix" className="image-grit object-cover" fill sizes="36vw" src={motionRun} />
          <div className="vertical-copy absolute left-5 top-8 font-mono text-xs uppercase text-white">Filmed on the streets of Aix</div>
          <span className="absolute bottom-5 left-5 h-2 w-2 rounded-full bg-rust" />
        </div>
        <Reveal className="flex items-center border-b-2 border-white p-6 lg:border-b-0 lg:border-r-2">
          <h2 className="font-display text-[clamp(3.4rem,7vw,7.2rem)] uppercase leading-[0.82]">
            THE RUNS HAPPEN OUTSIDE.
            <br />
            THE CHAOS STARTS HERE.
          </h2>
        </Reveal>
        <a
          className="group relative flex min-h-[260px] flex-col justify-center border-white p-6 transition hover:bg-white hover:text-black"
          href="https://www.instagram.com/nulll.club"
        >
          <span className="mb-8 font-mono text-xs uppercase text-rust group-hover:text-black">Join the community</span>
          <span className="flex items-center justify-between font-display text-[clamp(4rem,7.4vw,7rem)] uppercase leading-none">
            Instagram
            <ArrowIcon />
          </span>
          <span className="mt-6 font-mono text-sm uppercase">@nulll.club</span>
        </a>
      </div>

      <footer className="grid min-h-[170px] grid-cols-1 font-mono text-sm uppercase md:grid-cols-[0.34fr_0.43fr_0.23fr]">
        <div className="grid grid-cols-[0.52fr_0.48fr] border-b-2 border-white md:border-b-0 md:border-r-2">
          <div className="border-r-2 border-white p-5">
            <h2 className="font-display text-[clamp(4rem,7vw,7rem)] leading-none">NULLL.CLUB</h2>
          </div>
          <div className="p-5">
            Social run club
            <br />
            Aix-en-Provence
            <br />
            <br />
            Sport is the pretext.
            <br />
            People are the reason.
          </div>
        </div>
        <div className="grid grid-cols-3 border-b-2 border-white md:border-b-0 md:border-r-2">
          <div className="border-r-2 border-white p-5">
            Navigation
            <br />
            <br />
            01. Home
            <br />
            02. Runs
            <br />
            03. Community
            <br />
            04. Merch
            <br />
            05. Contact
          </div>
          <div className="border-r-2 border-white p-5">
            Info
            <br />
            <br />
            About
            <br />
            FAQ
            <br />
            Rules
            <br />
            Privacy
          </div>
          <div className="p-5">
            Connect
            <br />
            <br />
            Instagram
            <br />
            Email
            <br />
            nulll.club@proton.me
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="border-r-2 border-white p-5">
            Aix-en-Provence
            <br />
            43.5298 N, 5.4474 E
            <div className="mt-8 h-8 bg-[repeating-linear-gradient(90deg,#fff_0_2px,transparent_2px_7px,#fff_7px_10px,transparent_10px_16px)]" />
          </div>
          <div className="bg-white p-5 text-black">
            <h2 className="font-display text-[clamp(3rem,5vw,5rem)] uppercase leading-none">MAKE IT REAL.</h2>
            <span className="mt-5 block text-right text-4xl text-rust">◎</span>
          </div>
        </div>
      </footer>
    </section>
  );
}

function MerchNav() {
  return (
    <header className="grid border-b-2 border-white lg:grid-cols-[260px_1fr_300px_190px]">
      <a className="flex h-24 items-center border-b-2 border-white px-6 transition hover:bg-white hover:invert lg:border-b-0 lg:border-r-2" href="#top">
        <Image alt="NULLL.CLUB logo" className="h-auto w-40" src={logoWhite} />
      </a>
      <nav className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 px-4 py-5 font-mono text-sm uppercase">
        <a href="#top">01. Home</a>
        <a href="#runs">02. Runs</a>
        <a href="#community">03. Community</a>
        <a className="bg-white px-2 py-1 text-black" href="#merch">
          04. Merch
        </a>
        <a href="#social">05. Contact</a>
      </nav>
      <div className="border-t-2 border-white p-4 font-mono text-sm uppercase lg:border-l-2 lg:border-t-0">
        Aix-en-Provence
        <br />
        43.5298 N, 5.4474 E
        <br />
        Time: <span className="text-rust">12:45:32</span>
      </div>
      <div className="grid place-items-center border-t-2 border-white p-4 lg:border-l-2 lg:border-t-0">
        <span className="border-2 border-white px-8 py-3 font-mono text-sm uppercase">Cart [0]</span>
      </div>
    </header>
  );
}

function ProductCard({ item }: { item: (typeof merchItems)[number] }) {
  const visual = merchVisuals[item.variant];
  const logo = visual.logo === "white" ? logoWhite : logoBlack;

  return (
    <Reveal>
      <article className="group border-2 border-white bg-white text-black transition hover:-translate-y-2 hover:shadow-[8px_8px_0_#d64a24]">
        <div className="relative aspect-[1.08/1] overflow-hidden border-b-2 border-black">
          <Image alt={`${visual.title} product mockup`} className="object-cover" fill sizes="31vw" src={visual.image} />
          <div className="absolute left-4 top-3 font-mono text-sm uppercase">{visual.topLabel}</div>
          <div className="absolute right-4 top-3 font-mono text-sm uppercase">[T-SHIRT]</div>
          <div className="vertical-copy absolute bottom-7 right-4 font-mono text-xs uppercase">Make it real.</div>
          <div className="vertical-copy absolute bottom-20 left-4 font-mono text-xs uppercase">
            43.5298 N
            <br />
            5.4474 E
          </div>
          {visual.logo ? (
            <Image
              alt=""
              aria-hidden="true"
              className="absolute left-1/2 top-[42%] h-auto w-[28%] -translate-x-1/2 object-contain mix-blend-difference"
              src={logo}
            />
          ) : null}
          {visual.slogan ? (
            <div
              className={`absolute left-1/2 top-[39%] -translate-x-1/2 whitespace-pre text-center font-display text-4xl uppercase leading-[0.88] ${
                item.variant === "white" ? "text-black" : "text-white"
              }`}
            >
              {visual.slogan.replaceAll("\\A", "\n")}
            </div>
          ) : null}
          {item.variant === "white" ? (
            <span className="absolute left-1/2 top-[62%] -translate-x-1/2 font-mono text-xs font-bold">NULLL.CLUB</span>
          ) : null}
        </div>
        <div className="bg-black p-3 text-white">
          <div className="flex items-center justify-between border-b-2 border-white pb-2 font-mono text-lg uppercase">
            <h3>{visual.title}</h3>
            <span>€{visual.price}</span>
          </div>
          <a
            className="mt-3 flex min-h-12 items-center justify-between border-2 border-white px-4 py-3 font-mono text-sm uppercase transition hover:bg-white hover:text-black"
            href={`mailto:nulll.club@proton.me?subject=${encodeURIComponent(`${visual.title} waitlist`)}`}
          >
            <span>Add to cart</span>
            <ArrowIcon />
          </a>
        </div>
      </article>
    </Reveal>
  );
}
