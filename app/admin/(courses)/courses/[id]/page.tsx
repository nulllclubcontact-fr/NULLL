import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "../../../../../lib/admin/require-admin";
import { formatDistance, formatHeure, formatJour } from "../../../../../components/races/format";
import type { Race } from "../../../../../lib/races/types";

export const metadata = { robots: { index: false, follow: false } };

type Inscrit = {
  id: string;
  status: string;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
  profiles: { first_name: string | null; last_name: string | null; email: string | null; phone: string | null } | null;
};

const ETIQUETTES: Record<string, { texte: string; classe: string }> = {
  checked_in: { texte: "Présent", classe: "bg-[#ffb000]" },
  registered: { texte: "Inscrit", classe: "bg-[#f6eadf]" },
  cancelled: { texte: "Annulée", classe: "bg-[#351815] text-[#f6eadf]" },
  no_show: { texte: "Absent", classe: "bg-[#d96ab4]" }
};

export default async function AdminCourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdminUser();

  const { data: course } = await supabase
    .from("races")
    .select("id,title,slug,description,location,address,city,start_datetime,end_datetime,distance_km,max_participants,registration_open,registration_deadline,status,cover_image_url")
    .eq("id", id)
    .maybeSingle<Race>();

  if (!course) {
    notFound();
  }

  const { data: inscrits } = await supabase
    .from("race_registrations")
    .select("id,status,checked_in,checked_in_at,created_at,profiles(first_name,last_name,email,phone)")
    .eq("race_id", id)
    .order("created_at", { ascending: true })
    .returns<Inscrit[]>();

  const lignes = inscrits ?? [];
  const actifs = lignes.filter((l) => l.status !== "cancelled");
  const presents = actifs.filter((l) => l.checked_in);
  const absents = actifs.length - presents.length;
  const taux = actifs.length === 0 ? 0 : Math.round((presents.length / actifs.length) * 100);

  const chiffres = [
    { label: "Inscrits", valeur: actifs.length },
    { label: "Présents", valeur: presents.length },
    { label: "Absents", valeur: absents },
    { label: "Taux de présence", valeur: `${taux} %` }
  ];

  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link className="font-mono text-xs font-black uppercase tracking-[.14em] text-[#351815]/50 hover:text-[#b03583]" href="/admin/courses">
            ← Toutes les sorties
          </Link>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,5.5vw,3.8rem)] uppercase leading-[.98]">{course.title}</h1>
          <p className="mt-3 font-mono text-[.62rem] font-black uppercase tracking-[.12em] text-[#351815]/55">
            {formatJour(course.start_datetime)} · {formatHeure(course.start_datetime)}
            {course.location ? ` · ${course.location}` : ""}
            {course.distance_km !== null ? ` · ${formatDistance(course.distance_km)}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link className="primary-link" href={`/admin/scanner?course=${course.id}`}>
            Scanner cette sortie
          </Link>
          <a className="secondary-link" href={`/admin/courses/${course.id}/export`}>
            Export CSV
          </a>
        </div>
      </header>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {chiffres.map((c) => (
          <div className="panel p-5" key={c.label}>
            <dt className="font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#351815]/55">{c.label}</dt>
            <dd className="mt-3 font-display text-[clamp(2.4rem,6vw,3.4rem)] leading-none">{c.valeur}</dd>
          </div>
        ))}
      </dl>

      <div>
        <h2 className="border-b-2 border-[#351815] pb-3 font-mono text-xs font-black uppercase tracking-[.18em]">
          Les inscrits ({lignes.length})
        </h2>

        {lignes.length === 0 ? (
          <p className="mt-5 border-2 border-dashed border-[#351815]/30 p-6 font-bold text-[#351815]/60">
            Personne pour l’instant.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <thead>
                <tr className="font-mono text-[.6rem] font-black uppercase tracking-[.14em] text-[#351815]/55">
                  <th className="border-b-2 border-[#351815] pb-2 pr-4">Participant</th>
                  <th className="border-b-2 border-[#351815] pb-2 pr-4">Contact</th>
                  <th className="border-b-2 border-[#351815] pb-2 pr-4">Statut</th>
                  <th className="border-b-2 border-[#351815] pb-2">Scanné à</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne) => {
                  const p = ligne.profiles;
                  const etiquette = ETIQUETTES[ligne.status] ?? ETIQUETTES.registered;
                  const nom = [p?.first_name, p?.last_name].filter(Boolean).join(" ") || "Membre";

                  return (
                    <tr className="border-b border-[#351815]/20" key={ligne.id}>
                      <td className="py-3 pr-4 font-bold">{nom}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-[#351815]/70">
                        {p?.email ?? "—"}
                        {p?.phone ? <span className="block">{p.phone}</span> : null}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex border-2 border-[#351815] px-2 py-1 font-mono text-[.55rem] font-black uppercase tracking-[.12em] ${etiquette.classe}`}>
                          {etiquette.texte}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-xs">
                        {ligne.checked_in_at ? formatHeure(ligne.checked_in_at) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
