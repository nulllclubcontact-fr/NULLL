import "server-only";

import type { User } from "@supabase/supabase-js";
import { createSupabaseServiceClient } from "../supabase/service";

/**
 * Premier passage par Google ou Apple : ni profil ni decharge, puisque le
 * formulaire d'inscription n'a pas ete rempli. On cree le profil avec ce
 * que le fournisseur donne. Renvoie true tant que la decharge reste a
 * signer, sur /membre/bienvenue.
 */
export async function preparerProfilFournisseur(user: User): Promise<boolean> {
  const service = createSupabaseServiceClient();
  const { data: profil } = await service
    .from("profiles")
    .select("consent_waiver")
    .eq("id", user.id)
    .maybeSingle<{ consent_waiver: boolean | null }>();

  if (!profil) {
    const meta = user.user_metadata ?? {};
    const complet = String(meta.full_name ?? meta.name ?? "").trim();
    const [premier, ...reste] = complet ? complet.split(/\s+/) : [];

    await service.from("profiles").insert({
      id: user.id,
      email: user.email ?? null,
      first_name: (meta.given_name as string | undefined) ?? premier ?? null,
      last_name: (meta.family_name as string | undefined) ?? (reste.join(" ") || null)
    });
  }

  return !profil?.consent_waiver;
}
