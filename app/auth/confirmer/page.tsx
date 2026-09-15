import type { Metadata } from "next";
import { AccountShell } from "../../../components/account-shell";
import { ConfirmerLien } from "../../../components/auth/confirmer-lien";

export const metadata: Metadata = {
  title: "Confirmer mon adresse | NULLL.CLUB",
  robots: { index: false, follow: false },
  // Le jeton est dans le fragment, jamais transmis ; on ferme quand meme
  // l'en-tete Referer vers les liens de la page.
  referrer: "no-referrer"
};

/**
 * Arrivee des liens recus par e-mail. La page est statique et ne consomme
 * rien a l'ouverture : c'est le bouton qui valide le jeton.
 */
export default function ConfirmerPage() {
  return (
    <AccountShell
      benefits={[]}
      eyebrow="Espace membre"
      image="/assets/photos/apres-course-sol.webp"
      imageAlt="Un membre de NULLL.CLUB assis au sol après une sortie, médaille de finisher et clés posées à côté de ses chaussures"
      imagePosition="50% 66%"
      intro="Dernière étape avant ta première sortie."
      ticker="Rejoins le club · Aix-en-Provence"
      title="Un dernier"
      titleAccent="clic."
    >
      <ConfirmerLien />
    </AccountShell>
  );
}
