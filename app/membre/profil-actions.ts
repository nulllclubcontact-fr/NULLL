"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export type ProfilState = { error?: string; message?: string };

function lire(formData: FormData, cle: string, max: number) {
  const valeur = formData.get(cle);
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

/**
 * Mise a jour du profil par son proprietaire.
 *
 * Seuls les champs listes ici partent en base. Le role, les points et le
 * jeton QR n'y figurent pas : la policy d'update laisse un membre ecrire
 * sa ligne, donc c'est ici que se decide ce qu'il peut reellement changer.
 */
export async function updateProfil(_previousState: ProfilState, formData: FormData): Promise<ProfilState> {
  const firstName = lire(formData, "first_name", 80);
  const lastName = lire(formData, "last_name", 80);

  if (!firstName || !lastName) {
    return { error: "Prénom et nom sont nécessaires le jour d’une sortie." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Enregistrement indisponible pour le moment." };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Connecte-toi d’abord." };
  }

  const birthDate = lire(formData, "birth_date", 10);

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      phone: lire(formData, "phone", 30) || null,
      birth_date: birthDate || null,
      instagram_handle: lire(formData, "instagram_handle", 60) || null,
      emergency_contact_name: lire(formData, "emergency_contact_name", 120) || null,
      emergency_contact_phone: lire(formData, "emergency_contact_phone", 30) || null,
      medical_notes: lire(formData, "medical_notes", 1000) || null
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Enregistrement refusé. Réessaie." };
  }

  revalidatePath("/membre/profil");
  revalidatePath("/membre");

  return { message: "C’est enregistré." };
}
