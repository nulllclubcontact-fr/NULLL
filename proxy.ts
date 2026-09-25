import { NextRequest, NextResponse } from "next/server";

const PRO_SESSION_COOKIE = "nulll_pro_session";

const legacyPublicRedirects: Record<string, string> = {
  "/about": "/fr/a-propos",
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

  if (pathname === "/pro" || pathname.startsWith("/pro/scan") || pathname.startsWith("/pro/stats")) {
    const hasProSession = request.cookies.has(PRO_SESSION_COOKIE);

    if (!hasProSession) {
      return NextResponse.redirect(new URL("/pro/login", request.url));
    }
  }

  // Administration : premier barrage, avant tout rendu. Le vrai controle
  // (compte + role admin relu en base) reste dans requireAdminUser ; ici on
  // ecarte seulement, a moindre cout, les visiteurs sans session Supabase,
  // y compris sur les routes qu'un layout ne couvre pas (export CSV).
  if (pathname.startsWith("/admin")) {
    const aUneSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));

    if (!aUneSession) {
      return NextResponse.redirect(new URL("/membre/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pro/:path*", "/admin/:path*", "/about", "/community", "/contact", "/merch", "/runs"]
};
