import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDistance, formatHeure, formatJour } from "../../../../components/races/format";
import { inscriptionDonneAcces } from "../../../../lib/photos-sorties/regles";
import { listMyRegistrations, splitRegistrations } from "../../../../lib/races/repo";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export const metadata = { robots: { index: false, follow: false } };

const ETIQUETTES: Record<string, { texte: string; classe: string }> = {
  checked_in: { texte: "Présent", classe: "bg-[#FFC531]" },
  registered: { texte: "Inscrit", classe: "bg-[#141116]" },
  cancelled: { texte: "Annulée", classe: "bg-[#1E1A21] text-white" },
  no_show: { texte: "Absent", classe: "bg-[#E8459E]" }
};

export default async function MemberSortiesPage() {
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/membre/login");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/membre/login");
  }

  const inscriptions = await listMyRegistrations(user.id);
  const { aVenir, passees } = splitRegistrations(inscriptions);

  return (
    <section className="shell grid gap-10 py-8 lg:py-12">
      <header>
        <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-white">Espace membre</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] uppercase leading-[.95]">
          Tes sorties<span className="text-[#E8459E]">.</span>
        </h1>
      </header>

      {inscriptions.length === 0 ? (
        <p className="border-2 border-dashed border-white/30 p-6 font-bold text-white">
          Rien encore. Ça commencera par une première.
        </p>
      ) : (
        <>
          {aVenir.length > 0 ? <Tableau titre="À venir" lignes={aVenir} /> : null}
          {passees.length > 0 ? <Tableau avecPhotos titre="Sorties passées" lignes={passees} /> : null}
        </>
      )}
    </section>
  );
}

type Ligne = Awaited<ReturnType<typeof listMyRegistrations>>[number];

function Tableau({ titre, lignes, avecPhotos = false }: { titre: string; lignes: Ligne[]; avecPhotos?: boolean }) {
  return (
    <div>
      <h2 className="border-b-2 border-white/15 pb-3 font-mono text-xs font-black uppercase tracking-[.18em]">
        {titre} ({lignes.length})
      </h2>

      <ul className="mt-5 grid gap-3">
        {lignes.map((ligne) => {
          const course = ligne.races;
          const etiquette = ETIQUETTES[ligne.status] ?? ETIQUETTES.registered;

          return (
            <li
              className="flex flex-wrap items-center justify-between gap-4 border-2 border-white/15 bg-[#141116] p-4"
              key={ligne.id}
            >
              <div className="min-w-[12rem]">
                <p className="font-display text-xl uppercase leading-none">{course?.title ?? "Sortie"}</p>
                {course ? (
                  <p className="mt-2 font-mono text-xs font-black uppercase tracking-[.12em] text-white">
                    {formatJour(course.start_datetime)} · {formatHeure(course.start_datetime)}
                    {course.distance_km !== null ? ` · ${formatDistance(course.distance_km)}` : ""}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {avecPhotos && inscriptionDonneAcces(ligne.status) ? (
                  <Link
                    className="inline-flex min-h-11 items-center border-2 border-white/15 bg-[#E8459E] px-3 font-mono text-xs font-black uppercase tracking-[.14em] transition-colors hover:bg-[#FFC531]"
                    href={`/membre/sorties/${ligne.race_id}/photos`}
                  >
                    Photos
                  </Link>
                ) : null}
                <span
                  className={`inline-flex shrink-0 border-2 border-white/15 px-3 py-2 font-mono text-xs font-black uppercase tracking-[.14em] ${etiquette.classe}`}
                >
                  {etiquette.texte}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
