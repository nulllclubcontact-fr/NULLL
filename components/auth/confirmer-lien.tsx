"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useSyncExternalStore } from "react";
import { confirmerLienEmail, type ConfirmationState } from "../../app/membre/confirmation-actions";
import { lireLienEmail } from "../../lib/auth/confirmation";
import { RenvoiConfirmation } from "./renvoi-confirmation";

const initial: ConfirmationState = {};

// Le fragment est lu une fois puis retire de la barre d'adresse : le jeton
// ne reste ni dans l'historique, ni dans un lien copie-colle.
let fragmentLu = "";

function lireFragment() {
  if (window.location.hash) {
    fragmentLu = window.location.hash;
  }
  return fragmentLu;
}

// Un second lien ouvert dans le meme onglet change le fragment sans recharger la page.
function suivreFragment(changement: () => void) {
  window.addEventListener("hashchange", changement);
  return () => window.removeEventListener("hashchange", changement);
}

// Meme habit que les autres alertes des pages de compte.
const MESSAGE = "border-2 border-[#773331] bg-[#FFB200] px-4 py-3 text-sm font-bold leading-snug text-[#773331]";

export function ConfirmerLien() {
  const fragment = useSyncExternalStore(suivreFragment, lireFragment, () => null);
  const lien = useMemo(() => (fragment === null ? undefined : lireLienEmail(fragment)), [fragment]);
  const [etat, action, verification] = useActionState(confirmerLienEmail, initial);

  useEffect(() => {
    if (lien && window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [lien]);

  const recuperation = lien?.type === "recovery";

  // Rendu serveur, ou navigateur qui n'a pas encore lu le lien.
  if (lien === undefined) {
    return (
      <div className="panel panel-grid grid gap-4 p-5 sm:p-6">
        <p className="font-bold" role="status">
          Lecture du lien…
        </p>
        <noscript>
          <p className="font-bold leading-snug">Cette page a besoin de JavaScript pour lire ton lien. Active-le, puis rouvre le lien reçu par mail.</p>
        </noscript>
      </div>
    );
  }

  if (etat.resultat === "confirme" && etat.destination) {
    return (
      <div className="panel panel-grid grid gap-4 p-5 sm:p-6" role="status">
        <p className="font-display text-3xl uppercase leading-none">{recuperation ? "C’est bon." : "Adresse confirmée."}</p>
        <p className="font-bold leading-snug">
          {recuperation ? "Choisis maintenant ton nouveau mot de passe." : "Ton compte est actif et tu es connecté sur cet appareil."}
        </p>
        <Link className="primary-link" href={etat.destination}>
          {recuperation ? "Choisir mon mot de passe" : "Aller à mon espace"}
        </Link>
      </div>
    );
  }

  if (lien === null || etat.resultat === "expire") {
    return (
      <div className="panel panel-grid grid gap-4 p-5 sm:p-6">
        <p className={MESSAGE} role="alert">
          {lien === null
            ? "Ce lien est incomplet. Ouvre-le directement depuis le mail, sans le recopier."
            : "Ce lien a expiré ou a déjà servi."}
        </p>
        {recuperation ? (
          <>
            <p className="font-bold leading-snug">Pour ta sécurité, un lien de réinitialisation ne sert qu’une fois et pour peu de temps.</p>
            <Link className="primary-link" href="/membre/login">
              Demander un nouveau lien
            </Link>
          </>
        ) : (
          <>
            <p className="font-bold leading-snug">
              Déjà cliqué dessus ? Ton adresse est sans doute confirmée :{" "}
              <Link className="font-black underline decoration-[#EBA0CD] decoration-2 underline-offset-4" href="/membre/login">
                connecte-toi
              </Link>
              . Sinon, demande un nouveau mail.
            </p>
            <RenvoiConfirmation sortie={lien?.sortie ?? undefined} />
          </>
        )}
      </div>
    );
  }

  return (
    <form action={action} className="panel panel-grid grid gap-4 p-5 sm:p-6">
      <input name="token_hash" type="hidden" value={lien.tokenHash} />
      <input name="type" type="hidden" value={lien.type} />
      <input name="sortie" type="hidden" value={lien.sortie ?? ""} />

      <p className="font-bold leading-snug">
        {recuperation
          ? "Un clic pour ouvrir le choix d’un nouveau mot de passe."
          : "Un clic et ton compte est actif. Ça marche aussi depuis un autre appareil que celui de l’inscription."}
      </p>

      {etat.resultat === "reseau" ? (
        <p className={MESSAGE} role="alert">
          Vérification impossible pour le moment. Ton lien est toujours valable : réessaie dans un instant.
        </p>
      ) : null}

      <button
        className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#FFB200] enabled:hover:text-[#773331]"
        disabled={verification}
        type="submit"
      >
        {verification ? "Vérification…" : recuperation ? "Continuer" : "Confirmer mon adresse email"}
      </button>
    </form>
  );
}
