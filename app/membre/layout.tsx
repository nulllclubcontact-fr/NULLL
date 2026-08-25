import type { ReactNode } from "react";

// Espace membre : pages de connexion et pages privees. Elles ne doivent pas
// apparaitre dans les resultats de recherche — le guide Google recommande
// `noindex` plutot qu'un Disallow robots.txt, car une URL bloquee au crawl
// peut quand meme etre indexee sans son contenu.
export const metadata = {
  robots: { index: false, follow: false }
};

export default function MembreLayout({ children }: { children: ReactNode }) {
  return children;
}
