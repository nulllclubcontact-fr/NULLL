import "server-only";

import { supabaseAnonKey, supabaseServiceRoleKey, supabaseUrl } from "../supabase/config";

/**
 * Les briques dont le site depend, testees a l'ouverture de la page
 * Securite : chacune avec son temps de reponse. Un service « en panne »
 * ici, c'est un membre qui ne peut pas se connecter, un QR qui ne part
 * pas, une photo qui ne s'affiche pas.
 */
export type EtatBrique = "ok" | "lent" | "panne" | "a-configurer";
export type Brique = { nom: string; role: string; etat: EtatBrique; ms: number | null; detail: string };

const DELAI_MS = 5000;
const LENT_MS = 1500;

async function mesurer(nom: string, role: string, appel: () => Promise<{ ok: boolean; detail: string }>): Promise<Brique> {
  const debut = Date.now();

  try {
    const { ok, detail } = await appel();
    const ms = Date.now() - debut;
    return { nom, role, etat: !ok ? "panne" : ms > LENT_MS ? "lent" : "ok", ms, detail };
  } catch (e) {
    return { nom, role, etat: "panne", ms: Date.now() - debut, detail: (e as Error).name === "TimeoutError" ? "pas de réponse en 5 s" : (e as Error).message };
  }
}

function requete(url: string, init: RequestInit = {}) {
  return fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(DELAI_MS) });
}

export async function briques(): Promise<Brique[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [{ nom: "Supabase", role: "tout", etat: "a-configurer", ms: null, detail: "NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY" }];
  }

  const cleAnon = { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` };
  const cleService = supabaseServiceRoleKey ? { apikey: supabaseServiceRoleKey, Authorization: `Bearer ${supabaseServiceRoleKey}` } : null;

  return Promise.all([
    mesurer("Authentification", "connexion des membres, codes, sessions", async () => {
      const r = await requete(`${supabaseUrl}/auth/v1/health`, { headers: cleAnon });
      const corps = (await r.json().catch(() => ({}))) as { version?: string };
      return { ok: r.ok, detail: r.ok ? `GoTrue ${corps.version ?? ""}`.trim() : `HTTP ${r.status}` };
    }),
    mesurer("Base de données", "sorties, inscriptions, profils", async () => {
      const r = await requete(`${supabaseUrl}/rest/v1/loyalty_tiers?select=id&limit=1`, { method: "HEAD", headers: cleAnon });
      return { ok: r.ok || r.status === 401, detail: r.ok ? "PostgREST répond" : `HTTP ${r.status}` };
    }),
    mesurer("Stockage", "photos des sorties", async () => {
      if (!cleService) return { ok: false, detail: "clé de service absente" };
      const r = await requete(`${supabaseUrl}/storage/v1/bucket`, { headers: cleService });
      const liste = (await r.json().catch(() => [])) as Array<{ name: string; public: boolean }>;
      const sorties = Array.isArray(liste) ? liste.find((b) => b.name === "sorties") : undefined;
      return { ok: r.ok, detail: !r.ok ? `HTTP ${r.status}` : sorties ? `bucket « sorties » ${sorties.public ? "public" : "privé"}` : "bucket « sorties » pas encore créé (au premier envoi)" };
    }),
    mesurer("E-mails", "confirmation, mot de passe, QR", async () => {
      const cle = process.env.RESEND_API_KEY;
      if (!cle) return { ok: false, detail: "RESEND_API_KEY absente" };
      const r = await requete("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${cle}` } });
      const corps = (await r.json().catch(() => ({}))) as { data?: Array<{ name: string; status: string }> };
      const verifies = (corps.data ?? []).filter((d) => d.status === "verified").map((d) => d.name);
      return { ok: r.ok, detail: !r.ok ? `HTTP ${r.status}` : verifies.length ? `Resend · ${verifies.join(", ")}` : "Resend · aucun domaine vérifié" };
    })
  ]);
}
