"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Espaces prives : jamais suivis (meme liste que le compteur de visites).
const PRIVE = /^\/(admin|membre|pro|api|apercu|auth|identification)(\/|$)/;

type Clarity = (methode: string) => void;

/**
 * Script de suivi Oculot (sans cookie) : visites, carte de chaleur et erreurs JS
 * remontees dans le CRM du studio. Charge seulement sur les pages publiques ;
 * coupe des qu'on passe dans un espace prive.
 */
export function SuiviOculot() {
  const chemin = usePathname() ?? "/";
  const prive = PRIVE.test(chemin);

  useEffect(() => {
    if (!prive) return;
    const c = (window as unknown as { __oculotClarity?: Clarity }).__oculotClarity;
    try {
      c?.("stop");
    } catch {
      /* rien a couper */
    }
  }, [prive]);

  if (prive) return null;
  return <Script src="https://crm.oculot.studio/t.js?k=144dcc93d0574235" strategy="afterInteractive" />;
}
