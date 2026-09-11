"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { destinationApresFournisseur } from "../../app/membre/actions";
import { destinationMembre } from "../../lib/races/sortie-choisie";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

type Fournisseur = "google" | "apple";

type GoogleIdentite = {
  accounts: {
    id: {
      initialize(options: Record<string, unknown>): void;
      renderButton(element: HTMLElement, options: Record<string, unknown>): void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentite;
  }
}

// Identifiant public par nature : Google l'affiche dans chaque page de connexion.
const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "745605124032-mbhj0advn250o4ec4ma0uvmovt6l2v2s.apps.googleusercontent.com";

/**
 * Nonce contre le rejeu d'un jeton : Google recoit son empreinte SHA-256,
 * Supabase la valeur brute, et verifie que les deux correspondent.
 */
async function creerNonce() {
  const brut = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const empreinte = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(brut));
  const hache = Array.from(new Uint8Array(empreinte))
    .map((octet) => octet.toString(16).padStart(2, "0"))
    .join("");

  return { brut, hache };
}

function LogoGoogle() {
  // Le « G » officiel, couleurs comprises : les regles de marque Google
  // interdisent de le recolorer.
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 48 48">
      <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" fill="#FFC107" />
      <path d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00" />
      <path d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" fill="#4CAF50" />
      <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" fill="#1976D2" />
    </svg>
  );
}

function LogoApple() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.37 12.73c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-2.99-.79-1.54.02-2.96.9-3.75 2.27-1.6 2.78-.41 6.9 1.15 9.15.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.67zM14.1 5.98c.63-.77 1.06-1.83.94-2.89-.91.04-2.02.61-2.67 1.37-.59.68-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.28z" />
    </svg>
  );
}

const BOUTON =
  "flex min-h-12 w-full items-center justify-center gap-3 border-2 border-[#773331] px-4 font-mono text-xs font-black uppercase tracking-[.1em] transition disabled:opacity-60";

/**
 * Bouton officiel de Google, dessine par Google dans la page. La connexion
 * se fait dans sa fenetre, sans redirection par l'adresse technique de
 * Supabase : Google annonce donc nulll.club, et non « skyq….supabase.co ».
 */
function BoutonGoogleOfficiel({ onErreur, onIndisponible, sortie }: { onErreur: (message: string) => void; onIndisponible: () => void; sortie?: string }) {
  const conteneur = useRef<HTMLDivElement>(null);
  const [scriptPret, setScriptPret] = useState(false);
  const [connexion, setConnexion] = useState(false);

  useEffect(() => {
    const google = window.google;
    const element = conteneur.current;

    if (!scriptPret || !google || !element) return;

    let annule = false;
    let observateur: ResizeObserver | undefined;

    creerNonce().then(({ brut, hache }) => {
      if (annule) return;

      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        nonce: hache,
        ux_mode: "popup",
        callback: async ({ credential }: { credential: string }) => {
          setConnexion(true);
          onErreur("");

          const { error } = await createSupabaseBrowserClient().auth.signInWithIdToken({
            provider: "google",
            token: credential,
            nonce: brut
          });

          if (error) {
            setConnexion(false);
            onErreur("Connexion Google refusée. Réessaie ou passe par ton e-mail.");
            return;
          }

          window.location.assign(await destinationApresFournisseur(sortie));
        }
      });

      // Le bouton de Google a une largeur fixe, en pixels : on le redessine
      // quand son conteneur change de taille (rotation, fenetre retrecie),
      // sinon il debordait de l ecran.
      let largeur = 0;
      const dessiner = () => {
        const voulue = Math.max(200, Math.min(400, element.offsetWidth));
        if (Math.abs(voulue - largeur) < 8) return;
        largeur = voulue;
        element.replaceChildren();
        google.accounts.id.renderButton(element, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "center",
        locale: "fr",
        width: voulue
        });
      };

      dessiner();
      observateur = new ResizeObserver(dessiner);
      observateur.observe(element);
    });

    return () => {
      annule = true;
      observateur?.disconnect();
    };
  }, [scriptPret, onErreur, sortie]);

  return (
    <>
      <Script onError={onIndisponible} onReady={() => setScriptPret(true)} src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      {connexion ? (
        <p className={`${BOUTON} bg-white text-[#1f1f1f]`} role="status">
          Connexion en cours…
        </p>
      ) : (
        // Hauteur reservee : la page ne saute pas quand Google dessine son bouton.
        <div className="flex min-h-11 w-full justify-center" ref={conteneur} />
      )}
    </>
  );
}

/**
 * « Continuer avec Google / Apple ». Google passe par son bouton officiel ;
 * Apple, et Google si son script est bloque, par redirection vers
 * /auth/callback. Dans tous les cas, le profil se cree au premier passage
 * et la decharge se signe sur /membre/bienvenue.
 */
export function BoutonsSociaux({ google, apple, separateur, sortie }: { google: boolean; apple: boolean; separateur: string; sortie?: string }) {
  const [enCours, setEnCours] = useState<Fournisseur | null>(null);
  const [erreur, setErreur] = useState("");
  // Script Google bloque (bloqueur de publicite, reseau filtre) : on revient
  // au bouton par redirection, qui marche partout.
  const [googleParRedirection, setGoogleParRedirection] = useState(false);

  if (!google && !apple) {
    return null;
  }

  async function continuer(fournisseur: Fournisseur) {
    setEnCours(fournisseur);
    setErreur("");

    const { error } = await createSupabaseBrowserClient().auth.signInWithOAuth({
      provider: fournisseur,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destinationMembre(sortie))}` }
    });

    // En cas de succes, le navigateur part deja vers le fournisseur.
    if (error) {
      setErreur("Connexion impossible pour le moment. Réessaie ou passe par ton e-mail.");
      setEnCours(null);
    }
  }

  return (
    <div className="grid gap-3">
      {google && !googleParRedirection ? (
        <BoutonGoogleOfficiel onErreur={setErreur} onIndisponible={() => setGoogleParRedirection(true)} sortie={sortie} />
      ) : null}
      {google && googleParRedirection ? (
        <button className={`${BOUTON} bg-white text-[#1f1f1f] hover:bg-[#F1EDE9]`} disabled={enCours !== null} onClick={() => continuer("google")} type="button">
          <LogoGoogle />
          {enCours === "google" ? "Ouverture de Google…" : "Continuer avec Google"}
        </button>
      ) : null}
      {apple ? (
        <button className={`${BOUTON} bg-black text-white hover:bg-[#3A1A18]`} disabled={enCours !== null} onClick={() => continuer("apple")} type="button">
          <LogoApple />
          {enCours === "apple" ? "Ouverture d’Apple…" : "Continuer avec Apple"}
        </button>
      ) : null}
      {erreur ? (
        <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 text-sm font-bold" role="alert">
          {erreur}
        </p>
      ) : null}
      <p className="flex items-center gap-3 font-mono text-xs font-black uppercase tracking-[.14em]">
        <span aria-hidden="true" className="h-0.5 flex-1 bg-[#773331]" />
        {separateur}
        <span aria-hidden="true" className="h-0.5 flex-1 bg-[#773331]" />
      </p>
    </div>
  );
}
