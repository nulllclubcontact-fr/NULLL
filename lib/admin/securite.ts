import "server-only";

import { headers } from "next/headers";
import { createSupabaseServiceClient } from "../supabase/service";
import { DUREE_SESSION_ADMIN_MS } from "./regles";

/**
 * Tout ce que la page « Securite » affiche, rassemble ici : la base
 * (migration 0015), les en-tetes HTTP du site lui-meme, le deploiement
 * et la latence de la base. Chaque source peut manquer sans faire tomber
 * la page : null veut dire « indisponible », jamais « zero ».
 */

export type AdminSecurite = {
  id: string;
  prenom: string | null;
  nom: string | null;
  derniere_connexion: string | null;
  fournisseur: string | null;
  email_confirme: boolean;
  banni: boolean;
  double_verification: boolean;
};

export type SessionAdmin = {
  id: string;
  user_id: string;
  prenom: string | null;
  aal: string;
  depuis: string;
  rafraichie: string | null;
  expire: string | null;
  navigateur: string;
  ip: string | null;
};

export type EtatBase = {
  tables: number;
  tables_avec_rls: number;
  tables_sans_rls: string[];
  policies: number;
  fonctions_definer: number;
  definer_sans_search_path: string[];
  journal_lignes: number;
  journal_plus_ancien: string | null;
  limites_actives: number;
  limites_max: number;
  membres: number;
  membres_bannis: number;
  taille_base_octets: number;
  tables_lourdes: Array<{ table: string; octets: number; lignes: number }>;
  activite: Array<{ admin_id: string | null; prenom: string | null; actions: number; derniere: string }>;
  admins: AdminSecurite[];
  sessions: SessionAdmin[];
};

/** « 12,4 Mo », « 830 ko ». */
export function tailleLisible(octets: number) {
  if (octets >= 1024 ** 3) return `${(octets / 1024 ** 3).toFixed(2).replace(".", ",")} Go`;
  if (octets >= 1024 ** 2) return `${(octets / 1024 ** 2).toFixed(1).replace(".", ",")} Mo`;
  return `${Math.round(octets / 1024)} ko`;
}

export async function etatBase(): Promise<{ etat: EtatBase | null; latenceMs: number | null }> {
  const debut = Date.now();

  try {
    const { data, error } = await createSupabaseServiceClient().rpc("etat_securite");
    if (error || !data) return { etat: null, latenceMs: null };
    return { etat: data as EtatBase, latenceMs: Date.now() - debut };
  } catch {
    return { etat: null, latenceMs: null };
  }
}

/** Les en-tetes que next.config.mjs promet, verifies sur le site lui-meme. */
export const ENTETES_ATTENDUS: Array<{ nom: string; libelle: string; attendu?: string }> = [
  { nom: "x-content-type-options", libelle: "Types de fichiers non devinés", attendu: "nosniff" },
  { nom: "x-frame-options", libelle: "Pas d’affichage dans un cadre tiers", attendu: "DENY" },
  { nom: "content-security-policy", libelle: "Cadres parents interdits" },
  { nom: "content-security-policy-report-only", libelle: "CSP complète en observation" },
  { nom: "referrer-policy", libelle: "Référent limité" },
  { nom: "permissions-policy", libelle: "Caméra réservée au site" },
  { nom: "strict-transport-security", libelle: "HTTPS imposé (HSTS)" }
];

export type EnTete = { nom: string; libelle: string; present: boolean; valeur: string | null };

export async function enTetesDuSite(): Promise<{ origine: string; entetes: EnTete[] | null }> {
  const h = await headers();
  const hote = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (hote.startsWith("localhost") ? "http" : "https");
  const origine = `${proto}://${hote}`;

  try {
    const reponse = await fetch(`${origine}/fr`, { method: "HEAD", cache: "no-store", redirect: "manual" });
    return {
      origine,
      entetes: ENTETES_ATTENDUS.map((e) => {
        const valeur = reponse.headers.get(e.nom);
        return { nom: e.nom, libelle: e.libelle, present: valeur !== null && (!e.attendu || valeur.toLowerCase() === e.attendu.toLowerCase()), valeur };
      })
    };
  } catch {
    return { origine, entetes: null };
  }
}

export function deploiement() {
  const env = process.env.VERCEL_ENV ?? (process.env.NODE_ENV === "production" ? "production" : "local");
  const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null;
  const branche = process.env.VERCEL_GIT_COMMIT_REF ?? null;
  const region = process.env.VERCEL_REGION ?? null;

  return { env, commit, branche, region, node: process.version };
}

/** Le temps qu'il reste a une session admin avant la reconnexion forcee. */
export function resteSessionAdmin(derniereConnexion: string | null | undefined, maintenant: number) {
  if (!derniereConnexion) return 0;
  return Math.max(0, Date.parse(derniereConnexion) + DUREE_SESSION_ADMIN_MS - maintenant);
}

/** « Chrome · Windows » plutot qu'une ligne de 160 caracteres. */
export function navigateurCourt(userAgent: string) {
  const ua = userAgent || "";
  const nav = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : ua ? "Autre" : "Inconnu";
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "";
  return os ? `${nav} · ${os}` : nav;
}

/** « 3 h 12 », « 42 min », « moins d'une minute ». */
export function dureeCourte(ms: number) {
  const minutes = Math.round(ms / 60000);
  if (minutes < 1) return "moins d’une minute";
  if (minutes < 60) return `${minutes} min`;
  const heures = Math.floor(minutes / 60);
  const reste = minutes % 60;
  if (heures < 48) return reste ? `${heures} h ${String(reste).padStart(2, "0")}` : `${heures} h`;
  return `${Math.round(heures / 24)} j`;
}
