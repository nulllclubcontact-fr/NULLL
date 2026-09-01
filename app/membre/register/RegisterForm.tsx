"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { registerMember, type RegisterState } from "../actions";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerMember, initialState);
  const [accepted, setAccepted] = useState(false);

  return (
    <form
      action={formAction}
      aria-label="Inscription membre"
      className="panel panel-grid account-stagger grid gap-3.5 p-5 sm:p-6 lg:p-5"
    >
      <div className="grid gap-3.5 sm:grid-cols-2" style={{ "--pas": 0 } as React.CSSProperties}>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Prénom</span>
          <input autoComplete="given-name" className="field" name="first_name" required />
        </label>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Nom</span>
          <input autoComplete="family-name" className="field" name="last_name" required />
        </label>
      </div>

      <label className="account-field grid gap-2 font-mono text-xs font-black uppercase" style={{ "--pas": 1 } as React.CSSProperties}>
        <span>E-mail</span>
        <input autoComplete="email" className="field" name="email" required type="email" />
      </label>

      <label className="account-field grid gap-2 font-mono text-xs font-black uppercase" style={{ "--pas": 2 } as React.CSSProperties}>
        <span>Mot de passe</span>
        <input autoComplete="new-password" className="field" minLength={6} name="password" required type="password" />
        <span className="font-mono text-[.62rem] font-bold normal-case tracking-normal text-[#351815]/55">
          Six caractères au minimum.
        </span>
      </label>

      <label
        className="flex cursor-pointer gap-3 border-2 border-[#351815] bg-[#fff8ef] p-4 text-sm font-bold leading-tight text-[#351815]/78 transition-colors duration-300 has-[:checked]:bg-[#d96ab4]/12"
        style={{ "--pas": 3 } as React.CSSProperties}
      >
        <input checked={accepted} className="mt-0.5 h-6 w-6 shrink-0 accent-[#d96ab4]" name="waiver" onChange={(event) => setAccepted(event.target.checked)} type="checkbox" />
        <span>
          J’ai lu et j’accepte la décharge de responsabilité : je participe aux activités de NULLL.CLUB sous ma propre
          responsabilité, je reconnais les risques liés à la course à pied et je renonce à tout recours, sauf faute de
          l’organisateur.{" "}
          <Link className="inline-flex min-h-11 items-center font-black text-[#351815] underline decoration-[#d96ab4] decoration-2 underline-offset-4" href="/membre/decharge">
            lire la décharge complète
          </Link>
        </span>
      </label>

      {state.error ? (
        <p className="border-2 border-[#351815] bg-[#ffb000] px-4 py-3 font-mono text-sm font-black uppercase text-[#351815]" role="alert">
          {state.error}
        </p>
      ) : null}

      {/* Le bouton restait gris sans rien dire. Il annonce maintenant ce
          qui le debloque, et reprend le mouvement des autres boutons du
          site des qu'il est actif. */}
      <div className="grid gap-2" style={{ "--pas": 4 } as React.CSSProperties}>
        <button
          className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#ffb000] enabled:hover:text-[#351815]"
          disabled={!accepted || pending}
          type="submit"
        >
          {pending ? "Création…" : "Créer mon compte"}
        </button>
        {!accepted && !pending ? (
          <span aria-live="polite" className="font-mono text-[.62rem] font-black uppercase tracking-[.14em] text-[#351815]/50">
            Coche la décharge pour continuer.
          </span>
        ) : null}
      </div>
    </form>
  );
}
