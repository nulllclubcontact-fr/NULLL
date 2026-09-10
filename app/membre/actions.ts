"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { preparerProfilFournisseur } from "../../lib/auth/profil-fournisseur";
import { normaliserTelephone } from "../../lib/auth/telephone";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { createSupabaseServiceClient } from "../../lib/supabase/service";
import { MARQUEUR_SESSION_COURTE } from "../../lib/supabase/session";

/** Etat commun des formulaires d'acces ; etape « code » = attente du SMS. */
export type CodeState = {
  error?: string;
  message?: string;
  etape?: "code";
  telephone?: string;
};

export type RegisterState = CodeState;
export type LoginState = CodeState;

const WAIVER_VERSION = "v1-2026-06";
const NUMERO_ILLISIBLE = "Numéro illisible. Exemple : 06 12 34 56 78.";

function readRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getSignupMessage(message: string, parTelephone: boolean) {
  const normalized = message.toLowerCase();

  if (normalized.includes("already") || normalized.includes("registered")) {
    return parTelephone ? "Ce numéro a déjà un compte. Connecte-toi." : "Ce mail existe déjà. Connecte-toi.";
  }

  if (normalized.includes("password")) {
    return "Mot de passe trop fragile. Mets plus solide.";
  }

  if (parTelephone && (normalized.includes("disabled") || normalized.includes("provider"))) {
    return "Inscription par téléphone indisponible pour le moment. Passe par l’e-mail.";
  }

  if (parTelephone && (normalized.includes("sms") || normalized.includes("otp"))) {
    return "SMS impossible à envoyer. Vérifie le numéro ou réessaie dans une minute.";
  }

  return "Inscription bloquée. Vérifie les infos.";
}

