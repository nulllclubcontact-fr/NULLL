import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { adresseAppelant } from "../../../lib/limite";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
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

// L'equipe ne compte pas dans ses propres chiffres : tout compte admin,
// plus les identifiants de compte listes dans VISITES_EQUIPE (Tom et
// Tobias par defaut). Des identifiants, pas d'adresse e-mail.
const EQUIPE = new Set(
  (process.env.VISITES_EQUIPE ?? "596b9041-43fd-4ad7-ba6a-313e22be0409,77169478-2546-426b-a407-e9216544a399")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
);
const COOKIE_EQUIPE = "nulll_pas_compte";

/**
 * Un membre de l'equipe connecte est reconnu par sa session ; on pose alors
 * un cookie pour continuer a l'ecarter apres sa deconnexion sur ce navigateur.
 */
async function estEquipe() {
  const jar = await cookies();
  if (jar.has(COOKIE_EQUIPE)) return { equipe: true, poser: false };
  if (!jar.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"))) return { equipe: false, poser: false };

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return { equipe: false, poser: false };
    if (EQUIPE.has(user.id)) return { equipe: true, poser: true };
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle<{ role: string | null }>();
    return { equipe: data?.role === "admin", poser: data?.role === "admin" };
  } catch {
    return { equipe: false, poser: false };
  }
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

  const { equipe, poser } = await estEquipe();
  if (equipe) {
    const reponse = rien();
    if (poser) {
      reponse.headers.append("Set-Cookie", `${COOKIE_EQUIPE}=1; Path=/; Max-Age=34560000; HttpOnly; Secure; SameSite=Lax`);
    }
    return reponse;
  }

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
