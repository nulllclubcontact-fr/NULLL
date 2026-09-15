"use server";

import { headers } from "next/headers";
import { adresseEmailValide, jetonValide, typeLienValide } from "../../lib/auth/confirmation";
import { adresseAppelant, essaiAutorise } from "../../lib/limite";
import { destinationMembre, sortieValide, suiteSortie } from "../../lib/races/sortie-choisie";
import { createSupabaseServerClient } from "../../lib/supabase/server";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nulll.club";

/** Delai impose par Supabase entre deux envois a la meme adresse. */
const DELAI_RENVOI_SECONDES = 60;

export type ConfirmationState = {
  resultat?: "confirme" | "expire" | "reseau";
  destination?: string;
};

export type RenvoiState = {
  message?: string;
  error?: string;
  /** Horodatage de l'envoi : le bouton reste bloque le temps du delai. */
  envoyeA?: number;
};

/**
 * Adresse de retour passee a Supabase. Elle sert deux gabarits : l'ancien
 * ({{ .ConfirmationURL }}, qui renvoie vers /auth/callback avec un code) et
 * le nouveau, qui n'en lit que la sortie choisie.
 */
export async function adresseRetourInscription(sortie: unknown) {
  return `${SITE}/auth/callback?next=${encodeURIComponent(destinationMembre(sortie))}`;
}

/**
 * Consomme le jeton du lien recu par e-mail. Appelee par le bouton de
 * /auth/confirmer, jamais a l'ouverture de la page : les antivirus des
 * messageries qui ouvrent les liens a l'avance ne grillent donc rien.
 * verifyOtp avec token_hash ne depend d'aucun cookie pose a l'inscription :
 * le lien marche aussi sur un autre appareil que celui de l'inscription.
 */
export async function confirmerLienEmail(_etat: ConfirmationState, formData: FormData): Promise<ConfirmationState> {
  const tokenHash = formData.get("token_hash");
  const type = formData.get("type");
  const sortie = formData.get("sortie");

  if (!jetonValide(tokenHash) || !typeLienValide(type)) {
    return { resultat: "expire" };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { resultat: "reseau" };
  }

  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

  if (error) {
    // Supabase injoignable ou en panne : le jeton n'a pas servi, on peut
    // reessayer avec le meme lien.
    const panne = error.name === "AuthRetryableFetchError" || (typeof error.status === "number" && (error.status === 0 || error.status >= 500));
    return { resultat: panne ? "reseau" : "expire" };
  }

  return {
    resultat: "confirme",
    destination: type === "recovery" ? "/membre/mot-de-passe" : destinationMembre(sortieValide(sortie) ? sortie : null)
  };
}

/**
 * Renvoie l'e-mail de confirmation. Meme reponse que l'adresse ait un
 * compte ou non : on ne revele pas qui est inscrit. Deux limites en base,
 * par adresse et par connexion, en plus de celle de Supabase.
 */
export async function renvoyerConfirmation(_etat: RenvoiState, formData: FormData): Promise<RenvoiState> {
  const saisie = formData.get("email");
  const email = typeof saisie === "string" ? saisie.trim().toLowerCase() : "";
  const sortie = formData.get("sortie");

  if (!adresseEmailValide(email)) {
    return { error: "Adresse e-mail illisible. Vérifie-la." };
  }

  const appelant = adresseAppelant(await headers());
  const autorise = (await essaiAutorise("renvoi-confirmation-ip", appelant, 3600, 10)) && (await essaiAutorise("renvoi-confirmation", email, 3600, 3));

  if (!autorise) {
    return { error: "Trop de demandes pour le moment. Réessaie dans une heure." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Envoi impossible pour le moment. Réessaie dans un instant." };
  }

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: await adresseRetourInscription(sortieValide(sortie) ? sortie : null) }
  });

  if (error) {
    if (error.status === 429 || error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit") {
      return { error: `Un mail vient déjà de partir. Attends ${DELAI_RENVOI_SECONDES} secondes avant d’en redemander un.` };
    }

    if (error.name === "AuthRetryableFetchError" || (typeof error.status === "number" && (error.status === 0 || error.status >= 500))) {
      return { error: "Envoi impossible pour le moment. Réessaie dans un instant." };
    }
  }

  return {
    message: "Si un compte attend une confirmation avec cette adresse, un nouveau mail vient de partir. Regarde aussi dans les spams.",
    envoyeA: Date.now()
  };
}

/** Lien de retour vers la connexion, sortie choisie comprise. */
export async function lienConnexion(sortie: unknown) {
  return `/membre/login${suiteSortie(sortie)}`;
}
