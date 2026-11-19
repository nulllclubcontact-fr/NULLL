"use client";

import { useEffect, useRef } from "react";

/**
 * Ruban de texte qui defile en continu et accelere avec le defilement de
 * la page. Inspire du composant « Scroll Velocity » de React Bits
 * (reactbits.dev), reecrit sans dependance.
 *
 * Purement decoratif : le texte est masque aux lecteurs d'ecran, et le
 * ruban reste immobile si l'utilisateur a demande moins d'animations.
 */
export function RubanVitesse({ texte, vitesse = 40, className }: { texte: string; vitesse?: number; className?: string }) {
  const piste = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = piste.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let dernierScroll = window.scrollY;
    let elan = 0;
    let avant = performance.now();
    let image = 0;

    const tour = (maintenant: number) => {
      const dt = Math.min(0.05, (maintenant - avant) / 1000);
      avant = maintenant;

      // L'elan suit la vitesse de defilement puis retombe doucement.
      const delta = window.scrollY - dernierScroll;
      dernierScroll = window.scrollY;
      elan += (Math.min(60, Math.abs(delta)) - elan) * 0.08;

      const largeur = el.scrollWidth / 2;
      x -= (vitesse + elan * 14) * dt;
      if (largeur > 0 && -x >= largeur) x += largeur;
      el.style.transform = `translate3d(${x}px,0,0)`;
      image = requestAnimationFrame(tour);
    };

    image = requestAnimationFrame(tour);
    return () => cancelAnimationFrame(image);
  }, [vitesse]);

  const copie = Array.from({ length: 6 }, (_, i) => <span key={i}>{texte}</span>);

  return (
    <div aria-hidden="true" className={className}>
      <div className="hx-ruban-piste" ref={piste}>
        {copie}
        {copie}
      </div>
    </div>
  );
}
