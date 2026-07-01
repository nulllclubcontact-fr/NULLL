"use client";

import { useActionState } from "react";
import { loginAdmin, type AdminLoginState } from "../actions";

const initialState: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="panel panel-grid grid gap-4 p-5 sm:p-6" aria-label="Connexion admin">
      <label className="grid gap-2 font-mono text-xs font-black uppercase">
        Code admin
        <input autoComplete="one-time-code" className="field" name="code" required type="password" />
      </label>
      {state.error ? (
        <p className="border-2 border-[#351815] bg-[#ffb000] px-4 py-3 font-mono text-sm font-black uppercase text-[#351815]" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "Verification..." : "Entrer admin"}
      </button>
    </form>
  );
}
