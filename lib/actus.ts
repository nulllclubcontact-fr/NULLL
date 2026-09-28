import { DEPART } from "./rendez-vous";

/**
 * Les actus du club. Chaque entree reprend une publication deja faite
 * ailleurs (Strava, Instagram) pour qu'elle vive aussi sur le site :
 * Google indexe le site, pas le fil Strava. Rien d'invente ici : on ne
 * publie que ce qui a ete annonce, avec un lien vers l'original.
 */
export type Actu = {
  slug: string;
  titre: string;
  /** Date de publication, AAAA-MM-JJ. */
  date: string;
  /** Une ou deux phrases : carte d'accueil, meta description, JSON-LD. */
  resume: string;
  image: { src: string; alt: string };
  /** Photos du post d'origine, affichees en galerie sous le texte. */
  galerie?: Array<{ src: string; alt: string; largeur: number; hauteur: number }>;
  sections: Array<{ titre: string; paragraphes: string[] }>;
  source?: { label: string; url: string };
};

export const actus: Actu[] = [
  {
    slug: "bienvenue-social-run-samedi-aix",
    titre: "Bienvenue chez NULLL : le social run du samedi à Aix",
    date: "2026-09-28",
    resume:
      "Pas de chrono, pas de pression : chaque samedi à 8h30, on court ensemble 5 à 10 km à allure conversation, au départ du chemin de la Cible à Aix-en-Provence.",
    image: {
      src: "/assets/actus/bienvenue/01.webp",
      alt: "Photo de groupe des coureurs de NULLL.CLUB au départ, sous les arbres"
    },
    galerie: [
      { src: "/assets/actus/bienvenue/01.webp", alt: "Photo de groupe des coureurs de NULLL.CLUB au départ, sous les arbres", largeur: 1380, hauteur: 920 },
      { src: "/assets/actus/bienvenue/02.webp", alt: "Des coureuses et coureurs du club le long d’un mur, en pleine sortie", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/03.webp", alt: "Le groupe rassemblé à l’ombre avant de partir", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/04.webp", alt: "Deux coureuses arrivent sur un chemin de terre", largeur: 1067, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/05.webp", alt: "Les mains d’un DJ sur ses platines pendant l’après-run", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/06.webp", alt: "Un membre de l’équipe tend des canettes Bee Zen devant la table des boissons", largeur: 1067, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/07.webp", alt: "Trois membres du club posent après la course", largeur: 1600, hauteur: 1067 },
      { src: "/assets/actus/bienvenue/08.webp", alt: "Un coureur souriant reçoit une canette après la sortie", largeur: 1200, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/09.webp", alt: "Des coureurs sur le parking au retour du run", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/10.webp", alt: "Une coureuse ouvre sa canette après l’effort", largeur: 1200, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/11.webp", alt: "Une canette tendue à un membre du club en casquette", largeur: 1200, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/12.webp", alt: "Un coureur reçoit une Red Bull à l’arrivée", largeur: 1200, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/13.webp", alt: "Quatre membres du club, canettes en main", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/14.webp", alt: "Un coureur pose au milieu des arbres", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/15.webp", alt: "Le peloton du samedi sur un chemin ombragé", largeur: 1067, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/16.webp", alt: "Une coureuse en lunettes de soleil attrape une Red Bull", largeur: 1200, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/17.webp", alt: "Un coureur reçoit une canette au retour", largeur: 1200, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/18.webp", alt: "Deux coureurs font les pitres avec une Bee Zen", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/19.webp", alt: "Un membre du club en pleine discussion après la sortie", largeur: 1066, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Pas de chrono, pas de pression",
        paragraphes: [
          "Ici, pas de chrono ni de pression : chaque samedi à 8h30, on court ensemble 5 à 10 km à allure conversation.",
          "Tu peux venir seul : c’est justement pour ça qu’on court en groupe."
        ]
      },
      {
        titre: "Le départ",
        paragraphes: [`Rendez-vous au ${DEPART.nom.replace(/^Parking/, "parking")}, ${DEPART.repere}, à Aix-en-Provence.`]
      },
      {
        titre: "Comment venir",
        paragraphes: [
          "Sur Strava, clique sur « Je participe » dans l’événement « Social Run du samedi » du club NULLL CLUB pour recevoir les rappels.",
          "Et surtout, inscris-toi sur le site de NULLL : tu peux gagner des canettes, et même retrouver tes photos du run.",
          "Soyons nous. Soyons NULLL 🧡"
        ]
      }
    ],
    source: {
      label: "Voir le post sur Strava",
      url: "https://www.strava.com/clubs/2137443/posts/49521048"
    }
  }
];

/** Les plus recentes d'abord. */
export function listActus(): Actu[] {
  return [...actus].sort((a, b) => b.date.localeCompare(a.date));
}

export function getActu(slug: string): Actu | undefined {
  return actus.find((actu) => actu.slug === slug);
}

export function formaterDateActu(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(
    new Date(`${date}T12:00:00Z`)
  );
}
