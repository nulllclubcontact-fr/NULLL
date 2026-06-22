import Image from "next/image";
import Link from "next/link";
import { CountdownTimer } from "./CountdownTimer";
import { LanguageToggle } from "./LanguageToggle";
import { LocalizedText } from "./LocalizedText";
import { navItems, type NavKey } from "../lib/content";

type BrandHeaderProps = {
  current: NavKey;
};

export function BrandHeader({ current }: BrandHeaderProps) {
  const activeItem = navItems.find((item) => item.key === current) ?? navItems[0];

  return (
    <header className="sticky top-0 z-40 border-t-2 border-white bg-black/95 backdrop-blur-sm lg:border-x-2">
      <details className="border-b-2 border-white lg:hidden">
        <summary className="grid min-h-16 cursor-pointer grid-cols-[104px_minmax(0,1fr)_74px] items-stretch font-mono text-xs uppercase">
          <Link
            aria-label="NULLL.CLUB home"
            className="flex items-center border-r-2 border-white px-4 transition hover:bg-white hover:invert"
            href="/"
          >
            <Image
              alt="NULLL.CLUB"
              className="h-auto w-24 object-contain"
              height={116}
              priority
              src="/assets/brand/nulll-logo.png"
              width={252}
            />
          </Link>
          <span className="copy-safe flex items-center border-r-2 border-white px-3 text-shock">
            <LocalizedText en={activeItem.label} fr={activeItem.labelFr} />
          </span>
          <span className="grid place-items-center bg-shock font-black text-black">MENU</span>
        </summary>
        <nav aria-label="Mobile navigation" className="grid grid-cols-1 border-t-2 border-white font-mono text-sm uppercase">
          {navItems.map((item) => {
            const isActive = item.key === current;

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`border-b-2 border-white px-4 py-4 transition last:border-b-0 hover:bg-white hover:text-black ${
                  isActive ? "bg-shock font-black text-black" : ""
                }`}
                href={item.href}
                key={item.key}
              >
                <LocalizedText en={item.label} fr={item.labelFr} />
              </Link>
            );
          })}
          <Link className="border-t-2 border-white px-4 py-4 text-shock" href="/runs">
            <LocalizedText en="NEXT RUN / AIX-EN-PROVENCE" fr="PROCHAIN RUN / AIX-EN-PROVENCE" />
          </Link>
          <div className="border-t-2 border-white px-4 py-4">
            <CountdownTimer />
          </div>
          <LanguageToggle className="border-t-2" />
        </nav>
      </details>

      <div className="hidden border-b-2 border-white lg:grid lg:grid-cols-[210px_minmax(0,1fr)_245px_74px_130px] xl:grid-cols-[250px_minmax(0,1fr)_300px_82px_170px]">
        <Link
          aria-label="NULLL.CLUB home"
          className="flex h-24 items-center border-b-2 border-white px-6 transition hover:bg-white hover:invert lg:border-b-0 lg:border-r-2"
          href="/"
        >
          <Image
            alt="NULLL.CLUB"
            className="h-auto w-40 object-contain"
            height={116}
            priority
            src="/assets/brand/nulll-logo.png"
            width={252}
          />
        </Link>
        <nav aria-label="Main navigation" className="grid grid-cols-2 border-b-2 border-white font-mono text-[11px] uppercase sm:grid-cols-3 lg:grid-cols-6 lg:border-b-0">
          {navItems.map((item) => {
            const isActive = item.key === current;

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-16 items-center justify-center border-r-2 border-white px-2 text-center transition hover:bg-white hover:text-black ${
                  isActive ? "bg-shock font-black text-black" : ""
                }`}
                href={item.href}
                key={item.key}
              >
                <LocalizedText en={item.label} fr={item.labelFr} />
              </Link>
            );
          })}
        </nav>
        <div className="grid grid-cols-2 border-b-2 border-white font-mono text-xs uppercase lg:border-b-0 lg:border-l-2">
          <div className="p-4">
            Aix-en-Provence
            <br />
            43.5298 N
            <br />
            5.4474 E
          </div>
          <div className="border-l-2 border-white p-4 text-shock">
            <CountdownTimer />
          </div>
        </div>
        <LanguageToggle className="border-l-2" />
        <Link
          className="grid min-h-16 place-items-center border-white p-4 font-mono text-sm uppercase transition hover:bg-shock hover:text-black lg:border-l-2"
          href="/runs"
        >
          <LocalizedText en="Next run" fr="Prochain run" />
        </Link>
      </div>
    </header>
  );
}
