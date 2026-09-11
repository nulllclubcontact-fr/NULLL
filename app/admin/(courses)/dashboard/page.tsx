import Link from "next/link";
import { requireAdminUser } from "../../../../lib/admin/require-admin";
import { formatHeure, formatJour, formatJourCourt } from "../../../../components/races/format";
import { ColonnesParJour, Intitule, Pastille, TITRE_LIGNE, Tuiles, fenetreJours } from "../../../../components/admin/graphiques";
import type { Race, RaceStatus } from "../../../../lib/races/types";

export const metadata = { robots: { index: false, follow: false } };

type LigneCourse = Race & {
  race_registrations: Array<{ status: string; checked_in: boolean; created_at: string }>;
};

const JOURS_HISTORIQUE = 14;

// Chaque statut porte une couleur de la palette : on lit l'etat d'une
// sortie d'un coup d'oeil, sans dechiffrer un mot anglais.
const STATUTS: Record<RaceStatus, { label: string; classe: string }> = {
  draft: { label: "Brouillon", classe: "border-dashed bg-[#F1EDE9] text-[#773331]" },
  published: { label: "Publiée", classe: "bg-[#EBA0CD] text-[#773331]" },
  closed: { label: "Fermée", classe: "bg-[#FFB200] text-[#773331]" },
  completed: { label: "Terminée", classe: "bg-[#773331] text-[#F1EDE9]" },
  cancelled: { label: "Annulée", classe: "bg-[#F1EDE9] text-[#773331] line-through" }
};

