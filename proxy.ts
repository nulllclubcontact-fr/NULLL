import { NextRequest, NextResponse } from "next/server";

const PRO_SESSION_COOKIE = "nulll_pro_session";

const legacyPublicRedirects: Record<string, string> = {
  // Directement vers la page finale : /fr/a-propos redirige elle-meme.
  "/about": "/fr/communaute",
  "/community": "/fr/communaute",
  "/contact": "/fr/contact",
  "/merch": "/fr/merch",
  "/runs": "/fr/runs"
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const legacyTarget = legacyPublicRedirects[pathname];

  if (legacyTarget) {
    return NextResponse.redirect(new URL(legacyTarget, request.url), 308);
  }

  // Liens de confirmation envoyes sans adresse de retour : Supabase revient
  // sur la racine avec ?code=, que la redirection permanente vers /fr perdait.
  if (pathname === "/" && request.nextUrl.searchParams.has("code")) {
    const suite = new URL("/auth/callback", request.url);
    suite.searchParams.set("code", request.nextUrl.searchParams.get("code") ?? "");
    return NextResponse.redirect(suite);
  }

  if (pathname === "/pro" || pathname.startsWith("/pro/scan") || pathname.startsWith("/pro/stats")) {
    const hasProSession = request.cookies.has(PRO_SESSION_COOKIE);

    if (!hasProSession) {
      return NextResponse.redirect(new URL("/pro/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pro/:path*", "/about", "/community", "/contact", "/merch", "/runs", { source: "/", has: [{ type: "query", key: "code" }] }]
};
