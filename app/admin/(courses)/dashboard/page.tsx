import Link from "next/link";
import { requireAdminUser } from "../../../../lib/admin/require-admin";
import { formatHeure, formatJour, formatJourCourt } from "../../../../components/races/format";
import type { Race } from "../../../../lib/races/types";

export const metadata = { robots: { index: false, follow: false } };

type LigneCourse = Race & {
  race_registrations: Array<{ status: string; checked_in: boolean }>;
};

function pourcentage(part: number, total: number) {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdminUser();

  // Une seule requete ramene les courses et leurs inscriptions : compter
  // cote serveur evite N requetes et garde les chiffres coherents entre
  // eux, tous pris au meme instant.
  const { data: courses } = await supabase
    .from("races")
    .select("id,title,slug,start_datetime,status,max_participants,location,race_registrations(status,checked_in)")
    .order("start_datetime", { ascending: false })
    .returns<LigneCourse[]>();

  const liste = courses ?? [];
  const maintenant = Date.now();

  let inscriptions = 0;
  let presences = 0;
  let annulations = 0;

  for (const course of liste) {
    for (const i of course.race_registrations) {
      if (i.status === "cancelled") {
        annulations += 1;
        continue;
      }
      inscriptions += 1;
      if (i.checked_in) presences += 1;
    }
  }

  const publiees = liste.filter((c) => c.status === "published").length;
  const terminees = liste.filter((c) => c.status === "completed").length;
  const prochaines = liste
    .filter((c) => new Date(c.start_datetime).getTime() >= maintenant && c.status === "published")
    .sort((a, b) => a.start_datetime.localeCompare(b.start_datetime))
    .slice(0, 3);

  const chiffres = [
    { label: "Sorties", valeur: liste.length, detail: `${publiees} publiées · ${terminees} terminées` },
    { label: "Inscriptions", valeur: inscriptions, detail: annulations > 0 ? `${annulations} annulées` : "aucune annulation" },
    { label: "Présences", valeur: presences, detail: `${pourcentage(presences, inscriptions)} % des inscrits` },
    { label: "Absents", valeur: Math.max(inscriptions - presences, 0), detail: "inscrits non scannés" }
  ];

  return (
    <section className="shell grid gap-10 py-8 lg:py-12">
      <header>
        <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#351815]/55">Administration</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.2rem)] uppercase leading-[.95]">
          Vue d’ensemble<span className="text-[#b03583]">.</span>
        </h1>
      </header>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {chiffres.map((c) => (
          <div className="panel p-5" key={c.label}>
            <dt className="font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#351815]/55">{c.label}</dt>
            <dd className="mt-3 font-display text-[clamp(2.6rem,7vw,4rem)] leading-none">{c.valeur}</dd>
            <p className="mt-2 font-mono text-[.6rem] font-black uppercase tracking-[.12em] text-[#351815]/45">{c.detail}</p>
          </div>
        ))}
      </dl>

      <div>
        <h2 className="border-b-2 border-[#351815] pb-3 font-mono text-xs font-black uppercase tracking-[.18em]">
          Prochaines sorties
        </h2>
        {prochaines.length === 0 ? (
          <p className="mt-5 border-2 border-dashed border-[#351815]/30 p-6 font-bold text-[#351815]/60">
            Rien de publié à venir. <Link className="underline decoration-[#d96ab4] decoration-2 underline-offset-4" href="/admin/courses">Crée une sortie.</Link>
          </p>
        ) : (
          <ul className="mt-5 grid gap-3">
            {prochaines.map((c) => {
              const actives = c.race_registrations.filter((i) => i.status !== "cancelled").length;
              return (
                <li className="flex flex-wrap items-center justify-between gap-4 border-2 border-[#351815] p-4" key={c.id}>
                  <div>
                    <Link className="font-display text-xl uppercase leading-none hover:text-[#b03583]" href={`/admin/courses/${c.id}`}>
                      {c.title}
                    </Link>
                    <p className="mt-2 font-mono text-[.62rem] font-black uppercase tracking-[.12em] text-[#351815]/55">
                      {formatJour(c.start_datetime)} · {formatHeure(c.start_datetime)}
                    </p>
                  </div>
                  <p className="font-mono text-xs font-black uppercase">
                    {actives} inscrit{actives > 1 ? "s" : ""}
                    {c.max_participants ? ` / ${c.max_participants}` : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <h2 className="border-b-2 border-[#351815] pb-3 font-mono text-xs font-black uppercase tracking-[.18em]">
          Toutes les sorties
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <thead>
              <tr className="font-mono text-[.6rem] font-black uppercase tracking-[.14em] text-[#351815]/55">
                <th className="border-b-2 border-[#351815] pb-2 pr-4">Sortie</th>
                <th className="border-b-2 border-[#351815] pb-2 pr-4">Date</th>
                <th className="border-b-2 border-[#351815] pb-2 pr-4">Statut</th>
                <th className="border-b-2 border-[#351815] pb-2 pr-4 text-right">Inscrits</th>
                <th className="border-b-2 border-[#351815] pb-2 text-right">Présents</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((c) => {
                const actives = c.race_registrations.filter((i) => i.status !== "cancelled");
                const presents = actives.filter((i) => i.checked_in).length;
                return (
                  <tr className="border-b border-[#351815]/20" key={c.id}>
                    <td className="py-3 pr-4">
                      <Link className="font-bold hover:text-[#b03583]" href={`/admin/courses/${c.id}`}>
                        {c.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs">{formatJourCourt(c.start_datetime)}</td>
                    <td className="py-3 pr-4 font-mono text-[.6rem] font-black uppercase tracking-[.12em]">{c.status}</td>
                    <td className="py-3 pr-4 text-right font-mono text-xs font-black">{actives.length}</td>
                    <td className="py-3 text-right font-mono text-xs font-black">{presents}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {liste.length === 0 ? (
          <p className="mt-5 border-2 border-dashed border-[#351815]/30 p-6 font-bold text-[#351815]/60">
            Aucune sortie. La migration est-elle passée ?
          </p>
        ) : null}
      </div>
    </section>
  );
}
