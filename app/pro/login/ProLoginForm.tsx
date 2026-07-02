"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginPro, type ProLoginState } from "../actions";

const initialState: ProLoginState = {};

export function ProLoginForm() {
  const [state, formAction, pending] = useActionState(loginPro, initialState);

  return (
    <form action={formAction} className="panel panel-grid grid gap-4 p-5 sm:p-6" aria-label="Connexion pro">
      <label className="grid gap-2 font-mono text-xs font-black uppercase">
        Code d’accès
        <input autoComplete="one-time-code" className="field" name="code" required />
      </label>
      {state.error ? (
        <p className="border-2 border-[#351815] bg-[#ffb000] px-4 py-3 font-mono text-sm font-black uppercase text-[#351815]" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "Verification..." : "Entrer pro"}
      </button>
      <Link className="secondary-link" href="/identification">
        Retour site
      </Link>
    </form>
  );
}
