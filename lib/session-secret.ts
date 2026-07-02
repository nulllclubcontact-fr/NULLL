import "server-only";

export function getSessionSecret() {
  const secret = process.env.SESSION_SECRET ?? "";

  if (secret.length < 32) {
    throw new Error("Missing SESSION_SECRET environment variable with at least 32 characters");
  }

  return secret;
}
