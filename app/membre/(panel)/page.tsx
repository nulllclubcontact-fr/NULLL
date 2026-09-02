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
 * La premiere version etait juste : creme, brun, et rien d'autre. Elle
 * n'avait aucune des couleurs du site, donc elle n'y ressemblait pas.
 * Chaque bloc porte desormais sa couleur : le brun pour la sortie qui
 * arrive et son QR, le jaune pour les sorties ouvertes, le rose pour ce
 * qui accroche l'oeil.
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
    <>
      {/* ---------------- BANDEAU D'ACCUEIL ---------------- */}
      <section className="border-b-2 border-[#351815] bg-[#351815] text-[#f6eadf]">
        <div className="shell py-10 lg:py-14">
          <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#ffb000]">Espace membre</p>
          <h1 className="mt-4 font-display text-[clamp(2.8rem,8vw,5.6rem)] uppercase leading-[.92]">
            Salut {profile?.first_name ?? "toi"}
            <span className="text-[#d96ab4]">.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg font-bold leading-snug text-[#f6eadf]/78">
            {aVenir.length > 0
              ? "Ton QR est juste en dessous. Montre-le en arrivant, c’est tout."
              : "Choisis une sortie, et ton QR apparaîtra ici."}
          </p>
        </div>
      </section>

      {/* ---------------- MES PROCHAINES SORTIES ---------------- */}
      <section className="border-b-2 border-[#351815] bg-[#f6eadf]">
        <div className="shell py-10 lg:py-14">
          <h2 className="inline-flex border-2 border-[#351815] bg-[#d96ab4] px-4 py-2 font-mono text-xs font-black uppercase tracking-[.14em] text-[#351815]">
            Mes prochaines sorties {aVenir.length > 0 ? `· ${aVenir.length}` : ""}
          </h2>

          {aVenir.length === 0 ? (
            <p className="mt-6 border-2 border-dashed border-[#351815]/35 bg-[#fff8ef] p-6 font-bold text-[#351815]/60">
              Aucune sortie prévue. Choisis-en une juste en dessous — il en reste {disponibles.length}.
            </p>
          ) : (
            <ul className="mt-6 grid gap-6 lg:grid-cols-2">
              {aVenir.map((inscription) => (
                <CarteInscription inscription={inscription} key={inscription.id} qrSvg={qrs.get(inscription.id)} />
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ---------------- SORTIES OUVERTES ---------------- */}
      <section className="border-b-2 border-[#351815] bg-[#ffb000] text-[#351815]">
        <div className="shell py-10 lg:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] uppercase leading-[.98]">
              Sorties ouvertes<span className="text-[#351815]/40">.</span>
            </h2>
            <p className="font-mono text-xs font-black uppercase tracking-[.14em]">
              Gratuit · Tous les niveaux
            </p>
          </div>

          {disponibles.length === 0 ? (
            <p className="mt-6 border-2 border-[#351815] bg-[#fff8ef] p-6 font-bold">
              {coursesAVenir.length === 0
                ? "Rien d’annoncé pour le moment. On prépare la suite."
                : "Tu es inscrit à tout ce qui est ouvert. Beau travail."}
            </p>
          ) : (
            <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {disponibles.map((course, index) => {
                const limiteDepassee =
                  course.registration_deadline !== null && new Date(course.registration_deadline) < new Date();
                const ferme = !course.registration_open || limiteDepassee;

                return (
                  <li
                    className="flex flex-col gap-4 border-2 border-[#351815] bg-[#f6eadf] p-5 shadow-[8px_8px_0_#351815] transition duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0_#351815]"
                    key={course.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-mono text-[.62rem] font-black uppercase tracking-[.14em] text-[#351815]/60">
                        {formatJour(course.start_datetime)}
                        <span className="mt-1 block text-[#351815]">{formatHeure(course.start_datetime)}</span>
                      </p>
                      <span className="shrink-0 border-2 border-[#351815] bg-[#d96ab4] px-2 py-1 font-display text-lg leading-none">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl uppercase leading-[1.05]">{course.title}</h3>
                    {course.description ? (
                      <p className="text-sm leading-snug text-[#351815]/72">{course.description}</p>
                    ) : null}

                    <dl className="grid gap-1 border-t-2 border-[#351815]/15 pt-3 font-mono text-[.62rem] font-black uppercase tracking-[.1em] text-[#351815]/65">
                      {course.distance_km !== null ? (
                        <div className="flex justify-between gap-3">
                          <dt>Distance</dt>
                          <dd className="text-[#351815]">{formatDistance(course.distance_km)}</dd>
                        </div>
                      ) : null}
                      {course.location ? (
                        <div className="flex justify-between gap-3">
                          <dt>Départ</dt>
                          <dd className="text-right text-[#351815]">{course.location}</dd>
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
      </section>

      {/* ---------------- PIED D'ESPACE ---------------- */}
      <section className="bg-[#f6eadf]">
        <div className="shell grid gap-5 py-10 sm:grid-cols-2 lg:py-14">
          <Link className="primary-link" href="/membre/profil">
            Mes informations
          </Link>
          <Link className="secondary-link" href="/membre/sorties">
            Historique de mes sorties
          </Link>
          <p className="sm:col-span-2 font-mono text-[.62rem] font-black uppercase leading-relaxed tracking-[.14em] text-[#351815]/40">
            Un système de points arrive plus tard. Pour l’instant, viens courir.
          </p>
        </div>
      </section>
    </>
  );
}

function CarteInscription({ inscription, qrSvg }: { inscription: RegistrationWithRace; qrSvg?: string }) {
  const course = inscription.races;

  if (!course) {
    return null;
  }

  return (
    <li className="flex flex-col gap-5 border-2 border-[#351815] bg-[#351815] p-5 text-[#f6eadf] shadow-[10px_10px_0_#d96ab4] sm:p-6">
      <div>
        <p className="font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#ffb000]">
          {formatJour(course.start_datetime)} · {formatHeure(course.start_datetime)}
        </p>
        <h3 className="mt-3 font-display text-[clamp(1.7rem,3.6vw,2.4rem)] uppercase leading-[1.02]">{course.title}</h3>
        <p className="mt-2 font-mono text-[.62rem] font-black uppercase tracking-[.12em] text-[#f6eadf]/60">
          {[course.location, formatDistance(course.distance_km)].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        {qrSvg ? (
          <div
            aria-label="QR code de ton inscription"
            className="w-[9rem] shrink-0 border-2 border-[#f6eadf] bg-white p-2 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
            role="img"
          />
        ) : null}

        <div className="min-w-[10rem] flex-1">
          {inscription.checked_in ? (
            <p className="inline-flex border-2 border-[#351815] bg-[#ffb000] px-3 py-2 font-mono text-[.62rem] font-black uppercase tracking-[.14em] text-[#351815]">
              Présence validée
            </p>
          ) : (
            <p className="text-sm font-bold leading-snug text-[#f6eadf]/75">
              Montre ce code en arrivant. Un scan, et c’est réglé.
            </p>
          )}

          {inscription.checked_in ? null : (
            <div className="mt-4">
              <CancelButton registrationId={inscription.id} />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
