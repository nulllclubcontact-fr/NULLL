import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { createSupabaseServiceClient } from "../../../lib/supabase/service";

/**
 * Retour des liens envoyes par Supabase (mot de passe oublie, e-mail de
 * confirmation) et des connexions Google ou Apple.
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

  // Fenetre Google ou Apple fermee, ou acces refuse : pas de code, mais
  // une erreur dans l'URL.
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

  // Premier passage par Google ou Apple : ni profil ni decharge, puisque
  // le formulaire d'inscription n'a pas ete rempli. On cree le profil avec
  // ce que le fournisseur donne, et la decharge se signe sur /membre/bienvenue.
  try {
    const service = createSupabaseServiceClient();
    const { data: profil } = await service
      .from("profiles")
      .select("consent_waiver")
      .eq("id", data.user.id)
      .maybeSingle<{ consent_waiver: boolean | null }>();

    if (!profil) {
      const meta = data.user.user_metadata ?? {};
      const complet = String(meta.full_name ?? meta.name ?? "").trim();
      const [premier, ...reste] = complet ? complet.split(/\s+/) : [];

      await service.from("profiles").insert({
        id: data.user.id,
        email: data.user.email ?? null,
        first_name: (meta.given_name as string | undefined) ?? premier ?? null,
        last_name: (meta.family_name as string | undefined) ?? (reste.join(" ") || null)
      });
    }

    if (!profil?.consent_waiver) {
      return NextResponse.redirect(new URL("/membre/bienvenue", origin));
    }
  } catch {
    // Sans service role, l'espace membre renverra lui-meme vers la decharge.
  }

  return NextResponse.redirect(new URL(destination, origin));
}
