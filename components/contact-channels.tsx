"use client";

import { useEffect, useRef, useState } from "react";

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
  // Une ligne par canal : aucune case vide, quel que soit leur nombre.
  return (
    <ul className="grid gap-3">
      {channels.map((channel, index) => {
        const externe = channel.href.startsWith("http");
        const copiable = valeurCopiable(channel);
        const actif = etat?.cle === channel.title ? etat : null;

        return (
          <li className="flex flex-col rounded-[2px] border border-white/10 bg-[#1E1A21] sm:flex-row sm:items-stretch" key={channel.title}>
            <a
              className="group grid flex-1 gap-3 p-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FFC531] sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center sm:gap-6 sm:p-6 lg:grid-cols-[170px_minmax(0,1fr)_minmax(0,1fr)]"
              href={channel.href}
              rel={externe ? "noreferrer noopener" : undefined}
              target={externe ? "_blank" : undefined}
            >
              <span><span className={`st ${couleurs[index % couleurs.length]}`}>{channel.title}</span></span>
              <span className="copy-safe block font-display text-[clamp(1.5rem,2.2vw,2.1rem)] uppercase leading-[1.08] transition-colors group-hover:text-[#FFC531]">
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
              <span className="block text-[15px] leading-relaxed text-white/70 sm:col-start-2 lg:col-start-auto">{channel.text}</span>
            </a>
            <button
              aria-label={`Copier ${channel.title.toLowerCase()} : ${copiable}`}
              className={`flex min-h-12 items-center justify-center gap-3 border-t border-white/10 px-6 font-mono text-xs font-bold uppercase tracking-[.12em] transition-colors hover:bg-white/5 hover:text-[#FFC531] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FFC531] sm:w-36 sm:border-l sm:border-t-0 ${actif ? (actif.ok ? "text-[#FFC531]" : "text-[#E8459E]") : "text-white/70"}`}
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
