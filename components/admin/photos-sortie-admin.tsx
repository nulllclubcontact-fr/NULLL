"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import {
  noterPhotosEnvoyees,
  preparerEnvoiPhotoSortie,
  prevenirInscritsPhotos,
  supprimerPhotoSortie,
  type PhotosSortieState
} from "../../app/admin/photos-sortie-actions";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";
import { BUCKET_PHOTOS_SORTIES, TYPES_PHOTO_SORTIE } from "../../lib/photos-sorties/regles";
import type { PhotoSortie } from "../../lib/photos-sorties/lister";

const BOUTON = "inline-flex min-h-11 items-center border-2 border-[#773331] px-3 font-mono text-xs font-black uppercase tracking-[.1em] transition";
const initial: PhotosSortieState = {};

/**
 * Photos de la sortie, pour les inscrits. Plusieurs fichiers d'un coup :
 * ils partent un par un du navigateur vers le bucket prive.
 */
export function PhotosSortieAdmin({ raceId, photos }: { raceId: string; photos: PhotoSortie[] | null }) {
  const router = useRouter();
  const [progression, setProgression] = useState<{ fait: number; total: number } | null>(null);
  const [erreurs, setErreurs] = useState<string[]>([]);
  const [etatSuppression, supprimer, suppressionEnCours] = useActionState(supprimerPhotoSortie, initial);
  const [etatMail, prevenir, mailEnCours] = useActionState(prevenirInscritsPhotos, initial);

  async function envoyer(fichiers: File[]) {
    setErreurs([]);
    setProgression({ fait: 0, total: fichiers.length });
    const client = createSupabaseBrowserClient();
    const echecs: string[] = [];
    let reussis = 0;

    for (const [index, fichier] of fichiers.entries()) {
      try {
        const preparation = await preparerEnvoiPhotoSortie(raceId, fichier.type, fichier.size);
        if (!preparation.ok) throw new Error(preparation.error);
        const { error } = await client.storage
          .from(BUCKET_PHOTOS_SORTIES)
          .uploadToSignedUrl(preparation.path, preparation.token, fichier, { contentType: fichier.type });
        if (error) throw new Error("envoi interrompu");
        reussis++;
      } catch (e) {
        echecs.push(`${fichier.name} : ${e instanceof Error ? e.message : "échec"}`);
      }
      setProgression({ fait: index + 1, total: fichiers.length });
    }

    if (reussis > 0) await noterPhotosEnvoyees(raceId, reussis);
    setErreurs(echecs);
    setProgression(null);
    router.refresh();
  }

  const enCours = progression !== null;

  return (
    <div className="grid gap-5 border-2 border-[#773331] bg-[#F1EDE9] p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className={`${BOUTON} cursor-pointer bg-[#EBA0CD] hover:bg-[#FFB200] ${enCours ? "pointer-events-none opacity-70" : ""}`}>
          {enCours ? `Envoi ${progression.fait}/${progression.total}…` : "Ajouter des photos"}
          <input
            accept={Object.keys(TYPES_PHOTO_SORTIE).join(",")}
            className="sr-only"
            disabled={enCours}
            multiple
            onChange={(e) => {
              const fichiers = Array.from(e.target.files ?? []);
              if (fichiers.length) void envoyer(fichiers);
              e.target.value = "";
            }}
            type="file"
          />
        </label>

        <form action={prevenir}>
          <input name="race_id" type="hidden" value={raceId} />
          <button className={`${BOUTON} bg-[#FFB200] hover:bg-[#F1EDE9] disabled:opacity-60`} disabled={mailEnCours || !photos?.length} type="submit">
            {mailEnCours ? "Envoi des mails…" : "Prévenir les inscrits par mail"}
          </button>
        </form>

        <span className="font-mono text-xs font-bold uppercase tracking-[.1em]">
          {photos === null ? "Photos illisibles pour le moment" : `${photos.length} photo${photos.length > 1 ? "s" : ""}`} · JPG, PNG, WebP, HEIC · 20 Mo max
        </span>
      </div>

      {[etatMail, etatSuppression].map((etat, i) =>
        etat.message || etat.error ? (
          <p className={`border-2 border-[#773331] px-3 py-2 font-mono text-xs font-black uppercase ${etat.error ? "bg-[#FFB200]" : "bg-[#F1EDE9]"}`} key={i} role={etat.error ? "alert" : "status"}>
            {etat.error ?? etat.message}
          </p>
        ) : null
      )}
      {erreurs.length > 0 ? (
        <ul className="border-2 border-[#773331] bg-[#FFB200] px-3 py-2 font-mono text-xs font-black uppercase" role="alert">
          {erreurs.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : null}

      {photos && photos.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {photos.map((photo) => (
            <li className="grid gap-2" key={photo.chemin}>
              <Image alt="" className="aspect-square w-full border-2 border-[#773331] object-cover" height={160} src={photo.url} unoptimized width={160} />
              <form action={supprimer}>
                <input name="race_id" type="hidden" value={raceId} />
                <input name="chemin" type="hidden" value={photo.chemin} />
                <button className={`${BOUTON} w-full justify-center border-transparent hover:border-[#773331]`} disabled={suppressionEnCours} type="submit">
                  Supprimer
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
