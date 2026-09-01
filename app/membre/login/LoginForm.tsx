"use client";

import { useActionState } from "react";
import { loginMember, resetMemberPassword, type LoginState } from "../actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [loginState, loginAction, loginPending] = useActionState(loginMember, initialState);
  const [resetState, resetAction, resetPending] = useActionState(resetMemberPassword, initialState);

  return (
    <div className="panel panel-grid account-stagger p-5 sm:p-6">
      <form action={loginAction} aria-label="Connexion membre" className="grid gap-4" style={{ "--pas": 0 } as React.CSSProperties}>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>E-mail</span>
          <input autoComplete="email" className="field" name="email" required type="email" />
        </label>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Mot de passe</span>
          <input autoComplete="current-password" className="field" name="password" required type="password" />
        </label>
        {loginState.error ? (
          <p className="border-2 border-[#351815] bg-[#ffb000] px-4 py-3 font-mono text-sm font-black uppercase text-[#351815]" role="alert">
            {loginState.error}
          </p>
        ) : null}
        <button
          className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#ffb000] enabled:hover:text-[#351815]"
          disabled={loginPending}
          type="submit"
        >
          {loginPending ? "Connexion…" : "Entrer"}
        </button>
      </form>

      {/* « Mot de passe oublie » nommait la section, pas le champ : rien ne
          disait qu'il fallait y remettre son e-mail. Le bloc annonce
          maintenant ce qu'il fait, et le champ ce qu'il attend. */}
      <form action={resetAction} className="mt-5 grid gap-3 border-t-2 border-[#351815] pt-5" style={{ "--pas": 1 } as React.CSSProperties}>
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[.1em]">Mot de passe oublié ?</p>
          <p className="mt-1.5 text-sm font-bold leading-snug text-[#351815]/70">
            Donne ton e-mail, on t’envoie un lien pour en choisir un nouveau.
          </p>
        </div>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Ton e-mail</span>
          <input autoComplete="email" className="field" name="email" placeholder="prenom@exemple.fr" required type="email" />
        </label>
        {resetState.error ? <p className="text-sm font-bold text-[#351815]">{resetState.error}</p> : null}
        {resetState.message ? <p className="text-sm font-bold text-[#351815]/72">{resetState.message}</p> : null}
        <button className="secondary-link justify-center" disabled={resetPending} type="submit">
          Recevoir le lien
        </button>
      </form>
    </div>
  );
}
