import "server-only";

/**
 * Les services exterieurs que le tableau de bord Securite interroge :
 * Sentry (erreurs), SonarCloud (qualite du code), GitHub (chaine CI),
 * UptimeRobot (disponibilite). Chacun a trois etats :
 * - « a-configurer » : il manque une variable d'environnement, on dit laquelle ;
 * - « erreur » : la variable est la mais le service ne repond pas ;
 * - « ok » : des chiffres.
 * Aucun appel ne depasse quelques secondes, aucun n'est mis en cache :
 * la page est un instantane.
 */

export type EtatService<T> = { etat: "ok"; donnees: T } | { etat: "a-configurer"; manque: string[] } | { etat: "erreur"; message: string };

const DELAI_MS = 6000;

async function lireJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const reponse = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(DELAI_MS) });
  if (!reponse.ok) throw new Error(`${reponse.status} ${reponse.statusText}`);
  return (await reponse.json()) as T;
}

function manquants(noms: string[]) {
  return noms.filter((n) => !process.env[n]);
}

// ------------------------------------------------------------------
// Sentry : erreurs sur 24 h et problemes ouverts
// ------------------------------------------------------------------
export type Sentry = { erreurs24h: number; ouverts: number; derniers: Array<{ titre: string; vu: string; occurrences: number; url: string }>; url: string };

export async function sentry(): Promise<EtatService<Sentry>> {
  const manque = manquants(["SENTRY_ORG", "SENTRY_PROJECT", "SENTRY_AUTH_TOKEN"]);
  if (manque.length) return { etat: "a-configurer", manque };

  const org = process.env.SENTRY_ORG!;
  const projet = process.env.SENTRY_PROJECT!;
  const entetes = { Authorization: `Bearer ${process.env.SENTRY_AUTH_TOKEN}` };
  const base = process.env.SENTRY_URL ?? "https://sentry.io";

  try {
    const [problemes, stats] = await Promise.all([
      lireJson<Array<{ title: string; lastSeen: string; count: string; permalink: string }>>(
        `${base}/api/0/projects/${org}/${projet}/issues/?query=is:unresolved&statsPeriod=14d&limit=5`,
        { headers: entetes }
      ),
      lireJson<{ groups: Array<{ totals: { "sum(quantity)": number } }> }>(
        `${base}/api/0/organizations/${org}/stats_v2/?project=-1&field=sum(quantity)&category=error&outcome=accepted&statsPeriod=24h&interval=1d`,
        { headers: entetes }
      )
    ]);

    return {
      etat: "ok",
      donnees: {
        erreurs24h: stats.groups.reduce((n, g) => n + (g.totals["sum(quantity)"] ?? 0), 0),
        ouverts: problemes.length,
        derniers: problemes.slice(0, 5).map((p) => ({ titre: p.title, vu: p.lastSeen, occurrences: Number(p.count) || 0, url: p.permalink })),
        url: `${base}/organizations/${org}/issues/?project=&query=is:unresolved`
      }
    };
  } catch (e) {
    return { etat: "erreur", message: (e as Error).message };
  }
}

// ------------------------------------------------------------------
// SonarCloud : bugs, vulnerabilites, points sensibles, duplication
// ------------------------------------------------------------------
export type Sonar = { mesures: Record<string, number>; porte: "OK" | "ERROR" | "NONE" | string; url: string };

export const METRIQUES_SONAR: Array<{ cle: string; label: string; unite?: string }> = [
  { cle: "bugs", label: "Bugs" },
  { cle: "vulnerabilities", label: "Vulnérabilités" },
  { cle: "security_hotspots", label: "Points sensibles" },
  { cle: "code_smells", label: "Code à revoir" },
  { cle: "duplicated_lines_density", label: "Duplication", unite: " %" },
  { cle: "ncloc", label: "Lignes de code" }
];

export async function sonar(): Promise<EtatService<Sonar>> {
  const manque = manquants(["SONAR_PROJECT_KEY"]);
  if (manque.length) return { etat: "a-configurer", manque };

  const cle = process.env.SONAR_PROJECT_KEY!;
  const base = process.env.SONAR_HOST_URL ?? "https://sonarcloud.io";
  // Depot public, projet public : l'API se lit sans jeton. Un jeton rend
  // la lecture possible si le projet devient prive.
  const entetes = process.env.SONAR_TOKEN ? { Authorization: `Bearer ${process.env.SONAR_TOKEN}` } : undefined;

  try {
    const [mesures, porte] = await Promise.all([
      lireJson<{ component: { measures: Array<{ metric: string; value: string }> } }>(
        `${base}/api/measures/component?component=${encodeURIComponent(cle)}&metricKeys=${METRIQUES_SONAR.map((m) => m.cle).join(",")}`,
        { headers: entetes }
      ),
      lireJson<{ projectStatus: { status: string } }>(`${base}/api/qualitygates/project_status?projectKey=${encodeURIComponent(cle)}`, { headers: entetes })
    ]);

    return {
      etat: "ok",
      donnees: {
        mesures: Object.fromEntries(mesures.component.measures.map((m) => [m.metric, Number(m.value)])),
        porte: porte.projectStatus.status,
        url: `${base}/project/overview?id=${encodeURIComponent(cle)}`
      }
    };
  } catch (e) {
    return { etat: "erreur", message: (e as Error).message };
  }
}

