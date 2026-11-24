"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CASES, rotationFinale, type Case } from "../lib/roulette/regles";
import { FlecheMain } from "./fleche-main";

const CLE_VU = "nulll_roulette_vu";
const DELAI_MS = 6000;
const DUREE_ROTATION_MS = 4200;
const ANGLE = 360 / CASES.length;

const COULEURS: Record<Case, { fond: string; texte: string }> = {
  redbull: { fond: "#FFC531", texte: "#141116" },
  beezen: { fond: "#E8459E", texte: "#FFFFFF" },
  rien: { fond: "#1E1A21", texte: "#FFFFFF" }
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
  // la fenetre passait sous l'en-tete et le bandeau cookies. La classe
  // « da » redonne les etiquettes et boutons de la DA hors de l'accueil.
  return createPortal(
    <div className="da roulette-fond fixed inset-0 z-[90] grid place-items-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]" role="presentation">
      <div
        aria-describedby="roulette-texte"
        aria-labelledby="roulette-titre"
        aria-modal="true"
        className="roulette-carte flex max-h-[calc(100dvh-2rem-env(safe-area-inset-bottom))] w-full max-w-[440px] flex-col overflow-hidden text-white"
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
        {/* Ouverture facon story : une photo du club, le titre en etiquettes. */}
        <div className="roulette-entete relative shrink-0 overflow-hidden px-5 pb-5 pt-4 sm:px-7">
          <Image alt="" className="object-cover object-[50%_62%]" fill sizes="440px" src="/assets/actus/red-bull/02.webp" />
          <div aria-hidden="true" className="roulette-entete-ombre absolute inset-0" />
          <div className="relative flex items-start justify-between gap-4">
            <span className="st st-white roulette-kicker">1 essai · 9 chances sur 10</span>
            <button
              aria-label="Fermer"
              className="roulette-fermer grid size-11 shrink-0 place-items-center"
              disabled={phase === "tourne"}
              onClick={() => setPhase("ferme")}
              type="button"
            >
              <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
                <path d="M2 2 L14 14 M14 2 L2 14" stroke="currentColor" strokeLinecap="round" strokeWidth="2.6" />
              </svg>
            </button>
          </div>
          <h2 className="da-stack relative mt-6" id="roulette-titre">
            <span className="st st-yellow roulette-titre">Tourne</span>
            <span className="st st-pink roulette-titre">la roue.</span>
          </h2>
        </div>

        <div className="grid gap-4 overflow-y-auto overscroll-contain px-5 pb-6 pt-4 sm:px-7">
          {phase === "resultat" ? null : (
            <div className="relative">
              <p className="roulette-note" id="roulette-texte">
                Une Red Bull, une Bee Zen… ou rien.
              </p>
              <FlecheMain className="roulette-fleche" variante="boucle" />
            </div>
          )}

          <Roue petite={phase === "resultat"} rotation={rotation} />

          <div aria-live="polite">
            {phase === "resultat" ? <Resultat runsHref={runsHref} /> : null}
          </div>

          {phase !== "resultat" ? (
            <button className="roulette-pilule justify-self-center" disabled={phase === "tourne"} onClick={tourner} type="button">
              <span>{phase === "tourne" ? "Ça tourne…" : "Lancer la roue"}</span>
              {phase === "tourne" ? null : <FlecheDroite />}
            </button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}

function FlecheDroite() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 30 18" width="30">
      <path d="M1 9 H27 M19 2 L27 9 L19 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
    </svg>
  );
}

function Roue({ rotation, petite }: { rotation: number; petite: boolean }) {
  const rayon = 150;
  const cadre = rayon + 10;
  return (
    <div className={`roulette-cadre relative mx-auto w-full ${petite ? "max-w-[min(150px,20dvh)]" : "max-w-[min(250px,30dvh)]"}`}>
      {/* Le curseur, fixe, en haut de la roue : un petit sticker jaune. */}
      <svg aria-hidden="true" className="roulette-curseur absolute left-1/2 top-[-10px] z-10" height="34" viewBox="0 0 30 34" width="30">
        <path d="M3 3 H27 L15 31 Z" fill="#FFC531" stroke="#141116" strokeLinejoin="round" strokeWidth="3" />
      </svg>
      <svg
        aria-hidden="true"
        className="roulette-roue block h-auto w-full"
        style={{ transform: `rotate(${rotation}deg)`, transitionDuration: `${DUREE_ROTATION_MS}ms` }}
        viewBox={`-${cadre} -${cadre} ${cadre * 2} ${cadre * 2}`}
      >
        {/* Le cadre blanc, comme le bord d'un sticker decoupe. */}
        <circle fill="#FFFFFF" r={rayon + 8} />
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
              <path d={`M0 0 L${x1.toFixed(2)} ${y1.toFixed(2)} A${rayon} ${rayon} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`} fill={COULEURS[lot].fond} stroke="#141116" strokeWidth="3" />
              <text
                fill={COULEURS[lot].texte}
                fontFamily="var(--font-display), Impact, sans-serif"
                fontSize={lot === "rien" ? 19 : 18}
                letterSpacing=".3"
                textAnchor="end"
                transform={`rotate(${milieu - 90}) translate(${rayon - 14} 6.5)`}
              >
                {NOMS_CASE[lot]}
              </text>
            </g>
          );
        })}
        <circle fill="none" r={rayon} stroke="#141116" strokeWidth="3" />
        <circle fill="#141116" r="34" stroke="#FFFFFF" strokeWidth="4" />
        <text fill="#FFC531" fontFamily="var(--font-display), Impact, sans-serif" fontSize="17" letterSpacing=".4" textAnchor="middle" y="6">
          NULLL
        </text>
      </svg>
    </div>
  );
}

function Resultat({ runsHref }: { runsHref: string }) {
  return (
    <div className="roulette-chute grid justify-items-center gap-4 text-center">
      <p className="da-stack da-center">
        <span className="st st-white roulette-kicker">Résultat : rien…</span>
        <span className="st st-yellow roulette-chute-titre">Ahah, on rigole.</span>
        <span className="st st-pink roulette-chute-titre">Tout est offert !</span>
      </p>
      <p className="roulette-note">On se voit SAMEDI pour le run !!</p>
      <Link className="roulette-pilule" href={runsHref}>
        <span>Choisir ma sortie</span>
        <FlecheDroite />
      </Link>
    </div>
  );
}
