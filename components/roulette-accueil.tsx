"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CASES, rotationFinale, type Case } from "../lib/roulette/regles";

const CLE_VU = "nulll_roulette_vu";
const DELAI_MS = 6000;
const DUREE_ROTATION_MS = 4200;
const ANGLE = 360 / CASES.length;

const COULEURS: Record<Case, { fond: string; texte: string }> = {
  redbull: { fond: "#FFB200", texte: "#773331" },
  beezen: { fond: "#EBA0CD", texte: "#773331" },
  rien: { fond: "#3A1A18", texte: "#F1EDE9" }
};
const NOMS_CASE: Record<Case, string> = { redbull: "RED BULL", beezen: "BEE ZEN", rien: "RIEN" };

type Phase = "ferme" | "ouvert" | "tourne" | "resultat";

function dejaVu() {
  try {
    return window.localStorage.getItem(CLE_VU) === "1";
  } catch {
    return true;
  }
}

function marquerVu() {
  try {
    window.localStorage.setItem(CLE_VU, "1");
  } catch {
    // Stockage refuse : la fenetre reviendra, rien de grave.
  }
}

/**
 * Roulette de l'accueil : une fenetre qui s'ouvre une fois, quelques
 * secondes apres l'arrivee. Le tirage est fait par le serveur ; la roue ne
 * fait que montrer le resultat.
 */
export function RouletteAccueil({ runsHref }: { runsHref: string }) {
  const [phase, setPhase] = useState<Phase>("ferme");
  const [rotation, setRotation] = useState(0);
  const dialogue = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ?roulette dans l'adresse l'ouvre tout de suite (lien a partager, test).
    const forcee = new URLSearchParams(window.location.search).has("roulette");
    if (!forcee && dejaVu()) return;
    const minuteur = window.setTimeout(() => {
      marquerVu();
      setPhase("ouvert");
    }, forcee ? 400 : DELAI_MS);
    return () => window.clearTimeout(minuteur);
  }, []);

  const ouverte = phase !== "ferme";

  useEffect(() => {
    if (!ouverte) return;
    const precedent = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogue.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      precedent?.focus();
    };
  }, [ouverte]);

  if (!ouverte) return null;

  function tourner() {
    setPhase("tourne");
    // Toujours « rien »... La vraie reponse arrive juste apres.
    setRotation((actuelle) => rotationFinale(actuelle, 6, Math.random() * 0.8 - 0.4));
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setPhase("resultat"), reduit ? 0 : DUREE_ROTATION_MS);
  }

  // Rendue dans body : l'accueil isole ses calques (isolation: isolate),
  // la fenetre passait sous l'en-tete et le bandeau cookies.
  return createPortal(
    <div className="fixed inset-0 z-[90] grid place-items-center bg-[#3A1A18]/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]" role="presentation">
      <div
        aria-describedby="roulette-texte"
        aria-labelledby="roulette-titre"
        aria-modal="true"
        className="flex max-h-[calc(100dvh-2rem-env(safe-area-inset-bottom))] w-full max-w-lg flex-col overflow-hidden border-2 border-[#773331] bg-[#F1EDE9] text-[#773331] shadow-[10px_10px_0_#FFB200]"
        onKeyDown={(event) => {
          if (event.key === "Escape" && phase !== "tourne") {
            event.preventDefault();
            setPhase("ferme");
          }
          if (event.key !== "Tab") return;
          const controles = dialogue.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
          if (!controles?.length) return;
          const premier = controles[0];
          const dernier = controles[controles.length - 1];
          if (event.shiftKey && (document.activeElement === premier || document.activeElement === dialogue.current)) {
            event.preventDefault();
            dernier.focus();
          } else if (!event.shiftKey && document.activeElement === dernier) {
            event.preventDefault();
            premier.focus();
          }
        }}
        ref={dialogue}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b-2 border-[#773331] bg-[#FFB200] px-5 py-4 sm:px-7">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[.16em]">Un essai · Neuf chances sur dix</p>
            <h2 className="mt-2 font-display text-[clamp(1.9rem,6vw,2.6rem)] uppercase leading-[1.05]" id="roulette-titre">
              Tourne la roue.
            </h2>
          </div>
          <button
            aria-label="Fermer"
            className="grid size-11 shrink-0 place-items-center border-2 border-[#773331] font-mono text-lg font-black transition-colors hover:bg-[#773331] hover:text-[#FFB200] disabled:opacity-40"
            disabled={phase === "tourne"}
            onClick={() => setPhase("ferme")}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-5 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
          <p className="text-base leading-relaxed" id="roulette-texte">
            Une Red Bull, une Bee Zen… ou rien. Tente ta chance.
          </p>

          <Roue rotation={rotation} />

          <div aria-live="polite">
            {phase === "resultat" ? <Resultat runsHref={runsHref} /> : null}
          </div>

          {phase !== "resultat" ? (
            <button className="primary-button justify-center" disabled={phase === "tourne"} onClick={tourner} type="button">
              {phase === "tourne" ? "Ça tourne…" : "Lancer la roue"}
            </button>
          ) : null}

        </div>
      </div>
    </div>,
    document.body
  );
}

