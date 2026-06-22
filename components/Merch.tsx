import { contactInfo } from "../lib/content";
import { LocalizedText } from "./LocalizedText";
import { MerchShop } from "./MerchShop";
import { Reveal } from "./Reveal";

export function Merch() {
  return (
    <section className="relative overflow-hidden border-x-2 border-b-2 border-white bg-black text-white" id="merch">
      <div className="grid grid-cols-1 border-b-2 border-white lg:grid-cols-[0.32fr_0.68fr]">
        <div className="grid-paper border-b-2 border-white p-6 lg:border-b-0 lg:border-r-2">
          <Reveal>
            <h2 className="display-safe font-display text-[clamp(4rem,9vw,9rem)] uppercase">
              WEAR
              <br />
              THE CLUB
            </h2>
          </Reveal>
          <p className="mt-5 border-t-2 border-white pt-5 font-mono text-xl uppercase leading-tight">
            <LocalizedText en="Not a running brand." fr="Not a running brand." />
            <br />
            <span className="text-shock">
              <LocalizedText en="A social warning." fr="A social warning." />
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
          <p className="copy-safe mt-5 font-mono text-xs uppercase text-white/60">
            <LocalizedText
              en="All sales support the club and the runs."
              fr="Sales support le club et les runs."
            />
          </p>
        </div>
        <MerchShop />
      </div>

      <div className="grid border-b-2 border-white font-mono text-sm uppercase md:grid-cols-3">
        <a className="border-b-2 border-white p-5 transition hover:bg-shock hover:text-black md:border-b-0 md:border-r-2" href={contactInfo.instagram}>
          Instagram
          <br />
          {contactInfo.instagramLabel}
        </a>
        <a className="border-b-2 border-white p-5 transition hover:bg-shock hover:text-black md:border-b-0 md:border-r-2" href={`mailto:${contactInfo.email}`}>
          Email
          <br />
          {contactInfo.email}
        </a>
        <a className="p-5 transition hover:bg-shock hover:text-black" href={contactInfo.linkedin}>
          LinkedIn
          <br />
          NULLL CLUB
        </a>
      </div>
    </section>
  );
}
