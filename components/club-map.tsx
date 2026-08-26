"use client";

import { useState } from "react";

export type ClubMapNode = {
  label: string;
  text: string;
  detail: string;
  /** Classe de fond appliquee quand le noeud est actif. */
  accent: string;
};

/**
 * La carte du club : un noeud central relie a ses piliers.
 *
 * Les traits sont des blocs positionnes, pas un SVG : ils suivent la grille,
 * donc ils restent alignes a toutes les largeurs sans recalcul au scroll.
 * Sur grand ecran, une barre horizontale relie les trois branches ; en
 * dessous de md les branches s'empilent et la barre devient une colonne
 * verticale a gauche.
 */
export function ClubMap({ nodes }: { nodes: ClubMapNode[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="club-map relative mt-12 sm:mt-16">
      {/* Le noeud central. Le tronc vit dans ce bloc : son `top: 100%` doit
          partir du bas de la racine, pas du bas de toute la carte. */}
      <div className="relative z-10 flex justify-start md:justify-center">
        <span className="inline-flex items-center border-2 border-[#351815] bg-[#ffb000] px-6 py-4 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] uppercase leading-none text-[#351815]">
          NULLL.CLUB
        </span>
        <div aria-hidden="true" className="club-map-trunk" />
      </div>

      <ul className="club-map-branches relative grid gap-10 pt-10 md:grid-cols-3 md:gap-5 md:pt-14">
        {/* Barre de distribution : dans la grille, pour s'aligner exactement
            sur les amorces verticales de chaque branche. */}
        <li aria-hidden="true" className="club-map-bus" />
        {nodes.map((node, index) => (
          <li className="club-map-branch relative pl-10 md:pl-0 md:pt-10" key={node.label}>
            <span aria-hidden="true" className="club-map-drop" />

            <button
              aria-current={index === active ? "true" : undefined}
              className={`club-map-node group block w-full cursor-pointer border-2 px-5 py-5 text-left focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000] ${
                index === active ? `is-active ${node.accent}` : ""
              }`}
              onClick={() => setActive(index)}
              onFocus={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              type="button"
            >
              <span className="block font-mono text-[.62rem] font-black uppercase tracking-[.2em] opacity-60">
                Pilier 0{index + 1}
              </span>
              <span className="mt-2 block font-display text-[clamp(1.5rem,2.2vw,2.1rem)] uppercase leading-[.94]">
                {node.label}
              </span>
            </button>

            <p className="club-map-text mt-4 max-w-[38ch] text-base leading-relaxed">{node.text}</p>

            {/* Feuille terminale : le detail concret du pilier */}
            <div className="club-map-leaf relative mt-5 pl-8">
              <span aria-hidden="true" className="club-map-leaf-line" />
              <span className="inline-flex border-2 border-dashed border-[#f6eadf]/45 px-3 py-2 font-mono text-[.62rem] font-black uppercase tracking-[.14em] text-[#f6eadf]/75">
                {node.detail}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
