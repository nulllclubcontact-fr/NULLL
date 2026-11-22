"use client";

import { useEffect, useState } from "react";

/**
 * Bandeau de consentement + Google Analytics 4 (recommandations CNIL).
 * - Aucun script ni cookie Google tant que le visiteur n'a pas cliqué sur « Accepter ».
 * - « Refuser » est aussi visible et aussi simple qu'« Accepter ».
 * - Accord gardé 13 mois, refus 6 mois, puis on redemande.
 * - Tout lien vers « #cookies » rouvre le bandeau (retrait du consentement à tout moment).
 * Le choix vit dans localStorage : il ne part jamais au serveur.
 */
const GA_ID = "G-RFGKHG8WZJ";
const CLE = "nulll-consentement";
const POLITIQUE = "/confidentialite";
const C = {"fond": "#F1EDE9", "texte": "#773331", "accent": "#773331", "texteAccent": "#F1EDE9", "bord": "#773331", "arrondi": 0};

const MOIS = 30 * 24 * 3600 * 1000;
const DUREE = { oui: 13 * MOIS, non: 6 * MOIS };
type Choix = "oui" | "non";

function lireChoix(): Choix | null {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return null;
    const { v, t } = JSON.parse(brut) as { v: Choix; t: number };
    if ((v === "oui" || v === "non") && Date.now() - t < DUREE[v]) return v;
  } catch {}
  return null;
}

function garderChoix(v: Choix) {
  try {
    localStorage.setItem(CLE, JSON.stringify({ v, t: Date.now() }));
  } catch {}
}

type FenetreGA = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void } & Record<string, unknown>;

function chargerGA() {
  const w = window as unknown as FenetreGA;
  if (w.gtag) return;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params -- format attendu par gtag.js
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID, { cookie_expires: 13 * 30 * 24 * 3600 });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

function effacerCookiesGA() {
  const w = window as unknown as FenetreGA;
  w[`ga-disable-${GA_ID}`] = true;
  const domaines = ["", location.hostname, `.${location.hostname.replace(/^www\./, "")}`];
  for (const nom of document.cookie.split(";").map((c) => c.split("=")[0].trim())) {
    if (!/^_ga/.test(nom)) continue;
    for (const d of domaines) document.cookie = `${nom}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}

export function ConsentementGA() {
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    const choix = lireChoix();
    if (choix === "oui") chargerGA();
    // Montré après l'hydratation : le serveur ne connaît pas le choix du visiteur.
    const t = window.setTimeout(() => setOuvert(choix === null), 0);
    const rouvrir = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href$="#cookies"]');
      if (!a) return;
      e.preventDefault();
      setOuvert(true);
    };
    document.addEventListener("click", rouvrir);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("click", rouvrir);
    };
  }, []);

  if (!ouvert) return null;

  const choisir = (v: Choix) => {
    const avant = lireChoix();
    garderChoix(v);
    setOuvert(false);
    if (v === "oui") chargerGA();
    else if (avant === "oui") {
      effacerCookiesGA();
      location.reload();
    }
  };

  const bouton: React.CSSProperties = {
    font: "inherit",
    fontSize: 14,
    fontWeight: 600,
    padding: "10px 18px",
    borderRadius: C.arrondi,
    cursor: "pointer",
    minHeight: 44,
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookies et mesure d'audience"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: "max(16px, env(safe-area-inset-bottom))",
        zIndex: 2147483000,
        maxWidth: 560,
        margin: "0 auto",
        background: C.fond,
        color: C.texte,
        border: `1px solid ${C.bord}`,
        borderRadius: C.arrondi,
        boxShadow: "0 12px 40px rgba(0,0,0,.18)",
        padding: "16px 18px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 12,
        fontSize: 14,
        lineHeight: 1.45,
      }}
    >
      <p style={{ margin: 0, flex: "1 1 260px" }}>
        Nous mesurons l&apos;audience du site avec Google Analytics, uniquement si vous l&apos;acceptez.{" "}
        <a href={POLITIQUE} style={{ color: "inherit", textDecoration: "underline" }}>
          En savoir plus
        </a>
      </p>
      <div style={{ display: "flex", gap: 8, flex: "0 0 auto" }}>
        <button type="button" onClick={() => choisir("non")} style={{ ...bouton, background: "transparent", color: C.texte, border: `1.5px solid ${C.texte}` }}>
          Refuser
        </button>
        <button type="button" onClick={() => choisir("oui")} style={{ ...bouton, background: C.accent, color: C.texteAccent, border: `1.5px solid ${C.accent}` }}>
          Accepter
        </button>
      </div>
    </div>
  );
}
