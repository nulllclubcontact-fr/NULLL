import { redirect } from "next/navigation";

/**
 * L'historique listait les points gagnes chez les partenaires. Les points
 * ne sont pas ouverts aux membres pour l'instant : la page renvoie vers
 * l'historique des sorties, qui est ce qu'on vient y chercher aujourd'hui.
 * Les donnees restent en base, rien n'est perdu.
 */
export default function MemberHistoriqueRedirect() {
  redirect("/membre/sorties");
}
