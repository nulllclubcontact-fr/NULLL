import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "../../../../../lib/admin/require-admin";
import { formatDistance, formatHeure, formatJour } from "../../../../../components/races/format";
import type { Race } from "../../../../../lib/races/types";
import { Intitule } from "../../../../../components/admin/graphiques";
import { FormulairePhotoCourse } from "../../../../../components/admin/champ-photo";
import { SuppressionCourse } from "../SuppressionCourse";
import { EditRaceForm } from "./EditRaceForm";
import { dupliquerCourse, pointerInscription } from "../../../courses-actions";

export const metadata = { robots: { index: false, follow: false } };

type Inscrit = {
  id: string;
  status: string;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
  profiles: { first_name: string | null; last_name: string | null; email: string | null; phone: string | null; consent_image: boolean | null } | null;
};

const ETIQUETTES: Record<string, { texte: string; classe: string }> = {
  checked_in: { texte: "Présent", classe: "bg-[#FFB200]" },
  registered: { texte: "Inscrit", classe: "bg-[#F1EDE9]" },
  cancelled: { texte: "Annulée", classe: "bg-[#773331] text-[#F1EDE9]" },
  no_show: { texte: "Absent", classe: "bg-[#EBA0CD]" }
};

// Meme convention que le tableau de bord : l'heure lue au rendu vit hors du composant.
function instantPresent() {
  return Date.now();
}

const PARIS_LOCAL = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Paris",
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

