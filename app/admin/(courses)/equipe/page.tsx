import { requireAdminUser } from "../../../../lib/admin/require-admin";
import { createSupabaseServiceClient } from "../../../../lib/supabase/service";
import { Etiquette, Intitule } from "../../../../components/admin/graphiques";
import { FormulaireAjoutAdmin, FormulaireMembreEquipe } from "./formulaires";

export const metadata = { robots: { index: false, follow: false } };

type Admin = { id: string; first_name: string | null; last_name: string | null; email: string | null; created_at: string };

const DEPUIS = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short", year: "numeric" });

/** Les facteurs TOTP verifies de chaque admin, lus avec la cle de service. */
async function doubleVerificationDe(ids: string[]) {
  const etat = new Map<string, boolean>();

  try {
    const service = createSupabaseServiceClient();
    await Promise.all(
      ids.map(async (id) => {
        const { data } = await service.auth.admin.mfa.listFactors({ userId: id });
        etat.set(id, (data?.factors ?? []).some((f) => f.status === "verified"));
      })
    );
  } catch {
    // Sans cle de service, on affiche « inconnu » plutot qu'un faux « non ».
  }

  return etat;
}

export default async function AdminEquipePage() {
  const { supabase, user } = await requireAdminUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("id,first_name,last_name,email,created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: true })
    .returns<Admin[]>();

  const admins = data ?? [];
  const verification = await doubleVerificationDe(admins.map((a) => a.id));

  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <header>
        <p className="font-mono text-xs font-black uppercase tracking-[.18em]">Administration</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.2rem)] uppercase leading-[.95]">
          L’équipe<span className="text-[#EBA0CD]">.</span>
        </h1>
        <p className="mt-4 max-w-xl font-bold">
          Les comptes qui ouvrent l’administration. Chaque ajout et chaque retrait est inscrit au journal. Un admin ne peut pas se retirer lui-même, et il en reste toujours un.
        </p>
      </header>

      <FormulaireAjoutAdmin />

      <div>
        <Intitule>Admins ({admins.length})</Intitule>
        {error ? (
          <p className="mt-5 border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-bold" role="alert">
            Impossible de charger l’équipe pour le moment.
          </p>
        ) : (
          <ul className="mt-5 grid gap-4">
            {admins.map((a) => {
              const nom = [a.first_name, a.last_name].filter(Boolean).join(" ") || "Admin";
              const mfa = verification.get(a.id);
              const moi = a.id === user.id;

              return (
                <li className="flex flex-col gap-4 border-2 border-[#773331] p-4 lg:flex-row lg:items-center" key={a.id}>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-2xl uppercase leading-none">{nom}</span>
                      {moi ? <Etiquette teinte="jaune">Toi</Etiquette> : null}
                      {mfa === undefined ? (
                        <Etiquette pointillee teinte="creme">Vérification inconnue</Etiquette>
                      ) : mfa ? (
                        <Etiquette teinte="rose">Double vérification</Etiquette>
                      ) : (
                        <Etiquette pointillee teinte="creme">Mot de passe seul</Etiquette>
                      )}
                    </div>
                    <p className="mt-2 font-mono text-xs font-black uppercase tracking-[.12em]">
                      {a.email ?? "e-mail non renseigné"} · membre depuis le {DEPUIS.format(new Date(a.created_at))}
                    </p>
                  </div>
                  {moi ? null : <FormulaireMembreEquipe aDoubleVerification={mfa === true} id={a.id} nom={nom} />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
