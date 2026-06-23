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
          <span className="flex items-center border-r-2 border-white px-4">
            <Image
              alt="NULLL.CLUB"
              className="h-auto w-24 object-contain"
              height={116}
              priority
              src="/assets/brand/nulll-logo.png"
              width={252}
            />
          </span>
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

      <div className="hidden border-b-2 border-white lg:grid lg:grid-cols-[140px_minmax(0,1fr)_200px_58px_92px] xl:grid-cols-[210px_minmax(0,1fr)_300px_74px_150px]">
        <Link
          aria-label="NULLL.CLUB home"
          className="flex h-20 items-center border-b-2 border-white px-5 transition hover:bg-white hover:invert lg:border-b-0 lg:border-r-2"
          href="/"
        >
          <Image
            alt="NULLL.CLUB"
            className="h-auto w-28 object-contain xl:w-36"
            height={116}
            priority
            src="/assets/brand/nulll-logo.png"
            width={252}
          />
        </Link>
        <nav aria-label="Main navigation" className="grid min-w-0 grid-cols-2 border-b-2 border-white font-mono text-[8px] uppercase sm:grid-cols-3 lg:grid-cols-6 lg:border-b-0 min-[1180px]:text-[9px] xl:text-[11px]">
          {navItems.map((item) => {
            const isActive = item.key === current;

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`copy-safe flex min-h-14 min-w-0 items-center justify-center border-r-2 border-white px-1 text-center leading-tight transition hover:bg-white hover:text-black min-[1180px]:px-1.5 xl:px-2 ${
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
        <div className="grid grid-cols-[0.9fr_1.1fr] border-b-2 border-white font-mono text-[9px] uppercase lg:border-b-0 lg:border-l-2 xl:grid-cols-2 xl:text-[11px]">
          <div className="p-3 leading-tight xl:p-4">
            Aix-en-Provence
            <br />
            43.5298 N
            <br />
            5.4474 E
          </div>
          <div className="min-w-0 border-l-2 border-white p-3 text-shock xl:p-4">
            <CountdownTimer />
          </div>
        </div>
        <LanguageToggle className="border-l-2" />
        <Link
          className="copy-safe grid min-h-14 place-items-center border-white p-2 text-center font-mono text-[10px] uppercase leading-tight transition hover:bg-shock hover:text-black lg:border-l-2 xl:p-4 xl:text-sm"
          href="/runs"
        >
          <LocalizedText en="Next run" fr="Prochain run" />
        </Link>
      </div>
    </header>
  );
}
