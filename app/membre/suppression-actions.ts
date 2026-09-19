"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { createSupabaseServiceClient } from "../../lib/supabase/service";
import { MARQUEUR_SESSION_COURTE } from "../../lib/supabase/session";

export type SuppressionState = { error?: string };

/**
 * Suppression definitive du compte par son proprietaire.
 *
 * Effacer l'utilisateur d'auth suffit : profil, inscriptions, pointages,
 * points et transactions lui sont rattaches en cascade (ON DELETE CASCADE).
 * Suppression reelle, pas « douce » : il ne reste rien cote club.
 */
export async function supprimerCompte(_previousState: SuppressionState, formData: FormData): Promise<SuppressionState> {
  const confirmation = formData.get("confirmation");

  if (typeof confirmation !== "string" || confirmation.trim().toUpperCase() !== "SUPPRIMER") {
    return { error: "Écris SUPPRIMER pour confirmer." };
  }

  let supabase;
  let serviceSupabase;

  try {
    supabase = await createSupabaseServerClient();
    serviceSupabase = createSupabaseServiceClient();
  } catch {
    return { error: "Suppression indisponible pour le moment. Réessaie dans un instant." };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/membre/login");
  }

  const { data: profil } = await serviceSupabase.from("profiles").select("role").eq("id", user.id).maybeSingle<{ role: string | null }>();

  // Un compte admin a pointe des membres (checked_in_by, scanned_by) : le
  // supprimer d'ici casserait ces liens et pourrait priver le club d'accès.
  if (profil?.role === "admin") {
    return { error: "Compte administrateur : la suppression se fait à la main, pour ne pas bloquer le club." };
  }

  const { error } = await serviceSupabase.auth.admin.deleteUser(user.id, false);

  if (error) {
    return { error: "La suppression a échoué. Réessaie, ou écris-nous : on s’en occupe." };
  }

  // La session pointait vers un compte qui n'existe plus : on nettoie.
  await supabase.auth.signOut().catch(() => {});
  (await cookies()).delete(MARQUEUR_SESSION_COURTE);
  redirect("/membre/compte-supprime");
}
