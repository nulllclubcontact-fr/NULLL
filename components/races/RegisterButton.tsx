"use client";

import { useActionState } from "react";
import { registerForRace, cancelRegistration, type InscriptionState } from "../../app/membre/races-actions";

const initial: InscriptionState = {};

/** S'inscrire a une sortie. Le bouton porte son propre etat d'envoi. */
export function RegisterButton({ raceId, disabled, disabledLabel }: { raceId: string; disabled?: boolean; disabledLabel?: string }) {
  const [state, formAction, pending] = useActionState(registerForRace, initial);

  if (disabled) {
    return (
      <p className="inline-flex min-h-12 items-center border-2 border-dashed border-[#351815]/35 px-4 font-mono text-xs font-black uppercase tracking-[.12em] text-[#351815]/50">
        {disabledLabel ?? "Inscriptions fermées"}
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-2">
      <input name="race_id" type="hidden" value={raceId} />
      <button
        className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#ffb000] enabled:hover:text-[#351815]"
        disabled={pending}
        type="submit"
      >
        {pending ? "Inscription…" : "Je viens"}
      </button>
      {state.error ? (
        <p className="font-mono text-[.62rem] font-black uppercase tracking-[.12em] text-[#351815]" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p className="font-mono text-[.62rem] font-black uppercase tracking-[.12em] text-[#351815]/60" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

/** Se desinscrire. Discret : c'est une sortie de secours, pas un appel a l'action. */
export function CancelButton({ registrationId }: { registrationId: string }) {
  const [state, formAction, pending] = useActionState(cancelRegistration, initial);

  return (
    <form action={formAction} className="grid gap-2">
      <input name="registration_id" type="hidden" value={registrationId} />
      <button
        className="inline-flex min-h-11 w-fit items-center font-mono text-[.62rem] font-black uppercase tracking-[.12em] text-[#351815]/45 underline decoration-[#351815]/25 decoration-2 underline-offset-4 transition hover:text-[#351815] hover:decoration-[#d96ab4]"
        disabled={pending}
        type="submit"
      >
        {pending ? "Annulation…" : "Je ne pourrai pas venir"}
      </button>
      {state.error ? (
        <p className="font-mono text-[.62rem] font-black uppercase tracking-[.12em] text-[#351815]" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
