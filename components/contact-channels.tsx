"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "./ArrowIcon";

type Channel = {
  title: string;
  value: string;
  text: string;
  href: string;
};

/**
 * Ce qu'on colle vraiment dans le presse-papiers, pas le libelle affiche :
 * l'adresse pour un mail, le numero pour un tel, l'URL pour un profil.
 * Les quatre lignes en ont une — sinon la colonne d'action n'existait que
 * sur deux lignes et le bord droit partait en dents de scie.
 */
function valeurCopiable(channel: Channel) {
  if (channel.href.startsWith("mailto:")) return channel.href.slice("mailto:".length);
  if (channel.href.startsWith("tel:")) return channel.value;
  return channel.href;
}

type Etat = { cle: string; ok: boolean };

export function ContactChannels({ channels }: { channels: Channel[] }) {
  const [etat, setEtat] = useState<Etat | null>(null);
  const minuteur = useRef<number | null>(null);

  useEffect(() => () => {
    if (minuteur.current) window.clearTimeout(minuteur.current);
  }, []);

  async function copier(cle: string, texte: string) {
    let ok = true;
    try {
      await navigator.clipboard.writeText(texte);
    } catch {
      // Presse-papiers indisponible ou refuse (page non securisee,
      // permission). On le dit au lieu de ne rien faire : sinon le clic
      // reste sans effet visible et le visiteur reclique dans le vide.
      ok = false;
    }
    setEtat({ cle, ok });
    if (minuteur.current) window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => setEtat(null), 1800);
  }

  return (
    <ul className="border-b-2 border-[#351815] bg-[#ffb000] text-[#351815]">
      {channels.map((channel, index) => {
        const externe = channel.href.startsWith("http");
        const copiable = valeurCopiable(channel);
        const actif = etat?.cle === channel.title ? etat : null;

        return (
          <li className="flex items-stretch border-t-2 border-[#351815] first:border-t-0" key={channel.title}>
            <a
              className="contact-row-link group flex min-h-[7.5rem] min-w-0 flex-1 items-center gap-4 px-4 py-6 focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-[#351815] sm:gap-10 sm:px-8 xl:px-12"
              href={channel.href}
              rel={externe ? "noreferrer noopener" : undefined}
              target={externe ? "_blank" : undefined}
            >
              <span className="w-6 shrink-0 font-mono text-[.62rem] font-black uppercase tracking-[.16em] opacity-55 sm:w-12">
                0{index + 1}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[.62rem] font-black uppercase tracking-[.16em] opacity-55 [word-spacing:.18em]">
                  {channel.title}
                </span>
                <span className="contact-row-value copy-safe mt-2 block font-display text-[clamp(1.15rem,4vw,3rem)] uppercase leading-[.92] tracking-[-.03em]">
                  {channel.value}
                </span>
                <span className="contact-row-text block max-w-[56ch] text-base leading-relaxed opacity-80">{channel.text}</span>
              </span>

              <span className="contact-row-arrow shrink-0">
                <ArrowIcon />
              </span>
            </a>

            <button
                aria-label={`Copier ${channel.title.toLowerCase()} : ${copiable}`}
                className={`${actif ? `copy-done bg-[#351815] ${actif.ok ? "text-[#ffb000]" : "text-[#d96ab4]"}` : "bg-transparent"} w-[4.5rem] shrink-0 border-l-2 border-[#351815] font-mono text-[.58rem] font-black uppercase tracking-[.1em] sm:text-[.62rem] sm:tracking-[.14em] transition-colors hover:bg-[#351815] hover:text-[#ffb000] focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-[#351815] sm:w-32`}
              onClick={() => copier(channel.title, copiable)}
              type="button"
            >
              {actif ? (actif.ok ? "Copié" : "Échec") : "Copier"}
            </button>
          </li>
        );
      })}
      {/* Annonce le resultat aux lecteurs d'ecran : l'animation seule ne
          dit rien a qui ne voit pas la pastille changer. */}
      <li aria-live="polite" className="sr-only">
        {etat ? (etat.ok ? `${etat.cle} copié dans le presse-papiers` : `Copie impossible, sélectionne ${etat.cle} à la main`) : ""}
      </li>
    </ul>
  );
}
