"use client";

import { useActionState } from "react";
import { loginAdmin, type AdminLoginState } from "../actions";

const initialState: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} aria-label="Connexion admin" className="panel panel-grid account-stagger grid gap-4 p-5 sm:p-6">
      <label className="account-field grid gap-2 font-mono text-xs font-black uppercase" style={{ "--pas": 0 } as React.CSSProperties}>
        <span>Code admin</span>
        <input autoComplete="one-time-code" className="field" name="code" required type="password" />
      </label>
      {state.error ? (
        <p className="border-2 border-[#351815] bg-[#ffb000] px-4 py-3 font-mono text-sm font-black uppercase text-[#351815]" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#ffb000] enabled:hover:text-[#351815]"
        disabled={pending}
        style={{ "--pas": 1 } as React.CSSProperties}
        type="submit"
      >
        {pending ? "Vérification…" : "Entrer admin"}
      </button>
    </form>
  );
}
