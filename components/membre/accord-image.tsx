"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { repondreAccordImage, type AccordImageState } from "../../app/membre/accord-image-actions";

const initial: AccordImageState = {};

/**
 * Fenetre pour les membres inscrits avant l'accord photos (consent_image
 * encore vide). Elle revient a chaque visite tant qu'ils n'ont pas repondu ;
 * « Plus tard » la ferme seulement pour cette visite. Les deux reponses
 * pesent pareil : un oui arrache n'est pas un consentement.
 */
export function AccordImage({ prenom }: { prenom: string | null }) {
  const [etat, repondre, enCours] = useActionState(repondreAccordImage, initial);
  const [fermee, setFermee] = useState(false);
  const dialogue = useRef<HTMLDivElement>(null);
  const visible = !etat.fini && !fermee;

  useEffect(() => {
    if (!visible) return;
    const precedent = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogue.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      precedent?.focus();
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-[#3A1A18]/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]" role="presentation">
      <div
        aria-describedby="accord-image-texte"
        aria-labelledby="accord-image-titre"
        aria-modal="true"
        className="flex max-h-[calc(100dvh-2rem-env(safe-area-inset-bottom))] w-full max-w-xl outline-none flex-col overflow-hidden border-2 border-[#773331] bg-[#F1EDE9] text-[#773331] shadow-[10px_10px_0_#EBA0CD]"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setFermee(true);
          }
          if (event.key !== "Tab") return;
          const controles = dialogue.current?.querySelectorAll<HTMLElement>("button:not([disabled])");
          if (!controles?.length) return;
          const premier = controles[0];
          const dernier = controles[controles.length - 1];
          if (event.shiftKey && (document.activeElement === premier || document.activeElement === dialogue.current)) {
            event.preventDefault();
            dernier.focus();
          } else if (!event.shiftKey && document.activeElement === dernier) {
            event.preventDefault();
            premier.focus();
          }
        }}
        ref={dialogue}
        role="dialog"
        tabIndex={-1}
      >
        <div className="shrink-0 border-b-2 border-[#773331] bg-[#EBA0CD] px-5 py-4 sm:px-7">
          <p className="font-mono text-xs font-black uppercase tracking-[.16em]">Une question{prenom ? `, ${prenom}` : ""}</p>
          <h2 className="mt-2 font-display text-[clamp(1.9rem,6vw,2.6rem)] uppercase leading-[1.12]" id="accord-image-titre">
            Photos et vidéos
          </h2>
        </div>

        <form action={repondre} className="flex min-h-0 flex-col">
          <div className="grid gap-4 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
            <p className="text-base leading-relaxed" id="accord-image-texte">
              On prend des photos et des vidéos pendant les sorties, pour le site et les réseaux de NULLL.CLUB. Tu es
              d’accord pour y apparaître ? C’est facultatif, ça ne change rien à ta venue, et tu pourras changer d’avis
              à tout moment dans Mon profil.
            </p>

            {etat.error ? (
              <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-mono text-sm font-black uppercase" role="alert">
                {etat.error}
              </p>
            ) : null}
          </div>

          <div className="grid shrink-0 gap-2 border-t-2 border-[#773331] px-3 py-3 sm:grid-cols-2 sm:px-7">
            <button className="primary-button justify-center" disabled={enCours} name="image" type="submit" value="oui">
              Oui, ça me va
            </button>
            <button className="primary-button justify-center" disabled={enCours} name="image" type="submit" value="non">
              Non, pas de photo
            </button>
            <button
              className="secondary-link justify-center sm:col-span-2"
              disabled={enCours}
              onClick={() => setFermee(true)}
              type="button"
            >
              Plus tard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
