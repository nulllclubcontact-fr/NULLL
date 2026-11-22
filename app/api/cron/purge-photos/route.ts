import { NextResponse } from "next/server";
import { BUCKET_PHOTOS_SORTIES, CONSERVATION_PHOTOS_JOURS, photosExpirees } from "../../../../lib/photos-sorties/regles";
import { createSupabaseServiceClient } from "../../../../lib/supabase/service";

/**
 * Purge quotidienne (cron Vercel) : supprime les photos des sorties passees
 * depuis plus de 7 jours, miniatures comprises. Regle decidee par le club :
 * les photos restent une semaine, le temps que chacun recupere les siennes.
 * Ca libere le stockage et surtout le transfert du forfait gratuit Supabase.
 *
 * Protegee par CRON_SECRET (Vercel l'envoie en Authorization: Bearer ...).
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(requete: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || requete.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const service = createSupabaseServiceClient();
  const limite = new Date(Date.now() - CONSERVATION_PHOTOS_JOURS * 24 * 3600 * 1000).toISOString();
  const { data: sorties, error } = await service.from("races").select("id, start_datetime").lt("start_datetime", limite);
  if (error) return NextResponse.json({ ok: false, etape: "sorties" }, { status: 503 });

  const stockage = service.storage.from(BUCKET_PHOTOS_SORTIES);
  let supprimees = 0;
  const purgees: string[] = [];

  for (const sortie of sorties ?? []) {
    if (!photosExpirees(sortie.start_datetime)) continue;
    const chemins: string[] = [];
    for (const dossier of [sortie.id, `${sortie.id}/mini`]) {
      const { data: fichiers, error: erreurListe } = await stockage.list(dossier, { limit: 1000 });
      if (erreurListe) {
        // Bucket absent : aucune photo n'a jamais ete envoyee.
        if (erreurListe.message.toLowerCase().includes("not found")) continue;
        return NextResponse.json({ ok: false, etape: "liste", supprimees }, { status: 503 });
      }
      for (const f of fichiers ?? []) if (f.id && !f.name.startsWith(".")) chemins.push(`${dossier}/${f.name}`);
    }
    for (let i = 0; i < chemins.length; i += 100) {
      const { error: erreurSuppression } = await stockage.remove(chemins.slice(i, i + 100));
      if (erreurSuppression) return NextResponse.json({ ok: false, etape: "suppression", supprimees }, { status: 503 });
      supprimees += Math.min(100, chemins.length - i);
    }
    if (chemins.length) purgees.push(sortie.id);
  }

  return NextResponse.json({ ok: true, supprimees, sorties: purgees.length });
}
