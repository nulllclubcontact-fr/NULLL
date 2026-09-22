import "server-only";
import QRCode from "qrcode";
import { formatHeure, formatJour } from "../../components/races/format";
import { encodeMemberQrToken } from "../qr/token";
import { createSupabaseServiceClient } from "../supabase/service";
import { echapper, rendreEmail } from "./gabarit";

/**
 * Expediteur des mails aux membres. Il doit etre sur un domaine verifie
 * chez Resend : tant que nulll.club ne l'est pas, Resend refuse l'envoi et
 * seule la trace console en garde la marque. L'inscription, elle, passe.
 */
const FROM = process.env.RESEND_FROM_MEMBRES || "NULLL.CLUB <sorties@nulll.club>";
const REPONSE = "contact@nulll.club";

type Inscription = {
  qr_code_token: string;
  races: { title: string; start_datetime: string; distance_km: number | string | null; location: string | null } | null;
};

/**
 * Envoie au membre le QR de son inscription, en image dans le mail et en
 * piece jointe. L'image est jointe (cid) plutot qu'en data: URI, que Gmail
 * et Outlook bloquent. Ne leve jamais : un mail rate ne doit pas faire
 * echouer l'inscription, le QR reste dans l'espace membre.
 */
export async function envoyerQrInscription(userId: string, raceId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    const service = createSupabaseServiceClient();
    const [{ data: compte }, { data: inscription }, { data: profil }] = await Promise.all([
      service.auth.admin.getUserById(userId),
      service
        .from("race_registrations")
        .select("qr_code_token,races(title,start_datetime,distance_km,location)")
        .eq("user_id", userId)
        .eq("race_id", raceId)
        .neq("status", "cancelled")
        .maybeSingle<Inscription>(),
      service.from("profiles").select("first_name").eq("id", userId).maybeSingle<{ first_name: string | null }>()
    ]);

    // Compte ouvert par telephone : pas d'adresse, pas de mail.
    const email = compte?.user?.email;
    if (!email || !inscription?.races) return;

    const reponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(
        await construireMailQr({ email, prenom: profil?.first_name ?? null, token: inscription.qr_code_token, course: inscription.races })
      )
    });

    if (!reponse.ok) {
      console.error("Mail du QR refusé par Resend", reponse.status, await reponse.text());
    }
  } catch (erreur) {
    console.error("Mail du QR impossible", erreur);
  }
}

/** Le mail lui-meme, separe de l'envoi pour pouvoir le relire en test. */
export async function construireMailQr({
  email,
  prenom,
  token,
  course
}: {
  email: string;
  prenom: string | null;
  token: string;
  course: NonNullable<Inscription["races"]>;
}) {
  const jour = formatJour(course.start_datetime);
  const heure = formatHeure(course.start_datetime);
  const lieu = course.location || "Parking du chemin de la Cible, près du lycée Émile Zola";
  // Supabase rend le numeric en texte (« 5.00 ») : on le veut en « 5 km ».
  const km = Number(course.distance_km);
  const distance = km > 0 ? ` · ${km.toLocaleString("fr-FR")} km` : "";
  const salut = prenom ? `, ${prenom}` : "";

  const png = await QRCode.toBuffer(encodeMemberQrToken(token), {
    errorCorrectionLevel: "M",
    type: "png",
    width: 480,
    margin: 2,
    color: { dark: "#773331", light: "#ffffff" }
  });

  const corps = `<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
    <tr><td align="center" style="padding:8px 0 20px">
      <img src="cid:qr-inscription" width="240" height="240" alt="Ton QR code NULLL.CLUB" style="display:block;width:240px;height:240px;border:2px solid #773331;background:#ffffff">
    </td></tr>
    <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#773331;background:#FFB200;border:2px solid #773331;padding:14px 18px">
      <strong style="text-transform:uppercase">${echapper(jour)} · ${echapper(heure)}${echapper(distance)}</strong><br>
      ${echapper(lieu)}
    </td></tr>
  </table>`;

  return {
    from: FROM,
    to: [email],
    reply_to: REPONSE,
    subject: `Ton QR pour la sortie du ${jour}`,
    text: [
      `Salut${salut} !`,
      "",
      `Tu es inscrit·e à la sortie du ${jour} à ${heure}${distance}.`,
      lieu,
      "",
      "Ton QR code est en pièce jointe. Montre-le en arrivant, on le scanne et c'est parti.",
      "Il est aussi dans ton espace membre : https://nulll.club/membre"
    ].join("\n"),
    html: rendreEmail({
      preheader: `Ton QR pour le ${jour} à ${heure}. Montre-le en arrivant.`,
      titre: "Ton QR est prêt",
      intro: `Salut${echapper(salut)} ! Tu es inscrit·e. Montre ce QR en arrivant, on le scanne et c’est parti.`,
      corps,
      bouton: { libelle: "Mon espace membre", href: "https://nulll.club/membre" },
      pied: "Tu ne peux plus venir ? Annule depuis ton espace membre, ça libère la place pour quelqu’un d’autre."
    }),
    attachments: [
      {
        filename: "NULLL-QR.png",
        content: png.toString("base64"),
        content_type: "image/png",
        content_id: "qr-inscription"
      }
    ]
  };
}
