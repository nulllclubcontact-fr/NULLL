"use server";

import { revalidatePath } from "next/cache";
import { normaliserTelephone } from "../../lib/auth/telephone";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { createSupabaseServiceClient } from "../../lib/supabase/service";

export type InvitationState = { error?: string; fini?: boolean };

function lire(formData: FormData, cle: string, max: number) {
  const valeur = formData.get(cle);
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

function dateDeNaissanceValide(valeur: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valeur)) return false;
  const date = new Date(`${valeur}T12:00:00Z`);
  return date.toISOString().slice(0, 10) === valeur && valeur >= "1900-01-01" && date.getTime() < Date.now();
}

/** La fenetre ne se montre qu'une fois : remplie ou passee, elle ne revient plus. */
async function marquerVue(userId: string) {
  await createSupabaseServiceClient().from("profiles").update({ invitation_profil_vue: true }).eq("id", userId);
}

async function membreConnecte() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/** Enregistre ce que le membre a rempli, sans effacer ce qu'il aurait laisse vide. */
export async function completerProfil(_previousState: InvitationState, formData: FormData): Promise<InvitationState> {
  let session;

  try {
    session = await membreConnecte();
  } catch {
    return { error: "Enregistrement indisponible pour le moment." };
  }

  if (!session.user) {
    return { error: "Connecte-toi d’abord." };
  }

  const saisieTelephone = lire(formData, "phone", 30);
  const saisieUrgence = lire(formData, "emergency_contact_phone", 30);
  const naissance = lire(formData, "birth_date", 10);
  const telephone = saisieTelephone ? normaliserTelephone(saisieTelephone) : null;
  const telephoneUrgence = saisieUrgence ? normaliserTelephone(saisieUrgence) : null;

  if ((saisieTelephone && !telephone) || (saisieUrgence && !telephoneUrgence)) {
    return { error: "Numéro illisible. Exemple : 06 12 34 56 78." };
  }

  if (naissance && !dateDeNaissanceValide(naissance)) {
    return { error: "Date de naissance invalide." };
  }

  const champs: Record<string, string> = {};
  if (telephone) champs.phone = telephone;
  if (naissance) champs.birth_date = naissance;
  const instagram = lire(formData, "instagram_handle", 60);
  if (instagram) champs.instagram_handle = instagram;
  const urgenceNom = lire(formData, "emergency_contact_name", 120);
  if (urgenceNom) champs.emergency_contact_name = urgenceNom;
  if (telephoneUrgence) champs.emergency_contact_phone = telephoneUrgence;

  if (Object.keys(champs).length > 0) {
    const { error } = await session.supabase.from("profiles").update(champs).eq("id", session.user.id);

    if (error) {
      return { error: "Enregistrement refusé. Réessaie." };
    }
  }

  await marquerVue(session.user.id);
  revalidatePath("/membre", "layout");
  return { fini: true };
}

export async function passerInvitation(): Promise<InvitationState> {
  try {
    const { user } = await membreConnecte();

    if (user) {
      await marquerVue(user.id);
    }
  } catch {
    // Au pire la fenetre reviendra a la prochaine visite.
  }

  revalidatePath("/membre", "layout");
  return { fini: true };
}
