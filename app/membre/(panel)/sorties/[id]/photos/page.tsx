import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatJour } from "../../../../../../components/races/format";
import { TelechargerToutesPhotos } from "../../../../../../components/membre/telecharger-photos";
import { identifiantValide } from "../../../../../../lib/admin/regles";
import { listerPhotosSortie } from "../../../../../../lib/photos-sorties/lister";
import { inscriptionDonneAcces } from "../../../../../../lib/photos-sorties/regles";
import { sessionServeur } from "../../../../../../lib/supabase/server";

export const metadata = { robots: { index: false, follow: false } };

type Inscription = { status: string; races: { title: string; start_datetime: string } | null };

/**
 * Photos d'une sortie, reservees a ses inscrits. Le droit est verifie avec
 * la session du membre (sa propre inscription, sous RLS) avant de signer
 * le moindre lien.
 */
export default async function PhotosSortiePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await sessionServeur();
  if (!session?.user) redirect("/membre/login");
  if (!identifiantValide(id)) redirect("/membre/sorties");

  const { data: inscription } = await session.supabase
    .from("race_registrations")
    .select("status,races(title,start_datetime)")
    .eq("race_id", id)
    .eq("user_id", session.user.id)
    .maybeSingle<Inscription>();

  const course = inscription?.races ?? null;
  const acces = Boolean(course) && inscriptionDonneAcces(inscription?.status);
  const photos = acces && course ? await listerPhotosSortie(id, course.start_datetime) : null;

  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <header>
        <Link className="font-mono text-xs font-black uppercase tracking-[.18em] underline decoration-2 underline-offset-4" href="/membre/sorties">
          ← Mes sorties
        </Link>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] uppercase leading-[.95]">
          Les photos<span className="text-[#EBA0CD]">.</span>
        </h1>
        {course ? (
          <p className="mt-3 font-mono text-xs font-black uppercase tracking-[.12em]">
            {course.title} · {formatJour(course.start_datetime)}
          </p>
        ) : null}
      </header>

      {!acces ? (
        <p className="border-2 border-dashed border-[#773331]/30 p-6 font-bold">Ces photos sont réservées aux inscrits de la sortie.</p>
      ) : photos === null ? (
        <p className="border-2 border-[#773331] bg-[#FFB200] p-4 font-mono text-sm font-black uppercase" role="alert">
          Photos indisponibles pour le moment. Réessaie un peu plus tard.
        </p>
      ) : photos.length === 0 ? (
        <p className="border-2 border-dashed border-[#773331]/30 p-6 font-bold">Pas encore de photos. On te prévient dès qu’elles sont là.</p>
      ) : (
        <>
          <TelechargerToutesPhotos
            nomArchive={`nulll-club-${course!.start_datetime.slice(0, 10)}.zip`}
            photos={photos.map(({ url, nom }) => ({ url, nom }))}
          />
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <li className="grid gap-2" key={photo.chemin}>
                <a className="block border-2 border-[#773331] transition-transform hover:-translate-y-1" href={photo.url} rel="noopener" target="_blank">
                  <Image alt={`Photo ${photo.nom}`} className="aspect-square w-full object-cover" height={400} src={photo.url} unoptimized width={400} />
                </a>
                <a className="inline-flex min-h-11 items-center justify-center border-2 border-[#773331] bg-[#F1EDE9] font-mono text-xs font-black uppercase tracking-[.1em] hover:bg-[#FFB200]" href={photo.telechargement}>
                  Télécharger
                </a>
              </li>
            ))}
          </ul>
          <p className="font-mono text-xs font-bold uppercase tracking-[.1em]">Liens valables une heure : recharge la page si besoin.</p>
        </>
      )}
    </section>
  );
}
