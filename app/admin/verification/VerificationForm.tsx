"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { codeTotpValide } from "../../../lib/admin/regles";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";
import { noterVerification } from "../securite-actions";

export function VerificationForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, startTransition] = useTransition();

  function verifier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);

    if (!codeTotpValide(code)) {
      setErreur("Six chiffres, comme dans l’application.");
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: facteurs } = await supabase.auth.mfa.listFactors();
        const totp = facteurs?.totp.find((f) => f.status === "verified") ?? facteurs?.totp[0];

        if (!totp) {
          setErreur("Aucun facteur trouvé sur ce compte. Reconnecte-toi.");
          return;
        }

        const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: totp.id, code: code.replace(/\s+/g, "") });

        if (error) {
          void noterVerification(false);
          setErreur("Code refusé. Vérifie l’heure de ton téléphone et réessaie.");
          return;
        }

        await noterVerification(true);
        router.replace("/admin/dashboard");
        router.refresh();
      } catch {
        setErreur("Vérification impossible pour le moment. Réessaie.");
      }
    });
  }

  return (
    <form className="grid gap-4" onSubmit={verifier}>
      <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
        <span>Code de l’application</span>
        <input
          autoComplete="one-time-code"
          autoFocus
          className="field"
          inputMode="numeric"
          maxLength={7}
          name="code"
          onChange={(e) => setCode(e.target.value)}
          pattern="[0-9 ]*"
          placeholder="123 456"
          required
          value={code}
        />
      </label>

      {erreur ? (
        <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-mono text-sm font-black uppercase" role="alert">
          {erreur}
        </p>
      ) : null}

      <button className="primary-button" disabled={enCours} type="submit">
        {enCours ? "Vérification…" : "Entrer dans l’administration"}
      </button>

      <p className="font-mono text-xs font-black uppercase leading-relaxed tracking-[.12em] opacity-70">
        Téléphone perdu ? Un autre admin peut retirer ta double vérification depuis « Équipe ».
      </p>
    </form>
  );
}
