import Image from "next/image";
import Link from "next/link";
import { CreateRaceForm } from "./CreateRaceForm";
import { SuppressionCourse } from "./SuppressionCourse";
import { setRaceStatus } from "../../courses-actions";
import { requireAdminUser } from "../../../../lib/admin/require-admin";
import { formatDistance, formatHeure, formatJour } from "../../../../components/races/format";
import { Etiquette, Intitule, TITRE_LIGNE, type Teinte } from "../../../../components/admin/graphiques";
import type { Race, RaceStatus } from "../../../../lib/races/types";

export const metadata = { robots: { index: false, follow: false } };

type LigneCourse = Race & { race_registrations: Array<{ status: string; checked_in: boolean }> };

const STATUT: Record<RaceStatus, { label: string; teinte: Teinte; pointillee?: boolean }> = {
  draft: { label: "Brouillon", teinte: "creme", pointillee: true },
  published: { label: "Publiée", teinte: "rose" },
  closed: { label: "Fermée", teinte: "jaune" },
  completed: { label: "Terminée", teinte: "bordeaux" },
  cancelled: { label: "Annulée", teinte: "creme" }
};

// La page est rendue a chaque requete (layout force-dynamic) : l'instant
// present est lu une fois, hors du composant.
function instantPresent() {
  return Date.now();
}

export default async function AdminCoursesPage() {
  const { supabase } = await requireAdminUser();

  const { data } = await supabase
    .from("races")
    .select("id,title,slug,description,location,address,city,start_datetime,end_datetime,distance_km,max_participants,registration_open,registration_deadline,status,cover_image_url,race_registrations(status,checked_in)")
    .order("start_datetime", { ascending: false })
    .returns<LigneCourse[]>();

  const courses = data ?? [];
  const maintenant = instantPresent();

  // Une sortie dont l'heure de depart est passee quitte la liste principale :
  // en tete, toujours la plus proche.
  const aVenir = courses
    .filter((c) => new Date(c.start_datetime).getTime() >= maintenant)
    .sort((a, b) => a.start_datetime.localeCompare(b.start_datetime));
  const passees = courses.filter((c) => new Date(c.start_datetime).getTime() < maintenant);

  return (
    <section className="shell grid gap-10 py-8 lg:py-12">
      <header>
        <p className="font-mono text-xs font-black uppercase tracking-[.18em]">Administration</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.2rem)] uppercase leading-[.95]">
          Les sorties<span className="text-[#EBA0CD]">.</span>
        </h1>
        <p className="mt-4 max-w-xl font-bold">
          Une sortie publiée apparaît tout de suite sur l’onglet « Sorties » du site. Une fois l’heure de départ passée, elle en disparaît et bascule ici dans les passées.
        </p>
      </header>

      <CreateRaceForm />

      <div>
        <Intitule>À venir · la plus proche en premier</Intitule>
        {aVenir.length === 0 ? (
          <p className="mt-5 border-2 border-dashed border-[#773331] p-6 font-bold">Aucune sortie à venir. Crée la prochaine juste au-dessus.</p>
        ) : (
          <ul className="mt-5 grid gap-4">
            {aVenir.map((course, index) => (
              <CarteCourse course={course} key={course.id} prochaine={index === 0} />
            ))}
          </ul>
        )}
      </div>

      {passees.length > 0 ? (
        <details>
          <summary className="cursor-pointer">
            <Intitule>Sorties passées ({passees.length}) · afficher</Intitule>
          </summary>
          <ul className="mt-5 grid gap-4">
            {passees.map((course) => (
              <CarteCourse course={course} key={course.id} />
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

function CarteCourse({ course, prochaine = false }: { course: LigneCourse; prochaine?: boolean }) {
  const actives = course.race_registrations.filter((i) => i.status !== "cancelled");
  const presents = actives.filter((i) => i.checked_in).length;
  const statut = STATUT[course.status] ?? STATUT.draft;

  return (
    <li className={`flex flex-col gap-4 border-2 border-[#773331] p-4 lg:flex-row lg:items-center ${prochaine ? "shadow-[6px_6px_0_#EBA0CD]" : ""}`}>
      <div className="relative h-24 w-full shrink-0 overflow-hidden border-2 border-[#773331] bg-[#EBA0CD] sm:w-40">
        {course.cover_image_url ? (
          <Image alt="" className="object-cover" fill sizes="160px" src={course.cover_image_url} unoptimized />
        ) : (
          <span className="grid h-full place-items-center font-mono text-xs font-black uppercase tracking-[.12em]">Pas de photo</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <Link className={`${TITRE_LIGNE} hover:underline hover:decoration-[#EBA0CD] hover:decoration-4`} href={`/admin/courses/${course.id}`}>
            {course.title}
          </Link>
          <Etiquette pointillee={statut.pointillee} teinte={statut.teinte}>
            {statut.label}
          </Etiquette>
          {prochaine ? <Etiquette teinte="jaune">La prochaine</Etiquette> : null}
          {!course.registration_open ? (
            <span className="font-mono text-xs font-black uppercase tracking-[.12em]">inscriptions fermées</span>
          ) : null}
        </div>
        <p className="mt-2 font-mono text-xs font-black uppercase tracking-[.12em]">
          {formatJour(course.start_datetime)} · {formatHeure(course.start_datetime)}
          {course.distance_km !== null ? ` · ${formatDistance(course.distance_km)}` : ""}
          {` · ${actives.length} inscrit${actives.length > 1 ? "s" : ""}`}
          {course.max_participants ? ` / ${course.max_participants}` : ""}
          {presents > 0 ? ` · ${presents} présent${presents > 1 ? "s" : ""}` : ""}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-start gap-2">
        {course.status === "draft" ? <FormeStatut id={course.id} label="Publier" statut="published" /> : null}
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
        <SuppressionCourse id={course.id} inscrits={actives.length} titre={course.title} />
      </div>
    </li>
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
