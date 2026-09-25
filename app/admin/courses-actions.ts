"use server";

import { heureDeParis } from "../../lib/heure-paris";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "../../lib/admin/require-admin";
import { journaliser } from "../../lib/admin/journal";
import { bornerNombres, departSemaineSuivante, identifiantValide, slugDeSortie, statutValide, transitionRapidePermise } from "../../lib/admin/regles";
import { supabaseUrl } from "../../lib/supabase/config";
import { createSupabaseServiceClient } from "../../lib/supabase/service";
import type { CheckinOutcome, RaceStatus } from "../../lib/races/types";

/**
 * valeurs : ce que l'admin avait saisi quand la creation a ete refusee.
 * React vide un formulaire non controle apres chaque action ; sans ce
 * rappel, une distance mal tapee coutait tout le reste du formulaire.
 */
export type CourseState = { error?: string; message?: string; cle?: number; valeurs?: Record<string, string> };
export type ScanState = { resultat?: CheckinOutcome; error?: string };
export type EnvoiPhoto = { ok: true; path: string; token: string; url: string } | { ok: false; error: string };

const BUCKET_PHOTOS = "sorties";
const TYPES_PHOTO: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif"
};
const POIDS_MAX_PHOTO = 10 * 1024 * 1024;
const PREFIXE_PHOTOS = `${supabaseUrl}/storage/v1/object/public/${BUCKET_PHOTOS}/`;

function lire(formData: FormData, cle: string, max = 400) {
  const valeur = formData.get(cle);
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

/** Accueil et page « Sorties » lisent la base : on les regenere tout de suite. */
function rafraichirPagesPubliques() {
  revalidatePath("/fr");
  revalidatePath("/fr/runs");
}

/** N'accepte qu'une photo deposee dans notre bucket, jamais une URL arbitraire. */
function lirePhoto(formData: FormData) {
  const url = lire(formData, "cover_image_url", 500);
  return url.startsWith(PREFIXE_PHOTOS) ? url : null;
}

async function supprimerPhoto(url: string | null) {
  if (!url?.startsWith(PREFIXE_PHOTOS)) return;
  await createSupabaseServiceClient().storage.from(BUCKET_PHOTOS).remove([url.slice(PREFIXE_PHOTOS.length)]);
}

/**
 * Prepare l'envoi d'une photo. Le fichier part ensuite du navigateur
 * directement vers Supabase, par une URL signee a usage unique : il ne
 * transite pas par le serveur, dont Vercel plafonne les requetes a 4,5 Mo.
 */
export async function preparerEnvoiPhoto(type: string, poids: number): Promise<EnvoiPhoto> {
  const admin = await isAdminUser();

  if (!admin) {
    return { ok: false, error: "Accès refusé." };
  }

  const extension = TYPES_PHOTO[type];

  if (!extension) {
    return { ok: false, error: "Photo en JPG, PNG, WebP ou AVIF." };
  }

  if (poids > POIDS_MAX_PHOTO) {
    return { ok: false, error: "Photo trop lourde : 10 Mo maximum." };
  }

  const service = createSupabaseServiceClient();

  // Le bucket se cree au premier envoi : rien a configurer dans Supabase.
  const { data: bucket } = await service.storage.getBucket(BUCKET_PHOTOS);

  if (!bucket) {
    const { error } = await service.storage.createBucket(BUCKET_PHOTOS, {
      public: true,
      fileSizeLimit: POIDS_MAX_PHOTO,
      allowedMimeTypes: Object.keys(TYPES_PHOTO)
    });

    if (error && !error.message.toLowerCase().includes("exist")) {
      return { ok: false, error: "Stockage des photos indisponible." };
    }
  }

  const path = `${crypto.randomUUID()}.${extension}`;
  const { data, error } = await service.storage.from(BUCKET_PHOTOS).createSignedUploadUrl(path);

  if (error || !data) {
    return { ok: false, error: "Envoi impossible. Réessaie." };
  }

  return { ok: true, path, token: data.token, url: `${PREFIXE_PHOTOS}${path}` };
}

export async function createRace(_previousState: CourseState, formData: FormData): Promise<CourseState> {
  const admin = await isAdminUser();

  if (!admin) {
    return { error: "Accès refusé." };
  }

  const title = lire(formData, "title", 120);
  const start = lire(formData, "start_datetime", 40);
  const valeurs = Object.fromEntries(
    ["title", "start_datetime", "description", "location", "address", "distance_km", "max_participants", "status"].map((cle) => [cle, lire(formData, cle, 2000)])
  );

  if (!title || !start) {
    return { error: "Un titre et une date de départ, au minimum.", valeurs };
  }

  // Le champ datetime-local n'a pas de fuseau : « 08:30 » veut dire 8h30 a
  // Paris, pas a l'heure du serveur (UTC sur Vercel, soit 10h30 a Paris).
  const depart = heureDeParis(start);

  if (!depart) {
    return { error: "Date de départ illisible.", valeurs };
  }

  const nombres = bornerNombres(lire(formData, "distance_km", 12), lire(formData, "max_participants", 8));

  if ("error" in nombres) {
    return { error: nombres.error, valeurs };
  }

  const statut = statutValide(lire(formData, "status", 20));
  const slug = slugDeSortie(title, depart);

  const { data: creee, error } = await admin.supabase
    .from("races")
    .insert({
      title,
      slug,
      description: lire(formData, "description", 2000) || null,
      location: lire(formData, "location", 160) || null,
      address: lire(formData, "address", 240) || null,
      start_datetime: depart.toISOString(),
      distance_km: nombres.distance,
      max_participants: nombres.max,
      registration_open: formData.get("registration_open") === "on",
      status: statut,
      cover_image_url: lirePhoto(formData)
    })
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error) {
    return { error: error.message.includes("duplicate") ? "Une sortie porte déjà ce nom ce jour-là." : "Création refusée.", valeurs };
  }

  await journaliser(admin.user.id, "sortie.creation", creee?.id ?? slug, { titre: title, statut });
  revalidatePath("/admin/courses");
  revalidatePath("/admin/dashboard");
  rafraichirPagesPubliques();

  // Direction la fiche : c'est la qu'on verifie, qu'on ajoute la photo et
  // qu'on publie, sans chercher la sortie dans la liste.
  if (creee) {
    redirect(`/admin/courses/${creee.id}?creee=1`);
  }

  return { message: "Sortie créée.", cle: Date.now() };
}

