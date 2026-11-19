"use client";

import { useEffect, useRef } from "react";

/** Distance de defilement, en pixels, sur laquelle la barre se transforme. */
const COURSE = 140;

/**
 * Pose sur l'en-tete une variable --p qui va de 0 (barre pleine largeur,
 * en haut de page) a 1 (barre compacte detachee du bord). Le CSS
 * interpole la forme a partir de cette seule valeur : la transformation
 * suit le defilement, sans saut.
 */
export function SuiviDefilement() {
  const repere = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const entete = repere.current?.closest<HTMLElement>(".site-header");
    if (!entete) return;
    let image = 0;
    const maj = () => {
      image = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / COURSE));
      entete.style.setProperty("--p", p.toFixed(3));
      entete.toggleAttribute("data-compacte", p >= 1);
    };
    const demande = () => {
      if (!image) image = requestAnimationFrame(maj);
    };
    maj();
    window.addEventListener("scroll", demande, { passive: true });
    return () => {
      window.removeEventListener("scroll", demande);
      cancelAnimationFrame(image);
    };
  }, []);

  return <span aria-hidden="true" hidden ref={repere} />;
}
