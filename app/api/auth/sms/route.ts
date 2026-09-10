import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Send SMS Hook de Supabase : a chaque code a envoyer (inscription par
 * telephone, mot de passe oublie), Supabase appelle cette route au lieu de
 * Twilio. On transmet a SMSGate, qui fait partir le SMS depuis un telephone
 * Android du club, avec son forfait : aucun cout par message.
 *
 * Variables : SEND_SMS_HOOK_SECRET (genere dans Supabase > Auth > Hooks),
 * SMSGATE_USERNAME et SMSGATE_PASSWORD (affiches par l'app SMSGate).
 * SMSGATE_URL permet de viser un autre serveur que le cloud public.
 */

const TOLERANCE_SECONDES = 5 * 60;
const SMSGATE_URL_PAR_DEFAUT = "https://api.sms-gate.app/3rdparty/v1/messages";

// Standard Webhooks : HMAC-SHA256 de « id.horodatage.corps », cle en base64
// apres le prefixe « v1,whsec_ ». L'en-tete peut porter plusieurs signatures.
function signatureValide(corps: string, id: string | null, horodatage: string | null, signatures: string | null, secret: string) {
  if (!id || !horodatage || !signatures) {
    return false;
  }

  const ecart = Math.abs(Date.now() / 1000 - Number(horodatage));

  if (!Number.isFinite(ecart) || ecart > TOLERANCE_SECONDES) {
    return false;
  }

  const cle = Buffer.from(secret.replace(/^v1,/, "").replace(/^whsec_/, ""), "base64");
  const attendue = createHmac("sha256", cle).update(`${id}.${horodatage}.${corps}`).digest();

  return signatures.split(" ").some((entree) => {
    const [version, valeur] = entree.split(",");

    if (version !== "v1" || !valeur) {
      return false;
    }

    const recue = Buffer.from(valeur, "base64");
    return recue.length === attendue.length && timingSafeEqual(recue, attendue);
  });
}

function erreur(message: string, statut = 500) {
  return NextResponse.json({ error: { http_code: statut, message } }, { status: statut });
}

export async function POST(request: Request) {
  const secret = process.env.SEND_SMS_HOOK_SECRET;
  const utilisateur = process.env.SMSGATE_USERNAME;
  const motDePasse = process.env.SMSGATE_PASSWORD;

  if (!secret || !utilisateur || !motDePasse) {
    return erreur("Envoi de SMS non configuré.");
  }

  const corps = await request.text();
  const signee = signatureValide(
    corps,
    request.headers.get("webhook-id"),
    request.headers.get("webhook-timestamp"),
    request.headers.get("webhook-signature"),
    secret
  );

  if (!signee) {
    return erreur("Signature invalide.", 401);
  }

  let charge: { user?: { phone?: string }; sms?: { otp?: string } };

  try {
    charge = JSON.parse(corps);
  } catch {
    return erreur("Requête illisible.", 400);
  }

  // Supabase stocke le numero sans le « + » ; SMSGate l'attend en E.164.
  const telephone = charge.user?.phone?.replace(/\D/g, "");
  const code = charge.sms?.otp;

  if (!telephone || !code || !/^\d{6}$/.test(code)) {
    return erreur("Numéro ou code manquant.", 400);
  }

  // Supabase coupe le hook au bout de quelques secondes : on n'attend pas plus.
  const reponse = await fetch(process.env.SMSGATE_URL || SMSGATE_URL_PAR_DEFAUT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${utilisateur}:${motDePasse}`).toString("base64")}`
    },
    body: JSON.stringify({
      textMessage: { text: `NULLL.CLUB : ton code est ${code}. Ne le donne à personne.` },
      phoneNumbers: [`+${telephone}`]
    }),
    signal: AbortSignal.timeout(4500)
  }).catch(() => null);

  if (!reponse?.ok) {
    return erreur("SMS impossible à envoyer pour le moment.");
  }

  return NextResponse.json({});
}
