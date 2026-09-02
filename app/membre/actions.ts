"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { createSupabaseServiceClient } from "../../lib/supabase/service";

export type RegisterState = {
  error?: string;
};

export type LoginState = {
  error?: string;
  message?: string;
};

const WAIVER_VERSION = "v1-2026-06";

function readRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getSignupMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("already") || normalized.includes("registered")) {
    return "Ce mail existe déjà. Connecte-toi.";
  }

  if (normalized.includes("password")) {
    return "Mot de passe trop fragile. Mets plus solide.";
  }

  return "Inscription bloquée. Vérifie les infos.";
}

export async function registerMember(_previousState: RegisterState, formData: FormData): Promise<RegisterState> {
  const firstName = readRequiredString(formData, "first_name");
  const lastName = readRequiredString(formData, "last_name");
  const email = readRequiredString(formData, "email").toLowerCase();
  const password = readRequiredString(formData, "password");
  const acceptsWaiver = formData.get("waiver") === "on";

  if (!firstName || !lastName || !email || !password) {
    return { error: "Tous les champs. Pas à moitié." };
  }

  if (!acceptsWaiver) {
    return { error: "Lis et accepte la décharge. Obligatoire." };
  }

  let serviceSupabase;

  try {
    serviceSupabase = createSupabaseServiceClient();
  } catch {
    return { error: "Connexion membre indisponible : variables Supabase manquantes." };
  }

  const { error: configError } = await serviceSupabase.from("app_config").select("key").limit(1);

  if (configError) {
    return { error: "Base pas prête. Lance la migration Supabase d’abord." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Connexion membre indisponible : variables Supabase manquantes." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error || !data.user) {
    return { error: getSignupMessage(error?.message ?? "") };
  }

  const { error: profileError } = await serviceSupabase.from("profiles").upsert(
    {
      id: data.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      consent_waiver: true,
      consent_waiver_version: WAIVER_VERSION,
      consent_at: new Date().toISOString()
    },
    { onConflict: "id" }
  );

  if (profileError) {
    return { error: "Compte créé, profil bloqué. Réessaie la connexion." };
  }

  // Quand la confirmation d'e-mail est activee cote Supabase — le reglage
  // par defaut d'un projet — signUp cree le compte mais n'ouvre aucune
  // session. Rediriger vers /membre renvoyait alors le nouvel inscrit sur
  // le formulaire de connexion, sans un mot d'explication, juste apres
  // avoir rempli le sien. On teste la session plutot que de supposer le
  // reglage : les deux cas sont traites.
  if (!data.session) {
    redirect("/membre/login?message=confirme");
  }

  redirect("/membre");
}

export async function loginMember(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const email = readRequiredString(formData, "email").toLowerCase();
  const password = readRequiredString(formData, "password");

  if (!email || !password) {
    return { error: "Mail et mot de passe. Les deux." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Connexion membre indisponible : variables Supabase manquantes." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { error: "Accès refusé. Vérifie tes infos." };
  }

  redirect("/membre");
}

export async function resetMemberPassword(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const email = readRequiredString(formData, "email").toLowerCase();

  if (!email) {
    return { error: "Mets ton e-mail." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Réinitialisation indisponible : variables Supabase manquantes." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://nulll.club"}/auth/callback?next=/membre/mot-de-passe`
  });

  if (error) {
    return { error: "Lien impossible à envoyer." };
  }

  return { message: "Lien envoye si le compte existe." };
}

export async function updateMemberPassword(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const password = readRequiredString(formData, "password");
  const confirmation = readRequiredString(formData, "password_confirmation");

  if (password.length < 6) {
    return { error: "Six caractères au minimum." };
  }

  if (password !== confirmation) {
    return { error: "Les deux mots de passe ne sont pas identiques." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Changement indisponible : variables Supabase manquantes." };
  }

  // La session vient du lien reçu par mail, échangé par /auth/callback.
  // Sans elle, updateUser changerait le mot de passe de personne.
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Lien expiré. Redemande un lien depuis la page de connexion." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Mot de passe refusé. Essaie-en un autre." };
  }

  redirect("/membre");
}

/** Fermer sa session depuis l'espace membre. */
export async function logoutMember() {
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/membre/login");
  }

  await supabase.auth.signOut();
  redirect("/membre/login");
}
