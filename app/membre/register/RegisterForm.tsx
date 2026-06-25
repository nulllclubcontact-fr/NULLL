"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { registerMember, type RegisterState } from "../actions";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerMember, initialState);
  const [accepted, setAccepted] = useState(false);

  return (
    <form action={formAction} className="panel panel-grid grid max-w-2xl gap-4 p-5" aria-label="Inscription membre">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 font-mono text-xs uppercase tracking-[0.16em]">
          Prenom
          <input className="field" name="first_name" required />
        </label>
        <label className="grid gap-2 font-mono text-xs uppercase tracking-[0.16em]">
          Nom
          <input className="field" name="last_name" required />
        </label>
      </div>
      <label className="grid gap-2 font-mono text-xs uppercase tracking-[0.16em]">
        E-mail
        <input className="field" name="email" required type="email" />
      </label>
      <label className="grid gap-2 font-mono text-xs uppercase tracking-[0.16em]">
        Mot de passe
        <input className="field" minLength={6} name="password" required type="password" />
      </label>
      <label className="flex gap-3 border-2 border-white/70 p-4 text-sm text-white/78">
        <input checked={accepted} name="waiver" onChange={(event) => setAccepted(event.target.checked)} type="checkbox" />
        <span>
          J'ai lu et j'accepte la décharge de responsabilité : je participe aux activités de NULLL.CLUB sous ma propre
          responsabilité, je reconnais les risques liés à la course à pied et je renonce à tout recours, sauf faute de
          l'organisateur.{" "}
          <Link className="text-shock underline" href="/membre/decharge">
            lire la décharge complète
          </Link>
        </span>
      </label>
      {state.error ? (
        <p className="border-2 border-shock bg-shock px-4 py-3 font-mono text-sm font-black uppercase text-black" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="primary-button" disabled={!accepted || pending} type="submit">
        {pending ? "Creation..." : "Creer mon compte"}
      </button>
    </form>
  );
}
