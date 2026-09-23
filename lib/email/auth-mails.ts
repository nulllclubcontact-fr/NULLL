import "server-only";
import { createSupabaseServiceClient } from "../supabase/service";
import { echapper, rendreEmail } from "./gabarit";

/**
 * Mails de compte (confirmation d'adresse, mot de passe oublie) envoyes
 * par nous, depuis nulll.club.
 *
 * Avant, Supabase les envoyait par son serveur partage : Apple le bloque
 * sans un mot, et aucune inscription en @icloud.com n'aboutissait (23/09/2026).
 * On fabrique donc le lien avec la cle de service — generateLink n'envoie
 * rien — et on le poste par Resend, avec SPF et DKIM au nom du domaine.
 */

const FROM = process.env.RESEND_FROM_MEMBRES || "NULLL.CLUB <sorties@nulll.club>";
const REPONSE = "contact@nulll.club";

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://nulll.club";
}

async function poster(contenu: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquante");
  }

  const reponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, reply_to: REPONSE, ...contenu })
  });

  if (!reponse.ok) {
    throw new Error(`Resend ${reponse.status} ${await reponse.text()}`);
  }
}

/**
 * Cree le compte et envoie le lien de confirmation. Renvoie l'utilisateur
 * cree, ou le message d'erreur de Supabase pour que l'appelant le traduise.
 */
export async function creerCompteEtEnvoyerConfirmation(email: string, password: string, sortie: string | null) {
  const service = createSupabaseServiceClient();
  const suite = sortie ? `/membre?sortie=${encodeURIComponent(sortie)}` : "/membre";

  const { data, error } = await service.auth.admin.generateLink({ type: "signup", email, password });

  if (error || !data?.user || !data.properties?.hashed_token) {
    return { user: null, erreur: error?.message ?? "signup_failed" };
  }

  // On construit notre propre lien : le jeton est echange cote serveur par
  // /auth/confirme, qui pose les cookies de session.
  const lien = `${siteUrl()}/auth/confirme?token=${data.properties.hashed_token}&type=signup&next=${encodeURIComponent(suite)}`;

  await poster({
    to: [email],
    subject: "Confirme ton adresse · NULLL.CLUB",
    text: [
      "Bienvenue au club !",
      "",
      "Confirme ton adresse en ouvrant ce lien :",
      lien,
      "",
      "Ensuite, choisis ta sortie et ton QR t’attend dans ton espace membre.",
      "Si tu n’as pas créé de compte sur nulll.club, ignore ce message."
    ].join("\n"),
    html: rendreEmail({
      preheader: "Un clic pour confirmer ton adresse et activer ton compte.",
      titre: "Confirme ton adresse",
      intro:
        "Bienvenue au club ! Il reste une étape : confirme ton adresse. Ensuite, tu choisis ta sortie et ton QR t’attend dans ton espace membre.",
      bouton: { libelle: "Confirmer mon adresse", href: lien },
      pied: `Si le bouton ne marche pas, copie ce lien dans ton navigateur : ${echapper(lien)}. Si tu n’as pas créé de compte sur nulll.club, ignore ce message.`
    })
  });

  return { user: data.user, erreur: null };
}

/**
 * Envoie le lien de choix d'un nouveau mot de passe. Ne dit jamais si
 * l'adresse a un compte : le message affiche est le meme dans les deux cas.
 */
export async function envoyerLienMotDePasse(email: string) {
  const service = createSupabaseServiceClient();

  const { data, error } = await service.auth.admin.generateLink({ type: "recovery", email });

  // Adresse inconnue : Supabase refuse, et c'est tant mieux. On se tait.
  if (error || !data?.properties?.hashed_token) {
    return;
  }

  const lien = `${siteUrl()}/auth/confirme?token=${data.properties.hashed_token}&type=recovery&next=${encodeURIComponent("/membre/mot-de-passe")}`;

  await poster({
    to: [email],
    subject: "Ton nouveau mot de passe · NULLL.CLUB",
    text: [
      "Tu as demandé à changer ton mot de passe.",
      "",
      "Ouvre ce lien pour en choisir un nouveau :",
      lien,
      "",
      "Le lien ne sert qu’une fois. Si ce n’est pas toi, ignore ce message : ton mot de passe ne change pas."
    ].join("\n"),
    html: rendreEmail({
      preheader: "Un clic pour choisir un nouveau mot de passe.",
      titre: "Nouveau mot de passe",
      intro: "Tu as demandé à changer ton mot de passe. Choisis-en un nouveau avec le bouton ci-dessous.",
      bouton: { libelle: "Choisir un mot de passe", href: lien },
      pied: `Le lien ne sert qu’une fois. Si ce n’est pas toi, ignore ce message : ton mot de passe ne change pas. Lien complet : ${echapper(lien)}`
    })
  });
}
