/**
 * Photos des sorties : regles pures (testees dans regles.test.ts).
 * Les photos vivent dans un bucket prive, un dossier par sortie. Seuls
 * les inscrits de la sortie (et l'admin) obtiennent des liens signes.
 */

export const BUCKET_PHOTOS_SORTIES = "photos-sorties";
export const POIDS_MAX_PHOTO_SORTIE = 20 * 1024 * 1024;
export const TYPES_PHOTO_SORTIE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic"
};
/** Duree de vie d'un lien de telechargement : le temps de tout recuperer. */
export const DUREE_LIEN_SECONDES = 60 * 60;

/** Un inscrit qui n'a pas annule a acces aux photos ; un absent aussi n'a rien a voir ici. */
export function inscriptionDonneAcces(statut: string | null | undefined): boolean {
  return statut === "registered" || statut === "checked_in";
}

export function cheminPhoto(raceId: string, identifiant: string, extension: string): string {
  return `${raceId}/${identifiant}.${extension}`;
}

/** Le chemin appartient bien au dossier de cette sortie (pas de ../ ni d'autre dossier). */
export function cheminDeLaSortie(chemin: string, raceId: string): boolean {
  return chemin.startsWith(`${raceId}/`) && !chemin.includes("..") && chemin.split("/").length === 2 && chemin.length < 200;
}

/** Nom du fichier telecharge : nulll-club-2026-10-03-07.jpg */
export function nomTelechargement(dateIso: string, index: number, chemin: string): string {
  const jour = dateIso.slice(0, 10);
  const extension = chemin.split(".").pop()?.toLowerCase() || "jpg";
  return `nulll-club-${jour}-${String(index + 1).padStart(2, "0")}.${extension}`;
}
