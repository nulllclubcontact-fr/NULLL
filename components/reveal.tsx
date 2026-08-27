"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
  /**
   * Par defaut l'apparition ne joue qu'une fois. Avec `repeat`, l'element
   * disparait quand il sort de l'ecran et reapparait quand il y revient :
   * l'animation suit le scroll dans les deux sens.
   */
  repeat?: boolean;
};

/**
 * Fait apparaitre son contenu quand il entre dans l'ecran.
 * Si le visiteur a demande moins de mouvement, tout s'affiche directement.
 */
export function Reveal({ children, className = "", delay = 0, as = "div", repeat = false }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    // Filet de securite : le contenu part invisible, il ne doit jamais le
    // rester. Un onglet ouvert en arriere-plan ne fait pas tourner
    // l'IntersectionObserver — verifie : aucun appel, meme pour un element
    // en plein ecran. Si rien n'est remonte, on affiche.
    let recuUnAppel = false;
    const filet = window.setTimeout(() => {
      // Uniquement si l'onglet est au premier plan : en arriere-plan
      // l'observateur ne tourne pas, mais il reprendra au retour. Forcer
      // l'affichage la ferait clignoter — tout apparait, puis l'observateur
      // remasque ce qui est hors ecran.
      if (!recuUnAppel && document.visibilityState === "visible") setShown(true);
    }, 1500);

    const observer = new IntersectionObserver(
      (entries) => {
        recuUnAppel = true;
        window.clearTimeout(filet);
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (!repeat) observer.disconnect();
          } else if (repeat) {
            setShown(false);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );

    observer.observe(node);
    return () => {
      window.clearTimeout(filet);
      observer.disconnect();
    };
  }, [repeat]);

  const Tag = as as "div";

  return (
    <Tag
      className={`io-reveal ${shown ? "is-in" : ""} ${className}`}
      ref={ref as never}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
