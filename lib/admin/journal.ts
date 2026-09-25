import "server-only";

import { createSupabaseServiceClient } from "../supabase/service";

/** Les actions tracées, une par geste d'administration (migration 0013). */
export type ActionJournal =
  | "sortie.creation"
  | "sortie.modification"
  | "sortie.statut"
  | "sortie.photo"
  | "sortie.annulation"
  | "sortie.suppression"
  | "export.inscrits"
  | "partenaire.creation"
  | "partenaire.modification"
  | "partenaire.code"
  | "partenaire.activation"
  | "partenaire.desactivation"
  | "partenaire.suppression"
  | "admin.promotion"
  | "admin.retrait"
  | "admin.mfa.activation"
  | "admin.mfa.retrait";

export const LIBELLES_JOURNAL: Record<ActionJournal, string> = {
  "admin.promotion": "Admin ajouté",
  "admin.retrait": "Admin retiré",
  "admin.mfa.activation": "Double vérification activée",
  "admin.mfa.retrait": "Double vérification retirée",
  "sortie.creation": "Sortie créée",
  "sortie.modification": "Sortie modifiée",
  "sortie.statut": "Statut changé",
  "sortie.photo": "Photo changée",
  "sortie.annulation": "Sortie annulée",
  "sortie.suppression": "Sortie supprimée",
  "export.inscrits": "Export des inscrits",
  "partenaire.creation": "Partenaire créé",
  "partenaire.modification": "Partenaire modifié",
  "partenaire.code": "Nouveau code partenaire",
  "partenaire.activation": "Partenaire réactivé",
  "partenaire.desactivation": "Partenaire désactivé",
  "partenaire.suppression": "Partenaire supprimé"
};

/**
 * Ecrit une ligne dans le journal. Jamais bloquant : une panne du journal
 * ne doit pas empêcher l'action qu'il décrit, elle est signalée dans les
 * logs du serveur pour être vue par la supervision.
 */
export async function journaliser(
  adminId: string,
  action: ActionJournal,
  cible: string | null = null,
  details: Record<string, unknown> = {}
) {
  try {
    const { error } = await createSupabaseServiceClient()
      .from("journal_admin")
      .insert({ admin_id: adminId, action, cible, details });

    if (error) {
      console.error(JSON.stringify({ niveau: "erreur", source: "journal_admin", action, message: error.message }));
    }
  } catch (erreur) {
    console.error(JSON.stringify({ niveau: "erreur", source: "journal_admin", action, message: (erreur as Error).message }));
  }
}
