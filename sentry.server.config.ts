import * as Sentry from "@sentry/nextjs";

// Erreurs du serveur (pages, actions, routes). Sans DSN, rien ne part :
// le SDK reste inerte et les logs Vercel gardent la ligne JSON de
// instrumentation.ts. Aucune donnee personnelle par defaut.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  tracesSampleRate: 0
});
