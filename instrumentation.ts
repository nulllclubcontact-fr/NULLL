import * as Sentry from "@sentry/nextjs";
import type { Instrumentation } from "next";

/**
 * Remontee des erreurs serveur (pages, actions, routes) : une ligne JSON
 * par erreur dans les logs Vercel, et l'envoi a Sentry quand un DSN est
 * configure (sentry.server.config.ts). Aucune donnee de session ni de
 * corps de requete dans la ligne JSON : juste de quoi retrouver l'erreur
 * (digest) et l'endroit ou elle s'est produite.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError: Instrumentation.onRequestError = async (erreur, requete, contexte) => {
  const e = erreur as { message?: string; digest?: string; name?: string };

  console.error(
    JSON.stringify({
      niveau: "erreur",
      source: "next",
      nom: e.name ?? "Error",
      message: e.message ?? String(erreur),
      digest: e.digest ?? null,
      chemin: requete.path,
      methode: requete.method,
      type: contexte.routeType,
      rendu: contexte.renderSource ?? null
    })
  );

  await Sentry.captureRequestError(erreur, requete, contexte);
};