/** « Se souvenir de moi » : le marqueur survit a la connexion pour les renouvellements. */
async function noterChoixSouvenir(souvenir: boolean) {
  const cookieStore = await cookies();

  if (souvenir) {
    cookieStore.delete(MARQUEUR_SESSION_COURTE);
    return;
  }

  cookieStore.set(MARQUEUR_SESSION_COURTE, "1", {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function registerMember(_previousState: RegisterState, formData: FormData): Promise<RegisterState> {
  const parTelephone = formData.get("mode") === "telephone";
  const firstName = readRequiredString(formData, "first_name");
  const lastName = readRequiredString(formData, "last_name");
  const email = parTelephone ? "" : readRequiredString(formData, "email").toLowerCase();
  const saisieTelephone = parTelephone ? readRequiredString(formData, "phone") : "";
  const telephone = parTelephone ? normaliserTelephone(saisieTelephone) : null;
  const password = readRequiredString(formData, "password");
  const acceptsWaiver = formData.get("waiver") === "on";

  if (parTelephone && saisieTelephone && !telephone) {
    return { error: NUMERO_ILLISIBLE };
  }

  if (!firstName || !lastName || !password || (parTelephone ? !telephone : !email)) {
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

  // Par telephone, Supabase envoie un code SMS (via /api/auth/sms) et
  // n'ouvre la session qu'une fois ce code saisi.
  const { data, error } = telephone
    ? await supabase.auth.signUp({ phone: telephone, password })
    : await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    return { error: getSignupMessage(error?.message ?? "", parTelephone) };
  }

  const { error: profileError } = await serviceSupabase.from("profiles").upsert(
    {
      id: data.user.id,
      email: email || null,
      ...(telephone ? { phone: telephone } : {}),
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

  if (telephone) {
    return { etape: "code", telephone };
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

/** Le code SMS de l'inscription confirme le numero et ouvre la session. */
export async function verifierCodeInscription(_previousState: CodeState, formData: FormData): Promise<CodeState> {
  const telephone = normaliserTelephone(readRequiredString(formData, "telephone"));
  const code = readRequiredString(formData, "code").replace(/\D/g, "");

  if (!telephone || code.length !== 6) {
    return { etape: "code", telephone: telephone ?? undefined, error: "Le code fait 6 chiffres." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { etape: "code", telephone, error: "Vérification indisponible pour le moment." };
  }

  const { error } = await supabase.auth.verifyOtp({ phone: telephone, token: code, type: "sms" });

  if (error) {
    return { etape: "code", telephone, error: "Code faux ou expiré. Redemande-en un." };
  }

  redirect("/membre");
}

export async function renvoyerCodeInscription(_previousState: CodeState, formData: FormData): Promise<CodeState> {
  const telephone = normaliserTelephone(readRequiredString(formData, "telephone"));

  if (!telephone) {
    return { error: NUMERO_ILLISIBLE };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { etape: "code", telephone, error: "Envoi indisponible pour le moment." };
  }

  const { error } = await supabase.auth.resend({ type: "sms", phone: telephone });

  if (error) {
    return { etape: "code", telephone, error: "Attends une minute avant de redemander un code." };
  }

  return { etape: "code", telephone, message: "Nouveau code envoyé." };
}

export async function loginMember(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  // « email » reste lu pour un formulaire encore en cache d'une ancienne version.
  const identifiant = readRequiredString(formData, "identifiant") || readRequiredString(formData, "email");
  const password = readRequiredString(formData, "password");
  const souvenir = formData.get("souvenir") === "on";

  if (!identifiant || !password) {
    return { error: "Identifiant et mot de passe. Les deux." };
  }

  let identifiants: { email: string; password: string } | { phone: string; password: string };

  if (identifiant.includes("@")) {
    identifiants = { email: identifiant.toLowerCase(), password };
  } else {
    const telephone = normaliserTelephone(identifiant);

    if (!telephone) {
      return { error: NUMERO_ILLISIBLE };
    }

    identifiants = { phone: telephone, password };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient({ sessionCourte: !souvenir });
  } catch {
    return { error: "Connexion membre indisponible : variables Supabase manquantes." };
  }

  const { data, error } = await supabase.auth.signInWithPassword(identifiants);

  if (error || !data.user) {
    return { error: "Accès refusé. Vérifie tes infos." };
  }

  await noterChoixSouvenir(souvenir);

  // Un compte administrateur atterrit directement sur sa vue d'ensemble :
  // passer par l'espace membre pour cliquer ensuite sur « Administration »
  // est un detour inutile le jour d'une course.
  const { data: profil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle<{ role: string | null }>();

  redirect(profil?.role === "admin" ? "/admin/dashboard" : "/membre");
}

export async function resetMemberPassword(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  // « telephone » : le bouton « Renvoyer le code » repasse par ici.
  const identifiant =
    readRequiredString(formData, "identifiant") || readRequiredString(formData, "email") || readRequiredString(formData, "telephone");

  if (!identifiant) {
    return { error: "Mets ton e-mail ou ton numéro." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Réinitialisation indisponible : variables Supabase manquantes." };
  }

  if (!identifiant.includes("@")) {
    const telephone = normaliserTelephone(identifiant);

    if (!telephone) {
      return { error: NUMERO_ILLISIBLE };
    }

    const { error } = await supabase.auth.signInWithOtp({ phone: telephone, options: { shouldCreateUser: false } });

    if (error && /disabled|provider/i.test(error.message)) {
      return { error: "Réinitialisation par SMS indisponible pour le moment. Passe par ton e-mail." };
    }

    // Meme reponse que le numero ait un compte ou non : on ne revele pas
    // qui est inscrit au club.
    return { etape: "code", telephone, message: "Code envoyé si ce numéro a un compte." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(identifiant.toLowerCase(), {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://nulll.club"}/auth/callback?next=/membre/mot-de-passe`
  });

  if (error) {
    return { error: "Lien impossible à envoyer." };
  }

  return { message: "Lien envoye si le compte existe." };
}

/** Code SMS du mot de passe oublie : ouvre la session, puis le choix du nouveau mot de passe. */
export async function verifierCodeReinitialisation(_previousState: CodeState, formData: FormData): Promise<CodeState> {
  const telephone = normaliserTelephone(readRequiredString(formData, "telephone"));
  const code = readRequiredString(formData, "code").replace(/\D/g, "");

  if (!telephone || code.length !== 6) {
    return { etape: "code", telephone: telephone ?? undefined, error: "Le code fait 6 chiffres." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { etape: "code", telephone, error: "Vérification indisponible pour le moment." };
  }

  const { error } = await supabase.auth.verifyOtp({ phone: telephone, token: code, type: "sms" });

  if (error) {
    return { etape: "code", telephone, error: "Code faux ou expiré. Redemande-en un." };
  }

  redirect("/membre/mot-de-passe");
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

  // La session vient du lien reçu par mail (échangé par /auth/callback) ou
  // du code reçu par SMS. Sans elle, updateUser changerait le mot de passe
  // de personne.
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

/**
 * Premiere arrivee par Google ou Apple : le membre verifie son nom et
 * signe la decharge, que le formulaire d'inscription recueillait sinon.
 */
export async function accepterDecharge(_previousState: CodeState, formData: FormData): Promise<CodeState> {
  const firstName = readRequiredString(formData, "first_name");
  const lastName = readRequiredString(formData, "last_name");

  if (!firstName || !lastName) {
    return { error: "Ton prénom et ton nom, pour ta carte de membre." };
  }

  if (formData.get("waiver") !== "on") {
    return { error: "Lis et accepte la décharge. Obligatoire." };
  }

  let supabase;
  let serviceSupabase;

  try {
    supabase = await createSupabaseServerClient();
    serviceSupabase = createSupabaseServiceClient();
  } catch {
    return { error: "Connexion membre indisponible : variables Supabase manquantes." };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/membre/login");
  }

  const { error } = await serviceSupabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      first_name: firstName,
      last_name: lastName,
      consent_waiver: true,
      consent_waiver_version: WAIVER_VERSION,
      consent_at: new Date().toISOString()
    },
    { onConflict: "id" }
  );

  if (error) {
    return { error: "Enregistrement bloqué. Réessaie." };
  }

  const { data: profil } = await serviceSupabase.from("profiles").select("role").eq("id", user.id).maybeSingle<{ role: string | null }>();

  redirect(profil?.role === "admin" ? "/admin/dashboard" : "/membre");
}

/**
 * Apres une connexion par le bouton Google officiel, faite dans la page :
 * meme suite que /auth/callback (profil, decharge), puis la bonne porte.
 */
export async function destinationApresFournisseur(): Promise<string> {
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return "/membre/login?erreur=config";
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return "/membre/login?erreur=fournisseur";
  }

  try {
    if (await preparerProfilFournisseur(user)) {
      return "/membre/bienvenue";
    }
  } catch {
    // Sans service role, l'espace membre renverra lui-meme vers la decharge.
  }

  const { data: profil } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle<{ role: string | null }>();

  return profil?.role === "admin" ? "/admin/dashboard" : "/membre";
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
  (await cookies()).delete(MARQUEUR_SESSION_COURTE);
  redirect("/membre/login");
}
