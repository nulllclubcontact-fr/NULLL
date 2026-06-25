import "server-only";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_SESSION_COOKIE = "nulll_admin_session";

type AdminSessionPayload = {
  role: "admin";
  exp: number;
};

function getSecret() {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!secret) {
    throw new Error("Missing Supabase service role environment variable");
  }

  return secret;
}

function signPayload(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function encodeSession(payload: AdminSessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${signPayload(body)}`;
}

function decodeSession(value: string): AdminSessionPayload | null {
  const [body, signature] = value.split(".");

  if (!body || !signature) {
    return null;
  }

  const expected = signPayload(body);
  const givenBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (givenBuffer.length !== expectedBuffer.length || !timingSafeEqual(givenBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as AdminSessionPayload;

    if (payload.role !== "admin" || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_SESSION_COOKIE);

  if (!cookie?.value) {
    return null;
  }

  return decodeSession(cookie.value);
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  const expires = Date.now() + 1000 * 60 * 60 * 4;

  cookieStore.set(ADMIN_SESSION_COOKIE, encodeSession({ role: "admin", exp: expires }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    expires: new Date(expires)
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export { ADMIN_SESSION_COOKIE };
