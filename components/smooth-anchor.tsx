"use client";

import type { ReactNode } from "react";

/**
 * Lien d'ancre au defilement ralenti et amorti.
 * Le defilement natif est trop rapide ; on l'anime nous-memes.
 */
export function SmoothAnchor({
  children,
  className,
  duration = 1600,
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
    const end = target.getBoundingClientRect().top + start;
    const distance = end - start;
    const startedAt = performance.now();

    function step(now: number) {
      const progress = Math.min((now - startedAt) / duration, 1);
      // easeInOutCubic : depart doux, milieu rapide, arrivee amortie
      const eased =
        progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      window.scrollTo(0, start + distance * eased);
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
