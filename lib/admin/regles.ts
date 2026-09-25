import type { RaceStatus } from "../races/types";

/**
 * Regles pures de l'administration : sans base, sans requete, donc
 * testables (lib/admin/regles.test.ts). Les actions serveur ne font que
 * lire le formulaire, appeler ces regles et ecrire.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Un identifiant mal forme ferait lever Postgres : on le refuse avant. */
export function identifiantValide(valeur: unknown): valeur is string {
  return typeof valeur === "string" && UUID.test(valeur);
}

export const STATUTS: RaceStatus[] = ["draft", "published", "closed", "completed", "cancelled"];

/** Un statut inconnu retombe sur « brouillon », jamais sur « publiée ». */
export function statutValide(valeur: string): RaceStatus {
  return (STATUTS as string[]).includes(valeur) ? (valeur as RaceStatus) : "draft";
}

/** Un titre donne un identifiant d'URL lisible et stable. */
export function slugifier(texte: string) {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Le slug doit rester unique : on suffixe avec la date plutot que de
 * laisser la base rejeter l'insertion sur un titre repete d'un mois a
 * l'autre.
 */
export function slugDeSortie(titre: string, depart: Date) {
  return `${slugifier(titre) || "sortie"}-${depart.toISOString().slice(0, 10)}`;
}

export const DISTANCE_MAX_KM = 100;
export const PLACES_MAX = 10000;

/**
 * Distance et places, lues et bornees. Number("abc") ou « -3 places »
 * partaient en base ou faisaient echouer l'insertion sans explication.
 */
export function bornerNombres(distanceBrute: string, maxBrut: string): { distance: number | null; max: number | null } | { error: string } {
  const distanceTexte = distanceBrute.trim().replace(",", ".");
  const maxTexte = maxBrut.trim();
  const distance = distanceTexte ? Number(distanceTexte) : null;
  const max = maxTexte ? Number(maxTexte) : null;

  if (distance !== null && (!Number.isFinite(distance) || distance <= 0 || distance > DISTANCE_MAX_KM)) {
    return { error: `Distance invalide : entre 0 et ${DISTANCE_MAX_KM} km.` };
  }

  if (max !== null && (!Number.isInteger(max) || max < 1 || max > PLACES_MAX)) {
    return { error: "Places max : un nombre entier positif." };
  }

  return { distance, max };
}

/**
 * Transitions de statut permises depuis la liste des sorties. La fiche
 * complete accepte tout ; les raccourcis, seulement ce qui avance.
 */
export const TRANSITIONS_RAPIDES: Record<RaceStatus, RaceStatus[]> = {
  draft: ["published"],
  published: ["closed", "completed"],
  closed: ["completed"],
  completed: [],
  cancelled: []
};

export function transitionRapidePermise(depuis: RaceStatus, vers: RaceStatus) {
  return TRANSITIONS_RAPIDES[depuis]?.includes(vers) ?? false;
}

/**
 * Une session admin ne vaut que douze heures apres la connexion, quelle
 * que soit la duree du cookie membre : un appareil oublie n'expose pas
 * l'administration jusqu'a l'annee prochaine. La session membre, elle,
 * continue.
 */
export const DUREE_SESSION_ADMIN_MS = 12 * 60 * 60 * 1000;

export function sessionAdminExpiree(derniereConnexion: string | null | undefined, maintenant: number) {
  if (!derniereConnexion) return true;
  const depuis = Date.parse(derniereConnexion);
  if (!Number.isFinite(depuis)) return true;
  return maintenant - depuis > DUREE_SESSION_ADMIN_MS;
}

/** Une sortie dupliquee part une semaine plus tard, meme heure de Paris. */
export function departSemaineSuivante(depart: string) {
  return new Date(Date.parse(depart) + 7 * 24 * 60 * 60 * 1000);
}

/** Un code TOTP, c'est six chiffres, rien d'autre : espaces toleres. */
export function codeTotpValide(valeur: string) {
  return /^\d{6}$/.test(valeur.replace(/\s+/g, ""));
}
