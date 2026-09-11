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
