"use server";

import { revalidatePath } from "next/cache";
import { isAdminUser } from "../../lib/admin/require-admin";
import { journaliser } from "../../lib/admin/journal";
import { noterAuth } from "../../lib/admin/journal-auth";
import { sessionServeur } from "../../lib/supabase/server";

/**
 * L'enrolement et le retrait du facteur TOTP se font dans le navigateur,
 * avec la session de l'admin (Supabase l'exige). Le serveur ne fait que
 * constater l'etat et le noter aux journaux.
 */
export async function noterDoubleVerification(etat: "activation" | "retrait") {
  const admin = await isAdminUser();

  if (!admin) return;

  const { data } = await admin.supabase.auth.mfa.listFactors();
  const verifies = data?.totp.filter((f) => f.status === "verified").length ?? 0;
  const identifiant = admin.user.email ?? null;

  // On note ce que la base dit, pas ce que le navigateur pretend.
  if (etat === "activation" && verifies > 0) {
    await Promise.all([journaliser(admin.user.id, "admin.mfa.activation", admin.user.id), noterAuth("mfa_enrolled", { userId: admin.user.id, identifiant })]);
  } else if (etat === "retrait" && verifies === 0) {
    await Promise.all([journaliser(admin.user.id, "admin.mfa.retrait", admin.user.id), noterAuth("mfa_removed", { userId: admin.user.id, identifiant })]);
  }

  revalidatePath("/admin/securite");
  revalidatePath("/admin/equipe");
}

/**
 * Resultat d'une saisie de code a l'entree de l'administration. La
 * verification elle-meme est faite par Supabase dans le navigateur ; ici on
 * ne fait que noter, pour le compte connecte, ce qui vient de se passer.
 */
export async function noterVerification(reussie: boolean) {
  const session = await sessionServeur();

  if (!session?.user) return;

  await noterAuth(reussie ? "mfa_success" : "mfa_failure", { userId: session.user.id, identifiant: session.user.email ?? null });
}
