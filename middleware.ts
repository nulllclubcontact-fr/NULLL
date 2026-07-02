import { NextRequest, NextResponse } from "next/server";

const PRO_SESSION_COOKIE = "nulll_pro_session";

const legacyPublicRedirects: Record<string, string> = {
  "/about": "/fr/a-propos",
  "/community": "/fr/communaute",
  "/contact": "/fr/contact",
  "/merch": "/fr/merch",
  "/runs": "/fr/runs"
};

export function middleware(request: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/pro/:path*", "/about", "/community", "/contact", "/merch", "/runs"]
};
