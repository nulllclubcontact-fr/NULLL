"use client";

import { useActionState } from "react";
import { modifierCourse, type CourseState } from "../../../courses-actions";
import type { Race } from "../../../../../lib/races/types";

const initial: CourseState = {};

/**
 * Corriger une sortie sans la supprimer : une faute de frappe dans le titre
 * ou une heure a decaler ne doit pas couter les inscriptions deja prises.
 */
export function EditRaceForm({ course, departLocal }: { course: Race; departLocal: string }) {
  const [state, formAction, pending] = useActionState(modifierCourse, initial);

  return (
    <details className="panel p-5">
      <summary className="cursor-pointer font-mono text-xs font-black uppercase tracking-[.14em]">Modifier la sortie</summary>

      <form action={formAction} className="mt-5 grid gap-3.5">
        <input name="race_id" type="hidden" value={course.id} />

        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Titre</span>
            <input className="field" defaultValue={course.title} maxLength={120} name="title" required />
          </label>
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Départ (heure de Paris)</span>
            <input className="field" defaultValue={departLocal} name="start_datetime" required type="datetime-local" />
          </label>
        </div>

        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Description</span>
          <textarea className="field min-h-20" defaultValue={course.description ?? ""} maxLength={2000} name="description" rows={2} />
        </label>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Lieu de départ</span>
            <input className="field" defaultValue={course.location ?? ""} maxLength={160} name="location" />
          </label>
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Adresse</span>
            <input className="field" defaultValue={course.address ?? ""} maxLength={240} name="address" />
          </label>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-3">
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Distance (km)</span>
            <input className="field" defaultValue={course.distance_km ?? ""} inputMode="decimal" name="distance_km" />
          </label>
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Places max</span>
            <input className="field" defaultValue={course.max_participants ?? ""} inputMode="numeric" name="max_participants" placeholder="illimité" />
          </label>
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Statut</span>
            <select className="field" defaultValue={course.status} name="status">
              <option value="draft">Brouillon</option>
              <option value="published">Publiée</option>
              <option value="closed">Fermée</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </label>
        </div>

        <label className="flex cursor-pointer items-center gap-3 border-2 border-[#773331] bg-[#F1EDE9] p-4 text-sm font-bold">
          <input className="h-5 w-5 accent-[#EBA0CD]" defaultChecked={course.registration_open} name="registration_open" type="checkbox" />
          <span>Inscriptions ouvertes</span>
        </label>

        {state.error ? (
          <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-mono text-sm font-black uppercase" role="alert">
            {state.error}
          </p>
        ) : null}
        {state.message ? (
          <p className="font-mono text-xs font-black uppercase tracking-[.12em]" role="status">
            {state.message}
          </p>
        ) : null}

        <button className="primary-button" disabled={pending} type="submit">
          {pending ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </form>
    </details>
  );
}
