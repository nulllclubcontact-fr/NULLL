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

  return (
    <form className="grid gap-5 border-2 border-[#351815] bg-[#f6eadf] p-5 shadow-[8px_8px_0_#d96ab4] sm:p-7" onSubmit={handleSubmit}>
      <div>
        <p className="font-mono text-xs font-black uppercase text-[#d96ab4]">Message direct</p>
        <h2 className="mt-3 font-display text-[clamp(2.6rem,5vw,4.8rem)] uppercase leading-[0.94]">Ecris-nous.</h2>
      </div>

      <label className="grid gap-2 font-mono text-xs font-black uppercase">
        Ton email
        <input
          className="min-h-14 border-2 border-[#351815] bg-[#fff8ef] px-4 text-base font-bold outline-none focus:shadow-[0_0_0_4px_rgba(217,106,180,0.32)]"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>

      <label className="grid gap-2 font-mono text-xs font-black uppercase">
        Ton message
        <textarea
          className="min-h-40 resize-y border-2 border-[#351815] bg-[#fff8ef] px-4 py-3 text-base font-bold leading-snug outline-none focus:shadow-[0_0_0_4px_rgba(217,106,180,0.32)]"
          name="message"
          onChange={(event) => setMessage(event.target.value)}
          required
          value={message}
        />
      </label>

      <button className="group inline-flex min-h-14 items-center justify-between gap-4 border-2 border-[#351815] bg-[#351815] px-4 py-3 font-mono text-sm font-black uppercase text-[#f6eadf] transition hover:-translate-y-1 hover:bg-[#ffb000] hover:text-[#351815]" type="submit">
        Envoyer a contact@nulll.club
        <ArrowIcon />
      </button>
    </form>
  );
}
