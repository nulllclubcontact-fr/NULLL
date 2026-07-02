"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { registerMember, type RegisterState } from "../actions";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerMember, initialState);
  const [accepted, setAccepted] = useState(false);

  return (
    <form action={formAction} className="panel panel-grid grid gap-4 p-5 sm:p-6" aria-label="Inscription membre">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 font-mono text-xs font-black uppercase">
          Prenom
          <input autoComplete="given-name" className="field" name="first_name" required />
        </label>
        <label className="grid gap-2 font-mono text-xs font-black uppercase">
          Nom
          <input autoComplete="family-name" className="field" name="last_name" required />
        </label>
      </div>
      <label className="grid gap-2 font-mono text-xs font-black uppercase">
        E-mail
        <input autoComplete="email" className="field" name="email" required type="email" />
      </label>
      <label className="grid gap-2 font-mono text-xs font-black uppercase">
        Mot de passe
        <input autoComplete="new-password" className="field" minLength={6} name="password" required type="password" />
      </label>
      <label className="flex gap-3 border-2 border-[#351815] bg-[#fff8ef] p-4 text-sm font-bold leading-tight text-[#351815]/78">
        <input checked={accepted} className="mt-1 h-5 w-5 accent-[#d96ab4]" name="waiver" onChange={(event) => setAccepted(event.target.checked)} type="checkbox" />
        <span>
          J’ai lu et j’accepte la décharge de responsabilité : je participe aux activités de NULLL.CLUB sous ma propre
          responsabilité, je reconnais les risques liés à la course à pied et je renonce à tout recours, sauf faute de
          l’organisateur.{" "}
          <Link className="font-black text-[#351815] underline decoration-[#d96ab4] decoration-2 underline-offset-4" href="/membre/decharge">
            lire la décharge complète
          </Link>
        </span>
      </label>
      {state.error ? (
        <p className="border-2 border-[#351815] bg-[#ffb000] px-4 py-3 font-mono text-sm font-black uppercase text-[#351815]" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="primary-button" disabled={!accepted || pending} type="submit">
        {pending ? "Creation..." : "Creer mon compte"}
      </button>
    </form>
  );
}