/** Modifier une sortie existante : titre, date, lieu, distance, places, statut. */
export async function modifierCourse(_previousState: CourseState, formData: FormData): Promise<CourseState> {
  const admin = await isAdminUser();

  if (!admin) {
    return { error: "Accès refusé." };
  }

  const id = lire(formData, "race_id", 40);
  const title = lire(formData, "title", 120);
  const start = lire(formData, "start_datetime", 40);

  if (!identifiantValide(id)) {
    return { error: "Sortie introuvable." };
  }

  if (!title || !start) {
    return { error: "Un titre et une date de départ, au minimum." };
  }

  const depart = heureDeParis(start);

  if (!depart) {
    return { error: "Date de départ illisible." };
  }

  const nombres = bornerNombres(lire(formData, "distance_km", 12), lire(formData, "max_participants", 8));

  if ("error" in nombres) {
    return { error: nombres.error };
  }

  const statut = statutValide(lire(formData, "status", 20));

  const { error } = await admin.supabase
    .from("races")
    .update({
      title,
      description: lire(formData, "description", 2000) || null,
      location: lire(formData, "location", 160) || null,
      address: lire(formData, "address", 240) || null,
      start_datetime: depart.toISOString(),
      distance_km: nombres.distance,
      max_participants: nombres.max,
      registration_open: formData.get("registration_open") === "on",
      status: statut
    })
    .eq("id", id);

  if (error) {
    return { error: "Enregistrement refusé. Réessaie." };
  }

  await journaliser(admin.user.id, "sortie.modification", id, { titre: title, statut });
  revalidatePath(`/admin/courses/${id}`);
  revalidatePath("/admin/courses");
  revalidatePath("/admin/dashboard");
  rafraichirPagesPubliques();
  return { message: "Sortie modifiée." };
}

