/**
 * Le point de depart habituel du club. Une seule source : il etait ecrit a
 * la main dans une douzaine d'endroits, et faux dans tous.
 * Une sortie precise peut en annoncer un autre, lu en base.
 */
export const DEPART = {
  nom: "Parking du chemin de la Cible",
  repere: "près du lycée Émile Zola",
  adresse: "Parking du chemin de la Cible, près du lycée Émile Zola, Aix-en-Provence",
  /** Parking public releve sur OpenStreetMap (way 248421512). */
  latitude: 43.5096,
  longitude: 5.4611
} as const;

/**
 * Prochaine sortie annoncee a la main, pour le compte a rebours de la page
 * Sorties tant qu'aucune sortie n'est publiee en base. Une sortie publiee
 * dans l'admin prend toujours le dessus. Passee la date, le compte a
 * rebours disparait de lui-meme.
 */
export const SORTIE_ANNONCEE = {
  iso: "2026-12-01T09:30:00+01:00",
  libelle: "Mardi 1er décembre · 9h30"
} as const;