// La page est rendue a chaque requete (layout force-dynamic) : l'instant
// present est lu une fois, hors du composant.
function instantPresent() {
  return Date.now();
}

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
    .select("id,title,slug,start_datetime,status,max_participants,location,race_registrations(status,checked_in,created_at)")
    .order("start_datetime", { ascending: false })
    .returns<LigneCourse[]>();

  const liste = courses ?? [];
  const maintenant = instantPresent();

  // Reprend l indicateur « nouveaux membres » de l ancienne admin a code.
  const depuis30Jours = new Date(maintenant - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [{ count: membres }, { count: nouveaux }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", depuis30Jours)
  ]);

  let inscriptions = 0;
  let presences = 0;
  let annulations = 0;

  // Inscriptions actives par jour, sur les deux dernieres semaines.
  const fenetre = fenetreJours(JOURS_HISTORIQUE);

  // Absents et taux de presence ne se mesurent que sur les sorties deja
  // parties : un inscrit du samedi suivant n'est pas absent.
  let inscritsPasses = 0;
  let presentsPasses = 0;

  for (const course of liste) {
    const partie = new Date(course.start_datetime).getTime() <= maintenant;
    for (const i of course.race_registrations) {
      if (i.status === "cancelled") {
        annulations += 1;
        continue;
      }
      inscriptions += 1;
      if (i.checked_in) presences += 1;
      if (partie) {
        inscritsPasses += 1;
        if (i.checked_in) presentsPasses += 1;
      }
      fenetre.ajouter(i.created_at);
    }
  }

  const absents = Math.max(inscritsPasses - presentsPasses, 0);
  const tauxPresence = pourcentage(presentsPasses, inscritsPasses);
  const publiees = liste.filter((c) => c.status === "published").length;
  const terminees = liste.filter((c) => c.status === "completed").length;
  const prochaines = liste
    .filter((c) => new Date(c.start_datetime).getTime() >= maintenant && c.status === "published")
    .sort((a, b) => a.start_datetime.localeCompare(b.start_datetime))
    .slice(0, 3);

  const remplissage = liste
    .filter((c) => c.status !== "draft" && c.status !== "cancelled")
    .slice(0, 6)
    .reverse()
    .map((c) => {
      const actives = c.race_registrations.filter((i) => i.status !== "cancelled");
      return { course: c, inscrits: actives.length, presents: actives.filter((i) => i.checked_in).length };
    });
  // Sans jauge fixee, la barre se mesure a la sortie la plus remplie.
  const echelleLibre = Math.max(10, ...remplissage.map((r) => r.inscrits));

  const totalRepartition = inscriptions + annulations;
  const repartition = [
    { label: "Présents", valeur: presences, couleur: "bg-[#773331]" },
    { label: "Pas encore scannés", valeur: absents, couleur: "bg-[#FFB200]" },
    { label: "Annulés", valeur: annulations, couleur: "bg-[#EBA0CD]" }
  ];

  const totalJours = fenetre.jours.reduce((s, j) => s + j.total, 0);

  return (
    <section className="shell grid gap-12 py-8 lg:py-12">
      <header>
        <p className="font-mono text-xs font-black uppercase tracking-[.18em]">Administration</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.2rem)] uppercase leading-[.95]">
          Vue d’ensemble<span className="text-[#EBA0CD]">.</span>
        </h1>
        <p className="mt-4 font-mono text-xs font-black uppercase tracking-[.14em]">
          {membres ?? 0} membre{(membres ?? 0) > 1 ? "s" : ""} · {nouveaux ?? 0} {(nouveaux ?? 0) > 1 ? "nouveaux" : "nouveau"} ces 30 derniers jours
        </p>
      </header>

      <Tuiles
        tuiles={[
          { label: "Sorties", valeur: liste.length, detail: `${publiees} publiées · ${terminees} terminées`, teinte: "bordeaux" },
          {
            label: "Inscriptions",
            valeur: inscriptions,
            detail: annulations > 0 ? `${annulations} annulées` : "aucune annulation",
            teinte: "rose"
          },
          { label: "Présences", valeur: presences, detail: `${tauxPresence} % des inscrits aux sorties passées`, teinte: "jaune", jauge: tauxPresence },
          { label: "Absents", valeur: absents, detail: "sur les sorties passées", teinte: "creme" }
        ]}
      />

      <div className="grid gap-12 xl:grid-cols-[1.4fr_1fr]">
        <div>
          <Intitule>Remplissage des sorties</Intitule>
          {remplissage.length === 0 ? (
            <p className="mt-5 border-2 border-dashed border-[#773331] p-6 font-bold">Aucune sortie publiée à mesurer.</p>
          ) : (
            <>
              <ul className="mt-6 grid gap-5">
                {remplissage.map(({ course, inscrits, presents }) => {
                  const capacite = course.max_participants ?? echelleLibre;
                  const largeurInscrits = Math.min(100, (inscrits / capacite) * 100);
                  const largeurPresents = Math.min(100, (presents / capacite) * 100);
                  return (
                    <li key={course.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <Link className={`${TITRE_LIGNE} hover:underline hover:decoration-[#EBA0CD] hover:decoration-4`} href={`/admin/courses/${course.id}`}>
                          {course.title}
                        </Link>
                        <span className="font-mono text-xs font-black uppercase tracking-[.08em]">
                          {inscrits}
                          {course.max_participants ? ` / ${course.max_participants}` : ""} inscrit{inscrits > 1 ? "s" : ""}
                          {presents > 0 ? ` · ${presents} présent${presents > 1 ? "s" : ""}` : ""}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[.1em]">
                        {formatJourCourt(course.start_datetime)}
                        {course.max_participants ? "" : " · sans limite de places"}
                      </p>
                      <div
                        aria-label={`${inscrits} inscrits, ${presents} présents${course.max_participants ? ` sur ${course.max_participants} places` : ""}`}
                        className="relative mt-2 h-7 border-2 border-[#773331] bg-[#F1EDE9]"
                        role="img"
                      >
                        <div className="absolute inset-y-0 left-0 bg-[#EBA0CD]" style={{ width: `${largeurInscrits}%` }} />
                        <div className="absolute inset-y-0 left-0 bg-[#773331]" style={{ width: `${largeurPresents}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs font-black uppercase tracking-[.12em]">
                <span className="inline-flex items-center gap-2"><Pastille couleur="bg-[#EBA0CD]" />Inscrits</span>
                <span className="inline-flex items-center gap-2"><Pastille couleur="bg-[#773331]" />Présents</span>
                <span className="inline-flex items-center gap-2"><Pastille couleur="bg-[#F1EDE9]" />Places libres</span>
              </p>
            </>
          )}
        </div>

        <div className="grid content-start gap-12">
          <div>
            <Intitule>Répartition des inscrits</Intitule>
            <div
              aria-label={repartition.map((r) => `${r.valeur} ${r.label.toLowerCase()}`).join(", ")}
              className="mt-6 flex h-12 border-2 border-[#773331] bg-[repeating-linear-gradient(135deg,#F1EDE9_0_8px,#EBA0CD_8px_10px)]"
              role="img"
            >
              {totalRepartition > 0
                ? repartition.map((r) =>
                    r.valeur > 0 ? (
                      <div className={`h-full border-r-2 border-[#773331] last:border-r-0 ${r.couleur}`} key={r.label} style={{ width: `${(r.valeur / totalRepartition) * 100}%` }} />
                    ) : null
                  )
                : null}
            </div>
            {totalRepartition === 0 ? (
              <p className="mt-3 font-mono text-xs font-black uppercase tracking-[.12em]">Pas encore d’inscrit : la barre se remplira au premier.</p>
            ) : null}
            <ul className="mt-4 grid gap-2">
              {repartition.map((r) => (
                <li className="flex items-center justify-between gap-4 border-b border-[#773331]/30 pb-2" key={r.label}>
                  <span className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[.1em]">
                    <Pastille couleur={r.couleur} />
                    {r.label}
                  </span>
                  <span className="font-mono text-xs font-black">
                    {r.valeur} <span className="font-bold">· {pourcentage(r.valeur, totalRepartition)} %</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Intitule>Inscriptions · {JOURS_HISTORIQUE} derniers jours</Intitule>
            <ColonnesParJour description={`${totalJours} inscriptions sur les ${JOURS_HISTORIQUE} derniers jours`} jours={fenetre.jours} />
            <p className="mt-3 font-mono text-xs font-black uppercase tracking-[.12em]">
              {totalJours === 0 ? "Aucune inscription sur la période" : `${totalJours} inscription${totalJours > 1 ? "s" : ""} · aujourd’hui en jaune`}
            </p>
          </div>
        </div>
      </div>

      <div>
        <Intitule>Prochaines sorties</Intitule>
        {prochaines.length === 0 ? (
          <p className="mt-5 border-2 border-dashed border-[#773331] p-6 font-bold">
            Rien de publié à venir. <Link className="underline decoration-[#EBA0CD] decoration-2 underline-offset-4" href="/admin/courses">Crée une sortie.</Link>
          </p>
        ) : (
          <ul className="mt-5 grid gap-3">
            {prochaines.map((c, index) => {
              const actives = c.race_registrations.filter((i) => i.status !== "cancelled").length;
              return (
                <li
                  className={`flex flex-wrap items-center justify-between gap-4 border-2 border-[#773331] p-4 ${index === 0 ? "bg-[#773331] text-[#F1EDE9]" : "bg-[#F1EDE9]"}`}
                  key={c.id}
                >
                  <div>
                    {index === 0 ? (
                      <p className="mb-2 inline-block bg-[#FFB200] px-2 py-1 font-mono text-xs font-black uppercase tracking-[.14em] text-[#773331]">La prochaine</p>
                    ) : null}
                    <Link
                      className={`block ${TITRE_LIGNE} ${index === 0 ? "hover:text-[#FFB200]" : "hover:underline hover:decoration-[#EBA0CD] hover:decoration-4"}`}
                      href={`/admin/courses/${c.id}`}
                    >
                      {c.title}
                    </Link>
                    <p className="mt-2 font-mono text-xs font-black uppercase tracking-[.12em]">
                      {formatJour(c.start_datetime)} · {formatHeure(c.start_datetime)}
                    </p>
                  </div>
                  <p className={`border-2 px-3 py-2 font-mono text-xs font-black uppercase ${index === 0 ? "border-[#F1EDE9] bg-[#EBA0CD] text-[#773331]" : "border-[#773331] bg-[#EBA0CD]"}`}>
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
        <Intitule>Toutes les sorties</Intitule>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <thead>
              <tr className="font-mono text-xs font-black uppercase tracking-[.14em]">
                <th className="border-b-2 border-[#773331] pb-2 pr-4">Sortie</th>
                <th className="border-b-2 border-[#773331] pb-2 pr-4">Date</th>
                <th className="border-b-2 border-[#773331] pb-2 pr-4">Statut</th>
                <th className="border-b-2 border-[#773331] pb-2 pr-4 text-right">Inscrits</th>
                <th className="border-b-2 border-[#773331] pb-2 text-right">Présents</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((c) => {
                const actives = c.race_registrations.filter((i) => i.status !== "cancelled");
                const presents = actives.filter((i) => i.checked_in).length;
                const statut = STATUTS[c.status] ?? { label: c.status, classe: "bg-[#F1EDE9] text-[#773331]" };
                return (
                  <tr className="border-b border-[#773331]/30 transition hover:bg-[#EBA0CD]/35" key={c.id}>
                    <td className="py-3 pr-4">
                      <Link className="font-bold hover:underline hover:decoration-[#773331] hover:decoration-2" href={`/admin/courses/${c.id}`}>
                        {c.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs font-bold">{formatJourCourt(c.start_datetime)}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block border-2 border-[#773331] px-2 py-1 font-mono text-xs font-black uppercase tracking-[.12em] ${statut.classe}`}>
                        {statut.label}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-xs font-black">{actives.length}</td>
                    <td className="py-3 text-right font-mono text-xs font-black">{presents}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {liste.length === 0 ? (
          <p className="mt-5 border-2 border-dashed border-[#773331] p-6 font-bold">
            Aucune sortie. La migration est-elle passée ?
          </p>
        ) : null}
      </div>
    </section>
  );
}
