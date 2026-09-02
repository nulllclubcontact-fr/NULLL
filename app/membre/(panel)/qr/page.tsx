import { redirect } from "next/navigation";

/**
 * Le QR permanent servait a se faire crediter des points chez un
 * partenaire. Le QR est desormais lie a une inscription — un par sortie,
 * affiche sur le tableau de bord — donc cette page n'a plus d'objet.
 */
export default function MemberQrRedirect() {
  redirect("/membre");
}
