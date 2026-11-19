"use client";

import { useActionState } from "react";
import { registerForRace, cancelRegistration, type InscriptionState } from "../../app/membre/races-actions";

const initial: InscriptionState = {};

/** S'inscrire a une sortie. Le bouton porte son propre etat d'envoi. */
export function RegisterButton({ raceId, disabled, disabledLabel }: { raceId: string; disabled?: boolean; disabledLabel?: string }) {
  const [state, formAction, pending] = useActionState(registerForRace, initial);

  if (disabled) {
    return (
      <p className="inline-flex min-h-12 items-center border-2 border-dashed border-white/35 px-4 font-mono text-xs font-black uppercase tracking-[.12em] text-white">
        {disabledLabel ?? "Inscriptions fermées"}
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-2">
      <input name="race_id" type="hidden" value={raceId} />
      <button
        className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#FFC531] enabled:hover:text-[#141116]"
        disabled={pending}
        type="submit"
      >
        {pending ? "Inscription…" : "Je viens"}
      </button>
      {state.error ? (
        <p className="font-mono text-xs font-black uppercase tracking-[.12em] text-white" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p className="font-mono text-xs font-black uppercase tracking-[.12em] text-white" role="status">
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
        className="inline-flex min-h-11 w-fit items-center font-mono text-xs font-black uppercase tracking-[.12em] text-white/80 underline decoration-white/30 decoration-2 underline-offset-4 transition hover:text-white hover:decoration-[#E8459E] focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]"
        disabled={pending}
        type="submit"
      >
        {pending ? "Annulation…" : "Je ne pourrai pas venir"}
      </button>
      {state.error ? (
        <p className="font-mono text-xs font-black uppercase tracking-[.12em] text-[#FFC531]" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
