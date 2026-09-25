import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "../supabase/server";
import { sessionAdminExpiree } from "./regles";

/**
 * Porte d'entree de l'administration.
 *
 * L'acces se fait par un compte Supabase dont le profil porte
 * role = 'admin'. La verification est refaite en base a chaque requete,
 * jamais deduite d'un cookie ou d'un etat client. Meme si quelqu'un
 * atteint l'URL, la RLS refuserait les donnees.
 *
 * Deux gardes de plus (sprint 2) :
 * - la session admin expire douze heures apres la connexion, quelle que
 *   soit la duree du cookie membre ;
 * - un admin qui a active la double verification (TOTP) doit l'avoir
 *   passee (aal2). Sans facteur, l'acces reste ouvert : l'activation est
 *   volontaire, mais une fois faite elle s'impose, cote code comme cote
 *   RLS (migration 0014).
 *
 * Le layout et la page l'appellent tous les deux : cache() partage le
 * resultat le temps d'une requete. Chaque nouvelle requete reverifie tout.
 */
export const requireAdminUser = cache(async () => {
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/membre/login");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/membre/login");
  }

  const { data: profil } = await supabase
    .from("profiles")
    .select("role,first_name")
    .eq("id", user.id)
    .maybeSingle<{ role: string | null; first_name: string | null }>();

  if (profil?.role !== "admin") {
    // Un membre ordinaire ne doit pas apprendre que la page existe.
    redirect("/membre");
  }

  if (sessionAdminExpiree(user.last_sign_in_at, Date.now())) {
    redirect("/admin/reconnexion");
  }

  const verification = await niveauVerification(supabase);

  if (verification === "a-passer") {
    redirect("/admin/verification");
  }

  return { supabase, user, prenom: profil.first_name, doubleVerification: verification === "passee" };
});

/** Variante sans redirection, pour les actions qui renvoient une erreur. */
export async function isAdminUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profil } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle<{ role: string | null }>();

    if (profil?.role !== "admin") return null;
    if (sessionAdminExpiree(user.last_sign_in_at, Date.now())) return null;
    if ((await niveauVerification(supabase)) === "a-passer") return null;

    return { supabase, user };
  } catch {
    return null;
  }
}

/**
 * « aucune » : pas de facteur verifie, rien a passer.
 * « a-passer » : un facteur existe, la session n'a que le mot de passe.
 * « passee » : la session est au niveau aal2.
 *
 * Si l'API MFA ne repond pas, on laisse passer : la RLS (is_admin) fait
 * le meme calcul en base et refusera les donnees a une session aal1.
 */
export async function niveauVerification(supabase: SupabaseClient): Promise<"aucune" | "a-passer" | "passee"> {
  try {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error || !data) return "aucune";
    if (data.currentLevel === "aal2") return "passee";
    return data.nextLevel === "aal2" ? "a-passer" : "aucune";
  } catch {
    return "aucune";
  }
}
