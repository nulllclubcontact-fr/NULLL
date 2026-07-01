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
    return "Ce mail existe deja. Connecte-toi.";
  }

  if (normalized.includes("password")) {
    return "Mot de passe trop fragile. Mets plus solide.";
  }

  return "Inscription bloquee. Verifie les infos.";
}

export async function registerMember(_previousState: RegisterState, formData: FormData): Promise<RegisterState> {
  const firstName = readRequiredString(formData, "first_name");
  const lastName = readRequiredString(formData, "last_name");
  const email = readRequiredString(formData, "email").toLowerCase();
  const password = readRequiredString(formData, "password");
  const acceptsWaiver = formData.get("waiver") === "on";

  if (!firstName || !lastName || !email || !password) {
    return { error: "Tous les champs. Pas a moitie." };
  }

  if (!acceptsWaiver) {
    return { error: "Lis et accepte la decharge. Obligatoire." };
  }

  let serviceSupabase;

  try {
    serviceSupabase = createSupabaseServiceClient();
  } catch {
    return { error: "Connexion membre indisponible: variables Supabase manquantes." };
  }

  const { error: configError } = await serviceSupabase.from("app_config").select("key").limit(1);

  if (configError) {
    return { error: "Base pas prete. Lance la migration Supabase d'abord." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Connexion membre indisponible: variables Supabase manquantes." };
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
    return { error: "Compte cree, profil bloque. Reessaie la connexion." };
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
    return { error: "Connexion membre indisponible: variables Supabase manquantes." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { error: "Acces refuse. Verifie tes infos." };
  }

  redirect("/membre");
}

export async function resetMemberPassword(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const email = readRequiredString(formData, "email").toLowerCase();

  if (!email) {
    return { error: "Mets ton mail." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Reset indisponible: variables Supabase manquantes." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}/membre/login`
  });

  if (error) {
    return { error: "Lien impossible a envoyer." };
  }

  return { message: "Lien envoye si le compte existe." };
}
