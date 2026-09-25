import type { Instrumentation } from "next";

/**
 * Remontee des erreurs serveur (pages, actions, routes) vers les logs
 * Vercel, en une ligne JSON par erreur : la supervision peut y poser une
 * alerte (Vercel Log Drain, ou Sentry en branchant son SDK ici).
 *
 * Aucune donnee de session ni de corps de requete : juste de quoi
 * retrouver l'erreur (digest) et l'endroit ou elle s'est produite.
 */
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
};
