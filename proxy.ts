import { NextRequest, NextResponse } from "next/server";

const PRO_SESSION_COOKIE = "nulll_pro_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/pro" || pathname.startsWith("/pro/scan") || pathname.startsWith("/pro/stats")) {
    const hasProSession = request.cookies.has(PRO_SESSION_COOKIE);

    if (!hasProSession) {
      return NextResponse.redirect(new URL("/pro/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pro/:path*"]
};
