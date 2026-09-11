import Image from "next/image";
import Link from "next/link";
import { AccountHeader } from "../../components/account-shell";
import { ArrowIcon } from "../../components/ArrowIcon";
import { QrAnime } from "../../components/qr-anime";
import { suiteSortie } from "../../lib/races/sortie-choisie";
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
 * envoyer vers l'inscription ou la connexion, en gardant la sortie choisie
 * sur la page « Sorties » (?sortie=) pour la retrouver dans l'espace membre.
 *
 * La version precedente empilait trois etapes explicatives et un
 * argumentaire partenaires ; on ne savait plus ou cliquer. Le bloc
 * partenaires est parti sur la page contact, ou un commercant le cherche.
 */
export default async function IdentificationPage({ searchParams }: { searchParams: Promise<{ sortie?: string }> }) {
  const copy = getSiteCopy("fr");
  const suite = suiteSortie((await searchParams).sortie);

  return (
    <main className="flex min-h-dvh flex-col bg-[#3A1A18]">
      <AccountHeader />

      <section className="relative flex flex-1 items-center overflow-hidden px-5 py-14 text-[#F1EDE9] sm:px-8 sm:py-20">
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
          {/* Motif decoratif, pas le QR personnel : cache aux lecteurs d'ecran,
              et place apres les boutons sur mobile pour qu'ils arrivent en premier. */}
          <div
            aria-hidden="true"
            className="hero-rise order-2 mx-auto w-full max-w-[12rem] sm:max-w-[18rem] lg:order-1 lg:mx-0 lg:max-w-[28rem]"
            style={{ animationDelay: "160ms" }}
          >
            <QrAnime />
          </div>

          <div className="order-1 lg:order-2">
            <p className="hero-rise font-mono text-xs font-black uppercase tracking-[.2em] text-[#FFB200] [word-spacing:.22em]" style={{ animationDelay: "60ms" }}>
              Espace membre
            </p>
            <h1 className="hero-rise mt-6 font-display text-[clamp(2.8rem,6.4vw,5.4rem)] uppercase leading-[1.12] tracking-[-.035em]" style={{ animationDelay: "140ms" }}>
              {/* Coupure imposee : laisse au navigateur, le titre rejetait
                  « ici. » seul sur la seconde ligne. */}
              <span className="block">Viens faire</span>
              <span className="block text-[#EBA0CD]">ton premier pas.</span>
            </h1>
            {/* Une phrase, pas trois blocs : le visiteur doit savoir a quoi
                sert un compte sans avoir a lire la page. */}
            <p className="hero-rise mt-7 max-w-lg text-lg leading-relaxed text-[#F1EDE9] sm:text-xl" style={{ animationDelay: "220ms" }}>
              {suite
                ? "Ta sortie est notée. Crée ton compte ou connecte-toi pour confirmer ta place et retrouver ton QR."
                : "Crée ton compte gratuit pour choisir une sortie et retrouver son QR. La décharge se signe une seule fois."}
            </p>

            <div className="hero-rise mt-10 flex max-w-xl flex-col gap-4" style={{ animationDelay: "300ms" }}>
              <Link
                className="inline-flex min-h-[5.5rem] items-center justify-between gap-8 border-2 border-[#FFB200] bg-[#FFB200] px-7 font-mono text-base font-black uppercase tracking-[.06em] text-[#773331] transition-colors [word-spacing:.12em] hover:bg-transparent hover:text-[#FFB200] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#F1EDE9] sm:text-xl"
                href={`/membre/register${suite}`}
              >
                <span>Créer mon compte</span>
                <ArrowIcon />
              </Link>
              <Link
                className="inline-flex min-h-[5.5rem] items-center justify-between gap-8 border-2 border-[#F1EDE9]/80 px-7 font-mono text-base font-black uppercase tracking-[.06em] transition-colors [word-spacing:.12em] hover:border-[#F1EDE9] hover:bg-[#F1EDE9] hover:text-[#773331] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#FFB200] sm:text-xl"
                href={`/membre/login${suite}`}
              >
                <span>Se connecter</span>
                <ArrowIcon />
              </Link>
            </div>

            <p className="hero-rise mt-8 text-sm leading-relaxed text-[#F1EDE9]" style={{ animationDelay: "380ms" }}>
              {suite ? (
                <>
                  Déjà connecté ?{" "}
                  <Link className="font-bold underline decoration-2 underline-offset-4 transition-colors hover:text-[#FFB200]" href={`/membre${suite}`}>
                    Aller à mon espace
                  </Link>
                  {" · "}
                </>
              ) : null}
              {/* Troisieme chemin, rare : un lien suffit, il ne doit pas peser
                  autant que les deux boutons. */}
              Commerçant partenaire ?{" "}
              <Link
                className="font-bold underline decoration-2 underline-offset-4 transition-colors hover:text-[#FFB200] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFB200]"
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
