import QRCode from "qrcode";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CancelButton, RegisterButton } from "../../../components/races/RegisterButton";
import { formatDistance, formatHeure, formatJour } from "../../../components/races/format";
import { listMyRegistrations, listUpcomingRaces, splitRegistrations } from "../../../lib/races/repo";
import { encodeMemberQrToken } from "../../../lib/qr/token";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import type { RegistrationWithRace } from "../../../lib/races/types";

export const metadata = { robots: { index: false, follow: false } };

/**
 * Espace compte.
 *
 * Le tableau de bord affichait un compteur de points geant. Les points ne
 * sont pas encore ouverts aux membres : ils restent en base, ils ne sont
 * plus montres. Ce qui compte aujourd'hui, c'est la prochaine sortie et
 * le QR a presenter en arrivant.
 */
export default async function MemberDashboardPage() {
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

  const [{ data: profile }, inscriptions, coursesAVenir] = await Promise.all([
    supabase.from("profiles").select("first_name").eq("id", user.id).maybeSingle<{ first_name: string | null }>(),
    listMyRegistrations(user.id),
    listUpcomingRaces()
  ]);

  const { aVenir } = splitRegistrations(inscriptions.filter((i) => i.status !== "cancelled"));
  const dejaInscrit = new Set(aVenir.map((i) => i.race_id));
  const disponibles = coursesAVenir.filter((c) => !dejaInscrit.has(c.id));

  // Le QR est genere ici, une fois par inscription : le composant ne fait
  // que l'afficher, et rien de sensible ne traverse le client.
  const qrs = new Map<string, string>();
  for (const inscription of aVenir) {
    qrs.set(
      inscription.id,
      await QRCode.toString(encodeMemberQrToken(inscription.qr_code_token), {
        type: "svg",
        errorCorrectionLevel: "M",
        margin: 1,
        color: { dark: "#351815", light: "#ffffff" }
      })
    );
  }

  return (
    <section className="shell grid gap-10 py-8 lg:py-12">
      <header>
        <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#351815]/55">Espace membre</p>
        <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5rem)] uppercase leading-[.95]">
          Salut {profile?.first_name ?? "toi"}
          <span className="text-[#b03583]">.</span>
        </h1>
        <p className="mt-4 max-w-lg text-lg font-bold leading-snug text-[#351815]/72">
          {aVenir.length > 0
            ? "Ton QR est plus bas. Montre-le en arrivant, c’est tout."
            : "Choisis une sortie, et ton QR apparaîtra ici."}
        </p>
      </header>

      {/* ---------------- MES PROCHAINES SORTIES ---------------- */}
      <div>
        <h2 className="border-b-2 border-[#351815] pb-3 font-mono text-xs font-black uppercase tracking-[.18em]">
          Mes prochaines sorties {aVenir.length > 0 ? `(${aVenir.length})` : ""}
        </h2>

        {aVenir.length === 0 ? (
          <p className="mt-6 border-2 border-dashed border-[#351815]/30 p-6 font-bold text-[#351815]/60">
            Aucune sortie prévue pour l’instant. Elles sont juste en dessous.
          </p>
        ) : (
          <ul className="mt-6 grid gap-6 lg:grid-cols-2">
            {aVenir.map((inscription) => (
              <CarteInscription inscription={inscription} key={inscription.id} qrSvg={qrs.get(inscription.id)} />
            ))}
          </ul>
        )}
      </div>

      {/* ---------------- SORTIES DISPONIBLES ---------------- */}
      <div>
        <h2 className="border-b-2 border-[#351815] pb-3 font-mono text-xs font-black uppercase tracking-[.18em]">
          Sorties ouvertes
        </h2>

        {disponibles.length === 0 ? (
          <p className="mt-6 border-2 border-dashed border-[#351815]/30 p-6 font-bold text-[#351815]/60">
            {coursesAVenir.length === 0
              ? "Rien d’annoncé pour le moment. On prépare la suite."
              : "Tu es inscrit à tout ce qui est ouvert. Beau travail."}
          </p>
        ) : (
          <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {disponibles.map((course) => {
              const limiteDepassee =
                course.registration_deadline !== null && new Date(course.registration_deadline) < new Date();
              const ferme = !course.registration_open || limiteDepassee;

              return (
                <li className="panel flex flex-col gap-4 p-5" key={course.id}>
                  <div>
                    <p className="font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#351815]/55">
                      {formatJour(course.start_datetime)} · {formatHeure(course.start_datetime)}
                    </p>
                    <h3 className="mt-3 font-display text-2xl uppercase leading-[1.05]">{course.title}</h3>
                    {course.description ? (
                      <p className="mt-3 text-sm leading-snug text-[#351815]/70">{course.description}</p>
                    ) : null}
                  </div>

                  <dl className="grid gap-1 font-mono text-[.62rem] font-black uppercase tracking-[.12em] text-[#351815]/60">
                    {course.distance_km !== null ? (
                      <div className="flex justify-between gap-3">
                        <dt>Distance</dt>
                        <dd>{formatDistance(course.distance_km)}</dd>
                      </div>
                    ) : null}
                    {course.location ? (
                      <div className="flex justify-between gap-3">
                        <dt>Départ</dt>
                        <dd className="text-right">{course.location}</dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="mt-auto">
                    <RegisterButton
                      disabled={ferme}
                      disabledLabel={limiteDepassee ? "Date limite passée" : "Inscriptions fermées"}
                      raceId={course.id}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ---------------- PROFIL ---------------- */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Link className="primary-link" href="/membre/profil">
          Mes informations
        </Link>
        <Link className="secondary-link" href="/membre/sorties">
          Historique de mes sorties
        </Link>
      </div>

      {/* Les points existent en base mais ne sont pas ouverts : le dire une
          fois, discretement, vaut mieux qu'un compteur fige a zero. */}
      <p className="font-mono text-[.62rem] font-black uppercase leading-relaxed tracking-[.14em] text-[#351815]/40">
        Un système de points arrive plus tard. Pour l’instant, viens courir.
      </p>
    </section>
  );
}

function CarteInscription({ inscription, qrSvg }: { inscription: RegistrationWithRace; qrSvg?: string }) {
  const course = inscription.races;

  if (!course) {
    return null;
  }

  return (
    <li className="panel panel-grid flex flex-col gap-5 p-5 sm:p-6">
      <div>
        <p className="font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#b03583]">
          {formatJour(course.start_datetime)} · {formatHeure(course.start_datetime)}
        </p>
        <h3 className="mt-3 font-display text-[clamp(1.6rem,3.4vw,2.2rem)] uppercase leading-[1.02]">{course.title}</h3>
        <p className="mt-2 font-mono text-[.62rem] font-black uppercase tracking-[.12em] text-[#351815]/55">
          {[course.location, formatDistance(course.distance_km)].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        {qrSvg ? (
          <div
            aria-label="QR code de ton inscription"
            className="w-[8.5rem] shrink-0 border-2 border-[#351815] bg-white p-2 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
            role="img"
          />
        ) : null}

        <div className="min-w-[10rem] flex-1">
          {inscription.checked_in ? (
            <p className="inline-flex border-2 border-[#351815] bg-[#ffb000] px-3 py-2 font-mono text-[.62rem] font-black uppercase tracking-[.14em]">
              Présence validée
            </p>
          ) : (
            <p className="text-sm font-bold leading-snug text-[#351815]/70">
              Montre ce code en arrivant. Un scan, et c’est réglé.
            </p>
          )}

          <div className="mt-4">
            {inscription.checked_in ? null : <CancelButton registrationId={inscription.id} />}
          </div>
        </div>
      </div>
    </li>
  );
}
