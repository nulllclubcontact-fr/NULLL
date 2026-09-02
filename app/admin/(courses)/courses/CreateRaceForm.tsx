"use client";

import { useActionState } from "react";
import { createRace, type CourseState } from "../../courses-actions";

const initial: CourseState = {};

export function CreateRaceForm() {
  const [state, formAction, pending] = useActionState(createRace, initial);

  return (
    <details className="panel p-5">
      <summary className="cursor-pointer font-mono text-xs font-black uppercase tracking-[.14em]">
        Créer une sortie
      </summary>

      <form action={formAction} className="mt-5 grid gap-3.5">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Titre</span>
            <input className="field" name="title" placeholder="Sortie du samedi" required />
          </label>
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Départ</span>
            <input className="field" name="start_datetime" required type="datetime-local" />
          </label>
        </div>

        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Description</span>
          <textarea className="field min-h-20" name="description" rows={2} />
        </label>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Lieu de départ</span>
            <input className="field" name="location" placeholder="Parking Emile Zola" />
          </label>
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Adresse</span>
            <input className="field" name="address" />
          </label>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-3">
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Distance (km)</span>
            <input className="field" inputMode="decimal" name="distance_km" placeholder="5" />
          </label>
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Places max</span>
            <input className="field" inputMode="numeric" name="max_participants" placeholder="illimité" />
          </label>
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Statut</span>
            <select className="field" defaultValue="draft" name="status">
              <option value="draft">Brouillon</option>
              <option value="published">Publiée</option>
            </select>
          </label>
        </div>

        <label className="flex cursor-pointer items-center gap-3 border-2 border-[#351815] bg-[#fff8ef] p-4 text-sm font-bold">
          <input className="h-5 w-5 accent-[#d96ab4]" defaultChecked name="registration_open" type="checkbox" />
          <span>Inscriptions ouvertes</span>
        </label>

        {state.error ? (
          <p className="border-2 border-[#351815] bg-[#ffb000] px-4 py-3 font-mono text-sm font-black uppercase" role="alert">
            {state.error}
          </p>
        ) : null}
        {state.message ? (
          <p className="font-mono text-xs font-black uppercase tracking-[.12em] text-[#351815]/60" role="status">
            {state.message}
          </p>
        ) : null}

        <button className="primary-button" disabled={pending} type="submit">
          {pending ? "Création…" : "Créer"}
        </button>
      </form>
    </details>
  );
}
