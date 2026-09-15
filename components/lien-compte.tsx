"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const DECONNECTE = { label: "Se connecter", href: "/identification" };
const CONNECTE = { label: "Mon compte", href: "/membre" };

// Cookie de session pose par @supabase/ssr : « sb-<projet>-auth-token »,
// decoupe en « .0 », « .1 »… quand il est long.
const COOKIE_SESSION = /(?:^|;\s*)sb-[^=;]+-auth-token(?:\.0)?=/;

function sessionPresente() {
  return COOKIE_SESSION.test(document.cookie);
}

function sansAbonnement() {
  return () => {};
}

/**
 * Le seul morceau de la barre qui depend de la session.
 *
 * Il est isole dans un composant client pour que l'en-tete, lui, reste
 * rendu sur le serveur : lire la session dans SiteHeader rendrait les
 * trente-deux pages dynamiques, et on perdrait la generation statique
 * pour un libelle.
 *
 * Le rendu de depart est « Se connecter », l'etat juste pour un visiteur
 * qui arrive pour la premiere fois ; il bascule sur « Mon compte » apres
 * l'hydratation si un cookie de session existe.
 *
 * On lit la presence du cookie au lieu d'ouvrir le client Supabase : ce
 * client pesait 68 Ko compresses (260 Ko bruts) sur chaque page publique,
 * pour un simple libelle. Le lien n'ouvre aucun droit : /membre reverifie
 * la session sur le serveur et renvoie a la connexion si elle a expire.
 * Chaque page remonte l'en-tete, donc le libelle suit une deconnexion.
 */
export function LienCompte({
  actif,
  className,
  /** Libelle impose par les espaces prives, qui savent deja qui est la. */
  fige
}: {
  actif: boolean;
  className: string;
  fige?: { label: string; href: string };
}) {
  const connecte = useSyncExternalStore(sansAbonnement, sessionPresente, () => false);
  const porte = fige ?? (connecte ? CONNECTE : DECONNECTE);

  return (
    <Link aria-current={actif ? "page" : undefined} className={className} href={porte.href}>
      {porte.label}
    </Link>
  );
}
