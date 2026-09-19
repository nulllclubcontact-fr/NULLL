"use client";

import { useActionState, useState } from "react";
import { supprimerCompte, type SuppressionState } from "../../suppression-actions";

const initial: SuppressionState = {};

/**
 * Replie par defaut : un bouton aussi definitif ne doit pas se trouver
 * sous le doigt par accident. Il faut ouvrir, lire, puis ecrire SUPPRIMER.
 */
export function SuppressionCompte() {
  const [state, formAction, pending] = useActionState(supprimerCompte, initial);
  const [saisie, setSaisie] = useState("");
  const confirme = saisie.trim().toUpperCase() === "SUPPRIMER";

  return (
    <details className="border-2 border-[#773331] p-5 sm:p-6">
      <summary className="flex min-h-11 cursor-pointer items-center font-mono text-xs font-black uppercase tracking-[.14em]">
        Supprimer mon compte
      </summary>

      <form action={formAction} className="mt-4 grid gap-4">
        <p className="text-sm font-bold leading-snug">
          Tout est effacé tout de suite et pour de bon : ton profil, tes inscriptions aux sorties, tes présences, ton
          acceptation de la décharge et ton accord photo. On ne garde rien, et on ne pourra rien récupérer.
        </p>
        <p className="text-sm leading-snug">
          Les photos déjà publiées où tu apparais ne sont pas liées à ton compte : pour les faire retirer, écris-nous.
        </p>

        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Écris SUPPRIMER pour confirmer</span>
          <input
            autoCapitalize="characters"
            autoComplete="off"
            className="field"
            name="confirmation"
            onChange={(event) => setSaisie(event.target.value)}
            value={saisie}
          />
        </label>

        {state.error ? (
          <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-mono text-sm font-black uppercase" role="alert">
            {state.error}
          </p>
        ) : null}

        <button
          className="inline-flex min-h-14 items-center justify-center border-2 border-[#773331] bg-[#773331] px-6 font-mono text-xs font-black uppercase tracking-[.12em] text-[#F1EDE9] transition enabled:hover:bg-[#EBA0CD] enabled:hover:text-[#773331] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!confirme || pending}
          type="submit"
        >
          {pending ? "Suppression…" : "Supprimer définitivement mon compte"}
        </button>
      </form>
    </details>
  );
}
