import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./ArrowIcon";
import { SiteHeader } from "./site-shell";
import { getSiteCopy } from "../lib/site-content";

type AccountShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  image?: string;
  imageAlt?: string;
};

export function AccountShell({
  eyebrow,
  title,
  intro,
  children,
  image = "/assets/nulll-new/run-finish.png",
  imageAlt = "NULLL.CLUB community"
}: AccountShellProps) {
  return (
    <main className="min-h-screen bg-[#f6eadf] text-[#351815]">
      <AccountHeader />
      <section className="relative overflow-hidden border-b-2 border-[#351815]">
        <Image
          alt=""
          aria-hidden="true"
          className="absolute -right-24 top-20 hidden h-auto w-[36vw] rotate-6 opacity-10 lg:block"
          height={784}
          src="/assets/nulll-new/n-burgundy.png"
          width={900}
        />
        <div className="mx-auto grid w-full max-w-[1760px] lg:grid-cols-[minmax(0,0.82fr)_minmax(360px,0.68fr)]">
          <div className="flex flex-col justify-center border-b-2 border-[#351815] px-5 py-8 sm:px-8 lg:min-h-[620px] lg:border-b-0 lg:border-r-2 lg:px-10">
            <div>
              <p className="inline-flex border-2 border-[#351815] bg-[#ffb000] px-3 py-2 font-mono text-xs font-black uppercase">
                {eyebrow}
              </p>
              <h1 className="mt-6 max-w-4xl font-display text-[clamp(3.2rem,8.5vw,7.8rem)] uppercase leading-[0.92]">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-black uppercase leading-tight text-[#351815]/78 sm:text-xl">
                {intro}
              </p>
            </div>
            <div className="mt-7 grid gap-3 border-2 border-[#351815] bg-[#d96ab4] p-4 font-mono text-xs font-black uppercase leading-tight sm:grid-cols-3 sm:p-5">
              <span>Compte membre</span>
              <span>QR points</span>
              <span>Partenaires pro</span>
            </div>
          </div>
          <div className="grid content-center gap-5 bg-[#351815] p-4 text-[#f6eadf] sm:p-6 lg:p-8">
            <div className="relative min-h-[220px] overflow-hidden border-2 border-[#f6eadf] sm:min-h-[300px] lg:min-h-[340px]">
              <Image alt={imageAlt} className="object-cover" fill priority sizes="(min-width: 1024px) 42vw, 100vw" src={image} />
              <div className="absolute inset-0 bg-[#351815]/10" />
              <Image
                alt="NULLL.CLUB"
                className="absolute bottom-5 left-5 h-auto w-48 max-w-[70%]"
                height={157}
                src="/assets/nulll-new/logo-yellow.png"
                width={1225}
              />
            </div>
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}

export function AccountHeader() {
  return <SiteHeader copy={getSiteCopy("fr")} current="identification" locale="fr" pathname="/identification" />;
}

export function AccountLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return (
    <Link
      className={`group inline-flex min-h-14 items-center justify-between gap-4 border-2 border-[#351815] px-4 py-3 font-mono text-sm font-black uppercase transition hover:-translate-y-1 ${
        secondary ? "bg-[#f6eadf] text-[#351815] hover:bg-[#351815] hover:text-[#f6eadf]" : "bg-[#351815] text-[#f6eadf] hover:bg-[#ffb000] hover:text-[#351815]"
      }`}
      href={href}
    >
      <span>{children}</span>
      <ArrowIcon />
    </Link>
  );
}
