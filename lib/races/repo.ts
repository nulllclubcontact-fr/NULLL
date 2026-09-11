import "server-only";

import { createClient } from "@supabase/supabase-js";
import { hasSupabasePublicEnv, supabaseAnonKey, supabaseUrl } from "../supabase/config";
import { createSupabaseServerClient } from "../supabase/server";
import { formatDistance } from "../../components/races/format";
import { DEPART } from "../rendez-vous";
import type { RunEvent } from "../site-content";
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

const JOUR_PUBLIC = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris"
});
const HEURE_PUBLIQUE = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

/**
 * Les sorties publiees a venir, la plus proche en premier, au format des
 * pages publiques (accueil, « Sorties »). Client anonyme sans cookie : les
 * pages restent en cache et se regenerent, au lieu d'etre recalculees a
 * chaque visite. En cas de panne, null : la page dit qu'elle n'a pas pu
 * charger, au lieu d'annoncer qu'aucune sortie n'est prevue.
 */
export async function listPublicRuns(): Promise<RunEvent[] | null> {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data, error } = await supabase
    .from("races")
    .select(CHAMPS_COURSE)
    .eq("status", "published")
    .gte("start_datetime", new Date().toISOString())
    .order("start_datetime", { ascending: true })
    .returns<Race[]>();

  if (error || !data) {
    return null;
  }

  return data.map((course) => {
    const depart = new Date(course.start_datetime);
    const jour = JOUR_PUBLIC.format(depart);

    return {
      id: course.id,
      date: jour.charAt(0).toUpperCase() + jour.slice(1),
      isoDate: course.start_datetime,
      time: HEURE_PUBLIQUE.format(depart),
      title: course.title,
      distance: formatDistance(course.distance_km) ?? "Distance à venir",
      pace: "Allure conversation",
      location: course.location || DEPART.nom,
      address: course.address || (course.location ? `${course.location}, Aix-en-Provence` : DEPART.adresse),
      summary: course.description || "Sortie ouverte à tous, à allure conversation. Personne ne reste derrière.",
      afterRun: "On reste un moment ensemble après la sortie",
      image: course.cover_image_url,
      inscriptionsOuvertes:
        course.registration_open && (course.registration_deadline === null || new Date(course.registration_deadline).getTime() > Date.now())
    };
  });
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

const JOUR_PARIS = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" });

/**
 * Sépare ce qui arrive de ce qui est passé, pour que l'affichage n'ait pas à le refaire.
 * Une sortie reste « à venir » jusqu'à la fin de son jour, heure de Paris :
 * a 8h31 le retardataire doit encore pouvoir montrer son QR.
 */
export function splitRegistrations(inscriptions: RegistrationWithRace[]) {
  const aujourdhui = JOUR_PARIS.format(new Date());
  const aVenir: RegistrationWithRace[] = [];
  const passees: RegistrationWithRace[] = [];

  for (const inscription of inscriptions) {
    const depart = inscription.races?.start_datetime;
    // Course introuvable : on ne la presente pas comme a venir.
    const estPassee = depart ? JOUR_PARIS.format(new Date(depart)) < aujourdhui : true;
    (estPassee ? passees : aVenir).push(inscription);
  }

  return { aVenir, passees };
}
