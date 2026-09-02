"use client";

import { FormEvent, useState } from "react";
import { ArrowIcon } from "./ArrowIcon";

type Etat = "repos" | "envoi" | "envoye" | "erreur";

export function ContactMailForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [piege, setPiege] = useState("");
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (etat === "envoi") return;

    setEtat("envoi");
    setErreur("");

    let reponse: Response;

    try {
      reponse = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, website: piege })
      });
    } catch {
      setEtat("erreur");
      setErreur("Connexion perdue. Réessaie dans un moment.");
      return;
    }

    if (!reponse.ok) {
      const corps = await reponse.json().catch(() => null);
      setEtat("erreur");
      setErreur(corps?.message ?? "Envoi impossible pour le moment.");
      return;
    }

    setEtat("envoye");
    setEmail("");
    setMessage("");
  }

  // Sans cadre : la bande sombre de la page fait deja le panneau, un
  // second contour dedans aurait fait boite dans une boite.
  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Champ piege : hors ecran pour l'oeil comme pour le lecteur
          d'ecran, mais rempli par les robots qui remplissent tout. */}
      <input
        aria-hidden="true"
        autoComplete="off"
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        name="website"
        onChange={(event) => setPiege(event.target.value)}
        tabIndex={-1}
        value={piege}
      />

      <label className="field-rule flex flex-col gap-3 pb-[3px] font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#f6eadf]/70 [word-spacing:.18em]">
        Ton email
        <input
          className="min-h-16 border-2 border-[#f6eadf]/35 bg-transparent px-5 text-lg font-bold normal-case tracking-normal text-[#f6eadf] outline-none transition-colors [word-spacing:normal] placeholder:text-[#f6eadf]/35 focus:border-[#ffb000] focus:bg-[#f6eadf]/5"
          disabled={etat === "envoi"}
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="toi@exemple.com"
          required
          type="email"
          value={email}
        />
      </label>

      <label className="field-rule flex flex-1 flex-col gap-3 pb-[3px] font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#f6eadf]/70 [word-spacing:.18em]">
        Ton message
        <textarea
          className="min-h-48 flex-1 resize-y border-2 border-[#f6eadf]/35 bg-transparent px-5 py-4 text-lg font-bold normal-case leading-snug tracking-normal text-[#f6eadf] outline-none transition-colors [word-spacing:normal] placeholder:text-[#f6eadf]/35 focus:border-[#ffb000] focus:bg-[#f6eadf]/5"
          disabled={etat === "envoi"}
          name="message"
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Dis-nous tout."
          required
          value={message}
        />
      </label>

      <button
        className="inline-flex min-h-20 w-full items-center justify-between gap-4 border-2 border-[#ffb000] bg-[#ffb000] px-6 font-mono text-xs font-black uppercase tracking-[.1em] text-[#351815] transition-colors [word-spacing:.12em] hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#ffb000] disabled:hover:text-[#351815] sm:px-8"
        disabled={etat === "envoi"}
        type="submit"
      >
        <span className="copy-safe text-left">{etat === "envoi" ? "Envoi en cours…" : "Envoyer le message"}</span>
        <ArrowIcon />
      </button>

      {/* Le resultat est annonce aux lecteurs d'ecran, pas seulement
          affiche : l'envoi ne change pas de page. */}
      <p aria-live="polite" className="min-h-6 text-base leading-relaxed">
        {etat === "envoye" ? (
          <span className="font-bold text-[#ffb000]">C’est parti. On te répond à cette adresse.</span>
        ) : null}
        {etat === "erreur" ? <span className="font-bold text-[#b03583]">{erreur}</span> : null}
      </p>
    </form>
  );
}
