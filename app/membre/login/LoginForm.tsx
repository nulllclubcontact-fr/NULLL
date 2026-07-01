"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginMember, resetMemberPassword, type LoginState } from "../actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [loginState, loginAction, loginPending] = useActionState(loginMember, initialState);
  const [resetState, resetAction, resetPending] = useActionState(resetMemberPassword, initialState);

  return (
    <div className="panel panel-grid p-5 sm:p-6">
      <form action={loginAction} className="grid gap-4" aria-label="Connexion membre">
        <label className="grid gap-2 font-mono text-xs font-black uppercase">
          E-mail
          <input autoComplete="email" className="field" name="email" required type="email" />
        </label>
        <label className="grid gap-2 font-mono text-xs font-black uppercase">
          Mot de passe
          <input autoComplete="current-password" className="field" name="password" required type="password" />
        </label>
        {loginState.error ? (
          <p className="border-2 border-[#351815] bg-[#ffb000] px-4 py-3 font-mono text-sm font-black uppercase text-[#351815]" role="alert">
            {loginState.error}
          </p>
        ) : null}
        <button className="primary-button" disabled={loginPending} type="submit">
          {loginPending ? "Connexion..." : "Entrer"}
        </button>
      </form>

      <form action={resetAction} className="mt-5 grid gap-3 border-t-2 border-[#351815] pt-5">
        <label className="grid gap-2 font-mono text-xs font-black uppercase">
          Mot de passe oublie
          <input autoComplete="email" className="field" name="email" required type="email" />
        </label>
        {resetState.error ? <p className="text-sm font-bold text-[#351815]">{resetState.error}</p> : null}
        {resetState.message ? <p className="text-sm font-bold text-[#351815]/72">{resetState.message}</p> : null}
        <button className="secondary-link justify-center" disabled={resetPending} type="submit">
          Recevoir le lien
        </button>
      </form>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link className="primary-link" href="/membre/register">
          Creer un compte
        </Link>
        <Link className="secondary-link" href="/identification">
          Retour site
        </Link>
      </div>
    </div>
  );
}
