"use client";

import { useActionState } from "react";
import { ajouterAdmin, retirerAdmin, retirerDoubleVerification, type EquipeState } from "../../equipe-actions";

const initial: EquipeState = {};

function Retour({ state }: { state: EquipeState }) {
  if (state.error) {
    return (
      <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-mono text-sm font-black uppercase" role="alert">
        {state.error}
      </p>
    );
  }

  if (state.message) {
    return (
      <p className="font-mono text-xs font-black uppercase tracking-[.12em]" role="status">
        {state.message}
      </p>
    );
  }

  return null;
}

export function FormulaireAjoutAdmin() {
  const [state, formAction, pending] = useActionState(ajouterAdmin, initial);

  return (
    <details className="panel p-5">
      <summary className="cursor-pointer font-mono text-xs font-black uppercase tracking-[.14em]">Ajouter un admin</summary>
      <form action={formAction} className="mt-5 grid gap-3.5">
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>E-mail du membre</span>
          <input autoComplete="off" className="field" inputMode="email" name="email" placeholder="prenom@exemple.fr" required type="email" />
        </label>
        <p className="text-sm font-bold">La personne doit déjà avoir un compte membre. Elle recevra l’accès à sa prochaine connexion.</p>
        <Retour state={state} />
        <button className="primary-button w-fit" disabled={pending} type="submit">
          {pending ? "Ajout…" : "Donner l’accès admin"}
        </button>
      </form>
    </details>
  );
}

export function FormulaireMembreEquipe({ id, nom, aDoubleVerification }: { id: string; nom: string; aDoubleVerification: boolean }) {
  const [retrait, actionRetrait, retraitEnCours] = useActionState(retirerAdmin, initial);
  const [mfa, actionMfa, mfaEnCours] = useActionState(retirerDoubleVerification, initial);

  return (
    <div className="grid gap-2 lg:shrink-0 lg:justify-items-end">
      <div className="course-actions flex flex-wrap gap-2">
        {aDoubleVerification ? (
          <details className="relative">
            <summary className="nav-link cursor-pointer">Téléphone perdu</summary>
            <form
              action={actionMfa}
              className="absolute right-0 z-20 mt-2 grid w-72 max-w-[calc(100vw-2rem)] gap-3 border-2 border-[#773331] bg-[#F1EDE9] p-4 shadow-[6px_6px_0_#EBA0CD]"
            >
              <input name="profile_id" type="hidden" value={id} />
              <p className="text-sm font-bold">Retirer la double vérification de {nom} ? Son mot de passe seul rouvrira l’administration, jusqu’à ce qu’il la réactive.</p>
              <button
                className="inline-flex min-h-11 items-center justify-center border-2 border-[#773331] bg-[#773331] px-3 font-mono text-xs font-black uppercase tracking-[.1em] text-[#F1EDE9] transition hover:bg-[#FFB200] hover:text-[#773331]"
                disabled={mfaEnCours}
                type="submit"
              >
                Oui, retirer
              </button>
            </form>
          </details>
        ) : null}

        <details className="relative">
          <summary className="nav-link cursor-pointer">Retirer l’accès</summary>
          <form
            action={actionRetrait}
            className="absolute right-0 z-20 mt-2 grid w-72 max-w-[calc(100vw-2rem)] gap-3 border-2 border-[#773331] bg-[#F1EDE9] p-4 shadow-[6px_6px_0_#EBA0CD]"
          >
            <input name="profile_id" type="hidden" value={id} />
            <p className="text-sm font-bold">Retirer l’accès admin à {nom} ? Son compte membre, ses inscriptions et ses points restent.</p>
            <button
              className="inline-flex min-h-11 items-center justify-center border-2 border-[#773331] bg-[#773331] px-3 font-mono text-xs font-black uppercase tracking-[.1em] text-[#F1EDE9] transition hover:bg-[#FFB200] hover:text-[#773331]"
              disabled={retraitEnCours}
              type="submit"
            >
              Oui, retirer
            </button>
          </form>
        </details>
      </div>
      <Retour state={retrait} />
      <Retour state={mfa} />
    </div>
  );
}
