import type { ReactNode } from "react";

/**
 * Conteneur de l'accueil.
 *
 * Il portait un controleur de defilement de 130 lignes qui epinglait la
 * scene d'ouverture et pilotait quatre panneaux au doigt. L'intro tient
 * desormais en une affiche : la page reste dans le flux normal et n'a
 * plus besoin de rien.
 */
export function HomeJourney({ children }: { children: ReactNode }) {
  return <main className="home-journey" id="home-main">{children}</main>;
}
