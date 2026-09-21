"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export type AccordImageState = { error?: string; fini?: boolean };

/** Reponse a la fenetre « photos et videos » : oui ou non, rien d'autre. */
export async function repondreAccordImage(_previousState: AccordImageState, formData: FormData): Promise<AccordImageState> {
  const reponse = formData.get("image");

  if (reponse !== "oui" && reponse !== "non") {
    return { error: "Choisis oui ou non." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Connecte-toi d’abord." };
    }

    const { error } = await supabase.from("profiles").update({ consent_image: reponse === "oui" }).eq("id", user.id);

    if (error) {
      return { error: "Enregistrement refusé. Réessaie." };
    }
  } catch {
    return { error: "Enregistrement indisponible pour le moment." };
  }

  revalidatePath("/membre", "layout");
  return { fini: true };
}
