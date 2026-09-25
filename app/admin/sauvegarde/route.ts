import { isAdminUser } from "../../../lib/admin/require-admin";
import { journaliser } from "../../../lib/admin/journal";
import { createSupabaseServiceClient } from "../../../lib/supabase/service";

/**
 * Sauvegarde telechargeable : toutes les tables metier en un fichier JSON,
 * lu avec la cle de service. Les visites (volumineuses, anonymes) et les
 * compteurs de limite (ephemeres) n'y sont pas. Le fichier contient des
 * donnees personnelles : chaque telechargement est inscrit au journal,
 * et il ne remplace pas les sauvegardes de Supabase, il les complete.
 */
const TABLES = [
  "app_config",
  "loyalty_tiers",
  "profiles",
  "partners",
  "partner_access_codes",
  "transactions",
  "points_log",
  "points_ledger",
  "checkout_orders",
  "checkout_order_items",
  "races",
  "race_registrations",
  "checkins",
  "journal_admin"
];

const PAGE = 1000;

export async function GET() {
  const admin = await isAdminUser();

  if (!admin) {
    return new Response("Accès refusé", { status: 403 });
  }

  const service = createSupabaseServiceClient();
  const tables: Record<string, unknown[]> = {};
  const manquantes: string[] = [];

  for (const table of TABLES) {
    const lignes: unknown[] = [];

    for (let depuis = 0; ; depuis += PAGE) {
      const { data, error } = await service.from(table).select("*").range(depuis, depuis + PAGE - 1);

      if (error) {
        manquantes.push(table);
        break;
      }

      lignes.push(...(data ?? []));
      if (!data || data.length < PAGE) break;
    }

    tables[table] = lignes;
  }

  const total = Object.values(tables).reduce((n, l) => n + l.length, 0);
  const jour = new Date().toISOString().slice(0, 10);

  await journaliser(admin.user.id, "export.sauvegarde", jour, { tables: Object.keys(tables).length, lignes: total, manquantes });

  const corps = JSON.stringify({ site: "nulll.club", genere_le: new Date().toISOString(), tables_ignorees: ["visites", "rate_limits"], tables_en_erreur: manquantes, tables }, null, 1);

  return new Response(corps, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="nulll-sauvegarde-${jour}.json"`,
      "Cache-Control": "no-store"
    }
  });
}