/** Raccourci depuis la liste : publier, fermer, terminer, sans ouvrir la fiche. */
export async function setRaceStatus(formData: FormData) {
  const admin = await isAdminUser();

  if (!admin) {
    redirect("/membre");
  }

  const id = lire(formData, "race_id", 40);
  const statut = lire(formData, "status", 20);

  // Le raccourci n'avance que dans un sens : publier, fermer, terminer.
  // Rouvrir une sortie terminee passe par la fiche, en connaissance de cause.
  if (identifiantValide(id) && statutValide(statut) === statut) {
    const { data: avant } = await admin.supabase.from("races").select("status").eq("id", id).maybeSingle<{ status: RaceStatus }>();

    if (avant && transitionRapidePermise(avant.status, statut as RaceStatus)) {
      const { error } = await admin.supabase.from("races").update({ status: statut }).eq("id", id);

      if (!error) {
        await journaliser(admin.user.id, "sortie.statut", id, { de: avant.status, vers: statut });
      }
    }
  }

  revalidatePath("/admin/courses");
  revalidatePath("/admin/dashboard");
  rafraichirPagesPubliques();
}

/** Ajoute, remplace ou retire la photo d'une sortie existante. */
export async function changerPhotoCourse(_previousState: CourseState, formData: FormData): Promise<CourseState> {
  const admin = await isAdminUser();

  if (!admin) {
    return { error: "Accès refusé." };
  }

  const id = lire(formData, "race_id", 40);

  if (!identifiantValide(id)) {
    return { error: "Sortie manquante." };
  }

  const { data: avant } = await admin.supabase.from("races").select("cover_image_url").eq("id", id).maybeSingle<{ cover_image_url: string | null }>();
  const photo = lirePhoto(formData);
  const { error } = await admin.supabase.from("races").update({ cover_image_url: photo }).eq("id", id);

  if (error) {
    return { error: "Enregistrement refusé." };
  }

  if (avant?.cover_image_url && avant.cover_image_url !== photo) {
    await supprimerPhoto(avant.cover_image_url);
  }

  await journaliser(admin.user.id, "sortie.photo", id, { photo: photo ? "ajoutee" : "retiree" });
  revalidatePath(`/admin/courses/${id}`);
  revalidatePath("/admin/courses");
  rafraichirPagesPubliques();
  return { message: photo ? "Photo enregistrée." : "Photo retirée." };
}

/**
 * Supprime une sortie sans inscrit ; la photo est retiree du stockage.
 * Une sortie qui a des inscrits est annulee plutot qu'effacee : la
 * suppression emportait en cascade leurs inscriptions et l'historique des
 * scans, que la politique de confidentialite promet de garder.
 */
export async function supprimerCourse(formData: FormData) {
  const admin = await isAdminUser();

  if (!admin) {
    redirect("/membre");
  }

  const id = lire(formData, "race_id", 40);

  if (identifiantValide(id)) {
    const { count } = await admin.supabase
      .from("race_registrations")
      .select("id", { count: "exact", head: true })
      .eq("race_id", id);

    if (count) {
      const { error } = await admin.supabase.from("races").update({ status: "cancelled" }).eq("id", id);

      if (!error) {
        await journaliser(admin.user.id, "sortie.annulation", id, { inscrits: count });
      }
    } else {
      const { data: course } = await admin.supabase.from("races").select("title,cover_image_url").eq("id", id).maybeSingle<{ title: string; cover_image_url: string | null }>();
      const { error } = await admin.supabase.from("races").delete().eq("id", id);

      if (!error) {
        await supprimerPhoto(course?.cover_image_url ?? null);
        await journaliser(admin.user.id, "sortie.suppression", id, { titre: course?.title ?? null });
      }
    }
  }

  revalidatePath("/admin/courses");
  revalidatePath("/admin/dashboard");
  rafraichirPagesPubliques();
  redirect("/admin/courses");
}

