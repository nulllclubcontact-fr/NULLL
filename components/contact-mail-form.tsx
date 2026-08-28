"use client";

import { FormEvent, useState } from "react";
import { ArrowIcon } from "./ArrowIcon";

const CONTACT_EMAIL = "contact@nulll.club";

export function ContactMailForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = "Message depuis nulll.club";
    const body = [`Email : ${email}`, "", message].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // Sans cadre : la bande sombre de la page fait deja le panneau, un
  // second contour dedans aurait fait boite dans une boite.
  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <label className="field-rule flex flex-col gap-3 pb-[3px] font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#f6eadf]/70 [word-spacing:.18em]">
        Ton email
        <input
          className="min-h-16 border-2 border-[#f6eadf]/35 bg-transparent px-5 text-lg font-bold normal-case tracking-normal text-[#f6eadf] outline-none transition-colors [word-spacing:normal] placeholder:text-[#f6eadf]/35 focus:border-[#ffb000] focus:bg-[#f6eadf]/5"
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
          name="message"
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Dis-nous tout."
          required
          value={message}
        />
      </label>

      <button
        className="inline-flex min-h-20 w-full items-center justify-between gap-4 border-2 border-[#ffb000] bg-[#ffb000] px-6 font-mono text-xs font-black uppercase tracking-[.1em] text-[#351815] transition-colors [word-spacing:.12em] hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf] sm:px-8"
        type="submit"
      >
        <span className="copy-safe text-left">Envoyer à contact@nulll.club</span>
        <ArrowIcon />
      </button>
    </form>
  );
}
