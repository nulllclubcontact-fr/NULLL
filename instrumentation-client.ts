import * as Sentry from "@sentry/nextjs";

// Erreurs du navigateur (scanner, formulaires). Les envois passent par
// /api/suivi (tunnelRoute dans next.config.mjs) : meme origine, donc
// compatibles avec la CSP et les bloqueurs de publicite.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
