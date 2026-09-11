import { NextResponse } from "next/server";
import { blocCitation, echapper, rendreEmail } from "../../../lib/email/gabarit";
import { adresseAppelant, essaiAutorise } from "../../../lib/limite";

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
 * Limite d'envoi : 5 messages par quart d'heure et par adresse, comptes en
 * base pour valoir sur toutes les instances. Sans elle on pouvait marteler
 * le formulaire, vider le quota Resend et le faire taire pour les vrais
 * visiteurs. Le piege a robots n'arrete que ceux qui remplissent tout.
 */
const FENETRE_SECONDES = 15 * 60;
const MAX_ENVOIS = 5;

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

  // « null » ou un tableau sont du JSON valide : sans ce test, lire un
  // champ plantait la route en 500.
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  // Champ piege : invisible et laisse vide par un humain, rempli par la
  // plupart des robots qui remplissent tout ce qu'ils trouvent.
  if (readString(payload.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const email = readString(payload.email, 160);
  const brut = typeof payload.message === "string" ? payload.message.trim() : "";

  // Le formulaire borne deja la saisie : un message plus long ne vient que
  // d'un envoi direct. On le refuse plutot que de le tronquer en silence.
  if (brut.length > 5000) {
    return NextResponse.json({ message: "Message trop long : 5 000 caractères au maximum." }, { status: 400 });
  }

  const message = brut;

  if (!isEmail(email) || message.length < 2) {
    return NextResponse.json({ message: "Merci de remplir les deux champs." }, { status: 400 });
  }

  if (!(await essaiAutorise("contact", adresseAppelant(request.headers), FENETRE_SECONDES, MAX_ENVOIS))) {
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
        subject: `Message depuis nulll.club · ${email}`,
        // Les deux versions partent ensemble : le client affiche le HTML
        // s'il le peut, le texte sinon. Un e-mail sans version texte est
        // aussi plus souvent classe en indesirable.
        text: [`De : ${email}`, "", message].join("\n"),
        html: rendreEmail({
          preheader: `Nouveau message de ${email}`,
          titre: "Nouveau message",
          // L'adresse passe le controle de format mais peut contenir < ou > :
          // echappee, elle ne peut pas injecter de HTML dans le message.
          intro: `Envoyé depuis le formulaire de <strong>nulll.club</strong> par <strong>${echapper(email)}</strong>.`,
          corps: blocCitation(message),
          pied: "Réponds directement à cet e-mail, ta réponse partira vers l’expéditeur."
        })
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
