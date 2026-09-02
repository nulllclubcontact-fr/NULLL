"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "../../lib/admin/require-admin";
import type { CheckinOutcome, RaceStatus } from "../../lib/races/types";

export type CourseState = { error?: string; message?: string };
export type ScanState = { resultat?: CheckinOutcome; error?: string };

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

  const depart = new Date(start);

  if (Number.isNaN(depart.getTime())) {
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
    status: STATUTS.includes(statut) ? statut : "draft"
  });

  if (error) {
    return { error: error.message.includes("duplicate") ? "Une sortie porte déjà ce nom ce jour-là." : "Création refusée." };
  }

  revalidatePath("/admin/courses");
  return { message: "Sortie créée." };
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

