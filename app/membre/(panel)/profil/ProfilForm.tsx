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
  consent_image: boolean | null;
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
        <p className="field flex items-center bg-[#773331]/5 font-mono text-sm font-bold normal-case text-[#773331]">{email}</p>
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

      <fieldset className="grid gap-3.5 border-2 border-[#773331] p-4" style={{ "--pas": 4 } as React.CSSProperties}>
        <legend className="px-2 font-mono text-xs font-black uppercase tracking-[.14em]">En cas de pépin</legend>
        <p className="text-sm font-bold leading-snug text-[#773331]">
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
      </fieldset>

      {/* Oui / Non plutot qu'une case : un membre inscrit avant cette
          question n'a rien repondu, et enregistrer son telephone ne doit
          pas valoir refus. Sans choix, rien n'est ecrit. */}
      <fieldset className="grid gap-3 border-2 border-[#773331] p-4" id="photos" style={{ "--pas": 5 } as React.CSSProperties}>
        <legend className="px-2 font-mono text-xs font-black uppercase tracking-[.14em]">Photos et vidéos</legend>
        <p className="text-sm font-bold leading-snug text-[#773331]">
          On prend des photos et des vidéos pendant les sorties. Est-ce que tu acceptes d’y apparaître, et que NULLL.CLUB
          les publie sur son site et ses réseaux ? Tu peux changer d’avis quand tu veux.
          {valeurs.consent_image === null ? " Tu n’as pas encore répondu." : ""}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 border-2 border-[#773331] px-4 py-3 text-sm font-bold has-[:checked]:bg-[#EBA0CD]/12">
            <input className="h-5 w-5 shrink-0 accent-[#EBA0CD]" defaultChecked={valeurs.consent_image === true} name="image" type="radio" value="oui" />
            Oui, j’accepte
          </label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 border-2 border-[#773331] px-4 py-3 text-sm font-bold has-[:checked]:bg-[#EBA0CD]/12">
            <input className="h-5 w-5 shrink-0 accent-[#EBA0CD]" defaultChecked={valeurs.consent_image === false} name="image" type="radio" value="non" />
            Non, je préfère pas
          </label>
        </div>
      </fieldset>

      {state.error ? (
        <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-mono text-sm font-black uppercase" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p className="font-mono text-xs font-black uppercase tracking-[.12em] text-[#773331]" role="status">
          {state.message}
        </p>
      ) : null}

      <button
        className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#FFB200] enabled:hover:text-[#773331]"
        disabled={pending}
        style={{ "--pas": 6 } as React.CSSProperties}
        type="submit"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
