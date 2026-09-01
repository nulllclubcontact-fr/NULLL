import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

/**
 * Retour des liens envoyes par Supabase (mot de passe oublie, e-mail de
 * confirmation).
 *
 * Ces liens portent un code a echanger contre une session. Sans cette
 * route, le lien de reinitialisation renvoyait vers /membre/login : le
 * visiteur atterrissait sur le formulaire de connexion sans session et
 * sans aucun moyen de choisir un nouveau mot de passe.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const suite = searchParams.get("next") ?? "/membre";

  // « next » vient de l'URL : on n'accepte qu'un chemin interne, sinon la
  // route servirait de tremplin vers un site tiers.
  const destination = suite.startsWith("/") && !suite.startsWith("//") ? suite : "/membre";

  if (!code) {
    return NextResponse.redirect(new URL("/membre/login?erreur=lien", origin));
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.redirect(new URL("/membre/login?erreur=config", origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/membre/login?erreur=lien", origin));
  }

  return NextResponse.redirect(new URL(destination, origin));
}
