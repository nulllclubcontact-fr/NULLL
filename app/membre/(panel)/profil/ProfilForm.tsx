"use client";

import { useActionState } from "react";
import { updateProfil, type ProfilState } from "../../profil-actions";

const initial: ProfilState = {};

type Valeurs = {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  birth_date: string | null;
  instagram_handle: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_notes: string | null;
};

export function ProfilForm({ valeurs, email }: { valeurs: Valeurs; email: string }) {
  const [state, formAction, pending] = useActionState(updateProfil, initial);

  return (
    <form action={formAction} className="panel panel-grid account-stagger grid gap-3.5 p-5 sm:p-6">
      <div className="grid gap-3.5 sm:grid-cols-2" style={{ "--pas": 0 } as React.CSSProperties}>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Prénom</span>
          <input className="field" defaultValue={valeurs.first_name ?? ""} name="first_name" required />
        </label>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Nom</span>
          <input className="field" defaultValue={valeurs.last_name ?? ""} name="last_name" required />
        </label>
      </div>

      <div className="grid gap-2 font-mono text-xs font-black uppercase" style={{ "--pas": 1 } as React.CSSProperties}>
        <span>E-mail</span>
        {/* L'adresse sert d'identifiant de connexion : elle se change
            depuis l'authentification, pas depuis ce formulaire. */}
        <p className="field flex items-center bg-[#351815]/5 font-mono text-sm font-bold normal-case text-[#351815]/60">{email}</p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2" style={{ "--pas": 2 } as React.CSSProperties}>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Téléphone</span>
          <input className="field" defaultValue={valeurs.phone ?? ""} name="phone" placeholder="06 12 34 56 78" type="tel" />
        </label>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Date de naissance</span>
          <input className="field" defaultValue={valeurs.birth_date ?? ""} name="birth_date" type="date" />
        </label>
      </div>

      <label className="account-field grid gap-2 font-mono text-xs font-black uppercase" style={{ "--pas": 3 } as React.CSSProperties}>
        <span>Instagram</span>
        <input className="field" defaultValue={valeurs.instagram_handle ?? ""} name="instagram_handle" placeholder="@ton.pseudo" />
      </label>

      <fieldset className="grid gap-3.5 border-2 border-[#351815] p-4" style={{ "--pas": 4 } as React.CSSProperties}>
        <legend className="px-2 font-mono text-[.62rem] font-black uppercase tracking-[.14em]">En cas de pépin</legend>
        <p className="text-sm font-bold leading-snug text-[#351815]/60">
          Facultatif, mais ça nous évite de chercher pendant qu’il faudrait agir.
        </p>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Personne à prévenir</span>
            <input className="field" defaultValue={valeurs.emergency_contact_name ?? ""} name="emergency_contact_name" />
          </label>
          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
            <span>Son téléphone</span>
            <input className="field" defaultValue={valeurs.emergency_contact_phone ?? ""} name="emergency_contact_phone" type="tel" />
          </label>
        </div>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>À savoir sur ta santé</span>
          <textarea className="field min-h-24" defaultValue={valeurs.medical_notes ?? ""} name="medical_notes" rows={3} />
        </label>
      </fieldset>

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

      <button
        className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#ffb000] enabled:hover:text-[#351815]"
        disabled={pending}
        style={{ "--pas": 5 } as React.CSSProperties}
        type="submit"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
