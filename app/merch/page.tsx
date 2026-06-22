import Image from "next/image";
import { BrandHeader } from "../../components/BrandHeader";
import { PageStamp } from "../../components/PageStamp";
import { merchItems } from "../../lib/content";

const visualByVariant = {
  black: {
    image: "/assets/merch/tee-black-blank.png",
    title: "NULLL LOGO TEE",
    price: "35.00",
    overlay: "logo"
  },
  white: {
    image: "/assets/merch/tee-white-blank.png",
    title: "RUN BAD TEE",
    price: "35.00",
    overlay: "run"
  },
  warning: {
    image: "/assets/merch/tee-black-blank.png",
    title: "NO EXCUSE TEE",
    price: "35.00",
    overlay: "no-excuse"
  }
} as const;

export default function MerchPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BrandHeader current="merch" />
      <section className="poster-frame grid min-h-[calc(100vh-98px)] grid-cols-1 lg:grid-cols-[0.28fr_0.72fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="04.">Merch / Drop 001</PageStamp>
          <h1 className="mt-7 break-words font-display text-[clamp(4rem,11vw,11rem)] uppercase leading-[0.76]">
            WEAR
            <br />
            THE CLUB
          </h1>
          <p className="mt-5 border-t-2 border-white pt-5 font-mono text-xl uppercase leading-tight">
            Not a running brand.
            <br />
            A <span className="text-shock">social warning.</span>
          </p>
          <div className="mt-6 grid grid-cols-[1fr_82px] border-2 border-white font-mono text-sm uppercase">
            <div className="p-4">
              Drop 001
              <br />
              Summer 2026
              <br />
              Aix-en-Provence
            </div>
            <div className="grid place-items-center border-l-2 border-white text-4xl text-shock">+</div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-3 p-3 md:grid-cols-3">
          {merchItems.map((item, index) => (
            <ProductCard index={index + 1} item={item} key={item.id} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductCard({ index, item }: { index: number; item: (typeof merchItems)[number] }) {
  const visual = visualByVariant[item.variant];

  return (
    <article className="group self-start border-2 border-white bg-white text-black transition hover:-translate-y-2 hover:shadow-[8px_8px_0_#ff3fb4]">
      <div className="relative aspect-[1.03/1] overflow-hidden border-b-2 border-black">
        <Image alt={visual.title} className="object-cover" fill sizes="32vw" src={visual.image} />
        <div className="absolute left-4 top-3 font-mono text-sm uppercase">{String(index).padStart(3, "0")}.</div>
        <div className="absolute right-4 top-3 font-mono text-sm uppercase">[T-SHIRT]</div>
        <div className="vertical-copy absolute bottom-7 right-4 font-mono text-xs uppercase">Make it real.</div>
        {visual.overlay === "logo" ? (
          <Image
            alt=""
            aria-hidden="true"
            className="absolute left-1/2 top-[43%] h-auto w-[34%] -translate-x-1/2 object-contain"
            height={116}
            src="/assets/brand/nulll-logo.png"
            width={252}
          />
        ) : null}
        {visual.overlay === "run" ? (
          <div className="absolute left-1/2 top-[37%] -translate-x-1/2 text-center font-display text-4xl uppercase leading-[0.85] text-black">
            RUN BAD
            <br />
            MEET PEOPLE
          </div>
        ) : null}
        {visual.overlay === "no-excuse" ? (
          <div className="absolute left-1/2 top-[35%] -translate-x-1/2 text-center font-display text-4xl uppercase leading-[0.84] text-white">
            NO PACE
            <br />
            NO EGO
            <br />
            NO EXCUSE
          </div>
        ) : null}
      </div>
      <div className="bg-black p-3 text-white">
        <div className="flex items-center justify-between border-b-2 border-white pb-2 font-mono text-base uppercase">
          <h2>{visual.title}</h2>
          <span className="text-shock">{visual.price} EUR</span>
        </div>
        <a
          className="mt-3 flex min-h-12 items-center justify-between border-2 border-white px-4 py-3 font-mono text-sm uppercase transition hover:bg-shock hover:text-black"
          href={`mailto:nulll.club@proton.me?subject=${encodeURIComponent(`${visual.title} waitlist`)}`}
        >
          <span>Add to cart</span>
          <span aria-hidden="true">-&gt;</span>
        </a>
      </div>
    </article>
  );
}
