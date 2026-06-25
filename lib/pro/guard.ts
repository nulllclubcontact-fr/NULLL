import "server-only";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const PRO_SESSION_COOKIE = "nulll_pro_session";

type ProSessionPayload = {
  partnerId: string;
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

function encodeSession(payload: ProSessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${signPayload(body)}`;
}

function decodeSession(value: string): ProSessionPayload | null {
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
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as ProSessionPayload;

    if (!payload.partnerId || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getProSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(PRO_SESSION_COOKIE);

  if (!cookie?.value) {
    return null;
  }

  return decodeSession(cookie.value);
}

export async function setProSession(partnerId: string) {
  const cookieStore = await cookies();
  const expires = Date.now() + 1000 * 60 * 60 * 12;

  cookieStore.set(PRO_SESSION_COOKIE, encodeSession({ partnerId, exp: expires }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/pro",
    expires: new Date(expires)
  });
}

export async function clearProSession() {
  const cookieStore = await cookies();
  cookieStore.delete(PRO_SESSION_COOKIE);
}

export { PRO_SESSION_COOKIE };
