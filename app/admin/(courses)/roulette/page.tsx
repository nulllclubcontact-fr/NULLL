import { requireAdminUser } from "../../../../lib/admin/require-admin";
import { LIBELLES_LOT, LOTS_PAR_SEMAINE, type Lot } from "../../../../lib/roulette/regles";
import { createSupabaseServiceClient } from "../../../../lib/supabase/service";
import { FormulaireRemiseRoulette } from "../../../../components/admin/formulaire-remise-roulette";

export const metadata = { robots: { index: false, follow: false } };

type Gain = { code: string; lot: Exclude<Lot, "rien">; created_at: string; remis_at: string | null };

const DATE = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" });

async function lireTirages() {
  try {
    const service = createSupabaseServiceClient();
    const depuis = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const [gains, total] = await Promise.all([
      service.from("roulette_tirages").select("code, lot, created_at, remis_at").neq("lot", "rien").order("created_at", { ascending: false }).limit(100),
      service.from("roulette_tirages").select("id", { count: "exact", head: true }).gte("created_at", depuis)
    ]);
    if (gains.error || total.error) return null;
    return { gains: (gains.data ?? []) as Gain[], tiragesSemaine: total.count ?? 0 };
  } catch {
    return null;
  }
}

export default async function AdminRoulettePage() {
  // Table sans policy : lue par le service role, apres verification admin.
  await requireAdminUser();
  const donnees = await lireTirages();

  return (
    <section className="shell grid gap-10 py-8 lg:py-12">
      <header>
        <p className="font-mono text-xs font-black uppercase tracking-[.18em]">Administration</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.2rem)] uppercase leading-[.95]">
          Roulette<span className="text-[#EBA0CD]">.</span>
        </h1>
        <p className="mt-4 max-w-xl font-bold">
          Un gagnant montre son code au départ : saisis-le, le lot est marqué remis. Un code ne sert qu’une fois.
        </p>
      </header>

      <FormulaireRemiseRoulette />

      {donnees === null ? (
        <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-mono text-sm font-black uppercase" role="alert">
          Tirages illisibles : la table de la roulette (migration 0017) n’est pas encore en base.
        </p>
      ) : (
        <>
          <dl className="grid gap-4 sm:grid-cols-3">
            {(["redbull", "beezen"] as const).map((lot) => {
              const semaine = donnees.gains.filter((g) => g.lot === lot && Date.now() - new Date(g.created_at).getTime() < 7 * 24 * 3600 * 1000).length;
              return (
                <div className="border-2 border-[#773331] bg-[#F1EDE9] p-4" key={lot}>
                  <dt className="font-mono text-xs font-black uppercase tracking-[.12em]">{LIBELLES_LOT[lot]} · 7 jours</dt>
                  <dd className="mt-2 font-display text-4xl">
                    {semaine} <span className="text-lg">/ {LOTS_PAR_SEMAINE[lot]} par semaine</span>
                  </dd>
                </div>
              );
            })}
            <div className="border-2 border-[#773331] bg-[#F1EDE9] p-4">
              <dt className="font-mono text-xs font-black uppercase tracking-[.12em]">Tours de roue · 7 jours</dt>
              <dd className="mt-2 font-display text-4xl">{donnees.tiragesSemaine}</dd>
            </div>
          </dl>

          <div className="overflow-x-auto border-2 border-[#773331]">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-[#EBA0CD] font-mono text-xs font-black uppercase tracking-[.12em]">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Lot</th>
                  <th className="px-4 py-3">Gagné le</th>
                  <th className="px-4 py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {donnees.gains.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 font-bold" colSpan={4}>Aucun gagnant pour l’instant.</td>
                  </tr>
                ) : (
                  donnees.gains.map((gain) => (
                    <tr className="border-t-2 border-[#773331]" key={gain.code}>
                      <td className="px-4 py-3 font-mono font-black">{gain.code}</td>
                      <td className="px-4 py-3">{LIBELLES_LOT[gain.lot]}</td>
                      <td className="px-4 py-3">{DATE.format(new Date(gain.created_at))}</td>
                      <td className="px-4 py-3 font-mono text-xs font-black uppercase">
                        {gain.remis_at ? `Remis le ${DATE.format(new Date(gain.remis_at))}` : "À remettre"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
