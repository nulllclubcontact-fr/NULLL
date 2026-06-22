import Image from "next/image";
import logoWhite from "../Logo_basics/Logo Typo Blanc fond Noir.png";

const footerLinks = [
  { label: "Instagram", href: "https://www.instagram.com/nulll.club" },
  { label: "Contact", href: "mailto:hello@nulll.club" },
  { label: "Runs", href: "#runs" },
  { label: "Merch", href: "#merch" }
] as const;

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="grid grid-cols-1 border-b-2 border-white lg:grid-cols-[1fr_1fr]">
        <div className="border-b-2 border-white p-4 sm:p-8 lg:border-b-0 lg:border-r-2">
          <Image alt="NULLL.CLUB logo" className="h-auto w-52 object-contain" src={logoWhite} />
          <p className="mt-8 max-w-lg font-mono text-sm uppercase text-white/65">
            NULLL.CLUB is a community that brings people closer with sport as an excuse. Make it real.
          </p>
        </div>
        <div className="grid grid-cols-2 font-mono text-sm uppercase sm:grid-cols-4">
          {footerLinks.map((link) => (
            <a
              className="min-h-32 border-b-2 border-r-2 border-white p-4 transition hover:bg-white hover:text-black sm:border-b-0"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 font-mono text-sm uppercase md:grid-cols-3">
        <div className="border-b-2 border-white p-4 md:border-b-0 md:border-r-2">NULLL.CLUB</div>
        <div className="border-b-2 border-white p-4 md:border-b-0 md:border-r-2">Aix-en-Provence</div>
        <div className="bg-rust p-4 text-black">MAKE IT REAL.</div>
      </div>
    </footer>
  );
}
