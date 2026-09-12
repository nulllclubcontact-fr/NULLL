import { Suspense } from "react";
import Image from "next/image";
import { AccountHeader } from "../../components/account-shell";
import { ChoixIdentification, ChoixIdentificationAvecSortie } from "../../components/choix-identification";
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
 * Page passerelle, volontairement pauvre : envoyer vers l'inscription ou
 * la connexion. Elle est statique, donc prechargee par le lien « Se
 * connecter » et affichee des le clic. La sortie choisie (?sortie=) est
 * lue dans le navigateur par ChoixIdentificationAvecSortie.
 *
 * La version precedente empilait trois etapes explicatives et un
 * argumentaire partenaires ; on ne savait plus ou cliquer. Le bloc
 * partenaires est parti sur la page contact, ou un commercant le cherche.
 */
export default function IdentificationPage() {
  const copy = getSiteCopy("fr");

  return (
    <div className="flex min-h-dvh flex-col bg-[#3A1A18]">
      <AccountHeader />

      <main className="relative flex flex-1 items-center overflow-hidden px-5 py-14 text-[#F1EDE9] sm:px-8 sm:py-20" id="contenu" tabIndex={-1}>
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

            <Suspense fallback={<ChoixIdentification suite="" />}>
              <ChoixIdentificationAvecSortie />
            </Suspense>
          </div>
        </div>
      </main>

      <SiteFooter copy={copy} locale="fr" />
    </div>
  );
}
