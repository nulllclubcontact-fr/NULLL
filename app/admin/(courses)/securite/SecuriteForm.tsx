"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { codeTotpValide } from "../../../../lib/admin/regles";
import { createSupabaseBrowserClient } from "../../../../lib/supabase/client";
import { noterDoubleVerification } from "../../securite-actions";

type Facteur = { id: string; nom: string; depuis: string };
type Enrolement = { factorId: string; qr: string; secret: string };

const BOUTON_PLEIN = "inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50";
const BOUTON_CREUX = "inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-100 disabled:opacity-50";
const CHAMP = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10";

/**
 * Enrolement TOTP dans le navigateur : Supabase exige la session de
 * l'admin pour creer et verifier un facteur. Le serveur constate ensuite
 * (securite-actions.ts) et note au journal. Meme parti pris que la page :
 * lisible avant tout.
 */
export function SecuriteForm({ facteurs }: { facteurs: Facteur[] }) {
  const router = useRouter();
  const [enrolement, setEnrolement] = useState<Enrolement | null>(null);
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [enCours, startTransition] = useTransition();

  function commencer() {
    setErreur(null);
    setMessage(null);

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();

        // Un enrolement abandonne laisse un facteur « unverified » qui
        // bloquerait le suivant sous le meme nom : on le retire d'abord.
        const { data: existants } = await supabase.auth.mfa.listFactors();
        for (const f of existants?.all ?? []) {
          if (f.status !== "verified") await supabase.auth.mfa.unenroll({ factorId: f.id });
        }

        const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "NULLL admin", issuer: "NULLL.CLUB" });

        if (error || !data) {
          setErreur("Activation impossible pour le moment. La double vérification est-elle activée côté Supabase ?");
          return;
        }

        // Supabase termine l'URL de donnees par un retour a la ligne.
        setEnrolement({ factorId: data.id, qr: data.totp.qr_code.trimEnd(), secret: data.totp.secret });
      } catch {
        setErreur("Activation impossible pour le moment. Réessaie.");
      }
    });
  }

  function confirmer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enrolement) return;
    setErreur(null);

    if (!codeTotpValide(code)) {
      setErreur("Six chiffres, comme dans l’application.");
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: enrolement.factorId, code: code.replace(/\s+/g, "") });

        if (error) {
          setErreur("Code refusé. Vérifie l’heure de ton téléphone et réessaie.");
          return;
        }

        await noterDoubleVerification("activation");
        setEnrolement(null);
        setCode("");
        setMessage("Double vérification activée. À partir de maintenant, chaque connexion admin la demande.");
        router.refresh();
      } catch {
        setErreur("Vérification impossible pour le moment. Réessaie.");
      }
    });
  }

  function retirer(factorId: string) {
    setErreur(null);
    setMessage(null);

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.mfa.unenroll({ factorId });

        if (error) {
          setErreur("Retrait refusé. Reconnecte-toi puis réessaie.");
          return;
        }

        await noterDoubleVerification("retrait");
        setMessage("Double vérification retirée. Ton compte n’a plus que son mot de passe.");
        router.refresh();
      } catch {
        setErreur("Retrait impossible pour le moment. Réessaie.");
      }
    });
  }

  return (
    <div className="grid gap-4">
      {facteurs.map((f) => (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between" key={f.id}>
          <div>
            <p className="text-sm font-medium text-slate-900">{f.nom}</p>
            <p className="text-sm text-slate-500">Depuis le {f.depuis}</p>
          </div>
          <details className="relative">
            <summary className={`${BOUTON_CREUX} cursor-pointer list-none`}>Retirer</summary>
            <div className="absolute right-0 z-20 mt-2 grid w-72 max-w-[calc(100vw-2rem)] gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
              <p className="text-sm text-slate-700">Retirer la double vérification ? Ton mot de passe seul ouvrira de nouveau l’administration.</p>
              <button className={BOUTON_PLEIN} disabled={enCours} onClick={() => retirer(f.id)} type="button">
                Oui, retirer
              </button>
            </div>
          </details>
        </div>
      ))}

      {facteurs.length === 0 && !enrolement ? (
        <div className="grid gap-4">
          <ol className="grid gap-2 text-sm text-slate-700">
            <li>1. Installe une application d’authentification (Google Authenticator, Aegis, 1Password, Authy…).</li>
            <li>2. Clique ci-dessous, scanne le QR avec l’application.</li>
            <li>3. Entre le code à six chiffres qu’elle affiche.</li>
          </ol>
          <button className={`${BOUTON_PLEIN} w-fit`} disabled={enCours} onClick={commencer} type="button">
            {enCours ? "Préparation…" : "Activer la double vérification"}
          </button>
        </div>
      ) : null}

      {enrolement ? (
        <form className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4" onSubmit={confirmer}>
          <p className="text-sm font-medium text-slate-900">Scanne ce QR avec ton application</p>
          <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
            <div className="w-fit rounded-lg border border-slate-200 bg-white p-2">
              {/* Un SVG en URL de donnees, genere a la demande : rien a optimiser,
                  et next/image le refuserait. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="QR d’enrôlement à scanner dans l’application d’authentification" height={192} src={enrolement.qr} width={192} />
            </div>
            <div className="grid gap-3">
              <p className="text-sm text-slate-700">
                Pas de caméra ? Saisis cette clé à la main :
                <code className="mt-1 block break-all rounded-lg bg-slate-100 px-2 py-1.5 font-mono text-xs text-slate-900">{enrolement.secret}</code>
              </p>
              <label className="grid gap-1.5 text-sm font-medium text-slate-900">
                <span>Code affiché</span>
                <input
                  autoComplete="one-time-code"
                  className={CHAMP}
                  inputMode="numeric"
                  maxLength={7}
                  name="code"
                  onChange={(e) => setCode(e.target.value)}
                  pattern="[0-9 ]*"
                  placeholder="123 456"
                  required
                  value={code}
                />
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={BOUTON_PLEIN} disabled={enCours} type="submit">
              {enCours ? "Vérification…" : "Confirmer"}
            </button>
            <button className={BOUTON_CREUX} disabled={enCours} onClick={() => setEnrolement(null)} type="button">
              Annuler
            </button>
          </div>
        </form>
      ) : null}

      {erreur ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          {erreur}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
