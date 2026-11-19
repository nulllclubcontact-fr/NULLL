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
 * Toutes les lignes en ont une — sinon la colonne d'action n'existait que
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

  const couleurs = ["st-pink", "st-yellow", "st-blue", "st-lime", "st-cream"];
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {channels.map((channel, index) => {
        const externe = channel.href.startsWith("http");
        const copiable = valeurCopiable(channel);
        const actif = etat?.cle === channel.title ? etat : null;

        return (
          <li className="flex flex-col rounded-[2px] border border-white/10 bg-[#1E1A21]" key={channel.title}>
            <a
              className="group flex flex-1 flex-col items-start gap-4 p-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FFC531] sm:p-8"
              href={channel.href}
              rel={externe ? "noreferrer noopener" : undefined}
              target={externe ? "_blank" : undefined}
            >
              <span className={`st ${couleurs[index % couleurs.length]}`}>{channel.title}</span>
              <span className="copy-safe block font-display text-[clamp(1.6rem,2.6vw,2.4rem)] uppercase leading-[1.08] transition-colors group-hover:text-[#FFC531]">
                {/* L'adresse e-mail peut passer a la ligne apres l'arobase. */}
                {channel.value.includes("@") && !channel.value.startsWith("@") ? (
                  <>
                    {channel.value.slice(0, channel.value.indexOf("@") + 1)}
                    <wbr />
                    {channel.value.slice(channel.value.indexOf("@") + 1)}
                  </>
                ) : (
                  channel.value
                )}
              </span>
              <span className="block max-w-[52ch] text-base leading-relaxed text-white/75">{channel.text}</span>
            </a>
            <button
              aria-label={`Copier ${channel.title.toLowerCase()} : ${copiable}`}
              className={`flex min-h-12 items-center justify-between border-t border-white/10 px-6 font-mono text-xs font-bold uppercase tracking-[.12em] transition-colors hover:bg-white/5 hover:text-[#FFC531] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FFC531] sm:px-8 ${actif ? (actif.ok ? "text-[#FFC531]" : "text-[#E8459E]") : "text-white/70"}`}
              onClick={() => copier(channel.title, copiable)}
              type="button"
            >
              <span>{actif ? (actif.ok ? "Copié" : "Échec de la copie") : "Copier"}</span>
              <ArrowIcon />
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