/** Instant UTC en valeur de champ datetime-local, lue a l'heure de Paris. */
function versChampParis(iso: string) {
  const p = Object.fromEntries(PARIS_LOCAL.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

const MESSAGES: Record<string, { texte: string; alerte: boolean }> = {
  creee: { texte: "Sortie créée en brouillon. Vérifie, ajoute la photo, puis publie depuis « Modifier la sortie ».", alerte: false },
  publiee: { texte: "Sortie créée et publiée : elle est déjà sur le site. Ajoute une photo si tu en as une.", alerte: false },
  doublon: { texte: "Une sortie porte déjà ce nom une semaine plus tard : rien n’a été dupliqué.", alerte: true },
  duplication: { texte: "Duplication refusée. Réessaie.", alerte: true }
};

export default async function AdminCourseDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creee?: string; erreur?: string }>;
}) {
  const [{ id }, { creee, erreur }] = await Promise.all([params, searchParams]);
  const { supabase } = await requireAdminUser();

  const { data: course } = await supabase
    .from("races")
    .select("id,title,slug,description,location,address,city,start_datetime,end_datetime,distance_km,max_participants,registration_open,registration_deadline,status,cover_image_url")
    .eq("id", id)
    .maybeSingle<Race>();

  if (!course) {
    notFound();
  }

  // Le bandeau dit ce qui s'est vraiment passe : une sortie creee « publiee »
  // est deja visible, inutile de demander de la publier.
  const message = creee ? (course.status === "published" ? MESSAGES.publiee : MESSAGES.creee) : erreur ? MESSAGES[erreur] : undefined;

  const { data: inscrits } = await supabase
    .from("race_registrations")
    .select("id,status,checked_in,checked_in_at,created_at,profiles(first_name,last_name,email,phone,consent_image)")
    .eq("race_id", id)
    .order("created_at", { ascending: true })
    .returns<Inscrit[]>();

  const lignes = inscrits ?? [];
  const actifs = lignes.filter((l) => l.status !== "cancelled");
  const presents = actifs.filter((l) => l.checked_in);
  const nonScannes = actifs.length - presents.length;
  const taux = actifs.length === 0 ? 0 : Math.round((presents.length / actifs.length) * 100);
  // Avant le depart, personne n'est absent : il reste simplement a pointer.
  const commencee = new Date(course.start_datetime).getTime() <= instantPresent();

  const chiffres = [
    { label: "Inscrits", valeur: actifs.length },
    { label: "Présents", valeur: presents.length },
    { label: commencee ? "Absents" : "À pointer", valeur: nonScannes },
    { label: "Taux de présence", valeur: `${taux} %` }
  ];

  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link className="inline-flex min-h-11 items-center font-mono text-xs font-black uppercase tracking-[.14em] text-[#773331] hover:text-[#EBA0CD]" href="/admin/courses">
            ← Toutes les sorties
          </Link>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,5.5vw,3.8rem)] uppercase leading-[.98]">{course.title}</h1>
          <p className="mt-3 font-mono text-xs font-black uppercase tracking-[.12em] text-[#773331]">
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
          <form action={dupliquerCourse}>
            <input name="race_id" type="hidden" value={course.id} />
            <button className="secondary-link" type="submit">
              Dupliquer (+7 jours)
            </button>
          </form>
          <SuppressionCourse id={course.id} inscrits={actifs.length} titre={course.title} />
        </div>
      </header>

      {message ? (
        <p
          className={`border-2 border-[#773331] px-4 py-3 font-bold ${message.alerte ? "bg-[#FFB200]" : "bg-[#EBA0CD]"}`}
          role={message.alerte ? "alert" : "status"}
        >
          {message.texte}
        </p>
      ) : null}

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {chiffres.map((c) => (
          <div className="panel p-5" key={c.label}>
            <dt className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#773331]">{c.label}</dt>
            <dd className="mt-3 font-display text-[clamp(2.4rem,6vw,3.4rem)] leading-none">{c.valeur}</dd>
          </div>
        ))}
      </dl>

      <EditRaceForm course={course} departLocal={versChampParis(course.start_datetime)} />

      <div>
        <Intitule>Photo de la sortie</Intitule>
        <div className="mt-5">
          <FormulairePhotoCourse initiale={course.cover_image_url} raceId={course.id} />
        </div>
      </div>

      <div>
        <h2 className="border-b-2 border-[#773331] pb-3 font-mono text-xs font-black uppercase tracking-[.18em]">
          Les inscrits ({lignes.length})
        </h2>

        {lignes.length === 0 ? (
          <p className="mt-5 border-2 border-dashed border-[#773331]/30 p-6 font-bold text-[#773331]">
            Personne pour l’instant.
          </p>
        ) : (
          <div aria-label="Tableau des inscrits" className="mt-5 overflow-x-auto" tabIndex={0}>
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <thead>
                <tr className="font-mono text-xs font-black uppercase tracking-[.14em] text-[#773331]">
                  <th className="border-b-2 border-[#773331] pb-2 pr-4">Participant</th>
                  <th className="border-b-2 border-[#773331] pb-2 pr-4">Contact</th>
                  <th className="border-b-2 border-[#773331] pb-2 pr-4">Statut</th>
                  <th className="border-b-2 border-[#773331] pb-2 pr-4">Scanné à</th>
                  <th className="border-b-2 border-[#773331] pb-2">
                    <span className="sr-only">Pointer à la main</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne) => {
                  const p = ligne.profiles;
                  const etiquette = ETIQUETTES[ligne.status] ?? ETIQUETTES.registered;
                  const nom = [p?.first_name, p?.last_name].filter(Boolean).join(" ") || "Membre";

                  return (
                    <tr className="border-b border-[#773331]/20" key={ligne.id}>
                      <td className="py-3 pr-4 font-bold">
                        {nom}
                        {/* Sans accord (refus ou pas de reponse) : on ne le prend pas en photo. */}
                        {p?.consent_image ? null : (
                          <span className="mt-1 block w-fit border-2 border-[#773331] bg-[#EBA0CD] px-2 py-0.5 font-mono text-[.7rem] font-black uppercase tracking-[.1em]">
                            {p?.consent_image === false ? "Pas de photo" : "Photo : sans réponse"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs text-[#773331]">
                        {p?.email ?? "Non renseigné"}
                        {p?.phone ? <span className="block">{p.phone}</span> : null}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex border-2 border-[#773331] px-2 py-1 font-mono text-xs font-black uppercase tracking-[.12em] ${etiquette.classe}`}>
                          {etiquette.texte}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs">
                        {ligne.checked_in_at ? formatHeure(ligne.checked_in_at) : "Non pointé"}
                      </td>
                      <td className="py-3">
                        {/* Telephone decharge, QR illisible : on pointe a la main,
                            meme trace que le scan. Pas sur un brouillon ni une
                            sortie annulee, ni sur une inscription annulee. */}
                        {!ligne.checked_in && ligne.status !== "cancelled" && course.status !== "draft" && course.status !== "cancelled" ? (
                          <form action={pointerInscription}>
                            <input name="registration_id" type="hidden" value={ligne.id} />
                            <input name="race_id" type="hidden" value={course.id} />
                            <button className="nav-link" type="submit">
                              Pointer
                            </button>
                          </form>
                        ) : null}
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
