"use client";

import { useCallback } from "react";
import QRCode from "qrcode";
import { encodeMemberQrToken } from "../../lib/qr/token";

/**
 * Bouton pour télécharger le QR en PNG. Le QR est regenere en client
 * plutot que de passer une image du serveur : c'est plus simple et
 * plus rapide que faire une route API.
 */
export function DownloadQRButton({ token, nom }: { token: string; nom: string }) {
  const telecharger = useCallback(async () => {
    try {
      const encoded = encodeMemberQrToken(token);
      const dataUrl = await QRCode.toDataURL(encoded, {
        errorCorrectionLevel: "M",
        type: "image/png",
        width: 400,
        margin: 1,
        color: { dark: "#773331", light: "#ffffff" }
      });

      const lien = document.createElement("a");
      lien.href = dataUrl;
      lien.download = `NULLL-QR-${nom || "inscription"}.png`;
      document.body.appendChild(lien);
      lien.click();
      document.body.removeChild(lien);
    } catch (err) {
      console.error("erreur lors de la generation du QR :", err);
    }
  }, [token, nom]);

  return (
    <button
      className="inline-flex min-h-11 items-center border-2 border-[#773331] bg-[#773331] px-3 py-2 font-mono text-[.62rem] font-black uppercase tracking-[.12em] text-[#F1EDE9] transition hover:bg-[#EBA0CD] hover:text-[#773331] focus-visible:bg-[#EBA0CD] focus-visible:text-[#773331] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D3ED66]"
      onClick={telecharger}
      type="button"
    >
      ↓ Telecharger QR
    </button>
  );
}
