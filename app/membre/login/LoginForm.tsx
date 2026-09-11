"use client";

import { useActionState } from "react";
import { loginMember, resetMemberPassword, verifierCodeReinitialisation, type LoginState } from "../actions";
import { BoutonsSociaux } from "../../../components/auth/boutons-sociaux";
import { CodeSms } from "../../../components/auth/code-sms";
import type { FournisseursAuth } from "../../../lib/auth/reglages";

const initialState: LoginState = {};

export function LoginForm({ fournisseurs, sortie }: { fournisseurs: FournisseursAuth; sortie?: string }) {
  const [loginState, loginAction, loginPending] = useActionState(loginMember, initialState);
  const [resetState, resetAction, resetPending] = useActionState(resetMemberPassword, initialState);
  const telephoneActif = fournisseurs.telephone;
  const libelle = telephoneActif ? "E-mail ou téléphone" : "E-mail";

  return (
    <div className="panel panel-grid account-stagger p-5 sm:p-6">
      <div className="mb-4">
        <BoutonsSociaux apple={fournisseurs.apple} google={fournisseurs.google} separateur="ou avec ton compte" sortie={sortie} />
      </div>
      <form action={loginAction} aria-label="Connexion membre" className="grid gap-4" style={{ "--pas": 0 } as React.CSSProperties}>
        <input name="sortie" type="hidden" value={sortie ?? ""} />
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>{libelle}</span>
          <input autoComplete="username" className="field" name="identifiant" required type={telephoneActif ? "text" : "email"} />
        </label>
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Mot de passe</span>
          <input autoComplete="current-password" className="field" name="password" required type="password" />
        </label>

        {/* Cochee par defaut : le samedi, personne ne doit se retrouver
            deconnecte au moment de montrer son QR. */}
        <label className="flex cursor-pointer items-center gap-3 text-sm font-bold">
          <input className="h-5 w-5 shrink-0 accent-[#EBA0CD]" defaultChecked name="souvenir" type="checkbox" />
          <span>
            Rester connecté sur cet appareil
            <span className="block text-xs font-normal">À éviter sur un appareil partagé.</span>
          </span>
        </label>

        {loginState.error ? (
          <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-mono text-sm font-black uppercase text-[#773331]" role="alert">
            {loginState.error}
          </p>
        ) : null}
        <button
          className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#FFB200] enabled:hover:text-[#773331]"
          disabled={loginPending}
          type="submit"
        >
          {loginPending ? "Connexion…" : "Entrer"}
        </button>
      </form>

      {/* « Mot de passe oublie » nommait la section, pas le champ : rien ne
          disait qu'il fallait y remettre son e-mail. Le bloc annonce
          maintenant ce qu'il fait, et le champ ce qu'il attend. */}
      <div className="mt-5 border-t-2 border-[#773331] pt-5" style={{ "--pas": 1 } as React.CSSProperties}>
        {resetState.etape === "code" && resetState.telephone ? (
          <CodeSms
            renvoyer={resetMemberPassword}
            retour={{ href: "/membre/login", label: "Revenir à la connexion" }}
            telephone={resetState.telephone}
            texteBouton="Choisir un nouveau mot de passe"
            verifier={verifierCodeReinitialisation}
          />
        ) : (
          <form action={resetAction} className="grid gap-3">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[.1em]">Mot de passe oublié ?</p>
              <p className="mt-1.5 text-sm font-bold leading-snug text-[#773331]">
                {telephoneActif
                  ? "Donne ton e-mail ou ton numéro : on t’envoie un lien par mail ou un code par SMS pour en choisir un nouveau."
                  : "Donne ton e-mail, on t’envoie un lien pour en choisir un nouveau."}
              </p>
            </div>
            <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
              <span>{telephoneActif ? "Ton e-mail ou ton numéro" : "Ton e-mail"}</span>
              <input
                autoComplete={telephoneActif ? "username" : "email"}
                className="field"
                name="identifiant"
                placeholder={telephoneActif ? "prenom@exemple.fr ou 06 12 34 56 78" : "prenom@exemple.fr"}
                required
                type={telephoneActif ? "text" : "email"}
              />
            </label>
            {resetState.error ? <p className="text-sm font-bold text-[#773331]">{resetState.error}</p> : null}
            {resetState.message ? <p className="text-sm font-bold text-[#773331]">{resetState.message}</p> : null}
            <button className="secondary-link justify-center" disabled={resetPending} type="submit">
              {telephoneActif ? "Recevoir le lien ou le code" : "Recevoir le lien"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
