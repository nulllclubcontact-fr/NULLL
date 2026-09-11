"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { registerMember, renvoyerCodeInscription, verifierCodeInscription, type RegisterState } from "../actions";
import { BoutonsSociaux } from "../../../components/auth/boutons-sociaux";
import { CodeSms } from "../../../components/auth/code-sms";
import type { FournisseursAuth } from "../../../lib/auth/reglages";

const initialState: RegisterState = {};

export function RegisterForm({ fournisseurs }: { fournisseurs: FournisseursAuth }) {
  const telephoneActif = fournisseurs.telephone;
  const [state, formAction, pending] = useActionState(registerMember, initialState);
  const [accepted, setAccepted] = useState(false);
  const [mode, setMode] = useState<"email" | "telephone">("email");

  // Compte cree par telephone : il reste a confirmer le numero avec le SMS.
  if (state.etape === "code" && state.telephone) {
    return (
      <div className="panel panel-grid p-5 sm:p-6">
        <CodeSms
          renvoyer={renvoyerCodeInscription}
          retour={{ href: "/membre/register", label: "Changer de numéro" }}
          telephone={state.telephone}
          texteBouton="Valider mon numéro"
          verifier={verifierCodeInscription}
        />
      </div>
    );
  }

  return (
    <form
      action={formAction}
      aria-label="Inscription membre"
      className="panel panel-grid account-stagger grid gap-3.5 p-5 sm:p-6 lg:p-5"
    >
      {/* La decharge se signe juste apres, sur /membre/bienvenue. */}
      <BoutonsSociaux apple={fournisseurs.apple} google={fournisseurs.google} separateur="ou avec ton e-mail" />

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

      {telephoneActif ? (
        <div
          aria-label="S’inscrire avec"
          className="grid grid-cols-2 border-2 border-[#773331]"
          role="radiogroup"
          style={{ "--pas": 1 } as React.CSSProperties}
        >
          {(["email", "telephone"] as const).map((choix) => (
            <button
              aria-checked={mode === choix}
              className={`min-h-11 font-mono text-xs font-black uppercase tracking-[.12em] transition ${
                mode === choix ? "bg-[#773331] text-[#F1EDE9]" : "bg-[#F1EDE9] text-[#773331] hover:bg-[#EBA0CD]"
              }`}
              key={choix}
              onClick={() => setMode(choix)}
              role="radio"
              type="button"
            >
              {choix === "email" ? "E-mail" : "Téléphone"}
            </button>
          ))}
        </div>
      ) : null}
      <input name="mode" type="hidden" value={mode} />

      {mode === "email" ? (
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase" style={{ "--pas": 1 } as React.CSSProperties}>
          <span>E-mail</span>
          <input autoComplete="email" className="field" name="email" required type="email" />
        </label>
      ) : (
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase" style={{ "--pas": 1 } as React.CSSProperties}>
          <span>Téléphone</span>
          <input autoComplete="tel" className="field" inputMode="tel" name="phone" placeholder="06 12 34 56 78" required type="tel" />
          <span className="font-mono text-xs font-bold normal-case tracking-normal">
            On t’envoie un code par SMS pour vérifier ton numéro.
          </span>
        </label>
      )}

      <label className="account-field grid gap-2 font-mono text-xs font-black uppercase" style={{ "--pas": 2 } as React.CSSProperties}>
        <span>Mot de passe</span>
        <input autoComplete="new-password" className="field" minLength={6} name="password" required type="password" />
        <span className="font-mono text-xs font-bold normal-case tracking-normal text-[#773331]">
          Six caractères au minimum.
        </span>
      </label>

      <label
        className="flex cursor-pointer gap-3 border-2 border-[#773331] bg-[#F1EDE9] p-4 text-sm font-bold leading-tight text-[#773331] transition-colors duration-300 has-[:checked]:bg-[#EBA0CD]/12"
        style={{ "--pas": 3 } as React.CSSProperties}
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

      {/* Le bouton restait gris sans rien dire. Il annonce maintenant ce
          qui le debloque, et reprend le mouvement des autres boutons du
          site des qu'il est actif. */}
      <div className="grid gap-2" style={{ "--pas": 4 } as React.CSSProperties}>
        <button
          className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#FFB200] enabled:hover:text-[#773331]"
          disabled={!accepted || pending}
          type="submit"
        >
          {pending ? "Création…" : mode === "telephone" ? "Recevoir mon code" : "Créer mon compte"}
        </button>
        {!accepted && !pending ? (
          <span aria-live="polite" className="font-mono text-xs font-black uppercase tracking-[.14em] text-[#773331]">
            Coche la décharge pour continuer.
          </span>
        ) : null}
      </div>
    </form>
  );
}
