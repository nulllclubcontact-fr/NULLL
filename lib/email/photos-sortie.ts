import "server-only";
import { formatJour } from "../../components/races/format";
import { siteUrl } from "./auth-mails";
import { echapper, rendreEmail } from "./gabarit";
import { createSupabaseServiceClient } from "../supabase/service";

const FROM = process.env.RESEND_FROM_MEMBRES || "NULLL.CLUB <sorties@nulll.club>";
const REPONSE = "contact@nulll.club";

type Inscrit = { user_id: string; profiles: { first_name: string | null } | null };

/**
 * Previent chaque inscrit (present ou attendu) que les photos de la sortie
 * sont en ligne, avec le lien vers sa page de telechargement. Le lien mene
 * a l'espace membre : les photos ne sont jamais publiques.
 */
export async function envoyerPhotosDisponibles(raceId: string): Promise<{ envoyes: number; sansEmail: number } | { erreur: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { erreur: "Envoi des mails non configuré (RESEND_API_KEY)." };

  const service = createSupabaseServiceClient();
  const [{ data: course }, { data: inscrits, error }] = await Promise.all([
    service.from("races").select("title,start_datetime").eq("id", raceId).maybeSingle<{ title: string; start_datetime: string }>(),
    service.from("race_registrations").select("user_id,profiles(first_name)").eq("race_id", raceId).in("status", ["registered", "checked_in"]).returns<Inscrit[]>()
  ]);

  if (error || !course) return { erreur: "Sortie ou inscrits introuvables." };

  const jour = formatJour(course.start_datetime);
  const lien = `${siteUrl()}/membre/sorties/${raceId}/photos`;
  const mails: Record<string, unknown>[] = [];
  let sansEmail = 0;

  for (const inscrit of inscrits ?? []) {
    const { data: compte } = await service.auth.admin.getUserById(inscrit.user_id);
    const email = compte?.user?.email;
    if (!email) {
      sansEmail++;
      continue;
    }
    const prenom = inscrit.profiles?.first_name;
    mails.push({
      from: FROM,
      to: [email],
      reply_to: REPONSE,
      subject: `Les photos du ${jour} sont là`,
      text: [`Salut${prenom ? `, ${prenom}` : ""} !`, "", `Les photos de la sortie du ${jour} sont en ligne.`, `Télécharge-les ici : ${lien}`, "", "À samedi."].join("\n"),
      html: rendreEmail({
        preheader: `Les photos de la sortie du ${jour} t’attendent.`,
        titre: "Les photos sont là.",
        intro: `Salut${prenom ? `, ${echapper(prenom)}` : ""} ! Les photos de la sortie du ${echapper(jour)} sont en ligne, rien que pour les inscrits.`,
        bouton: { libelle: "Télécharger les photos", href: lien },
        pied: "Le lien s’ouvre dans ton espace membre NULLL.CLUB."
      })
    });
  }

  // Resend accepte 100 mails par lot.
  let envoyes = 0;
  for (let i = 0; i < mails.length; i += 100) {
    const lot = mails.slice(i, i + 100);
    const reponse = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(lot)
    });
    if (!reponse.ok) {
      console.error("Mails des photos refusés par Resend", reponse.status, await reponse.text());
      return envoyes > 0 ? { envoyes, sansEmail } : { erreur: "Resend a refusé l’envoi des mails." };
    }
    envoyes += lot.length;
  }

  return { envoyes, sansEmail };
}
