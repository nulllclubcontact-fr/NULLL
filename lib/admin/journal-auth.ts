import "server-only";

import { headers } from "next/headers";
import { adresseAppelant } from "../limite";
import { createSupabaseServiceClient } from "../supabase/service";

/**
 * Journal des connexions (migration 0016) : ce qui arrive aux comptes,
 * reussi ou non. Ecrit depuis les actions de connexion, de deconnexion,
 * de mot de passe et de double verification. Jamais bloquant.
 *
 * L'identifiant est garde tel que saisi (e-mail ou numero), en minuscules :
 * c'est ce qui permet de voir qu'un compte precis est vise. L'adresse IP
 * est tronquee avant d'etre ecrite.
 */
export type ActionAuth =
  | "login_success"
  | "login_failure"
  | "login_blocked"
  | "logout"
  | "session_expired"
  | "mfa_success"
  | "mfa_failure"
  | "mfa_enrolled"
  | "mfa_removed"
  | "mfa_reset_by_admin"
  | "password_changed"
  | "password_reset_requested";

export const LIBELLES_AUTH: Record<ActionAuth, { texte: string; ton: "ok" | "attention" | "alerte" | "neutre" }> = {
  login_success: { texte: "Connexion", ton: "ok" },
  login_failure: { texte: "Mot de passe erroné", ton: "attention" },
  login_blocked: { texte: "Connexion bloquée (trop d’essais)", ton: "alerte" },
  logout: { texte: "Déconnexion", ton: "neutre" },
  session_expired: { texte: "Session admin expirée (12 h)", ton: "neutre" },
  mfa_success: { texte: "Code de vérification accepté", ton: "ok" },
  mfa_failure: { texte: "Code de vérification refusé", ton: "attention" },
  mfa_enrolled: { texte: "Double vérification activée", ton: "ok" },
  mfa_removed: { texte: "Double vérification retirée par la personne", ton: "attention" },
  mfa_reset_by_admin: { texte: "Double vérification retirée par un admin", ton: "attention" },
  password_changed: { texte: "Mot de passe changé", ton: "neutre" },
  password_reset_requested: { texte: "Réinitialisation demandée", ton: "neutre" }
};

function ipTronquee(ip: string) {
  return ip === "local" ? ip : ip.replace(/[.:][0-9a-f]+$/i, ".x");
}

export async function noterAuth(action: ActionAuth, options: { userId?: string | null; identifiant?: string | null; details?: Record<string, unknown> } = {}) {
  try {
    const h = await headers();
    const { error } = await createSupabaseServiceClient()
      .from("journal_auth")
      .insert({
        user_id: options.userId ?? null,
        identifiant: options.identifiant?.trim().toLowerCase().slice(0, 200) ?? null,
        action,
        ip: ipTronquee(adresseAppelant(h)),
        navigateur: (h.get("user-agent") ?? "").slice(0, 160),
        details: options.details ?? {}
      });

    if (error) {
      console.error(JSON.stringify({ niveau: "erreur", source: "journal_auth", action, message: error.message }));
    }
  } catch (erreur) {
    console.error(JSON.stringify({ niveau: "erreur", source: "journal_auth", action, message: (erreur as Error).message }));
  }
}

export type EntreeAuth = {
  id: number;
  user_id: string | null;
  prenom: string | null;
  identifiant: string | null;
  action: string;
  ip: string | null;
  navigateur: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export type CompteursAuth = { connexions: number; echecs: number; blocages: number; identifiants_vises: Array<{ identifiant: string; essais: number }> };

export async function lireJournalAuth(limite = 60): Promise<{ entrees: EntreeAuth[] | null; compteurs: CompteursAuth | null }> {
  try {
    const service = createSupabaseServiceClient();
    const [lignes, compteurs] = await Promise.all([
      service.rpc("lire_journal_auth", { p_limite: limite }),
      service.rpc("compter_journal_auth", { p_heures: 24 })
    ]);

    return {
      entrees: lignes.error ? null : ((lignes.data ?? []) as EntreeAuth[]),
      compteurs: compteurs.error ? null : (compteurs.data as CompteursAuth)
    };
  } catch {
    return { entrees: null, compteurs: null };
  }
}
