"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const CLE = "nulll_cookies_vu";

function dejaVu() {
  try {
    return window.localStorage.getItem(CLE) !== null;
  } catch {
    // Navigation privee ou stockage bloque : on montre le bandeau, il
    // reviendra a la prochaine visite. Mieux que de planter.
    return false;
  }
}

function suivreStockage(changement: () => void) {
  window.addEventListener("storage", changement);
  return () => window.removeEventListener("storage", changement);
}

/**
 * Bandeau d'information, pas de consentement.
 *
 * Le site ne pose que trois cookies, tous necessaires a la connexion :
 * la session Supabase, son marqueur de session courte et nulll_pro_session. Aucune
 * mesure d'audience, aucun traceur, aucun script tiers. Ces cookies sont
 * exemptes de consentement (directive ePrivacy, doctrine CNIL), donc on
 * informe au lieu de demander une permission dont on n'a pas besoin.
 *
 * Le jour ou une mesure d'audience arrive, ce bandeau doit passer en vrai
 * consentement : deux boutons, refus aussi facile que l'acceptation, et
 * le traceur ne se charge qu'apres acceptation.
 *
 * Le choix vit dans localStorage : il est propre au navigateur, ne part
 * jamais au serveur, et n'a donc pas besoin d'etre un cookie lui-meme.
 */
export function BandeauCookies() {
  // Cote serveur on le dit deja vu : le serveur ne sait pas ce que la
  // personne a vu, et faire apparaitre puis disparaitre le bandeau serait
  // pire que de le faire apparaitre juste apres l'hydratation.
  const vu = useSyncExternalStore(suivreStockage, dejaVu, () => true);
  const [ferme, setFerme] = useState(false);
  const bandeau = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vu || ferme || !bandeau.current) return;
    // Reserve sa hauteur reelle, y compris apres rotation et avec l'encoche.
    const mesurer = () => document.documentElement.style.setProperty("--cookie-banner-height", `${bandeau.current?.getBoundingClientRect().height ?? 0}px`);
    const observer = new ResizeObserver(mesurer);
    observer.observe(bandeau.current);
    mesurer();
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--cookie-banner-height");
    };
  }, [vu, ferme]);

  if (vu || ferme) return null;

  const fermer = () => {
    try {
      window.localStorage.setItem(CLE, "1");
    } catch {
      // Rien a faire : le bandeau se fermera pour cette visite seulement.
    }
    setFerme(true);
  };

  return (
    <div
      aria-label="Information sur les cookies"
      className="cookie-banner fixed inset-x-0 bottom-0 z-[80] max-h-[50dvh] overflow-y-auto border-t-2 border-[#773331] bg-[#F1EDE9] pb-[env(safe-area-inset-bottom)] text-[#773331]"
      ref={bandeau}
      role="region"
    >
      {/* Marges laterales volontairement plus courtes que sur le reste du
          site : le bandeau est une barre de service, pas une section de
          contenu, et le retrait de 48px repoussait le visuel loin du bord
          en mangeant la largeur utile du texte. */}
      {/* Sur telephone, une seule ligne : phrase courte a gauche, bouton a
          droite. Sur trois etages, le bandeau cachait le bouton « Choisir ma
          sortie » de l'accueil. Le detail revient des 640 px. */}
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-2 sm:flex-col sm:items-stretch sm:gap-4 sm:px-5 sm:py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-6">
        {/* Le visuel et le texte forment un bloc : sans ce groupement, le
            justify-between les separait et le cookie partait a l'autre bout. */}
        <div className="flex min-w-0 flex-1 items-center gap-5 sm:flex-initial">
          <Cookie />
          <div className="min-w-0">
            <p className="hidden font-mono text-xs font-black uppercase tracking-[.16em] text-[#773331] sm:block">Cookies</p>
            <p className="max-w-2xl text-sm leading-snug sm:mt-2 sm:text-[.95rem] sm:leading-relaxed">
              Des cookies servent à la connexion.
              <span className="hidden sm:inline">
                {" "}Retrouve le détail des données et des prestataires dans notre politique de confidentialité.
              </span>{" "}
              <Link className="font-bold underline decoration-2 underline-offset-4 sm:hidden" href="/confidentialite">
                En savoir plus
              </Link>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link
            className="hidden min-h-11 items-center px-1 font-mono text-xs font-black uppercase tracking-[.12em] underline decoration-2 underline-offset-4 transition-colors hover:text-[#773331]/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#773331] sm:inline-flex"
            href="/confidentialite"
          >
            En savoir plus
          </Link>
          <button
            className="inline-flex min-h-11 items-center border-2 border-[#773331] bg-[#FFB200] px-4 font-mono text-xs font-black uppercase tracking-[.12em] text-[#773331] transition-colors hover:bg-[#773331] hover:text-[#F1EDE9] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#773331] sm:min-h-12 sm:px-6"
            onClick={fermer}
            type="button"
          >
            J’ai compris
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Cookie dessine plutot que photographie : le projet n'a aucune image de
 * biscuit, et une illustration dans les couleurs du club se tient mieux a
 * cette taille qu'une photo recadree en vignette.
 *
 * Pour le remplacer par une vraie photo, deposer le fichier dans
 * public/assets/photos/ puis echanger ce composant contre :
 *   <Image alt="" className="size-16 shrink-0 rounded-full object-cover"
 *          height={64} src="/assets/photos/cookie.jpg" width={64} />
 *
 * aria-hidden parce qu'il est purement decoratif : le texte a cote dit
 * deja tout, et le faire lire deux fois n'aide personne.
 */
function Cookie() {
  return (
    <svg
      aria-hidden="true"
      className="hidden size-16 shrink-0 sm:block"
      fill="none"
      focusable="false"
      viewBox="0 0 64 64"
    >
      <circle cx="32" cy="32" r="29" fill="#FFB200" stroke="#773331" strokeWidth="3" />
      <circle cx="23" cy="21" r="4.4" fill="#773331" />
      <circle cx="41" cy="26" r="3.4" fill="#773331" />
      <circle cx="20" cy="38" r="3.2" fill="#773331" />
      <circle cx="34" cy="42" r="4.8" fill="#773331" />
      <circle cx="45" cy="41" r="2.6" fill="#773331" />
      <circle cx="30" cy="31" r="2.2" fill="#773331" />
    </svg>
  );
}
