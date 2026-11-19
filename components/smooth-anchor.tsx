"use client";

import type { ReactNode } from "react";

/**
 * Lien d'ancre au defilement court et amorti (0,6 s).
 * Chaque pas est applique en « instant » : sinon le scroll-behavior: smooth
 * du html relance un defilement doux a chaque image et tout traine.
 */
export function SmoothAnchor({
  children,
  className,
  duration = 600,
  targetId
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  targetId: string;
}) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(targetId);
    if (!target) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();

    const start = window.scrollY;
    // On s'arrete sous la barre de navigation fixe (scroll-margin-top).
    const marge = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const end = target.getBoundingClientRect().top + start - marge;
    const distance = end - start;
    const startedAt = performance.now();

    function step(now: number) {
      const progress = Math.min((now - startedAt) / duration, 1);
      // easeInOutCubic : depart doux, milieu rapide, arrivee amortie
      const eased =
        progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      window.scrollTo({ top: start + distance * eased, behavior: "instant" });
      if (progress < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  return (
    <a className={className} href={`#${targetId}`} onClick={handleClick}>
      {children}
    </a>
  );
}