function Roue({ rotation }: { rotation: number }) {
  const rayon = 150;
  return (
    <div className="relative mx-auto w-full max-w-[min(260px,38dvh)]">
      {/* Le curseur, fixe, en haut de la roue. */}
      <svg aria-hidden="true" className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2" height="28" viewBox="0 0 24 28" width="24">
        <path d="M2 2 H22 L12 26 Z" fill="#3A1A18" stroke="#F1EDE9" strokeWidth="2" />
      </svg>
      <svg
        aria-hidden="true"
        className="roulette-roue block h-auto w-full"
        style={{ transform: `rotate(${rotation}deg)`, transitionDuration: `${DUREE_ROTATION_MS}ms` }}
        viewBox={`-${rayon + 4} -${rayon + 4} ${(rayon + 4) * 2} ${(rayon + 4) * 2}`}
      >
        {CASES.map((lot, index) => {
          const debut = ((index * ANGLE - 90) * Math.PI) / 180;
          const fin = (((index + 1) * ANGLE - 90) * Math.PI) / 180;
          const x1 = Math.cos(debut) * rayon;
          const y1 = Math.sin(debut) * rayon;
          const x2 = Math.cos(fin) * rayon;
          const y2 = Math.sin(fin) * rayon;
          const milieu = index * ANGLE + ANGLE / 2;
          return (
            <g key={index}>
              <path d={`M0 0 L${x1.toFixed(2)} ${y1.toFixed(2)} A${rayon} ${rayon} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`} fill={COULEURS[lot].fond} stroke="#773331" strokeWidth="2" />
              <text
                fill={COULEURS[lot].texte}
                fontFamily="var(--font-mono), monospace"
                fontSize={lot === "rien" ? 11 : 12}
                fontWeight={900}
                letterSpacing="1.2"
                textAnchor="end"
                transform={`rotate(${milieu - 90}) translate(${rayon - 12} 4)`}
              >
                {NOMS_CASE[lot]}
              </text>
            </g>
          );
        })}
        <circle fill="#F1EDE9" r="26" stroke="#773331" strokeWidth="2" />
        <text fill="#773331" fontFamily="var(--font-display), Impact, sans-serif" fontSize="18" textAnchor="middle" y="7">
          N
        </text>
      </svg>
    </div>
  );
}

function Resultat({ runsHref }: { runsHref: string }) {
  return (
    <div className="roulette-chute grid gap-3 border-2 border-[#773331] bg-[#FFB200] p-4">
      <p className="font-mono text-xs font-black uppercase tracking-[.14em]">Résultat : rien…</p>
      <p className="font-display text-[clamp(1.8rem,6vw,2.4rem)] uppercase leading-[1.05]">Ahah, on rigole. Tout est offert !</p>
      <p className="text-lg font-bold leading-relaxed">On se voit SAMEDI pour le run !!</p>
      <Link className="primary-button justify-center" href={runsHref}>
        Choisir ma sortie
      </Link>
    </div>
  );
}
