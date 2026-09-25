import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { MARQUEUR_SESSION_COURTE } from "../../../lib/supabase/session";

/**
 * La session admin a depasse douze heures (lib/admin/regles.ts) : on ferme
 * la session et on renvoie a la connexion avec l'explication. Un
 * composant serveur ne peut pas ecrire de cookies ; une route, si.
 */
export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Sans Supabase joignable, le cookie de session tombera de lui-meme.
  }

  (await cookies()).delete(MARQUEUR_SESSION_COURTE);

  return NextResponse.redirect(new URL("/membre/login?erreur=admin", request.url), { status: 303 });
}
