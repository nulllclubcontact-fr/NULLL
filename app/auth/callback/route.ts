import { NextResponse } from "next/server";
import { preparerProfilFournisseur } from "../../../lib/auth/profil-fournisseur";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

/**
 * Retour des liens envoyes par Supabase (mot de passe oublie, e-mail de
 * confirmation) et des connexions Apple (Google passe par son bouton
 * officiel, sans redirection).
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

  // Fenetre du fournisseur fermee, ou acces refuse : pas de code, mais une
  // erreur dans l'URL.
  if (searchParams.get("error")) {
    return NextResponse.redirect(new URL("/membre/login?erreur=fournisseur", origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/membre/login?erreur=lien", origin));
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.redirect(new URL("/membre/login?erreur=config", origin));
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/membre/login?erreur=lien", origin));
  }

  try {
    if (await preparerProfilFournisseur(data.user)) {
      return NextResponse.redirect(new URL("/membre/bienvenue", origin));
    }
  } catch {
    // Sans service role, l'espace membre renverra lui-meme vers la decharge.
  }

  return NextResponse.redirect(new URL(destination, origin));
}
