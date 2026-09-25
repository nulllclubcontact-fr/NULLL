/**
 * Rapports de la Content-Security-Policy en mode observation
 * (next.config.mjs). Chaque violation devient une ligne JSON dans les
 * logs Vercel, filtre "source":"csp". Deux semaines sans rapport
 * legitime, et la politique peut passer en mode blocage.
 *
 * Toujours 204 : le navigateur n'attend rien, et un rapport mal forme ne
 * merite pas une erreur dans ses propres logs.
 */
const TAILLE_MAX = 8 * 1024;

export async function POST(request: Request) {
  try {
    const texte = (await request.text()).slice(0, TAILLE_MAX);
    const corps = JSON.parse(texte) as { "csp-report"?: Record<string, unknown> } | Array<{ body?: Record<string, unknown> }>;
    const rapport = Array.isArray(corps) ? corps[0]?.body : corps["csp-report"];

    if (rapport) {
      console.warn(
        JSON.stringify({
          niveau: "avertissement",
          source: "csp",
          document: rapport["document-uri"] ?? rapport.documentURL ?? null,
          directive: rapport["violated-directive"] ?? rapport.effectiveDirective ?? null,
          bloque: rapport["blocked-uri"] ?? rapport.blockedURL ?? null,
          ligne: rapport["line-number"] ?? rapport.lineNumber ?? null
        })
      );
    }
  } catch {
    // Rapport illisible : rien a noter.
  }

  return new Response(null, { status: 204 });
}
