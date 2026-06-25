"use client";

import { useActionState } from "react";
import { loginAdmin, type AdminLoginState } from "../actions";

const initialState: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="panel panel-grid grid max-w-xl gap-4 p-5" aria-label="Connexion admin">
      <label className="grid gap-2 font-mono text-xs uppercase tracking-[0.16em]">
        Code admin
        <input className="field" name="code" required type="password" />
      </label>
      {state.error ? (
        <p className="border-2 border-shock bg-shock px-4 py-3 font-mono text-sm font-black uppercase text-black" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "Verification..." : "Entrer admin"}
      </button>
    </form>
  );
}
