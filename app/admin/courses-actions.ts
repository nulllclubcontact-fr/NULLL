"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "../../lib/admin/require-admin";
import { supabaseUrl } from "../../lib/supabase/config";
import { createSupabaseServiceClient } from "../../lib/supabase/service";
import type { CheckinOutcome, RaceStatus } from "../../lib/races/types";

export type CourseState = { error?: string; message?: string; cle?: number };
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

/** Un titre donne un identifiant d'URL lisible et stable. */
function slugifier(texte: string) {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const STATUTS: RaceStatus[] = ["draft", "published", "closed", "completed", "cancelled"];

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

const HEURE_PARIS = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Paris",
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

/** « 2026-09-26T08:30 », lu comme une heure de Paris, en instant UTC. */
function heureDeParis(valeur: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(valeur);

  if (!m) {
    return null;
  }

  const [annee, mois, jour, heure, minute] = m.slice(1).map(Number);
  const commeUtc = Date.UTC(annee, mois - 1, jour, heure, minute);
  const parties = Object.fromEntries(HEURE_PARIS.formatToParts(new Date(commeUtc)).map((p) => [p.type, p.value]));
  const vuAParis = Date.UTC(+parties.year, +parties.month - 1, +parties.day, +parties.hour, +parties.minute);
  const resultat = new Date(commeUtc - (vuAParis - commeUtc));

  return Number.isNaN(resultat.getTime()) ? null : resultat;
}

export async function createRace(_previousState: CourseState, formData: FormData): Promise<CourseState> {
  const admin = await isAdminUser();

  if (!admin) {
    return { error: "Accès refusé." };
  }

  const title = lire(formData, "title", 120);
  const start = lire(formData, "start_datetime", 40);

  if (!title || !start) {
    return { error: "Un titre et une date de départ, au minimum." };
  }

  // Le champ datetime-local n'a pas de fuseau : « 08:30 » veut dire 8h30 a
  // Paris, pas a l'heure du serveur (UTC sur Vercel, soit 10h30 a Paris).
  const depart = heureDeParis(start);

  if (!depart) {
    return { error: "Date de départ illisible." };
  }

  const distance = lire(formData, "distance_km", 12).replace(",", ".");
  const max = lire(formData, "max_participants", 8);
  const statut = lire(formData, "status", 20) as RaceStatus;

  // Le slug doit rester unique : on suffixe avec la date plutot que de
  // laisser la base rejeter l'insertion sur un titre repete d'un mois
  // a l'autre.
  const slug = `${slugifier(title) || "sortie"}-${depart.toISOString().slice(0, 10)}`;

  const { error } = await admin.supabase.from("races").insert({
    title,
    slug,
    description: lire(formData, "description", 2000) || null,
    location: lire(formData, "location", 160) || null,
    address: lire(formData, "address", 240) || null,
    start_datetime: depart.toISOString(),
    distance_km: distance ? Number(distance) : null,
    max_participants: max ? Number(max) : null,
    registration_open: formData.get("registration_open") === "on",
    status: STATUTS.includes(statut) ? statut : "draft",
    cover_image_url: lirePhoto(formData)
  });

  if (error) {
    return { error: error.message.includes("duplicate") ? "Une sortie porte déjà ce nom ce jour-là." : "Création refusée." };
  }

  revalidatePath("/admin/courses");
  revalidatePath("/admin/dashboard");
  rafraichirPagesPubliques();
  return { message: "Sortie créée.", cle: Date.now() };
}

export async function updateRace(formData: FormData) {
  const admin = await isAdminUser();

  if (!admin) {
    redirect("/membre");
  }

  const id = lire(formData, "race_id", 40);

  if (!id) {
    redirect("/admin/courses");
  }

  const statut = lire(formData, "status", 20) as RaceStatus;
  const distance = lire(formData, "distance_km", 12).replace(",", ".");
  const max = lire(formData, "max_participants", 8);

  await admin.supabase
    .from("races")
    .update({
      title: lire(formData, "title", 120),
      description: lire(formData, "description", 2000) || null,
      location: lire(formData, "location", 160) || null,
      address: lire(formData, "address", 240) || null,
      distance_km: distance ? Number(distance) : null,
      max_participants: max ? Number(max) : null,
      registration_open: formData.get("registration_open") === "on",
      status: STATUTS.includes(statut) ? statut : "draft"
    })
    .eq("id", id);

  revalidatePath(`/admin/courses/${id}`);
  revalidatePath("/admin/courses");
  rafraichirPagesPubliques();
  redirect(`/admin/courses/${id}`);
}

/** Raccourci depuis la liste : publier, fermer, terminer, sans ouvrir la fiche. */
export async function setRaceStatus(formData: FormData) {
  const admin = await isAdminUser();

  if (!admin) {
    redirect("/membre");
  }

  const id = lire(formData, "race_id", 40);
  const statut = lire(formData, "status", 20) as RaceStatus;

  if (id && STATUTS.includes(statut)) {
    await admin.supabase.from("races").update({ status: statut }).eq("id", id);
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

  if (!id) {
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

  if (id) {
    const { count } = await admin.supabase
      .from("race_registrations")
      .select("id", { count: "exact", head: true })
      .eq("race_id", id);

    if (count) {
      await admin.supabase.from("races").update({ status: "cancelled" }).eq("id", id);
    } else {
      const { data: course } = await admin.supabase.from("races").select("cover_image_url").eq("id", id).maybeSingle<{ cover_image_url: string | null }>();
      const { error } = await admin.supabase.from("races").delete().eq("id", id);

      if (!error) {
        await supprimerPhoto(course?.cover_image_url ?? null);
      }
    }
  }

  revalidatePath("/admin/courses");
  revalidatePath("/admin/dashboard");
  rafraichirPagesPubliques();
  redirect("/admin/courses");
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

  if (!token || !raceId) {
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
