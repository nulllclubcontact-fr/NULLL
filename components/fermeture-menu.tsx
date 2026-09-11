"use client";

import { useEffect, useRef } from "react";

/**
 * Le menu mobile est un <details> natif : il s'ouvre au clavier sans aide,
 * mais restait ouvert a Echap, apres un clic dehors ou sur un lien. Ce
 * repere invisible, pose dedans, lui apprend a se refermer et rend le
 * focus au bouton « Menu ».
 */
export function FermetureMenu() {
  const repere = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const menu = repere.current?.closest("details");
    if (!menu) return;

    const fermer = (rendreFocus: boolean) => {
      if (!menu.open) return;
      menu.open = false;
      if (rendreFocus) menu.querySelector("summary")?.focus();
    };

    const touche = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") fermer(true);
    };

    const clic = (evenement: MouseEvent) => {
      const cible = evenement.target as Element | null;
      if (!cible) return;
      if (!menu.contains(cible) || cible.closest("a")) fermer(false);
    };

    document.addEventListener("keydown", touche);
    document.addEventListener("click", clic);
    return () => {
      document.removeEventListener("keydown", touche);
      document.removeEventListener("click", clic);
    };
  }, []);

  return <span hidden ref={repere} />;
}
