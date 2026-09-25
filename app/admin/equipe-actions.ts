"use server";

import { revalidatePath } from "next/cache";
import { isAdminUser } from "../../lib/admin/require-admin";
import { journaliser } from "../../lib/admin/journal";
import { noterAuth } from "../../lib/admin/journal-auth";
import { identifiantValide } from "../../lib/admin/regles";
import { createSupabaseServiceClient } from "../../lib/supabase/service";

export type EquipeState = { error?: string; message?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function lire(formData: FormData, cle: string, max = 200) {
  const valeur = formData.get(cle);
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

/**
 * Donner le role admin a un membre existant, par son e-mail. Le compte
 * doit deja exister : on ne cree pas d'admin a partir de rien, et on ne
 * revele pas si un e-mail inconnu a un compte ailleurs.
 */
export async function ajouterAdmin(_previousState: EquipeState, formData: FormData): Promise<EquipeState> {
  const admin = await isAdminUser();

  if (!admin) {
    return { error: "Accès refusé." };
  }

  const email = lire(formData, "email").toLowerCase();

  if (!EMAIL.test(email)) {
    return { error: "E-mail invalide." };
  }

  const service = createSupabaseServiceClient();
  const { data: profil, error: erreurLecture } = await service
    .from("profiles")
    .select("id,role,first_name")
    .eq("email", email)
    .maybeSingle<{ id: string; role: string | null; first_name: string | null }>();

  if (erreurLecture) {
    return { error: "Lecture impossible. Réessaie." };
  }

  if (!profil) {
    return { error: "Aucun membre avec cet e-mail. La personne doit d’abord créer son compte membre." };
  }

  if (profil.role === "admin") {
    return { message: `${profil.first_name ?? "Ce membre"} est déjà admin.` };
  }

  const { error } = await service.from("profiles").update({ role: "admin" }).eq("id", profil.id);

  if (error) {
    return { error: "Enregistrement refusé. Réessaie." };
  }

  await journaliser(admin.user.id, "admin.promotion", profil.id, { email });
  revalidatePath("/admin/equipe");
  return { message: `${profil.first_name ?? "Ce membre"} est admin. Conseille-lui d’activer la double vérification.` };
}

/** Retirer le role : jamais a soi-meme, jamais au dernier admin. */
export async function retirerAdmin(_previousState: EquipeState, formData: FormData): Promise<EquipeState> {
  const admin = await isAdminUser();

  if (!admin) {
    return { error: "Accès refusé." };
  }

  const id = lire(formData, "profile_id", 40);

  if (!identifiantValide(id)) {
    return { error: "Membre introuvable." };
  }

  if (id === admin.user.id) {
    return { error: "Pas toi-même : demande à un autre admin de le faire." };
  }

  const service = createSupabaseServiceClient();
  const { count } = await service.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin");

  if ((count ?? 0) <= 1) {
    return { error: "Il doit rester au moins un admin." };
  }

  const { data: profil } = await service.from("profiles").select("email,first_name").eq("id", id).eq("role", "admin").maybeSingle<{ email: string | null; first_name: string | null }>();

  if (!profil) {
    return { error: "Ce membre n’est pas admin." };
  }

  const { error } = await service.from("profiles").update({ role: "user" }).eq("id", id);

  if (error) {
    return { error: "Enregistrement refusé. Réessaie." };
  }

  await journaliser(admin.user.id, "admin.retrait", id, { email: profil.email });
  revalidatePath("/admin/equipe");
  return { message: `${profil.first_name ?? "Ce membre"} n’est plus admin. Son compte membre continue.` };
}

/**
 * Telephone perdu : un autre admin retire les facteurs TOTP du compte,
 * qui redevient accessible par mot de passe seul. Trace au journal.
 */
export async function retirerDoubleVerification(_previousState: EquipeState, formData: FormData): Promise<EquipeState> {
  const admin = await isAdminUser();

  if (!admin) {
    return { error: "Accès refusé." };
  }

  const id = lire(formData, "profile_id", 40);

  if (!identifiantValide(id)) {
    return { error: "Membre introuvable." };
  }

  if (id === admin.user.id) {
    return { error: "Pour ton propre compte, passe par « Sécurité »." };
  }

  const service = createSupabaseServiceClient();

  try {
    const { data } = await service.auth.admin.mfa.listFactors({ userId: id });
    const facteurs = data?.factors ?? [];

    for (const f of facteurs) {
      const { error } = await service.auth.admin.mfa.deleteFactor({ userId: id, id: f.id });
      if (error) return { error: "Retrait refusé. Réessaie." };
    }

    if (facteurs.length === 0) {
      return { message: "Ce compte n’a pas de double vérification." };
    }
  } catch {
    return { error: "Retrait impossible pour le moment." };
  }

  await Promise.all([journaliser(admin.user.id, "admin.mfa.retrait", id), noterAuth("mfa_reset_by_admin", { userId: id, details: { par: admin.user.id } })]);
  revalidatePath("/admin/equipe");
  return { message: "Double vérification retirée. La personne peut se reconnecter avec son mot de passe, puis la réactiver." };
}
