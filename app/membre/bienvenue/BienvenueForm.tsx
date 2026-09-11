"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { accepterDecharge, type CodeState } from "../actions";

const initialState: CodeState = {};

export function BienvenueForm({ prenom, nom, sortie }: { prenom: string; nom: string; sortie?: string }) {
  const [state, formAction, pending] = useActionState(accepterDecharge, initialState);
  const [accepted, setAccepted] = useState(false);

  return (
    <form action={formAction} aria-label="Finaliser mon compte" className="panel panel-grid account-stagger grid gap-3.5 p-5 sm:p-6 lg:p-5">
      <input name="sortie" type="hidden" value={sortie ?? ""} />
      <div className="grid gap-3.5 sm:grid-cols-2" style={{ "--pas": 0 } as React.CSSProperties}>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Prénom</span>
          <input autoComplete="given-name" className="field" defaultValue={prenom} name="first_name" required />
        </label>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Nom</span>
          <input autoComplete="family-name" className="field" defaultValue={nom} name="last_name" required />
        </label>
      </div>

      <label
        className="flex cursor-pointer gap-3 border-2 border-[#773331] bg-[#F1EDE9] p-4 text-sm font-bold leading-tight text-[#773331] transition-colors duration-300 has-[:checked]:bg-[#EBA0CD]/12"
        style={{ "--pas": 1 } as React.CSSProperties}
      >
        <input checked={accepted} className="mt-0.5 h-6 w-6 shrink-0 accent-[#EBA0CD]" name="waiver" onChange={(event) => setAccepted(event.target.checked)} type="checkbox" />
        <span>
          J’ai lu et j’accepte la décharge de responsabilité : je participe aux activités de NULLL.CLUB sous ma propre
          responsabilité, je reconnais les risques liés à la course à pied et je renonce à tout recours, sauf faute de
          l’organisateur.{" "}
          <Link className="inline-flex min-h-11 items-center font-black text-[#773331] underline decoration-[#EBA0CD] decoration-2 underline-offset-4" href="/membre/decharge">
            lire la décharge complète
          </Link>
        </span>
      </label>

      {state.error ? (
        <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-mono text-sm font-black uppercase text-[#773331]" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#FFB200] enabled:hover:text-[#773331]"
        disabled={!accepted || pending}
        style={{ "--pas": 2 } as React.CSSProperties}
        type="submit"
      >
        {pending ? "Enregistrement…" : "Entrer dans le club"}
      </button>
    </form>
  );
}
