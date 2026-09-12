import { SiteHeader } from "../../components/site-shell";
import { getSiteCopy } from "../../lib/site-content";

/**
 * Affiche tout de suite pendant que le serveur verifie la session : sans
 * lui, un clic sur « Mon compte » ou « Se connecter » ne changeait rien a
 * l'ecran le temps de la reponse, et donnait une impression de lag.
 * Next le precharge avec le lien : il apparait des le clic.
 */
export default function ChargementMembre() {
  return (
    <div className="min-h-dvh bg-[#F1EDE9] text-[#773331]" aria-busy="true">
      <SiteHeader copy={getSiteCopy("fr")} current="identification" locale="fr" pathname="/membre" />
      <div className="h-[3.75rem] border-b-2 border-[#773331] bg-[#FFB200]" />
      <div className="border-b-2 border-[#773331] bg-[#773331]">
        <div className="shell grid gap-4 py-10 lg:py-14">
          <span className="h-3 w-28 bg-[#F1EDE9]/30 motion-safe:animate-pulse" />
          <span className="h-14 w-72 max-w-full bg-[#F1EDE9]/30 motion-safe:animate-pulse sm:h-20" />
          <span className="h-4 w-80 max-w-full bg-[#F1EDE9]/20 motion-safe:animate-pulse" />
        </div>
      </div>
      <div className="shell grid gap-5 py-10 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <span className="h-64 border-2 border-[#773331]/20 bg-[#773331]/5 motion-safe:animate-pulse" key={i} />
        ))}
      </div>
      <p className="sr-only" role="status">
        Chargement…
      </p>
    </div>
  );
}
