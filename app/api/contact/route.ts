import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

/**
 * Destinataire des messages. Configurable parce que tant que le domaine
 * n'est pas verifie chez Resend, l'envoi n'est autorise que vers l'adresse
 * du compte Resend — pas encore vers contact@nulll.club. Une fois le
 * domaine verifie, retirer CONTACT_TO et cette valeur reprend la main.
 */
const CONTACT_EMAIL = process.env.CONTACT_TO || "contact@nulll.club";

/**
 * Adresse d'expedition : elle doit appartenir a un domaine verifie chez
 * Resend. Tant que nulll.club ne l'est pas, RESEND_FROM peut pointer sur
 * onboarding@resend.dev, qui fonctionne sans verification.
 */
const FROM = process.env.RESEND_FROM || "NULLL.CLUB <onboarding@resend.dev>";

/**
 * Limite d'envoi.
 *
 * Les connexions pro et admin en avaient une, ce formulaire non : on
 * pouvait le marteler en boucle, vider le quota Resend et faire taire le
 * formulaire pour les vrais visiteurs. Le piege a robots ne suffit pas —
 * il n'arrete que ceux qui remplissent tous les champs.
 *
 * Comme ailleurs dans le projet, le compteur vit en memoire : sur une
 * plateforme sans etat il ne freine que par instance, mais c'est deja
 * beaucoup mieux que rien.
 */
const FENETRE_MS = 15 * 60 * 1000;
const MAX_ENVOIS = 5;
const envois = new Map<string, { compte: number; finFenetre: number }>();

function cleAppelant(request: Request) {
  const transmise = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const reelle = request.headers.get("x-real-ip")?.trim();
  // Uniquement l'adresse : un en-tete choisi par l'appelant, comme le
  // user-agent, se change a volonte et rendrait la limite inutile.
  const identite = transmise || reelle || "local";
  return createHash("sha256").update(`contact:${identite}`).digest("hex");
}

function tropDEnvois(cle: string) {
  const maintenant = Date.now();

  if (envois.size >= 2000) {
    for (const [k, etat] of envois) {
      if (etat.finFenetre < maintenant) envois.delete(k);
    }
  }

  const etat = envois.get(cle);

  if (!etat || etat.finFenetre < maintenant) {
    envois.set(cle, { compte: 1, finFenetre: maintenant + FENETRE_MS });
    return false;
  }

  etat.compte += 1;
  return etat.compte > MAX_ENVOIS;
}

function readString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  // Champ piege : invisible et laisse vide par un humain, rempli par la
  // plupart des robots qui remplissent tout ce qu'ils trouvent.
  if (readString(payload.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const email = readString(payload.email, 160);
  const message = readString(payload.message, 5000);

  if (!isEmail(email) || message.length < 2) {
    return NextResponse.json({ message: "Merci de remplir les deux champs." }, { status: 400 });
  }

  if (tropDEnvois(cleAppelant(request))) {
    return NextResponse.json(
      { message: "Trop de messages d’affilée. Attends quelques minutes, ou écris à contact@nulll.club." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "L’envoi n’est pas encore configuré. Écris-nous directement à contact@nulll.club." },
      { status: 503 }
    );
  }

  let reponse: Response;

  try {
    reponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM,
        to: [CONTACT_EMAIL],
        // Repondre depuis la boite du club ecrit directement au visiteur.
        reply_to: email,
        subject: `Message depuis nulll.club — ${email}`,
        text: [`De : ${email}`, "", message].join("\n")
      })
    });
  } catch {
    return NextResponse.json(
      { message: "Envoi impossible pour le moment. Réessaie ou écris à contact@nulll.club." },
      { status: 502 }
    );
  }

  if (!reponse.ok) {
    // Le detail de l'erreur reste au serveur : il peut contenir des
    // informations de configuration.
    console.error("Resend a refusé l’envoi", reponse.status, await reponse.text());
    return NextResponse.json(
      { message: "Envoi impossible pour le moment. Réessaie ou écris à contact@nulll.club." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
