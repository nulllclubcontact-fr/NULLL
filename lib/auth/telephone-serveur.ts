import "server-only";

import { hasSupabasePublicEnv, supabaseAnonKey, supabaseUrl } from "../supabase/config";

/**
 * L'option telephone n'apparait qu'une fois activee dans Supabase
 * (Authentication > Providers > Phone) : jamais de bouton qui mene a une
 * erreur. La reponse est gardee cinq minutes.
 */
export async function telephoneDisponible(): Promise<boolean> {
  if (!hasSupabasePublicEnv()) {
    return false;
  }

  try {
    const reponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: supabaseAnonKey },
      next: { revalidate: 300 }
    });

    if (!reponse.ok) {
      return false;
    }

    const reglages = (await reponse.json()) as { external?: { phone?: boolean } };
    return reglages.external?.phone === true;
  } catch {
    return false;
  }
}