/** Inscrits (hors annulations) et scannes d'une sortie, pour l'ecran du scanner. */
export async function compterSortie(raceId: string): Promise<{ inscrits: number; scannes: number } | null> {
  const admin = await isAdminUser();

  if (!admin || !identifiantValide(raceId)) {
    return null;
  }

  const compter = () => admin.supabase.from("race_registrations").select("id", { count: "exact", head: true }).eq("race_id", raceId);
  const [inscrits, scannes] = await Promise.all([compter().neq("status", "cancelled"), compter().eq("checked_in", true)]);

  if (inscrits.error || scannes.error) {
    return null;
  }

  return { inscrits: inscrits.count ?? 0, scannes: scannes.count ?? 0 };
}

/**
 * Pointer un participant.
 *
 * Toute la decision revient a la fonction SQL : elle verrouille
 * l'inscription, compare la course, trace le scan dans checkins et ne
 * met a jour la presence que si tout concorde. On ne fait que traduire.
 */
export async function scanRegistration(_previousState: ScanState, formData: FormData): Promise<ScanState> {
  const admin = await isAdminUser();

  if (!admin) {
    return { error: "Accès refusé." };
  }

  const token = lire(formData, "token", 200);
  const raceId = lire(formData, "race_id", 40);

  if (!token || !identifiantValide(raceId)) {
    return { error: "QR ou sortie manquants." };
  }

  const { data, error } = await admin.supabase.rpc("checkin_by_token", {
    p_token: token,
    p_race_id: raceId
  });

  if (error || !data) {
    return { error: "Scan impossible. Réessaie." };
  }

  const resultat = data as CheckinOutcome;
  revalidatePath(`/admin/courses/${raceId}`);

  return { resultat };
}

/**
 * Pointer a la main, depuis la fiche : telephone decharge, QR illisible.
 * Meme fonction de decision cote SQL que le scan (migration 0014), meme
 * trace dans checkins, avec la note « manuel ».
 */
export async function pointerInscription(formData: FormData) {
  const admin = await isAdminUser();

  if (!admin) {
    redirect("/membre");
  }

  const id = lire(formData, "registration_id", 40);
  const raceId = lire(formData, "race_id", 40);

  if (identifiantValide(id)) {
    await admin.supabase.rpc("pointer_inscription", { p_registration_id: id });
  }

  if (identifiantValide(raceId)) {
    revalidatePath(`/admin/courses/${raceId}`);
  }
}

/**
 * Dupliquer une sortie : meme titre, meme lieu, meme distance, une
 * semaine plus tard, en brouillon. Sans la photo : deux sorties qui
 * partagent un fichier, et retirer la photo de l'une efface celle de
 * l'autre.
 */
export async function dupliquerCourse(formData: FormData) {
  const admin = await isAdminUser();

  if (!admin) {
    redirect("/membre");
  }

  const id = lire(formData, "race_id", 40);

  if (!identifiantValide(id)) {
    redirect("/admin/courses");
  }

  const { data: source } = await admin.supabase
    .from("races")
    .select("title,description,location,address,city,start_datetime,distance_km,max_participants")
    .eq("id", id)
    .maybeSingle<{
      title: string;
      description: string | null;
      location: string | null;
      address: string | null;
      city: string | null;
      start_datetime: string;
      distance_km: number | null;
      max_participants: number | null;
    }>();

  if (!source) {
    redirect("/admin/courses");
  }

  const depart = departSemaineSuivante(source.start_datetime);
  const { data: copie, error } = await admin.supabase
    .from("races")
    .insert({
      title: source.title,
      slug: slugDeSortie(source.title, depart),
      description: source.description,
      location: source.location,
      address: source.address,
      city: source.city,
      start_datetime: depart.toISOString(),
      distance_km: source.distance_km,
      max_participants: source.max_participants,
      registration_open: true,
      status: "draft",
      cover_image_url: null
    })
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error || !copie) {
    redirect(`/admin/courses/${id}?erreur=${error?.message.includes("duplicate") ? "doublon" : "duplication"}`);
  }

  await journaliser(admin.user.id, "sortie.creation", copie.id, { titre: source.title, statut: "draft", dupliquee_de: id });
  revalidatePath("/admin/courses");
  revalidatePath("/admin/dashboard");
  redirect(`/admin/courses/${copie.id}?creee=1`);
}
