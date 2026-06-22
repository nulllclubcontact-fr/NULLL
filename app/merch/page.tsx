import { BrandHeader } from "../../components/BrandHeader";
import { LocalizedText } from "../../components/LocalizedText";
import { MerchShop } from "../../components/MerchShop";
import { PageStamp } from "../../components/PageStamp";

export default function MerchPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BrandHeader current="merch" />
      <section className="poster-frame grid min-h-[calc(100vh-98px)] grid-cols-1 lg:grid-cols-[0.28fr_0.72fr]">
        <div className="grid-paper border-b-2 border-white p-5 lg:border-b-0 lg:border-r-2 lg:p-8">
          <PageStamp index="04.">
            <LocalizedText en="Merch / Drop 001" fr="Merch / Drop 001" />
          </PageStamp>
          <h1 className="display-safe mt-7 font-display text-[clamp(4rem,9.5vw,10rem)] uppercase">
            WEAR
            <br />
            THE CLUB
          </h1>
          <p className="mt-5 border-t-2 border-white pt-5 font-mono text-xl uppercase leading-tight">
            <LocalizedText en="Not a running brand." fr="Not a running brand." />
            <br />
            <LocalizedText en="A" fr="A" /> <span className="text-shock">
              <LocalizedText en="social warning." fr="social warning." />
            </span>
          </p>
          <div className="mt-6 grid grid-cols-[1fr_82px] border-2 border-white font-mono text-sm uppercase">
            <div className="p-4">
              Drop 001
              <br />
              Septembre 2026
              <br />
              DJ sets apres run
            </div>
            <div className="grid place-items-center border-l-2 border-white text-4xl text-shock">+</div>
          </div>
        </div>

        <MerchShop />
      </section>
    </main>
  );
}
