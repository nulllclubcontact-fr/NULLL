import "server-only";

import { createSupabaseServerClient } from "../supabase/server";
import type { Race, RegistrationWithRace } from "./types";

const CHAMPS_COURSE =
  "id,title,slug,description,location,address,city,start_datetime,end_datetime,distance_km,max_participants,registration_open,registration_deadline,status,cover_image_url";

/**
 * Les sorties publiees encore a venir, la plus proche en premier.
 * La RLS ne laisse voir que les publiees : rien a filtrer de plus ici pour
 * un visiteur, et le filtre explicite protege l'admin de sa propre vue
 * elargie.
 */
export async function listUpcomingRaces(): Promise<Race[]> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("races")
    .select(CHAMPS_COURSE)
    .eq("status", "published")
    .gte("start_datetime", new Date().toISOString())
    .order("start_datetime", { ascending: true })
    .returns<Race[]>();

  return data ?? [];
}

/**
 * Les inscriptions d'un membre, course incluse. Les annulees restent
 * visibles : savoir qu'on s'est desinscrit vaut mieux qu'une ligne qui
 * disparait sans explication.
 */
export async function listMyRegistrations(userId: string): Promise<RegistrationWithRace[]> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("race_registrations")
    .select(`id,race_id,user_id,qr_code_token,status,checked_in,checked_in_at,created_at,races(${CHAMPS_COURSE})`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<RegistrationWithRace[]>();

  return data ?? [];
}

/** Sépare ce qui arrive de ce qui est passé, pour que l'affichage n'ait pas à le refaire. */
export function splitRegistrations(inscriptions: RegistrationWithRace[]) {
  const maintenant = Date.now();
  const aVenir: RegistrationWithRace[] = [];
  const passees: RegistrationWithRace[] = [];

  for (const inscription of inscriptions) {
    const depart = inscription.races?.start_datetime;
    const estPassee = depart ? new Date(depart).getTime() < maintenant : false;
    (estPassee ? passees : aVenir).push(inscription);
  }

  return { aVenir, passees };
}
