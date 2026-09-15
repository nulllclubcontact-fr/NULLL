"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { preparerProfilFournisseur } from "../../lib/auth/profil-fournisseur";
import { normaliserTelephone } from "../../lib/auth/telephone";
import { VERSION_DECHARGE } from "../../lib/decharge";
import { adresseAppelant, essaiAutorise, oublierEssais } from "../../lib/limite";
import { destinationMembre, suiteSortie } from "../../lib/races/sortie-choisie";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { createSupabaseServiceClient } from "../../lib/supabase/service";
import { MARQUEUR_SESSION_COURTE } from "../../lib/supabase/session";
import { adresseRetourInscription } from "./confirmation-actions";

/**
 * Etat commun des formulaires d'acces. Etape « code » = attente du SMS,
 * « email » = attente du clic dans le mail de confirmation.
 */
export type CodeState = {
  error?: string;
  message?: string;
  etape?: "code" | "email";
  telephone?: string;
  email?: string;
  /** Connexion refusee faute de confirmation : l'adresse, pour renvoyer le mail. */
  nonConfirme?: string;
};

export type RegisterState = CodeState;
export type LoginState = CodeState;

const WAIVER_VERSION = VERSION_DECHARGE;
const NUMERO_ILLISIBLE = "Numéro illisible. Exemple : 06 12 34 56 78.";

function readRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

/** Un mot de passe se lit tel quel : un espace au bord en fait partie. */
function readPassword(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
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
  const password = readPassword(formData, "password");
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

  // Les appels partent du serveur : Supabase voit l'adresse de Vercel, pas
  // celle du visiteur. La limite par connexion se tient donc ici.
  if (!(await essaiAutorise("inscription-ip", adresseAppelant(await headers()), 3600, 10))) {
    return { error: "Trop d’inscriptions depuis cette connexion. Réessaie dans une heure." };
  }

  let serviceSupabase;

  try {
    serviceSupabase = createSupabaseServiceClient();
  } catch {
    return { error: "Connexion membre indisponible : variables Supabase manquantes." };
  }

  const { error: configError } = await serviceSupabase.from("app_config").select("key").limit(1);

  if (configError) {
    return { error: "La création de compte est indisponible. Réessaie dans quelques minutes." };
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
    : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: await adresseRetourInscription(formData.get("sortie")) } });

  if (error || !data.user) {
    return { error: getSignupMessage(error?.message ?? "", parTelephone) };
  }

  // Adresse deja inscrite et confirmee : Supabase ne renvoie pas d'erreur
  // mais un compte factice, sans identite, pour ne pas reveler qui est
  // inscrit. Ecrire son profil echouait (« profil bloque ») et revelait
  // justement l'inscription. Meme ecran qu'une vraie creation.
  if (!telephone && data.user.identities?.length === 0) {
    return { etape: "email", email };
  }

  // Adresse deja inscrite mais pas encore confirmee : Supabase renvoie le
  // vrai compte et renvoie le mail. On ne reecrit pas son profil, sinon
  // quiconque connait l'adresse remplacerait le nom et la decharge.
  const compteRecent = Date.now() - Date.parse(data.user.created_at) < 2 * 60 * 1000;

  if (!compteRecent) {
    return telephone ? { etape: "code", telephone } : { etape: "email", email };
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
  // session. Le formulaire affiche alors « regarde tes mails », avec le
  // renvoi du lien, au lieu d'une page de connexion inutile a ce stade.
  // On teste la session plutot que de supposer le reglage.
  if (!data.session) {
    return { etape: "email", email };
  }

  redirect(destinationMembre(formData.get("sortie")));
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

  redirect(destinationMembre(formData.get("sortie")));
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
  const password = readPassword(formData, "password");
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

  // Supabase voit l'adresse du serveur, commune a tous : sa limite ne
  // distingue pas un visiteur d'un autre. Celle-ci freine les essais en
  // serie sur un compte ou depuis une connexion.
  const cleIdentifiant = identifiant.toLowerCase();
  const ip = adresseAppelant(await headers());

  if (!(await essaiAutorise("connexion-ip", ip, 900, 30)) || !(await essaiAutorise("connexion", cleIdentifiant, 900, 10))) {
    return { error: "Trop d’essais. Attends quelques minutes avant de réessayer." };
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient({ sessionCourte: !souvenir });
  } catch {
    return { error: "Connexion membre indisponible : variables Supabase manquantes." };
  }

  const { data, error } = await supabase.auth.signInWithPassword(identifiants);

  if (error || !data.user) {
    // Supabase ne le dit qu'avec le bon mot de passe : rien n'est revele a
    // qui ne connait pas deja le compte.
    if (error?.code === "email_not_confirmed" && "email" in identifiants) {
      return { error: "Adresse pas encore confirmée. Ouvre le mail reçu à l’inscription, ou renvoie-le.", nonConfirme: identifiants.email };
    }

    return { error: "Accès refusé. Vérifie tes infos." };
  }

  await oublierEssais("connexion", cleIdentifiant);
  await noterChoixSouvenir(souvenir);

  // Un compte administrateur atterrit directement sur sa vue d'ensemble :
  // passer par l'espace membre pour cliquer ensuite sur « Administration »
  // est un detour inutile le jour d'une course.
  const { data: profil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle<{ role: string | null }>();

  redirect(profil?.role === "admin" ? "/admin/dashboard" : destinationMembre(formData.get("sortie")));
}

export async function resetMemberPassword(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  // « telephone » : le bouton « Renvoyer le code » repasse par ici.
  const identifiant =
    readRequiredString(formData, "identifiant") || readRequiredString(formData, "email") || readRequiredString(formData, "telephone");

  if (!identifiant) {
    return { error: "Mets ton e-mail ou ton numéro." };
  }

  // Meme reponse que le compte existe ou non : la limite ne revele rien.
  const ipReinitialisation = adresseAppelant(await headers());

  if (
    !(await essaiAutorise("reinitialisation-ip", ipReinitialisation, 3600, 20)) ||
    !(await essaiAutorise("reinitialisation", identifiant.toLowerCase(), 3600, 5))
  ) {
    return { error: "Trop de demandes. Réessaie dans une heure." };
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

  return { message: "Lien envoyé si le compte existe. Regarde aussi dans les spams." };
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
  const password = readPassword(formData, "password");
  const confirmation = readPassword(formData, "password_confirmation");

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

  redirect(destinationMembre(formData.get("sortie")));
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

  redirect(profil?.role === "admin" ? "/admin/dashboard" : destinationMembre(formData.get("sortie")));
}

/**
 * Apres une connexion par le bouton Google officiel, faite dans la page :
 * meme suite que /auth/callback (profil, decharge), puis la bonne porte.
 */
export async function destinationApresFournisseur(sortie?: string): Promise<string> {
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
      return `/membre/bienvenue${suiteSortie(sortie)}`;
    }
  } catch {
    // Sans service role, l'espace membre renverra lui-meme vers la decharge.
  }

  const { data: profil } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle<{ role: string | null }>();

  return profil?.role === "admin" ? "/admin/dashboard" : destinationMembre(sortie);
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
