"use server";

import { revalidatePath } from "next/cache";
import { journaliser } from "../../lib/admin/journal";
import { identifiantValide } from "../../lib/admin/regles";
import { isAdminUser } from "../../lib/admin/require-admin";
import { envoyerPhotosDisponibles } from "../../lib/email/photos-sortie";
import {
  BUCKET_PHOTOS_SORTIES,
  cheminDeLaSortie,
  cheminPhoto,
  POIDS_MAX_PHOTO_SORTIE,
  TYPES_PHOTO_SORTIE
} from "../../lib/photos-sorties/regles";
import { createSupabaseServiceClient } from "../../lib/supabase/service";

export type EnvoiPhotoSortie = { ok: true; path: string; token: string } | { ok: false; error: string };
export type PhotosSortieState = { message?: string; error?: string };

function rafraichir(raceId: string) {
  revalidatePath(`/admin/courses/${raceId}`);
  revalidatePath(`/membre/sorties/${raceId}/photos`);
}

/**
 * Prepare l'envoi d'une photo de sortie : URL signee a usage unique, le
 * fichier part du navigateur directement vers le bucket prive. Le bucket
 * se cree au premier envoi, prive : aucune photo n'a d'adresse publique.
 */
export async function preparerEnvoiPhotoSortie(raceId: string, type: string, poids: number): Promise<EnvoiPhotoSortie> {
  const admin = await isAdminUser();
  if (!admin) return { ok: false, error: "Accès refusé." };
  if (!identifiantValide(raceId)) return { ok: false, error: "Sortie manquante." };

  const extension = TYPES_PHOTO_SORTIE[type];
  if (!extension) return { ok: false, error: "Photo en JPG, PNG, WebP ou HEIC." };
  if (poids > POIDS_MAX_PHOTO_SORTIE) return { ok: false, error: "Photo trop lourde : 20 Mo maximum." };

  const service = createSupabaseServiceClient();
  const { data: bucket } = await service.storage.getBucket(BUCKET_PHOTOS_SORTIES);
  if (!bucket) {
    const { error } = await service.storage.createBucket(BUCKET_PHOTOS_SORTIES, {
      public: false,
      fileSizeLimit: POIDS_MAX_PHOTO_SORTIE,
      allowedMimeTypes: Object.keys(TYPES_PHOTO_SORTIE)
    });
    if (error && !error.message.toLowerCase().includes("exist")) return { ok: false, error: "Stockage des photos indisponible." };
  }

  const path = cheminPhoto(raceId, crypto.randomUUID(), extension);
  const { data, error } = await service.storage.from(BUCKET_PHOTOS_SORTIES).createSignedUploadUrl(path);
  if (error || !data) return { ok: false, error: "Envoi impossible. Réessaie." };

  return { ok: true, path, token: data.token };
}

/** Appelee une fois un lot d'envois termine : trace et rafraichissement. */
export async function noterPhotosEnvoyees(raceId: string, nombre: number): Promise<void> {
  const admin = await isAdminUser();
  if (!admin || !identifiantValide(raceId) || !Number.isInteger(nombre) || nombre < 1) return;
  await journaliser(admin.user.id, "sortie.photos.ajout", raceId, { nombre: Math.min(nombre, 1000) });
  rafraichir(raceId);
}

export async function supprimerPhotoSortie(_precedent: PhotosSortieState, formData: FormData): Promise<PhotosSortieState> {
  const admin = await isAdminUser();
  if (!admin) return { error: "Accès refusé." };

  const raceId = String(formData.get("race_id") ?? "");
  const chemin = String(formData.get("chemin") ?? "");
  if (!identifiantValide(raceId) || !cheminDeLaSortie(chemin, raceId)) return { error: "Photo introuvable." };

  const { error } = await createSupabaseServiceClient().storage.from(BUCKET_PHOTOS_SORTIES).remove([chemin]);
  if (error) return { error: "Suppression refusée." };

  await journaliser(admin.user.id, "sortie.photos.suppression", raceId, { chemin });
  rafraichir(raceId);
  return { message: "Photo supprimée." };
}

export async function prevenirInscritsPhotos(_precedent: PhotosSortieState, formData: FormData): Promise<PhotosSortieState> {
  const admin = await isAdminUser();
  if (!admin) return { error: "Accès refusé." };

  const raceId = String(formData.get("race_id") ?? "");
  if (!identifiantValide(raceId)) return { error: "Sortie manquante." };

  const resultat = await envoyerPhotosDisponibles(raceId);
  if ("erreur" in resultat) return { error: resultat.erreur };

  await journaliser(admin.user.id, "sortie.photos.mail", raceId, resultat);
  const sans = resultat.sansEmail ? ` ${resultat.sansEmail} inscrit(s) sans adresse email.` : "";
  return { message: `${resultat.envoyes} mail(s) envoyé(s).${sans}` };
}