// ------------------------------------------------------------------
// GitHub : les derniers runs de la chaine « Qualite »
// ------------------------------------------------------------------
export type RunGitHub = { id: number; titre: string; branche: string; statut: string; conclusion: string | null; quand: string; url: string; duree_s: number | null };

export async function github(): Promise<EtatService<{ runs: RunGitHub[]; depot: string; url: string }>> {
  const depot = process.env.GITHUB_REPOSITORY ?? "nulllclubcontact-fr/NULLL";
  const entetes: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "nulll-admin" };
  // Depot public : lisible sans jeton, mais limite a 60 appels par heure
  // par adresse. Un jeton (lecture des actions) leve cette limite.
  if (process.env.GITHUB_TOKEN) entetes.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const { workflow_runs } = await lireJson<{
      workflow_runs: Array<{ id: number; display_title: string; head_branch: string; status: string; conclusion: string | null; run_started_at: string; updated_at: string; html_url: string }>;
    }>(`https://api.github.com/repos/${depot}/actions/runs?per_page=6`, { headers: entetes });

    return {
      etat: "ok",
      donnees: {
        depot,
        url: `https://github.com/${depot}/actions`,
        runs: workflow_runs.map((r) => ({
          id: r.id,
          titre: r.display_title,
          branche: r.head_branch,
          statut: r.status,
          conclusion: r.conclusion,
          quand: r.run_started_at,
          url: r.html_url,
          duree_s: r.status === "completed" ? Math.round((Date.parse(r.updated_at) - Date.parse(r.run_started_at)) / 1000) : null
        }))
      }
    };
  } catch (e) {
    return { etat: "erreur", message: (e as Error).message };
  }
}

// ------------------------------------------------------------------
// UptimeRobot : disponibilite 24 h et 7 jours, incidents
// ------------------------------------------------------------------
export type Disponibilite = {
  nom: string;
  enLigne: boolean;
  dispo24h: number;
  dispo7j: number;
  reponseMs: number | null;
  incidents: Array<{ debut: string; duree_s: number; raison: string }>;
  url: string;
};

export async function disponibilite(): Promise<EtatService<Disponibilite>> {
  const manque = manquants(["UPTIMEROBOT_API_KEY"]);
  if (manque.length) return { etat: "a-configurer", manque };

  try {
    const corps = new URLSearchParams({
      api_key: process.env.UPTIMEROBOT_API_KEY!,
      format: "json",
      custom_uptime_ratios: "1-7",
      response_times: "1",
      response_times_limit: "1",
      logs: "1",
      logs_limit: "5",
      log_types: "1"
    });

    const { stat, monitors, error } = await lireJson<{
      stat: string;
      error?: { message?: string };
      monitors?: Array<{
        id: number;
        friendly_name: string;
        status: number;
        custom_uptime_ratio: string;
        response_times?: Array<{ value: number }>;
        logs?: Array<{ datetime: number; duration: number; reason?: { detail?: string } }>;
      }>;
    }>("https://api.uptimerobot.com/v2/getMonitors", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: corps.toString()
    });

    if (stat !== "ok" || !monitors?.length) throw new Error(error?.message ?? "aucun moniteur");

    const m = monitors.find((x) => /nulll/i.test(x.friendly_name)) ?? monitors[0];
    const [dispo24h, dispo7j] = m.custom_uptime_ratio.split("-").map(Number);

    return {
      etat: "ok",
      donnees: {
        nom: m.friendly_name,
        enLigne: m.status === 2,
        dispo24h,
        dispo7j,
        reponseMs: m.response_times?.[0]?.value ?? null,
        incidents: (m.logs ?? []).map((l) => ({ debut: new Date(l.datetime * 1000).toISOString(), duree_s: l.duration, raison: l.reason?.detail ?? "" })),
        url: "https://dashboard.uptimerobot.com/monitors"
      }
    };
  } catch (e) {
    return { etat: "erreur", message: (e as Error).message };
  }
}
