"use server";

import { revalidatePath } from "next/cache";
import { isAdminUser } from "../../lib/admin/require-admin";
import { journaliser } from "../../lib/admin/journal";

/**
 * L'enrolement et le retrait du facteur TOTP se font dans le navigateur,
 * avec la session de l'admin (Supabase l'exige). Le serveur ne fait que
 * constater l'etat et le noter au journal.
 */
export async function noterDoubleVerification(etat: "activation" | "retrait") {
  const admin = await isAdminUser();

  if (!admin) return;

  const { data } = await admin.supabase.auth.mfa.listFactors();
  const verifies = data?.totp.filter((f) => f.status === "verified").length ?? 0;

  // On note ce que la base dit, pas ce que le navigateur pretend.
  if (etat === "activation" && verifies > 0) {
    await journaliser(admin.user.id, "admin.mfa.activation", admin.user.id);
  } else if (etat === "retrait" && verifies === 0) {
    await journaliser(admin.user.id, "admin.mfa.retrait", admin.user.id);
  }

  revalidatePath("/admin/securite");
  revalidatePath("/admin/equipe");
}
