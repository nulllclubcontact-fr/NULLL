import "server-only";
import { createSupabaseServiceClient } from "../supabase/service";
import { BUCKET_PHOTOS_SORTIES, cheminMiniature, DUREE_LIEN_SECONDES, nomTelechargement } from "./regles";

/** miniature : version legere pour les grilles (l'original si elle manque). */
export type PhotoSortie = { chemin: string; url: string; miniature: string; telechargement: string; nom: string };

/**
 * Photos d'une sortie avec des liens signes d'une heure. A n'appeler
 * qu'apres avoir verifie le droit d'acces (admin, ou inscrit de la sortie) :
 * la cle de service voit tout le bucket.
 */
export async function listerPhotosSortie(raceId: string, dateIso: string): Promise<PhotoSortie[] | null> {
  try {
    const stockage = createSupabaseServiceClient().storage.from(BUCKET_PHOTOS_SORTIES);
    const { data: fichiers, error } = await stockage.list(raceId, { limit: 1000, sortBy: { column: "created_at", order: "asc" } });
    // Bucket pas encore cree : aucune photo, ce n'est pas une panne.
    if (error) return error.message.toLowerCase().includes("not found") ? [] : null;

    const chemins = (fichiers ?? []).filter((f) => f.id && !f.name.startsWith(".")).map((f) => `${raceId}/${f.name}`);
    if (chemins.length === 0) return [];

    // Les miniatures existantes seulement : une photo envoyee sans (HEIC
    // illisible par le navigateur de l'admin) garde l'original en vignette.
    const { data: minis } = await stockage.list(`${raceId}/mini`, { limit: 1000 });
    const presentes = new Set((minis ?? []).map((f) => `${raceId}/mini/${f.name}`));
    const cheminsMinis = chemins.map(cheminMiniature).filter((c) => presentes.has(c));

    const { data: signes, error: erreurSignature } = await stockage.createSignedUrls([...chemins, ...cheminsMinis], DUREE_LIEN_SECONDES);
    if (erreurSignature || !signes) return null;
    const urlMinis = new Map(signes.slice(chemins.length).map((s) => [s.path, s.signedUrl]));

    return signes.slice(0, chemins.length).flatMap((signe, index) => {
      if (!signe.signedUrl || !signe.path) return [];
      const nom = nomTelechargement(dateIso, index, signe.path);
      const separateur = signe.signedUrl.includes("?") ? "&" : "?";
      const miniature = urlMinis.get(cheminMiniature(signe.path)) || signe.signedUrl;
      return [{ chemin: signe.path, url: signe.signedUrl, miniature, telechargement: `${signe.signedUrl}${separateur}download=${encodeURIComponent(nom)}`, nom }];
    });
  } catch {
    return null;
  }
}
