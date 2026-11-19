import { Suspense } from "react";
import Image from "next/image";
import { AccountHeader } from "../../components/account-shell";
import { ChoixIdentification, ChoixIdentificationAvecSortie } from "../../components/choix-identification";
import { QrAnime } from "../../components/qr-anime";
import { getSiteCopy } from "../../lib/site-content";
import { SiteFooter } from "../../components/site-shell";

export const metadata = {
  title: "S'identifier | Nulll Club",
  description: "Connexion membre, inscription membre et accès professionnel partenaire Nulll Club.",
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
    <div className="da flex min-h-dvh flex-col bg-[#141116] text-white">
      <AccountHeader />

      <main className="relative flex flex-1 items-center overflow-hidden px-5 py-16 text-white sm:px-8 sm:py-24" id="contenu" tabIndex={-1}>
        <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-16 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          {/* Collage decoratif : une photo du club, et devant le QR qu'on
              recoit en s'inscrivant. Apres les boutons sur telephone. */}
          <div aria-hidden="true" className="relative order-2 mx-auto w-full max-w-[22rem] pb-16 pr-10 sm:max-w-[26rem] lg:order-1 lg:max-w-[30rem]">
            <div className="relative aspect-[4/5] -rotate-3 overflow-hidden rounded-[2px]">
              <Image alt="" className="object-cover" fill priority sizes="(min-width: 1024px) 30vw, 80vw" src="/assets/actus/bienvenue/12.webp" />
            </div>
            <div className="absolute -bottom-2 right-0 w-[58%] rotate-[5deg]">
              <QrAnime />
            </div>
            <p className="st st-lime absolute left-4 top-6" style={{ "--r": "-4deg" } as React.CSSProperties}>Ton QR t’attend</p>
          </div>

          <div className="order-1 lg:order-2">
            <p className="st st-cream" style={{ "--r": "2deg" } as React.CSSProperties}>Espace membre</p>
            <h1 className="da-stack mt-4">
              <span className="st st-yellow st-lg">Viens faire</span>
              <span className="st st-pink st-lg">ton premier pas</span>
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
