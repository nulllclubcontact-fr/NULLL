"use client";

import { useActionState } from "react";
import type { CodeState } from "../../app/membre/actions";
import { masquerTelephone } from "../../lib/auth/telephone";

type ActionCode = (etat: CodeState, formData: FormData) => Promise<CodeState>;

/**
 * Saisie du code recu par SMS. Sert a l'inscription par telephone comme au
 * mot de passe oublie : seules les deux actions changent.
 */
export function CodeSms({
  telephone,
  verifier,
  renvoyer,
  texteBouton,
  retour
}: {
  telephone: string;
  verifier: ActionCode;
  renvoyer: ActionCode;
  texteBouton: string;
  retour?: { href: string; label: string };
}) {
  const [etat, verifierAction, verification] = useActionState(verifier, { etape: "code", telephone });
  const [renvoi, renvoyerAction, renvoiEnCours] = useActionState(renvoyer, { etape: "code", telephone });

  return (
    <div className="grid gap-4">
      <div>
        <p className="font-mono text-xs font-black uppercase tracking-[.14em]">Code envoyé par SMS</p>
        <p className="mt-2 text-sm font-bold leading-snug">
          On vient d’envoyer un code à 6 chiffres au {masquerTelephone(telephone)}. Il expire dans quelques minutes.
        </p>
      </div>

      <form action={verifierAction} className="grid gap-3">
        <input name="telephone" type="hidden" value={telephone} />
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Code reçu</span>
          <input
            autoComplete="one-time-code"
            className="field text-center font-mono text-2xl tracking-[.4em]"
            inputMode="numeric"
            maxLength={6}
            minLength={6}
            name="code"
            pattern="[0-9]{6}"
            required
          />
        </label>
        {etat.error ? (
          <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-mono text-sm font-black uppercase text-[#773331]" role="alert">
            {etat.error}
          </p>
        ) : null}
        <button className="primary-button" disabled={verification} type="submit">
          {verification ? "Vérification…" : texteBouton}
        </button>
      </form>

      <form action={renvoyerAction} className="flex flex-wrap items-center gap-4">
        <input name="telephone" type="hidden" value={telephone} />
        <button className="secondary-link" disabled={renvoiEnCours} type="submit">
          {renvoiEnCours ? "Envoi…" : "Renvoyer le code"}
        </button>
        {retour ? (
          // Un vrai rechargement : l'etat du formulaire precedent repart de zero.
          <a className="font-mono text-xs font-black uppercase underline decoration-[#EBA0CD] decoration-2 underline-offset-4" href={retour.href}>
            {retour.label}
          </a>
        ) : null}
      </form>
      {renvoi.error || renvoi.message ? (
        <p className="text-sm font-bold" role="status">
          {renvoi.error ?? renvoi.message}
        </p>
      ) : null}
    </div>
  );
}
