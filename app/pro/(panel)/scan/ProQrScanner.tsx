"use client";

import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";
import { useActionState, useCallback, useEffect, useRef, useState, useTransition } from "react";
import { decodeMemberQrToken } from "../../../../lib/qr/token";
import { creditPurchase, lookupMember, type LookupMemberResult } from "../../actions";

function formatDiscount(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);
}

export function ProQrScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [status, setStatus] = useState("Camera prete a demarrer.");
  const [rawToken, setRawToken] = useState("");
  const [member, setMember] = useState<LookupMemberResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const stopScanner = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
  }, []);

  const startScanner = useCallback(async () => {
    if (!videoRef.current) {
      return;
    }

    stopScanner();
    setMember(null);
    setRawToken("");
    setStatus("Camera ouverte. Montre le QR membre.");

    const reader = new BrowserQRCodeReader();

    try {
      controlsRef.current = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
        const text = result?.getText();

        if (!text) {
          return;
        }

        const token = decodeMemberQrToken(text);

        if (!token) {
          stopScanner();
          setStatus("QR invalide. Il doit commencer par NULLL:");
          return;
        }

        stopScanner();
        setRawToken(token);
        setStatus("QR lu. Verification membre...");
        startTransition(async () => {
          const lookup = await lookupMember(token);
          setMember(lookup);
          setStatus(lookup.ok ? "Membre trouve." : lookup.error);
        });
      });
    } catch {
      setStatus("Camera bloquee. Autorise l'acces ou passe en HTTPS si besoin.");
    }
  }, [stopScanner]);

  useEffect(() => {
    void startScanner();

    return () => stopScanner();
  }, [startScanner, stopScanner]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)]">
      <div className="panel panel-grid p-4">
        <video
          aria-label="Camera de scan QR"
          className="aspect-[3/4] w-full bg-black object-cover sm:aspect-video"
          muted
          playsInline
          ref={videoRef}
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button className="primary-button" onClick={() => void startScanner()} type="button">
            Nouveau scan
          </button>
          <p className="self-center font-mono text-xs uppercase tracking-[0.14em] text-white/60">{status}</p>
        </div>
      </div>

      <aside className="panel p-5">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-shock">Resultat scan</p>
        {isPending ? <p className="mt-5 text-white/72">Verification...</p> : null}
        {member?.ok ? (
          <div className="mt-5 grid gap-5">
            <div>
              <h2 className="font-display text-[clamp(3rem,8vw,6rem)] uppercase leading-none">{member.firstName}</h2>
              <p className="mt-3 font-mono text-sm font-black uppercase text-shock">
                {member.tierName} - {formatDiscount(member.discountPercent)}% de reduction a appliquer
              </p>
              <p className="mt-3 text-white/60">{member.currentMonthPoints} points ce mois-ci.</p>
            </div>
            <PurchaseForm key={rawToken} qrToken={rawToken} />
          </div>
        ) : null}
        {member && !member.ok ? (
          <p className="mt-5 border-2 border-shock bg-shock px-4 py-3 font-mono text-sm font-black uppercase text-black">
            {member.error}
          </p>
        ) : null}
        {!member && !isPending ? <p className="mt-5 text-white/72">Scanne un QR membre NULLL. Rien d'autre.</p> : null}
      </aside>
    </div>
  );
}

function PurchaseForm({ qrToken }: { qrToken: string }) {
  const [purchaseState, purchaseAction, purchasePending] = useActionState(creditPurchase, {});

  if (purchaseState.confirmation) {
    return (
      <div className="border-2 border-shock bg-shock p-4 text-black">
        <p className="font-mono text-xs font-black uppercase tracking-[0.16em]">Achat valide</p>
        <p className="mt-2 font-display text-[clamp(2.2rem,6vw,4rem)] uppercase leading-none">
          +{purchaseState.confirmation.pointsAwarded} points crédités à {purchaseState.confirmation.memberFirstName}
        </p>
        <p className="mt-3 font-mono text-sm font-black uppercase">
          Nouveau palier : {purchaseState.confirmation.tierName} ({formatDiscount(purchaseState.confirmation.discountPercent)}%)
        </p>
      </div>
    );
  }

  return (
    <form action={purchaseAction} className="grid gap-3 border-t-2 border-white pt-5">
      <input name="qr_token" readOnly type="hidden" value={qrToken} />
      <label className="grid gap-2 font-mono text-xs uppercase tracking-[0.16em]">
        Libellé de l'achat
        <input className="field" maxLength={80} name="label" placeholder="Menu + boisson" required />
      </label>
      <label className="grid gap-2 font-mono text-xs uppercase tracking-[0.16em]">
        Montant dépensé (€)
        <input className="field" min="0.01" max="1000" name="amount_eur" required step="0.01" type="number" />
      </label>
      {purchaseState.error ? (
        <p className="border-2 border-shock bg-shock px-4 py-3 font-mono text-sm font-black uppercase text-black">
          {purchaseState.error}
        </p>
      ) : null}
      <button className="primary-button" disabled={purchasePending} type="submit">
        {purchasePending ? "Validation..." : "Valider l'achat"}
      </button>
    </form>
  );
}
