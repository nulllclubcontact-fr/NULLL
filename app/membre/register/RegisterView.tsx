"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { QrAnime } from "../../../components/qr-anime";
import { registerMember, type RegisterState } from "../actions";

const initialState: RegisterState = {};

/**
 * Inscription membre.
 *
 * La page precedente decrivait ce qu'un compte apporte : une photo, un
 * titre, trois arguments, un formulaire a cote. Beaucoup de mots pour un
 * objet qu'on peut montrer.
 *
 * Ici la carte de membre se construit pendant qu'on remplit : le QR se
 * dessine, le nom s'inscrit des qu'on le tape, et la carte se redresse et
 * se fait tamponner quand la decharge est acceptee.
 *
 * La grille tient en trois cases pour que le formulaire commence tout en
 * haut de sa colonne — sinon le titre le poussait sous la ligne de
 * flottaison sur un portable. Sur mobile l'ordre redevient naturel :
 * titre, formulaire, carte.
 */
export function RegisterView() {
  const [state, formAction, pending] = useActionState(registerMember, initialState);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [accepted, setAccepted] = useState(false);

  const nomComplet = [prenom.trim(), nom.trim()].filter(Boolean).join(" ");

  return (
    <div className="relative mx-auto grid w-full max-w-[1500px] gap-y-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1fr)] lg:items-start lg:gap-x-16 lg:gap-y-8 xl:gap-x-24 xl:px-6">
      {/* ---------------- TITRE (col. 1, ligne 1) ---------------- */}
      <div className="order-1 lg:col-start-1 lg:row-start-1">
        <p className="hero-rise font-mono text-[.62rem] font-black uppercase tracking-[.2em] text-[#ffb000] [word-spacing:.22em]" style={{ animationDelay: "60ms" }}>
          Inscription membre
        </p>
        <h1 className="hero-rise mt-5 font-display text-[clamp(2.4rem,5vw,4.2rem)] uppercase leading-[1.06] tracking-[-.035em] text-[#f6eadf]" style={{ animationDelay: "140ms" }}>
          <span className="block">Ta carte</span>
          <span className="block text-[#d96ab4]">t’attend.</span>
        </h1>
        <p className="hero-rise mt-5 max-w-md text-lg leading-relaxed text-[#f6eadf]/78" style={{ animationDelay: "220ms" }}>
          Trois minutes. Elle se remplit pendant que tu écris.
        </p>
      </div>

      {/* ---------------- FORMULAIRE (col. 2, sur les deux lignes) ---------------- */}
      <div className="order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <form action={formAction} aria-label="Inscription membre" className="panel panel-grid account-stagger grid gap-3.5 p-5 sm:p-6">
          <div className="grid gap-3.5 sm:grid-cols-2" style={{ "--pas": 0 } as React.CSSProperties}>
            <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
              <span>Prénom</span>
              <input autoComplete="given-name" className="field" name="first_name" onChange={(e) => setPrenom(e.target.value)} required value={prenom} />
            </label>
            <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
              <span>Nom</span>
              <input autoComplete="family-name" className="field" name="last_name" onChange={(e) => setNom(e.target.value)} required value={nom} />
            </label>
          </div>

          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase" style={{ "--pas": 1 } as React.CSSProperties}>
            <span>E-mail</span>
            <input autoComplete="email" className="field" name="email" required type="email" />
          </label>

          <label className="account-field grid gap-2 font-mono text-xs font-black uppercase" style={{ "--pas": 2 } as React.CSSProperties}>
            <span>Mot de passe</span>
            <input autoComplete="new-password" className="field" minLength={6} name="password" required type="password" />
            <span className="font-mono text-[.62rem] font-bold normal-case tracking-normal text-[#351815]/55">Six caractères au minimum.</span>
          </label>

          <label
            className="flex cursor-pointer gap-3 border-2 border-[#351815] bg-[#fff8ef] p-4 text-sm font-bold leading-tight text-[#351815]/78 transition-colors duration-300 has-[:checked]:bg-[#d96ab4]/12"
            style={{ "--pas": 3 } as React.CSSProperties}
          >
            <input checked={accepted} className="mt-0.5 h-6 w-6 shrink-0 accent-[#d96ab4]" name="waiver" onChange={(e) => setAccepted(e.target.checked)} type="checkbox" />
            <span>
              J’ai lu et j’accepte la décharge de responsabilité : je participe aux activités de NULLL.CLUB sous ma propre
              responsabilité, je reconnais les risques liés à la course à pied et je renonce à tout recours, sauf faute de
              l’organisateur.{" "}
              <Link className="inline-flex min-h-11 items-center font-black text-[#351815] underline decoration-[#d96ab4] decoration-2 underline-offset-4" href="/membre/decharge">
                lire la décharge complète
              </Link>
            </span>
          </label>

          {state.error ? (
            <p className="border-2 border-[#351815] bg-[#ffb000] px-4 py-3 font-mono text-sm font-black uppercase text-[#351815]" role="alert">
              {state.error}
            </p>
          ) : null}

          <div className="grid gap-2" style={{ "--pas": 4 } as React.CSSProperties}>
            <button
              className="primary-button transition duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-[#ffb000] enabled:hover:text-[#351815]"
              disabled={!accepted || pending}
              type="submit"
            >
              {pending ? "Création…" : "Créer mon compte"}
            </button>
            {!accepted && !pending ? (
              <span aria-live="polite" className="font-mono text-[.62rem] font-black uppercase tracking-[.14em] text-[#351815]/50">
                Coche la décharge pour valider ta carte.
              </span>
            ) : null}
          </div>
        </form>

        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-black uppercase tracking-[.14em] text-[#f6eadf]/60">
          Déjà un compte ?
          <Link className="text-[#ffb000] underline decoration-[#ffb000]/40 decoration-2 underline-offset-4 transition hover:decoration-[#ffb000]" href="/membre/login">
            Se connecter
          </Link>
        </p>
      </div>

      {/* ---------------- LA CARTE (col. 1, ligne 2) ---------------- */}
      <div className="order-3 lg:col-start-1 lg:row-start-2">
        {/* L'arrivee et la rotation sont sur deux elements distincts :
            hero-rise anime « transform », il ecraserait la rotation de la
            carte et son redressement au tampon. */}
        <div className="hero-rise mx-auto w-full max-w-[19rem] sm:max-w-[21rem] lg:mx-0" style={{ animationDelay: "300ms" }}>
        <div
          className={`carte-membre w-full border-2 border-[#351815] bg-[#f6eadf] p-5 text-[#351815] ${
            accepted ? "is-prete" : ""
          }`}
        >
          <div className="flex items-baseline justify-between border-b-2 border-[#351815] pb-3 font-mono text-[.58rem] font-black uppercase tracking-[.2em]">
            <span>NULLL.CLUB</span>
            <span className="text-[#d96ab4]">Membre</span>
          </div>

          <div className="relative mt-4">
            <QrAnime />
            {accepted ? (
              <span
                aria-hidden="true"
                className="carte-tampon pointer-events-none absolute left-1/2 top-1/2 border-4 border-[#d96ab4] px-4 py-2 font-display text-3xl uppercase leading-none text-[#d96ab4]"
              >
                Prêt
              </span>
            ) : null}
          </div>

          {/* Le nom s'inscrit en direct. Tant qu'il est vide, la ligne
              reste en pointilles : elle attend, elle ne ment pas. */}
          <div className="mt-4 min-h-[2.9rem]">
            {nomComplet ? (
              <p className="carte-nom font-display text-[clamp(1.4rem,3.6vw,1.9rem)] uppercase leading-[.95]">{nomComplet}</p>
            ) : (
              <p className="border-b-2 border-dashed border-[#351815]/35 pb-2 font-mono text-xs font-black uppercase tracking-[.16em] text-[#351815]/40">
                Ton nom ici
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t-2 border-[#351815] pt-3 font-mono text-[.58rem] font-black uppercase tracking-[.16em] text-[#351815]/60">
            <span>Aix-en-Provence</span>
            <span>Depuis 2026</span>
          </div>
        </div>
        </div>

        <p className="mx-auto mt-4 max-w-[21rem] font-mono text-[.62rem] font-black uppercase leading-relaxed tracking-[.14em] text-[#f6eadf]/45 lg:mx-0">
          Un scan à chaque sortie, et ta présence est comptée.
        </p>
      </div>
    </div>
  );
}
