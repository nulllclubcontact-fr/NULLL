"use client";

import { useActionState } from "react";
import { completerProfil, passerInvitation, type InvitationState } from "../../app/membre/invitation-actions";

const initial: InvitationState = {};

/**
 * Fenetre de premiere connexion : les infos du profil, avec la raison de
 * chacune. Tout est facultatif et elle ne se montre qu'une fois.
 */
export function InvitationProfil({ prenom }: { prenom: string | null }) {
  const [etat, enregistrer, enCours] = useActionState(completerProfil, initial);
  const [etatPasse, passer, passeEnCours] = useActionState(passerInvitation, initial);

  if (etat.fini || etatPasse.fini) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-[#3A1A18]/80 p-4" role="presentation">
      <div
        aria-describedby="invitation-profil-texte"
        aria-labelledby="invitation-profil-titre"
        aria-modal="true"
        className="w-full max-w-xl border-2 border-[#773331] bg-[#F1EDE9] text-[#773331] shadow-[10px_10px_0_#FFB200]"
        role="dialog"
      >
        <div className="border-b-2 border-[#773331] bg-[#FFB200] px-5 py-4 sm:px-7">
          <p className="font-mono text-xs font-black uppercase tracking-[.16em]">Bienvenue{prenom ? `, ${prenom}` : ""}</p>
          <h2 className="mt-2 font-display text-[clamp(1.9rem,6vw,2.6rem)] uppercase leading-[1.05]" id="invitation-profil-titre">
            Deux minutes pour ton profil.
          </h2>
        </div>

        <form action={enregistrer} className="grid gap-4 px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-base leading-relaxed" id="invitation-profil-texte">
            Ton numéro nous permet de te joindre si une sortie change au dernier moment. La personne à prévenir, c’est au
            cas où tu aurais un pépin pendant une sortie. Tout est facultatif, et tu pourras le modifier dans Mon profil.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 font-mono text-xs font-black uppercase" htmlFor="invitation-telephone">
              Ton téléphone
              <input autoComplete="tel" className="field" id="invitation-telephone" inputMode="tel" name="phone" placeholder="06 12 34 56 78" type="tel" />
            </label>
            <label className="grid gap-2 font-mono text-xs font-black uppercase" htmlFor="invitation-naissance">
              Date de naissance
              <input autoComplete="bday" className="field" id="invitation-naissance" name="birth_date" type="date" />
            </label>
          </div>

          <label className="grid gap-2 font-mono text-xs font-black uppercase" htmlFor="invitation-instagram">
            Instagram
            <input className="field" id="invitation-instagram" name="instagram_handle" placeholder="@ton.pseudo" />
          </label>

          <fieldset className="grid gap-4 border-2 border-[#773331] p-4">
            <legend className="px-2 font-mono text-xs font-black uppercase tracking-[.14em]">En cas de pépin</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 font-mono text-xs font-black uppercase" htmlFor="invitation-urgence-nom">
                Personne à prévenir
                <input className="field" id="invitation-urgence-nom" name="emergency_contact_name" />
              </label>
              <label className="grid gap-2 font-mono text-xs font-black uppercase" htmlFor="invitation-urgence-tel">
                Son téléphone
                <input className="field" id="invitation-urgence-tel" inputMode="tel" name="emergency_contact_phone" type="tel" />
              </label>
            </div>
          </fieldset>

          {etat.error ? (
            <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-mono text-sm font-black uppercase" role="alert">
              {etat.error}
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <button className="primary-button justify-center" disabled={enCours || passeEnCours} type="submit">
              {enCours ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              className="secondary-link justify-center"
              disabled={enCours || passeEnCours}
              formAction={passer}
              formNoValidate
              type="submit"
            >
              {passeEnCours ? "…" : "Plus tard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
