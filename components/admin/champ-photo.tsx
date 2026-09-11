"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { changerPhotoCourse, preparerEnvoiPhoto, type CourseState } from "../../app/admin/courses-actions";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

const BOUTON =
  "inline-flex min-h-11 items-center border-2 border-[#773331] px-3 font-mono text-xs font-black uppercase tracking-[.1em] transition";

/**
 * Choix d'une photo de sortie. Le fichier part tout de suite vers Supabase ;
 * le formulaire ne transporte ensuite que son adresse, dans un champ cache.
 */
export function ChampPhoto({ initiale = null, onEnvoi }: { initiale?: string | null; onEnvoi?: (enCours: boolean) => void }) {
  const [url, setUrl] = useState<string | null>(initiale);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  async function envoyer(fichier: File) {
    setEnCours(true);
    setErreur("");
    onEnvoi?.(true);

    try {
      const preparation = await preparerEnvoiPhoto(fichier.type, fichier.size);
      if (!preparation.ok) throw new Error(preparation.error);

      const { error } = await createSupabaseBrowserClient()
        .storage.from("sorties")
        .uploadToSignedUrl(preparation.path, preparation.token, fichier, { contentType: fichier.type });
      if (error) throw new Error("Envoi interrompu. Réessaie.");

      setUrl(preparation.url);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setEnCours(false);
      onEnvoi?.(false);
    }
  }

  return (
    <div className="grid gap-2 font-mono text-xs font-black uppercase">
      <span>Photo de la sortie</span>
      <input name="cover_image_url" readOnly type="hidden" value={url ?? ""} />

      <div className="flex flex-wrap items-center gap-4 border-2 border-[#773331] bg-[#F1EDE9] p-3">
        {url ? (
          <Image alt="Aperçu de la photo" className="h-20 w-32 border-2 border-[#773331] object-cover" height={80} src={url} unoptimized width={128} />
        ) : (
          <span className="grid h-20 w-32 place-items-center border-2 border-dashed border-[#773331] text-xs tracking-[.12em]">Pas de photo</span>
        )}

        <label className={`${BOUTON} cursor-pointer bg-[#EBA0CD] hover:bg-[#FFB200] ${enCours ? "pointer-events-none opacity-70" : ""}`}>
          {enCours ? "Envoi…" : url ? "Changer" : "Choisir une photo"}
          <input
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            disabled={enCours}
            onChange={(e) => {
              const fichier = e.target.files?.[0];
              if (fichier) void envoyer(fichier);
              e.target.value = "";
            }}
            type="file"
          />
        </label>

        {url && !enCours ? (
          <button className={`${BOUTON} border-transparent hover:border-[#773331]`} onClick={() => setUrl(null)} type="button">
            Retirer
          </button>
        ) : null}
      </div>

      <span className="text-xs font-bold tracking-[.1em]">JPG, PNG, WebP ou AVIF · 10 Mo max · format paysage conseillé</span>
      {erreur ? (
        <p className="border-2 border-[#773331] bg-[#FFB200] px-3 py-2" role="alert">
          {erreur}
        </p>
      ) : null}
    </div>
  );
}

const initial: CourseState = {};

/** Photo d'une sortie existante, depuis sa fiche. */
export function FormulairePhotoCourse({ raceId, initiale }: { raceId: string; initiale: string | null }) {
  const [state, formAction, pending] = useActionState(changerPhotoCourse, initial);
  const [envoi, setEnvoi] = useState(false);

  return (
    <form action={formAction} className="grid max-w-2xl gap-3">
      <input name="race_id" type="hidden" value={raceId} />
      <ChampPhoto initiale={initiale} onEnvoi={setEnvoi} />
      <div className="flex flex-wrap items-center gap-4">
        <button className="primary-button" disabled={pending || envoi} type="submit">
          {pending ? "Enregistrement…" : "Enregistrer la photo"}
        </button>
        {state.message ? (
          <p className="font-mono text-xs font-black uppercase tracking-[.12em]" role="status">
            {state.message}
          </p>
        ) : null}
        {state.error ? (
          <p className="border-2 border-[#773331] bg-[#FFB200] px-3 py-2 font-mono text-xs font-black uppercase" role="alert">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
