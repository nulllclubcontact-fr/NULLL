import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { preparerProfilFournisseur } from "../../../lib/auth/profil-fournisseur";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

/**
 * Confirmation d'adresse et mot de passe oublie : le lien de nos mails
 * arrive ici avec un jeton a usage unique, qu'on echange cote serveur
 * contre une session (cookies). Les liens de Supabase, eux, renvoyaient
 * les jetons dans l'ancre de l'URL, que le serveur ne voit jamais.
 */
const TYPES: EmailOtpType[] = ["signup", "recovery", "email_change", "invite", "magiclink"];

function cheminInterne(valeur: string, origin: string) {
  try {
    const url = new URL(valeur, origin);
    return url.origin === origin ? `${url.pathname}${url.search}` : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");
  const type = searchParams.get("type") as EmailOtpType | null;
  const destination = cheminInterne(searchParams.get("next") ?? "/membre", origin) ?? "/membre";

  if (!token || !type || !TYPES.includes(type)) {
    return NextResponse.redirect(new URL("/membre/login?erreur=lien", origin));
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.redirect(new URL("/membre/login?erreur=config", origin));
  }

  const { data, error } = await supabase.auth.verifyOtp({ token_hash: token, type });

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/membre/login?erreur=lien", origin));
  }

  try {
    if (await preparerProfilFournisseur(data.user)) {
      return NextResponse.redirect(new URL("/membre/bienvenue", origin));
    }
  } catch {
    // L'espace membre renverra lui-meme vers la decharge si besoin.
  }

  return NextResponse.redirect(new URL(destination, origin));
}
