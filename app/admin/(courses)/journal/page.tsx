import Link from "next/link";
import { requireAdminUser } from "../../../../lib/admin/require-admin";
import { LIBELLES_JOURNAL, type ActionJournal } from "../../../../lib/admin/journal";
import { createSupabaseServiceClient } from "../../../../lib/supabase/service";
import { formatHeure, formatJourCourt } from "../../../../components/races/format";
import { Etiquette, Intitule, type Teinte } from "../../../../components/admin/graphiques";

export const metadata = { robots: { index: false, follow: false } };

type Entree = {
  id: number;
  admin_id: string | null;
  prenom: string | null;
  nom: string | null;
  action: string;
  cible: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

// Une couleur par famille : ce qui touche aux donnees personnelles ou
// efface quelque chose ressort au premier coup d'oeil.
function teinteDe(action: string): { teinte: Teinte; pointillee?: boolean } {
  if (action.startsWith("export.")) return { teinte: "jaune" };
  if (action.endsWith(".suppression") || action.endsWith(".annulation") || action.endsWith(".desactivation")) return { teinte: "bordeaux" };
  if (action.endsWith(".creation") || action.endsWith(".code")) return { teinte: "rose" };
  return { teinte: "creme", pointillee: true };
}

function lienCible(action: string, cible: string | null) {
  if (!cible) return null;
  if (action.startsWith("sortie.") && action !== "sortie.suppression") return `/admin/courses/${cible}`;
  if (action.startsWith("partenaire.") && action !== "partenaire.suppression") return `/admin/reseau/${cible}`;
  return null;
}

/** Les details en une ligne lisible, sans le jargon des cles. */
function resumeDetails(details: Record<string, unknown> | null) {
  if (!details) return "";
  const morceaux: string[] = [];
  if (typeof details.titre === "string") morceaux.push(details.titre);
  if (typeof details.nom === "string") morceaux.push(details.nom);
  if (typeof details.email === "string") morceaux.push(details.email);
  if (typeof details.dupliquee_de === "string") morceaux.push("dupliquée");
  if (typeof details.sortie === "string") morceaux.push(details.sortie);
  if (typeof details.de === "string" && typeof details.vers === "string") morceaux.push(`${details.de} → ${details.vers}`);
  else if (typeof details.statut === "string") morceaux.push(details.statut);
  if (typeof details.lignes === "number") morceaux.push(`${details.lignes} ligne${details.lignes > 1 ? "s" : ""}`);
  if (typeof details.inscrits === "number") morceaux.push(`${details.inscrits} inscrit${details.inscrits > 1 ? "s" : ""}`);
  if (typeof details.photo === "string") morceaux.push(details.photo);
  return morceaux.join(" · ");
}

export default async function AdminJournalPage() {
  await requireAdminUser();

  // Lu avec la cle de service : la table n'a aucune policy (migration 0013).
  // Une panne rend null, pas une liste vide et rassurante.
  let entrees: Entree[] | null = null;

  try {
    const { data, error } = await createSupabaseServiceClient().rpc("lire_journal_admin", { p_limite: 200 });
    entrees = error ? null : ((data ?? []) as Entree[]);
  } catch {
    entrees = null;
  }

  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <header>
        <p className="font-mono text-xs font-black uppercase tracking-[.18em]">Administration</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.2rem)] uppercase leading-[.95]">
          Journal<span className="text-[#EBA0CD]">.</span>
        </h1>
        <p className="mt-4 max-w-xl font-bold">
          Qui a fait quoi dans l’administration. Les exports d’inscrits emportent des e-mails et des téléphones : ils sont en jaune. Les scans du jour de course ont leur propre trace, sur chaque sortie.
        </p>
      </header>

      {entrees === null ? (
        <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-bold" role="alert">
          Impossible de lire le journal pour le moment. Recharge la page dans un instant.
        </p>
      ) : entrees.length === 0 ? (
        <p className="border-2 border-dashed border-[#773331] p-6 font-bold">Rien pour l’instant. La première action apparaîtra ici.</p>
      ) : (
        <div>
          <Intitule>Les 200 dernières actions · gardées douze mois</Intitule>
          <div aria-label="Journal des actions" className="mt-5 overflow-x-auto" tabIndex={0}>
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <thead>
                <tr className="font-mono text-xs font-black uppercase tracking-[.14em] text-[#773331]">
                  <th className="border-b-2 border-[#773331] pb-2 pr-4">Quand</th>
                  <th className="border-b-2 border-[#773331] pb-2 pr-4">Qui</th>
                  <th className="border-b-2 border-[#773331] pb-2 pr-4">Action</th>
                  <th className="border-b-2 border-[#773331] pb-2">Détail</th>
                </tr>
              </thead>
              <tbody>
                {entrees.map((e) => {
                  const libelle = LIBELLES_JOURNAL[e.action as ActionJournal] ?? e.action;
                  const allure = teinteDe(e.action);
                  const lien = lienCible(e.action, e.cible);
                  const qui = [e.prenom, e.nom].filter(Boolean).join(" ") || (e.admin_id ? "Admin" : "Hors interface ou compte supprimé");
                  const detail = resumeDetails(e.details);

                  return (
                    <tr className="border-b border-[#773331]/20" key={e.id}>
                      <td className="py-3 pr-4 font-mono text-xs">
                        {formatJourCourt(e.created_at)} · {formatHeure(e.created_at)}
                      </td>
                      <td className="py-3 pr-4 font-bold">{qui}</td>
                      <td className="py-3 pr-4">
                        <Etiquette pointillee={allure.pointillee} teinte={allure.teinte}>
                          {libelle}
                        </Etiquette>
                      </td>
                      <td className="py-3 text-sm font-bold">
                        {lien ? (
                          <Link className="hover:underline hover:decoration-[#EBA0CD] hover:decoration-4" href={lien}>
                            {detail || "Voir"}
                          </Link>
                        ) : (
                          detail
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
