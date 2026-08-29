import Image from "next/image";
import Link from "next/link";
import { AccountHeader } from "../../components/account-shell";
import { ArrowIcon } from "../../components/ArrowIcon";
import { QrAnime } from "../../components/qr-anime";
import { getSiteCopy } from "../../lib/site-content";
import { SiteFooter } from "../../components/site-shell";

export const metadata = {
  title: "S'identifier | NULLL.CLUB",
  description: "Connexion membre, inscription membre et accès professionnel partenaire NULLL.CLUB.",
  // Page passerelle vers les espaces prives : aucun interet dans les resultats.
  robots: { index: false, follow: false }
};

/**
 * Page passerelle, volontairement pauvre. Elle ne fait qu'une chose :
 * envoyer vers l'inscription ou la connexion.
 *
 * La version precedente empilait trois etapes explicatives et un
 * argumentaire partenaires ; on ne savait plus ou cliquer. Le bloc
 * partenaires est parti sur la page contact, ou un commercant le cherche.
 */
export default function IdentificationPage() {
  const copy = getSiteCopy("fr");

  return (
    <main className="flex min-h-dvh flex-col bg-[#1c0d0b]">
      <AccountHeader />

      <section className="relative flex flex-1 items-center overflow-hidden px-5 py-14 text-[#f6eadf] sm:px-8 sm:py-20">
        {/* Filigrane discret : il ne doit rien disputer a la carte. */}
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -left-8 bottom-8 h-auto w-[130%] max-w-none opacity-[.05] sm:w-[112%]"
          height={313}
          priority
          src="/assets/nulll-new/logo-cream.png"
          width={2449}
        />

        <div className="relative mx-auto grid w-full max-w-4xl items-center gap-12 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1fr)] lg:gap-16">
          <div className="hero-rise mx-auto w-full max-w-[16rem] lg:mx-0" style={{ animationDelay: "160ms" }}>
            <QrAnime />
          </div>

          <div>
            <p className="hero-rise font-mono text-[.62rem] font-black uppercase tracking-[.2em] text-[#ffb000] [word-spacing:.22em]" style={{ animationDelay: "60ms" }}>
              Espace membre
            </p>
            <h1 className="hero-rise mt-5 font-display text-[clamp(2.4rem,5.2vw,3.6rem)] uppercase leading-[1.12] tracking-[-.03em]" style={{ animationDelay: "140ms" }}>
              Un club, <span className="text-[#d96ab4]">ça se compte.</span>
            </h1>
            {/* Une phrase, pas trois blocs : le visiteur doit savoir a quoi
                sert un compte sans avoir a lire la page. */}
            <p className="hero-rise mt-5 max-w-md text-lg leading-relaxed text-[#f6eadf]/78" style={{ animationDelay: "220ms" }}>
              Ton compte, ta carte de membre, et la décharge signée une seule fois.
            </p>

            <div className="hero-rise mt-9 flex flex-col gap-3" style={{ animationDelay: "300ms" }}>
              <Link
                className="inline-flex min-h-16 items-center justify-between gap-8 border-2 border-[#ffb000] bg-[#ffb000] px-6 font-mono text-xs font-black uppercase tracking-[.1em] text-[#351815] transition-colors [word-spacing:.12em] hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf]"
                href="/membre/register"
              >
                <span>Créer mon compte</span>
                <ArrowIcon />
              </Link>
              <Link
                className="inline-flex min-h-16 items-center justify-between gap-8 border-2 border-[#f6eadf]/55 px-6 font-mono text-xs font-black uppercase tracking-[.1em] transition-colors [word-spacing:.12em] hover:border-[#f6eadf] hover:bg-[#f6eadf] hover:text-[#351815] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
                href="/membre/login"
              >
                <span>Se connecter</span>
                <ArrowIcon />
              </Link>
            </div>

            {/* Troisieme chemin, rare : un lien suffit, il ne doit pas peser
                autant que les deux boutons. */}
            <p className="hero-rise mt-8 text-sm leading-relaxed text-[#f6eadf]/55" style={{ animationDelay: "380ms" }}>
              Commerçant partenaire ?{" "}
              <Link
                className="font-bold text-[#f6eadf]/80 underline decoration-2 underline-offset-4 transition-colors hover:text-[#ffb000] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
                href="/pro/login"
              >
                Espace pro
              </Link>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter copy={copy} locale="fr" />
    </main>
  );
}
