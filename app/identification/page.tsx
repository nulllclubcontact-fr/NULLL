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
          className="pointer-events-none absolute -left-8 bottom-4 h-auto w-[150%] max-w-none opacity-[.055] sm:w-[125%]"
          height={313}
          priority
          src="/assets/nulll-new/logo-cream.png"
          width={2449}
        />

        <div className="relative mx-auto grid w-full max-w-[1500px] items-center gap-14 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1fr)] lg:gap-24 xl:px-6">
          <div className="hero-rise mx-auto w-full max-w-[15rem] sm:max-w-[20rem] lg:mx-0 lg:max-w-[28rem]" style={{ animationDelay: "160ms" }}>
            <QrAnime />
          </div>

          <div>
            <p className="hero-rise font-mono text-[.62rem] font-black uppercase tracking-[.2em] text-[#ffb000] [word-spacing:.22em]" style={{ animationDelay: "60ms" }}>
              Espace membre
            </p>
            <h1 className="hero-rise mt-6 font-display text-[clamp(2.8rem,6.4vw,5.4rem)] uppercase leading-[1.12] tracking-[-.035em]" style={{ animationDelay: "140ms" }}>
              Le club <span className="text-[#d96ab4]">prend forme ici.</span>
            </h1>
            {/* Une phrase, pas trois blocs : le visiteur doit savoir a quoi
                sert un compte sans avoir a lire la page. */}
            <p className="hero-rise mt-7 max-w-lg text-lg leading-relaxed text-[#f6eadf]/78 sm:text-xl" style={{ animationDelay: "220ms" }}>
              Ton compte, ta carte de membre, et la décharge signée une seule fois.
            </p>

            <div className="hero-rise mt-10 flex max-w-xl flex-col gap-4" style={{ animationDelay: "300ms" }}>
              <Link
                className="inline-flex min-h-[5.5rem] items-center justify-between gap-8 border-2 border-[#ffb000] bg-[#ffb000] px-7 font-mono text-base font-black uppercase tracking-[.06em] sm:text-xl text-[#351815] transition-colors [word-spacing:.12em] hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf]"
                href="/membre/register"
              >
                <span>Créer mon compte</span>
                <ArrowIcon />
              </Link>
              <Link
                className="inline-flex min-h-[5.5rem] items-center justify-between gap-8 border-2 border-[#f6eadf]/55 px-7 font-mono text-base font-black uppercase tracking-[.06em] sm:text-xl transition-colors [word-spacing:.12em] hover:border-[#f6eadf] hover:bg-[#f6eadf] hover:text-[#351815] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
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
