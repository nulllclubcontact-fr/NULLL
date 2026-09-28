/**
 * Partenaires affiches dans le bandeau de l'accueil. Uniquement des
 * partenaires confirmes par le club : ne jamais en ajouter un "pour faire
 * plein" (regle du projet : aucun partenariat invente).
 * Logos : fichiers officiels des marques, dans public/assets/partenaires.
 */
export type PartenaireVisible = {
  nom: string;
  logo: string;
  /** Largeur / hauteur du fichier, pour garder les proportions. */
  ratio: number;
  /** Agrandissement par rapport a la hauteur commune, pour un logo au texte fin. */
  echelle?: number;
  url: string;
};

export const partenairesVisibles: PartenaireVisible[] = [
  { nom: "Red Bull", logo: "/assets/partenaires/red-bull.svg", ratio: 607 / 147, url: "https://www.redbull.com/fr-fr/" },
  { nom: "Bee Zen", logo: "/assets/partenaires/bee-zen.png", ratio: 764 / 320, echelle: 1.4, url: "https://www.beezendrinks.com/" }
];
