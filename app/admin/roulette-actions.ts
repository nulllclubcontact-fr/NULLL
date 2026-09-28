"use server";

import { revalidatePath } from "next/cache";
import { journaliser } from "../../lib/admin/journal";
import { isAdminUser } from "../../lib/admin/require-admin";
import { codeValide, LIBELLES_LOT, normaliserCode, type Lot } from "../../lib/roulette/regles";
import { createSupabaseServiceClient } from "../../lib/supabase/service";

export type RemiseState = { ok?: string; erreur?: string };

/**
 * Le samedi, un gagnant montre son code : l'equipe le saisit ici. Un code
 * ne se remet qu'une fois ; la mise a jour ne touche que les lots pas
 * encore remis, deux telephones ne peuvent pas le valider en meme temps.
 */
export async function remettreLot(_precedent: RemiseState, formData: FormData): Promise<RemiseState> {
  const admin = await isAdminUser();
  if (!admin) return { erreur: "Session admin expirée. Reconnecte-toi." };

  const code = normaliserCode(String(formData.get("code") ?? "").slice(0, 40));
  if (!codeValide(code)) return { erreur: "Ce n’est pas un code de la roulette (format NULLL-RB-XXXXX ou NULLL-BZ-XXXXX)." };

  const service = createSupabaseServiceClient();
  const { data: remis, error } = await service
    .from("roulette_tirages")
    .update({ remis_at: new Date().toISOString(), remis_par: admin.user.id })
    .eq("code", code)
    .is("remis_at", null)
    .select("lot")
    .maybeSingle<{ lot: Lot }>();

  if (error) return { erreur: "Impossible de valider le code pour le moment." };

  if (!remis) {
    const { data: existant } = await service.from("roulette_tirages").select("remis_at").eq("code", code).maybeSingle<{ remis_at: string | null }>();
    if (!existant) return { erreur: "Code inconnu. Vérifie la saisie." };
    const quand = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" }).format(new Date(existant.remis_at!));
    return { erreur: `Déjà remis le ${quand}.` };
  }

  await journaliser(admin.user.id, "roulette.remise", code, { lot: remis.lot });
  revalidatePath("/admin/roulette");
  return { ok: `${LIBELLES_LOT[remis.lot]} à remettre. Code validé.` };
}
