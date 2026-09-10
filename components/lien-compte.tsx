"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "../lib/supabase/client";
import { hasSupabasePublicEnv } from "../lib/supabase/config";

const DECONNECTE = { label: "Se connecter", href: "/identification" };
const CONNECTE = { label: "Mon compte", href: "/membre" };

/**
 * Le seul morceau de la barre qui depend de la session.
 *
 * Il est isole dans un composant client pour que l'en-tete, lui, reste
 * rendu sur le serveur : lire la session dans SiteHeader rendrait les
 * trente-deux pages dynamiques, et on perdrait la generation statique
 * pour un libelle.
 *
 * Le rendu de depart est « Se connecter », qui est l'etat juste pour un
 * visiteur qui arrive pour la premiere fois. Si une session existe, le
 * libelle bascule sur « Mon compte » apres l'hydratation. Une personne
 * connectee voit donc brievement l'ancien libelle ; l'inverse (afficher
 * « Mon compte » par defaut) tromperait tous les nouveaux venus, ce qui
 * est le cas le plus frequent.
 *
 * getSession lit le cookie pose par @supabase/ssr, sans appel reseau.
 * onAuthStateChange couvre la deconnexion : le libelle repasse tout seul
 * a « Se connecter » sans recharger la page.
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
  const [connecte, setConnecte] = useState(false);
  const estFige = Boolean(fige);

  useEffect(() => {
    // Sans variables d'environnement publiques, createBrowserClient jette.
    // La barre doit survivre a ca : on reste sur « Se connecter ».
    if (estFige || !hasSupabasePublicEnv()) return;

    const supabase = createSupabaseBrowserClient();
    let vivant = true;

    supabase.auth.getSession().then(({ data }) => {
      if (vivant) setConnecte(Boolean(data.session));
    });

    const { data } = supabase.auth.onAuthStateChange((_evenement, session) => {
      if (vivant) setConnecte(Boolean(session));
    });

    return () => {
      vivant = false;
      data.subscription.unsubscribe();
    };
  }, [estFige]);

  const porte = fige ?? (connecte ? CONNECTE : DECONNECTE);

  return (
    <Link aria-current={actif ? "page" : undefined} className={className} href={porte.href}>
      {porte.label}
    </Link>
  );
}
