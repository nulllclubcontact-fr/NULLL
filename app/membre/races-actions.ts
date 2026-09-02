"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { MESSAGES_INSCRIPTION, type RegisterOutcome } from "../../lib/races/types";

export type InscriptionState = {
  error?: string;
  message?: string;
};

function lire(formData: FormData, cle: string) {
  const valeur = formData.get(cle);
  return typeof valeur === "string" ? valeur.trim() : "";
}

/**
 * S'inscrire a une sortie.
 *
 * Tout le travail est fait par la fonction SQL : elle verrouille la
 * course, verifie le statut, la date limite, la capacite et le doublon
 * dans la meme transaction que l'ecriture. Ici on ne fait que traduire
 * sa reponse — aucune de ces regles n'est rejouee cote serveur Next, ou
 * elles pourraient diverger.
 */
export async function registerForRace(_previousState: InscriptionState, formData: FormData): Promise<InscriptionState> {
  const raceId = lire(formData, "race_id");

  if (!raceId) {
    return { error: "Sortie introuvable." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Inscription indisponible pour le moment." };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: MESSAGES_INSCRIPTION.not_authenticated };
  }

  const { data, error } = await supabase.rpc("register_for_race", { p_race_id: raceId });

  if (error || !data) {
    return { error: "Inscription impossible pour le moment. Réessaie." };
  }

  const resultat = data as RegisterOutcome;
  const texte = MESSAGES_INSCRIPTION[resultat.reason] ?? "Inscription impossible.";

  revalidatePath("/membre");
  revalidatePath("/membre/sorties");

  return resultat.ok ? { message: texte } : { error: texte };
}

/** Annuler sa propre inscription, tant que la sortie n'a pas commence. */
export async function cancelRegistration(_previousState: InscriptionState, formData: FormData): Promise<InscriptionState> {
  const registrationId = lire(formData, "registration_id");

  if (!registrationId) {
    return { error: "Inscription introuvable." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Annulation indisponible pour le moment." };
  }

  const { data, error } = await supabase.rpc("cancel_registration", { p_registration_id: registrationId });

  if (error || !data) {
    return { error: "Annulation impossible pour le moment." };
  }

  const resultat = data as { ok: boolean; reason?: string };

  if (!resultat.ok) {
    const raisons: Record<string, string> = {
      already_checked_in: "Tu as déjà été scanné sur cette sortie.",
      race_started: "Cette sortie a déjà commencé.",
      not_found: "Inscription introuvable.",
      not_authenticated: "Connecte-toi d’abord."
    };
    return { error: raisons[resultat.reason ?? ""] ?? "Annulation impossible." };
  }

  revalidatePath("/membre");
  revalidatePath("/membre/sorties");

  return { message: "Inscription annulée. Tu peux te réinscrire tant que la sortie est ouverte." };
}
