import { createSupabaseServiceClient } from "../../../lib/supabase/service";

/**
 * Sonde de disponibilite pour la supervision (Gatus, StatusCake, Vercel
 * Checks) : 200 si le site repond et joint sa base, 503 sinon. Pas de
 * detail sur l'infrastructure dans la reponse, juste l'etat.
 *
 * Les sondes ne polluent pas le compteur de visites : elles n'appellent
 * pas /api/visite, et leur user-agent est de toute facon ecarte.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const debut = Date.now();
  let base: "ok" | "erreur" = "ok";

  try {
    const { error } = await createSupabaseServiceClient().from("app_config").select("*", { head: true, count: "exact" }).limit(1);
    if (error) base = "erreur";
  } catch {
    base = "erreur";
  }

  const ok = base === "ok";

  return Response.json(
    { ok, base, latence_ms: Date.now() - debut },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } }
  );
}
