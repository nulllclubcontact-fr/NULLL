"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type ClubGalleryItem = {
  label: string;
  text: string;
  src: string;
  alt: string;
  /** Cadrage choisi photo par photo : le centrage par defaut tombait sur les jambes. */
  position: string;
};

/**
 * Liste de moments dont le survol change la grande photo.
 *
 * Sur pointeur fin, c'est le survol (et le focus clavier) qui pilote.
 * Sur tactile, il n'y a pas de survol : c'est alors la ligne la plus proche
 * du centre de l'ecran qui devient active, et la galerie se parcourt au
 * scroll. Une seule serie d'images dans le DOM dans les deux cas.
 */
export function ClubGallery({ items }: { items: ClubGalleryItem[] }) {
  const [active, setActive] = useState(0);
  const rows = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = rows.current.indexOf(entry.target as HTMLLIElement);
          if (index >= 0) setActive(index);
        }
      },
      // Bande etroite au centre de l'ecran : une seule ligne active a la fois.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    for (const row of rows.current) {
      if (row) observer.observe(row);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1fr_1.02fr] lg:items-start lg:gap-14">
      {/* Le panneau. Sticky sur grand ecran pour rester en face de la liste. */}
      <div className="club-gallery-panel relative order-1 aspect-[4/5] w-full overflow-hidden border-2 border-[#f6eadf]/25 sm:aspect-[5/4] lg:sticky lg:top-28 lg:order-2 lg:aspect-[4/5]">
        {items.map((item, index) => (
          <Image
            alt={item.alt}
            className={`club-gallery-photo object-cover ${item.position} ${index === active ? "is-active" : ""}`}
            fill
            key={item.src}
            priority={index === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={item.src}
          />
        ))}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 bg-[#ffb000] px-4 py-2.5 font-mono text-xs font-black uppercase tracking-[.16em] text-[#351815]"
        >
          {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
      </div>

      <ol className="order-2 lg:order-1">
        {items.map((item, index) => (
          <li
            className="club-gallery-row border-b border-[#f6eadf]/25 first:border-t"
            key={item.label}
            ref={(node) => {
              rows.current[index] = node;
            }}
          >
            <button
              aria-current={index === active ? "true" : undefined}
              className={`club-gallery-trigger group flex w-full cursor-pointer items-baseline gap-5 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000] sm:gap-7 ${
                index === active ? "is-active" : ""
              }`}
              onClick={() => setActive(index)}
              onFocus={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              type="button"
            >
              <span aria-hidden="true" className="font-mono text-xs font-black uppercase tracking-[.16em] opacity-55">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="club-gallery-label block font-display text-[clamp(1.9rem,3.4vw,3.2rem)] uppercase leading-[.92]">
                  {item.label}
                </span>
                <span className="club-gallery-text mt-2 block max-w-[42ch] text-base leading-relaxed text-[#f6eadf]/70">
                  {item.text}
                </span>
              </span>
              <span aria-hidden="true" className="club-gallery-arrow shrink-0 font-display text-2xl leading-none">
                →
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
