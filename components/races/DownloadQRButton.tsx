"use client";

import { useCallback, useState } from "react";
import QRCode from "qrcode";
import { encodeMemberQrToken } from "../../lib/qr/token";

/**
 * Bouton pour télécharger le QR en PNG. Le QR est regenere en client
 * plutot que de passer une image du serveur : c'est plus simple et
 * plus rapide que faire une route API.
 */
export function DownloadQRButton({ token, nom }: { token: string; nom: string }) {
  const [etat, setEtat] = useState<"repos" | "cours" | "erreur">("repos");

  const telecharger = useCallback(async () => {
    setEtat("cours");

    try {
      const encoded = encodeMemberQrToken(token);
      const dataUrl = await QRCode.toDataURL(encoded, {
        errorCorrectionLevel: "M",
        type: "image/png",
        width: 400,
        margin: 1,
        color: { dark: "#141116", light: "#ffffff" }
      });

      const lien = document.createElement("a");
      lien.href = dataUrl;
      lien.download = `NULLL-QR-${nom || "inscription"}.png`;
      document.body.appendChild(lien);
      lien.click();
      document.body.removeChild(lien);
      setEtat("repos");
    } catch {
      // Le QR reste affiche a l'ecran : il suffit de le montrer, ou de reessayer.
      setEtat("erreur");
    }
  }, [token, nom]);

  return (
    <div className="grid gap-2">
      <button
        className="inline-flex min-h-11 items-center border-2 border-white/15 bg-[#1E1A21] px-3 py-2 font-mono text-xs font-black uppercase tracking-[.12em] text-white transition hover:bg-[#E8459E] hover:text-white focus-visible:bg-[#E8459E] focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC531] disabled:opacity-70"
        disabled={etat === "cours"}
        onClick={telecharger}
        type="button"
      >
        {etat === "cours" ? "Préparation…" : "↓ Télécharger le QR"}
      </button>
      {etat === "erreur" ? (
        <p className="font-mono text-xs font-black uppercase tracking-[.12em] text-[#FFC531]" role="alert">
          Le QR n’a pas pu être téléchargé. Réessaie.
        </p>
      ) : null}
    </div>
  );
}
