import "server-only";

import { hasSupabasePublicEnv, supabaseAnonKey, supabaseUrl } from "../supabase/config";

export type FournisseursAuth = { telephone: boolean; google: boolean; apple: boolean };

const AUCUN: FournisseursAuth = { telephone: false, google: false, apple: false };

/**
 * Moyens de connexion actives dans Supabase (Authentication > Providers).
 * Un bouton n'apparait que si son fournisseur est allume : jamais de
 * bouton qui mene a une erreur. La reponse est gardee cinq minutes.
 */
export async function fournisseursAuth(): Promise<FournisseursAuth> {
  if (!hasSupabasePublicEnv()) {
    return AUCUN;
  }

  try {
    const reponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: supabaseAnonKey },
      next: { revalidate: 300 }
    });

    if (!reponse.ok) {
      return AUCUN;
    }

    const { external } = (await reponse.json()) as { external?: Record<string, boolean> };

    return {
      telephone: external?.phone === true,
      google: external?.google === true,
      apple: external?.apple === true
    };
  } catch {
    return AUCUN;
  }
}
