import "server-only";

import { createHash } from "node:crypto";
import { createSupabaseServiceClient } from "./supabase/service";

/**
 * Limiteur partage entre toutes les instances, compte en base
 * (migration 0008). Les anciens compteurs en memoire ne freinaient qu'une
 * instance serverless a la fois.
 *
 * En cas de panne de la base, on laisse passer : bloquer tout le monde
 * parce que le compteur est injoignable serait pire que l'abus qu'il freine.
 */
export async function essaiAutorise(espace: string, identite: string, fenetreSecondes: number, max: number) {
  try {
    const { data, error } = await createSupabaseServiceClient().rpc("consommer_limite", {
      p_cle: cle(espace, identite),
      p_fenetre_secondes: fenetreSecondes,
      p_max: max
    });

    return error ? true : data !== false;
  } catch {
    return true;
  }
}

/** Remet le compteur a zero, par exemple apres une connexion reussie. */
export async function oublierEssais(espace: string, identite: string) {
  try {
    await createSupabaseServiceClient().rpc("effacer_limite", { p_cle: cle(espace, identite) });
  } catch {
    // Le compteur expirera de lui-meme.
  }
}

/**
 * L'adresse de l'appelant, seule : un en-tete choisi par l'appelant, comme
 * le user-agent, se change a volonte et rendrait la limite inutile.
 */
export function adresseAppelant(entetes: Headers) {
  return entetes.get("x-forwarded-for")?.split(",")[0]?.trim() || entetes.get("x-real-ip")?.trim() || "local";
}

function cle(espace: string, identite: string) {
  return `${espace}:${createHash("sha256").update(identite).digest("hex")}`;
}
