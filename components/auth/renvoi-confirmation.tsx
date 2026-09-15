"use client";

import { useActionState, useEffect, useState } from "react";
import { renvoyerConfirmation, type RenvoiState } from "../../app/membre/confirmation-actions";

const DELAI_SECONDES = 60;
const initial: RenvoiState = {};

/**
 * « Renvoyer l'e-mail de confirmation ». Adresse connue (juste apres
 * l'inscription) : un seul bouton. Sinon, le champ pour la saisir. Le
 * bouton reste bloque une minute apres chaque envoi, comme cote Supabase.
 */
export function RenvoiConfirmation({ email, sortie }: { email?: string; sortie?: string }) {
  const [etat, action, envoi] = useActionState(renvoyerConfirmation, initial);
  const [maintenant, setMaintenant] = useState(0);
  const restant = etat.envoyeA ? Math.max(0, DELAI_SECONDES - Math.floor((maintenant - etat.envoyeA) / 1000)) : 0;

  useEffect(() => {
    if (!etat.envoyeA) return;
    const minuterie = window.setInterval(() => setMaintenant(Date.now()), 1000);
    return () => window.clearInterval(minuterie);
  }, [etat.envoyeA]);

  const bloque = envoi || (etat.envoyeA !== undefined && (maintenant === 0 || restant > 0));

  return (
    <form action={action} className="grid gap-3">
      <input name="sortie" type="hidden" value={sortie ?? ""} />
      {email ? (
        <input name="email" type="hidden" value={email} />
      ) : (
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Ton e-mail</span>
          <input autoComplete="email" className="field" name="email" placeholder="prenom@exemple.fr" required type="email" />
        </label>
      )}

      <button className="secondary-link justify-center disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:transform-none disabled:hover:shadow-none" disabled={bloque} type="submit">
        {envoi ? "Envoi…" : restant > 0 ? `Renvoyer dans ${restant} s` : "Renvoyer l’e-mail"}
      </button>

      <p aria-live="polite" className="text-sm font-bold leading-snug" role="status">
        {etat.error ?? etat.message ?? ""}
      </p>
    </form>
  );
}
