"use client";

import { useState } from "react";
import { creerZip } from "../../lib/zip";

/**
 * « Tout telecharger » : les photos sont recuperees une a une puis
 * rangees dans un zip, directement dans le navigateur.
 */
export function TelechargerToutesPhotos({ photos, nomArchive }: { photos: Array<{ url: string; nom: string }>; nomArchive: string }) {
  const [etat, setEtat] = useState<{ fait: number } | null>(null);
  const [erreur, setErreur] = useState("");

  async function telecharger() {
    setErreur("");
    setEtat({ fait: 0 });
    try {
      const fichiers = [];
      for (const [index, photo] of photos.entries()) {
        const reponse = await fetch(photo.url);
        if (!reponse.ok) throw new Error("lien expiré");
        fichiers.push({ nom: photo.nom, donnees: new Uint8Array(await reponse.arrayBuffer()) });
        setEtat({ fait: index + 1 });
      }
      const zip = creerZip(fichiers);
      const lien = URL.createObjectURL(new Blob([zip.buffer as ArrayBuffer], { type: "application/zip" }));
      const a = document.createElement("a");
      a.href = lien;
      a.download = nomArchive;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(lien), 10_000);
    } catch {
      setErreur("Téléchargement interrompu. Recharge la page et réessaie.");
    } finally {
      setEtat(null);
    }
  }

  return (
    <div className="grid gap-3 sm:justify-items-start">
      <button className="primary-button justify-center" disabled={etat !== null} onClick={telecharger} type="button">
        {etat ? `Préparation ${etat.fait}/${photos.length}…` : `Tout télécharger (${photos.length} photo${photos.length > 1 ? "s" : ""})`}
      </button>
      {erreur ? (
        <p className="border-2 border-[#773331] bg-[#FFB200] px-3 py-2 font-mono text-xs font-black uppercase" role="alert">
          {erreur}
        </p>
      ) : null}
    </div>
  );
}
