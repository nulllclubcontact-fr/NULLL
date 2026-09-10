/**
 * « Se souvenir de moi » decoche : ce cookie, sans duree, le rappelle a
 * chaque renouvellement de session, cote serveur comme cote navigateur.
 * Il n'est pas httpOnly : le client Supabase du navigateur doit le lire.
 */
export const MARQUEUR_SESSION_COURTE = "nulll_session_courte";

/**
 * Retire la duree d'un cookie : le navigateur l'oublie a sa fermeture.
 * @supabase/ssr impose 400 jours quelle que soit l'option passee, d'ou ce
 * filtre a l'ecriture. Une suppression (maxAge 0) reste une suppression.
 */
export function sansDuree<T extends { maxAge?: number; expires?: unknown }>(options: T): T {
  if (options?.maxAge === 0) {
    return options;
  }

  const copie = { ...options };
  delete copie.maxAge;
  delete copie.expires;
  return copie;
}
