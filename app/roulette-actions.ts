"use server";

import { createHash, randomBytes, randomInt } from "node:crypto";
import { cookies, headers } from "next/headers";
import { adresseAppelant, essaiAutorise } from "../lib/limite";
import { appliquerPlafond, formerCode, lotPourTirage, type Lot } from "../lib/roulette/regles";
import { hasSupabasePublicEnv, supabaseServiceRoleKey } from "../lib/supabase/config";
import { createSupabaseServiceClient } from "../lib/supabase/service";

export type ResultatRoulette =
  | { ok: true; lot: Lot; code: string | null; dejaJoue: boolean; demo: boolean }
  | { ok: false; message: string };

const COOKIE = "nulll_roulette";
const UN_AN = 60 * 60 * 24 * 365;

/**
 * Tourne la roue. Une seule fois par navigateur (cookie) et au plus trois
 * fois par jour et par adresse (un foyer, un bureau), pour freiner ceux qui
 * videraient leurs cookies. Le hasard et le plafond hebdomadaire sont
 * decides ici, jamais dans le navigateur.
 */
export async function tournerRoulette(): Promise<ResultatRoulette> {
  // En local sans cle de service (et donc sans table), on montre la roue
  // en mode demo : vrai tirage, rien d'enregistre, code marque DEMO.
  if (!supabaseServiceRoleKey || !hasSupabasePublicEnv()) {
    if (process.env.NODE_ENV === "production") return { ok: false, message: "La roue est en pause. Reviens plus tard." };
    const lot = lotPourTirage(randomInt(100));
    return { ok: true, lot, code: lot === "rien" ? null : formerCode(lot, randomBytes(5)).replace("NULLL", "DEMO"), dejaJoue: false, demo: true };
  }

  const jar = await cookies();
  const service = createSupabaseServiceClient();

  const precedent = jar.get(COOKIE)?.value;
  if (precedent && /^[0-9a-f-]{36}$/.test(precedent)) {
    const { data } = await service.from("roulette_tirages").select("lot, code").eq("id", precedent).maybeSingle<{ lot: Lot; code: string | null }>();
    if (data) return { ok: true, lot: data.lot, code: data.code, dejaJoue: true, demo: false };
  }

  const adresse = adresseAppelant(await headers());
  if (!(await essaiAutorise("roulette", adresse, 60 * 60 * 24, 3))) {
    return { ok: false, message: "La roue a déjà beaucoup tourné depuis ta connexion aujourd’hui. Reviens demain." };
  }

  let lot = lotPourTirage(randomInt(100));
  if (lot !== "rien") {
    const lundi = debutSemaineParis();
    const { count, error } = await service
      .from("roulette_tirages")
      .select("id", { count: "exact", head: true })
      .eq("lot", lot)
      .gte("created_at", lundi.toISOString());
    lot = error ? "rien" : appliquerPlafond(lot, count ?? 0);
  }

  const empreinte = createHash("sha256")
    .update(`${process.env.SESSION_SECRET ?? ""}|roulette|${adresse}`)
    .digest("hex")
    .slice(0, 32);

  // Un code deja pris (collision tres improbable) : on retire.
  for (let essai = 0; essai < 3; essai++) {
    const code = lot === "rien" ? null : formerCode(lot, randomBytes(5));
    const { data, error } = await service.from("roulette_tirages").insert({ lot, code, empreinte }).select("id").single<{ id: string }>();
    if (!error && data) {
      jar.set(COOKIE, data.id, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: UN_AN });
      return { ok: true, lot, code, dejaJoue: false, demo: false };
    }
    if (error?.code !== "23505") break;
  }

  return { ok: false, message: "La roue s’est coincée. Réessaie dans un instant." };
}

/** Lundi 0 h, heure de Paris, de la semaine en cours. */
function debutSemaineParis(): Date {
  const maintenant = new Date();
  const paris = new Date(maintenant.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const decalage = maintenant.getTime() - paris.getTime();
  const jour = (paris.getDay() + 6) % 7;
  paris.setHours(0, 0, 0, 0);
  paris.setDate(paris.getDate() - jour);
  return new Date(paris.getTime() + decalage);
}
