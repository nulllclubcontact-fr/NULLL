import { NextResponse } from "next/server";

const CONTACT_EMAIL = "contact@nulll.club";

/**
 * Adresse d'expedition : elle doit appartenir a un domaine verifie chez
 * Resend. Tant que nulll.club ne l'est pas, RESEND_FROM peut pointer sur
 * onboarding@resend.dev, qui fonctionne sans verification.
 */
const FROM = process.env.RESEND_FROM || "NULLL.CLUB <onboarding@resend.dev>";

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
