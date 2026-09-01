"use client";

import { useActionState } from "react";
import { updateMemberPassword, type LoginState } from "../actions";

const initialState: LoginState = {};

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(updateMemberPassword, initialState);

  return (
    <form action={formAction} aria-label="Nouveau mot de passe" className="panel panel-grid account-stagger grid gap-3.5 p-5 sm:p-6">
      <label className="account-field grid gap-2 font-mono text-xs font-black uppercase" style={{ "--pas": 0 } as React.CSSProperties}>
        <span>Nouveau mot de passe</span>
        <input autoComplete="new-password" className="field" minLength={6} name="password" required type="password" />
        <span className="font-mono text-[.62rem] font-bold normal-case tracking-normal text-[#351815]/55">Six caractères au minimum.</span>
      </label>

      <label className="account-field grid gap-2 font-mono text-xs font-black uppercase" style={{ "--pas": 1 } as React.CSSProperties}>
        <span>Confirme-le</span>
        <input autoComplete="new-password" className="field" minLength={6} name="password_confirmation" required type="password" />
      </label>

      {state.error ? (
        <p className="border-2 border-[#351815] bg-[#ffb000] px-4 py-3 font-mono text-sm font-black uppercase text-[#351815]" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#ffb000] enabled:hover:text-[#351815]"
        disabled={pending}
        style={{ "--pas": 2 } as React.CSSProperties}
        type="submit"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
