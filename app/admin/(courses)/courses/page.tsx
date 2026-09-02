import Link from "next/link";
import { CreateRaceForm } from "./CreateRaceForm";
import { setRaceStatus } from "../../courses-actions";
import { requireAdminUser } from "../../../../lib/admin/require-admin";
import { formatDistance, formatHeure, formatJour } from "../../../../components/races/format";
import type { Race } from "../../../../lib/races/types";

export const metadata = { robots: { index: false, follow: false } };

type LigneCourse = Race & { race_registrations: Array<{ status: string; checked_in: boolean }> };

const LIBELLE_STATUT: Record<string, string> = {
  draft: "Brouillon",
  published: "Publiée",
  closed: "Fermée",
  completed: "Terminée",
  cancelled: "Annulée"
};

export default async function AdminCoursesPage() {
  const { supabase } = await requireAdminUser();

  const { data } = await supabase
    .from("races")
    .select("id,title,slug,description,location,address,city,start_datetime,end_datetime,distance_km,max_participants,registration_open,registration_deadline,status,cover_image_url,race_registrations(status,checked_in)")
    .order("start_datetime", { ascending: false })
    .returns<LigneCourse[]>();

  const courses = data ?? [];

  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <header>
        <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#351815]/55">Administration</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.2rem)] uppercase leading-[.95]">
          Les sorties<span className="text-[#b03583]">.</span>
        </h1>
      </header>

      <CreateRaceForm />

      {courses.length === 0 ? (
        <p className="border-2 border-dashed border-[#351815]/30 p-6 font-bold text-[#351815]/60">
          Aucune sortie pour l’instant.
        </p>
      ) : (
        <ul className="grid gap-4">
          {courses.map((course) => {
            const actives = course.race_registrations.filter((i) => i.status !== "cancelled");
            const presents = actives.filter((i) => i.checked_in).length;

            return (
              <li className="panel flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between" key={course.id}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link className="font-display text-2xl uppercase leading-none hover:text-[#b03583]" href={`/admin/courses/${course.id}`}>
                      {course.title}
                    </Link>
                    <span className="inline-flex border-2 border-[#351815] px-2 py-1 font-mono text-[.55rem] font-black uppercase tracking-[.12em]">
                      {LIBELLE_STATUT[course.status] ?? course.status}
                    </span>
                    {!course.registration_open ? (
                      <span className="font-mono text-[.55rem] font-black uppercase tracking-[.12em] text-[#351815]/45">
                        inscriptions fermées
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 font-mono text-[.62rem] font-black uppercase tracking-[.12em] text-[#351815]/55">
                    {formatJour(course.start_datetime)} · {formatHeure(course.start_datetime)}
                    {course.distance_km !== null ? ` · ${formatDistance(course.distance_km)}` : ""}
                    {` · ${actives.length} inscrit${actives.length > 1 ? "s" : ""}`}
                    {course.max_participants ? ` / ${course.max_participants}` : ""}
                    {presents > 0 ? ` · ${presents} présent${presents > 1 ? "s" : ""}` : ""}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {course.status === "draft" ? (
                    <FormeStatut id={course.id} label="Publier" statut="published" />
                  ) : null}
                  {course.status === "published" ? (
                    <>
                      <FormeStatut id={course.id} label="Fermer" statut="closed" />
                      <FormeStatut id={course.id} label="Terminer" statut="completed" />
                    </>
                  ) : null}
                  {course.status === "closed" ? <FormeStatut id={course.id} label="Terminer" statut="completed" /> : null}
                  <Link className="nav-link" href={`/admin/courses/${course.id}`}>
                    Détail
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function FormeStatut({ id, statut, label }: { id: string; statut: string; label: string }) {
  return (
    <form action={setRaceStatus}>
      <input name="race_id" type="hidden" value={id} />
      <input name="status" type="hidden" value={statut} />
      <button className="nav-link" type="submit">
        {label}
      </button>
    </form>
  );
}
