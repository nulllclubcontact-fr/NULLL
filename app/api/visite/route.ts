import { createHash } from "node:crypto";
import { adresseAppelant } from "../../../lib/limite";
import { createSupabaseServiceClient } from "../../../lib/supabase/service";

/**
 * Compteur de visites des pages publiques (migration 0012). Sans cookie :
 * le visiteur est une empreinte du jour, hachee avec un secret du serveur,
 * qui change a minuit. On repond 204 quoi qu'il arrive : la page n'attend
 * rien de cet appel.
 */

const ROBOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|lighthouse|headless|curl|wget|python|monitor/i;
const JOUR_PARIS = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" });

function rien() {
  return new Response(null, { status: 204 });
}

export async function POST(request: Request) {
  // En local on ne pollue pas les chiffres de la production.
  if (process.env.NODE_ENV !== "production" && !process.env.VISITES_EN_LOCAL) return rien();

  const navigateur = request.headers.get("user-agent") ?? "";
  if (!navigateur || ROBOTS.test(navigateur)) return rien();

  let chemin = "";
  let source: string | null = null;

  try {
    const corps = JSON.parse(await request.text()) as { chemin?: unknown; source?: unknown };
    chemin = typeof corps.chemin === "string" ? corps.chemin.slice(0, 200) : "";
    source = typeof corps.source === "string" && corps.source ? corps.source.slice(0, 120) : null;
  } catch {
    return rien();
  }

  if (!chemin.startsWith("/")) return rien();

  const jour = JOUR_PARIS.format(new Date());
  const visiteur = createHash("sha256")
    .update(`${process.env.SESSION_SECRET ?? ""}|${jour}|${adresseAppelant(request.headers)}|${navigateur}`)
    .digest("hex")
    .slice(0, 32);

  try {
    await createSupabaseServiceClient().from("visites").insert({ jour, visiteur, chemin, source });
  } catch {
    // Une visite de moins dans les chiffres, rien de plus.
  }

  return rien();
}
