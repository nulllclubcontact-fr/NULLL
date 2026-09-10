"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { creerPartenaire, genererNouveauCode, supprimerPartenaire, type PartenaireState } from "../../app/admin/reseau-actions";

const BOUTON =
  "inline-flex min-h-11 items-center justify-center border-2 border-[#773331] px-4 font-mono text-xs font-black uppercase tracking-[.1em] transition disabled:opacity-60";

const initial: PartenaireState = {};

function Erreur({ texte }: { texte?: string }) {
  return texte ? (
    <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 text-sm font-bold" role="alert">
      {texte}
    </p>
  ) : null;
}

/**
 * Le code en clair n'existe qu'ici, le temps de cet affichage : en base il
 * n'y a que son empreinte. Personne ne pourra le relire ensuite.
 */
function CodeRevele({ code, nom }: { code: string; nom?: string }) {
  const [copie, setCopie] = useState(false);

  return (
    <div className="grid gap-3 border-2 border-[#773331] bg-[#FFB200] p-4 text-[#773331]" role="status">
      <p className="font-mono text-xs font-black uppercase tracking-[.12em]">
        Code {nom ? `de ${nom}` : "d’accès"} · affiché une seule fois
      </p>
      <p className="select-all break-all font-mono text-2xl font-black tracking-[.08em]">{code}</p>
      <p className="text-sm font-bold">
        Transmets-le au partenaire maintenant : il sert à ouvrir son espace pro sur /pro/login. Il est enregistré chiffré, donc ni toi ni personne ne pourra le relire. S’il le perd, génère-en un nouveau.
      </p>
      <button
        className={`${BOUTON} justify-self-start bg-[#F1EDE9] hover:bg-[#773331] hover:text-[#F1EDE9]`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopie(true);
          } catch {
            setCopie(false);
          }
        }}
        type="button"
      >
        {copie ? "Copié ✓" : "Copier le code"}
      </button>
    </div>
  );
}

export function CreerPartenaireForm() {
  const [state, formAction, pending] = useActionState(creerPartenaire, initial);

  return (
    <details className="border-2 border-[#773331] bg-[#F1EDE9] p-5" open={Boolean(state.code) || undefined}>
      <summary className="cursor-pointer font-mono text-xs font-black uppercase tracking-[.14em]">+ Nouveau partenaire</summary>

      <form action={formAction} className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="grid gap-2 font-mono text-xs font-black uppercase">
          Nom du commerce
          <input className="field" maxLength={120} name="name" required />
        </label>
        <label className="grid gap-2 font-mono text-xs font-black uppercase">
          E-mail de contact
          <input className="field" name="contact_email" type="email" />
        </label>
        <button className={`${BOUTON} bg-[#773331] text-[#F1EDE9] hover:bg-[#FFB200] hover:text-[#773331]`} disabled={pending} type="submit">
          {pending ? "Création…" : "Créer et générer son code"}
        </button>
      </form>

      <div className="mt-4 grid gap-3">
        <Erreur texte={state.error} />
        {state.code ? (
          <>
            <CodeRevele code={state.code} nom={state.nom} />
            <Link className="font-mono text-xs font-black uppercase tracking-[.12em] underline decoration-[#EBA0CD] decoration-2 underline-offset-4" href={`/admin/reseau/${state.partenaireId}`}>
              Voir sa fiche →
            </Link>
          </>
        ) : null}
      </div>
    </details>
  );
}

export function NouveauCodeForm({ partnerId, aDejaUnCode }: { partnerId: string; aDejaUnCode: boolean }) {
  const [state, formAction, pending] = useActionState(genererNouveauCode, initial);

  return (
    <form action={formAction} className="grid gap-3">
      <input name="partner_id" type="hidden" value={partnerId} />
      <button className={`${BOUTON} justify-self-start bg-[#EBA0CD] hover:bg-[#FFB200]`} disabled={pending} type="submit">
        {pending ? "Génération…" : aDejaUnCode ? "Générer un nouveau code" : "Générer son code"}
      </button>
      {aDejaUnCode && !state.code ? (
        <p className="text-sm font-bold">Le code actuel cessera aussitôt de fonctionner.</p>
      ) : null}
      <Erreur texte={state.error} />
      {state.code ? <CodeRevele code={state.code} /> : null}
    </form>
  );
}

export function SuppressionPartenaire({ partnerId, nom, ventes }: { partnerId: string; nom: string; ventes: number }) {
  const [state, formAction, pending] = useActionState(supprimerPartenaire, initial);

  if (ventes > 0) {
    return (
      <p className="max-w-md text-sm font-bold">
        Suppression impossible : {ventes} vente{ventes > 1 ? "s" : ""} rattachée{ventes > 1 ? "s" : ""}, qui portent des points de membres. Désactive-le plutôt.
      </p>
    );
  }

  return (
    <details className="relative">
      <summary className="nav-link cursor-pointer">Supprimer</summary>
      <form
        action={formAction}
        className="absolute left-0 z-20 mt-2 grid w-72 max-w-[calc(100vw-2rem)] gap-3 border-2 border-[#773331] bg-[#F1EDE9] p-4 shadow-[6px_6px_0_#EBA0CD]"
      >
        <input name="partner_id" type="hidden" value={partnerId} />
        <p className="text-sm font-bold">Supprimer « {nom} » ? Ses codes d’accès partent avec lui.</p>
        <button className={`${BOUTON} bg-[#773331] text-[#F1EDE9] hover:bg-[#FFB200] hover:text-[#773331]`} disabled={pending} type="submit">
          {pending ? "Suppression…" : "Oui, supprimer"}
        </button>
        <Erreur texte={state.error} />
      </form>
    </details>
  );
}
