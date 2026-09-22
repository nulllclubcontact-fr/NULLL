"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Espaces prives : ce ne sont pas des visites du site public.
const EXCLUS = /^\/(admin|membre|pro|api|apercu)(\/|$)/;

/**
 * Signale chaque page publique vue a /api/visite. Aucun cookie ni stockage :
 * juste le chemin, et d'ou arrive le visiteur a sa premiere page.
 */
export function CompteurVisites() {
  const chemin = usePathname();
  const premiere = useRef(true);
  const dernier = useRef<string | null>(null);

  useEffect(() => {
    // Une meme page ne compte qu'une fois de suite : React peut rejouer
    // l'effet sans que le visiteur ait bouge.
    if (!chemin || EXCLUS.test(chemin) || dernier.current === chemin) return;
    dernier.current = chemin;

    let source = "";
    if (premiere.current) {
      premiere.current = false;
      try {
        const origine = document.referrer ? new URL(document.referrer).hostname : "";
        source = origine && origine !== window.location.hostname ? origine.replace(/^www\./, "") : "";
      } catch {
        source = "";
      }
    }

    const corps = JSON.stringify({ chemin, source });
    try {
      if (!navigator.sendBeacon?.("/api/visite", new Blob([corps], { type: "text/plain" }))) {
        void fetch("/api/visite", { method: "POST", body: corps, keepalive: true }).catch(() => undefined);
      }
    } catch {
      // Rien : le compteur ne doit jamais gener la page.
    }
  }, [chemin]);

  return null;
}
