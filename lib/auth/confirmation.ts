/**
 * Liens recus par e-mail (confirmation d'adresse, changement d'adresse,
 * mot de passe oublie). Le gabarit Supabase les envoie vers
 * /auth/confirmer#token_hash=…&type=…&next=… : apres le « # », le jeton ne
 * part ni au serveur, ni dans les journaux, ni dans l'en-tete Referer.
 *
 * Sans dependance : ce module est teste directement par node --test.
 */

/**
 * Duree de validite annoncee aux membres. Elle doit rester egale au
 * reglage « Email OTP Expiration » de Supabase (3600 s par defaut) et au
 * texte des gabarits de supabase/emails.
 */
export const DUREE_LIEN_EMAIL = "1 heure";

export const TYPES_LIEN = ["email", "email_change", "recovery"] as const;

export type TypeLien = (typeof TYPES_LIEN)[number];

export type LienEmail = { tokenHash: string; type: TypeLien; sortie: string | null };

const JETON = /^[A-Za-z0-9_-]{16,256}$/;
const SORTIE = /sortie(?:=|%3D)([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

export function typeLienValide(valeur: unknown): valeur is TypeLien {
  return typeof valeur === "string" && (TYPES_LIEN as readonly string[]).includes(valeur);
}

export function jetonValide(valeur: unknown): valeur is string {
  return typeof valeur === "string" && JETON.test(valeur);
}

/**
 * La sortie choisie avant l'inscription voyage dans l'adresse de retour
 * ({{ .RedirectTo }}), plus ou moins encodee selon le client mail. On n'en
 * garde que l'identifiant : aucun chemin venu du lien n'est suivi tel quel.
 */
export function sortieDepuisRetour(retour: string | null | undefined) {
  return retour?.match(SORTIE)?.[1] ?? null;
}

/** Lit « #token_hash=…&type=…&next=… ». null si le lien est incomplet ou altere. */
export function lireLienEmail(fragment: string): LienEmail | null {
  const parametres = new URLSearchParams(fragment.replace(/^#/, ""));
  const tokenHash = parametres.get("token_hash");
  const type = parametres.get("type");

  if (!jetonValide(tokenHash) || !typeLienValide(type)) {
    return null;
  }

  return { tokenHash, type, sortie: sortieDepuisRetour(parametres.get("next")) };
}

export function adresseEmailValide(valeur: string) {
  return valeur.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur);
}
