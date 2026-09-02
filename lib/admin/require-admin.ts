import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server";

/**
 * Porte d'entree de l'administration des courses.
 *
 * Le panneau fidelite historique s'ouvre avec un code partage dans un
 * cookie signe. Ce modele ne convient pas ici : checked_in_by doit
 * referencer un vrai compte pour tracer qui a scanne, et la RLS des
 * courses s'appuie sur auth.uid(). L'acces se fait donc par un compte
 * Supabase dont le profil porte role = 'admin'.
 *
 * La verification est refaite en base a chaque requete, jamais deduite
 * d'un cookie ou d'un etat client. Meme si quelqu'un atteint l'URL, la
 * RLS refuserait les donnees.
 */
export async function requireAdminUser() {
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

  return { supabase, user, prenom: profil.first_name };
}

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

    return profil?.role === "admin" ? { supabase, user } : null;
  } catch {
    return null;
  }
}
