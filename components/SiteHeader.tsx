import Image from "next/image";
import logoWhite from "../Logo_basics/Logo Typo Blanc fond Noir.png";
import { navItems } from "../lib/content";
import { CountdownTimer } from "./CountdownTimer";
import { LocalizedText } from "./LocalizedText";

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b-2 border-white bg-black/95">
      <div className="grid grid-cols-1 divide-y-2 divide-white md:grid-cols-[30fr_32fr_18fr_20fr] md:divide-x-2 md:divide-y-0">
        <a className="flex h-24 items-center px-8 transition hover:bg-white hover:invert" href="#top">
          <Image alt="NULLL.CLUB logo" className="h-auto w-44 object-contain" priority src={logoWhite} />
        </a>
        <nav aria-label="Primary navigation" className="flex flex-nowrap items-center justify-center">
          {navItems.map((item) => (
            <a
              className="whitespace-nowrap px-2 py-5 font-mono text-xs uppercase transition hover:bg-white hover:text-black lg:px-4 lg:text-sm"
              href={item.href}
              key={item.href}
            >
              <LocalizedText en={item.label} fr={item.labelFr} />
            </a>
          ))}
          <a
            className="whitespace-nowrap px-2 py-5 font-mono text-xs font-black uppercase text-shock transition hover:bg-shock hover:text-black lg:px-4 lg:text-sm"
            href="/identification"
          >
            S&apos;identifier
          </a>
        </nav>
        <div className="flex items-center px-7 py-4 font-mono text-xs uppercase md:text-sm">
          Aix-en-Provence
          <br />
          43.5297 N, 5.4474 E
        </div>
        <div className="flex items-center px-7 py-4">
          <CountdownTimer />
        </div>
      </div>
    </header>
  );
}
