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
  sections: Array<{ titre: string; paragraphes: string[] }>;
  source?: { label: string; url: string };
};

export const actus: Actu[] = [
  {
    slug: "bienvenue-social-run-samedi-aix",
    titre: "Bienvenue chez NULLL CLUB : le social run du samedi à Aix",
    date: "2026-09-28",
    resume:
      "Chaque samedi à 8h30, on court ensemble 5 à 6 km à allure conversation, au départ du chemin de la Cible à Aix-en-Provence.",
    image: {
      src: "/assets/photos/runs-crew.webp",
      alt: "Deux membres de NULLL.CLUB en tenue de course dans une rue d’Aix-en-Provence"
    },
    sections: [
      {
        titre: "Le rendez-vous",
        paragraphes: [
          `Chaque samedi à 8h30, on se retrouve au ${DEPART.nom.replace(/^Parking/, "parking")}, ${DEPART.repere}, pour courir ensemble dans Aix-en-Provence.`,
          "5 à 6 km, à une allure qui permet de discuter. C’est gratuit et ouvert à tous."
        ]
      },
      {
        titre: "Pas de chrono, pas de pression",
        paragraphes: [
          "Ici, personne ne compte les secondes. On court à allure conversation, et personne n’est laissé derrière.",
          "Tu peux venir seul : c’est justement pour ça qu’on court en groupe."
        ]
      },
      {
        titre: "Comment venir",
        paragraphes: [
          "Inscris-toi à la sortie de ton choix sur la page Sorties du site : tu reçois ton QR code par email.",
          "Sur Strava, rejoins le club NULLL CLUB et clique sur « Je participe » dans l’événement « Social Run du samedi · 8h30 » pour recevoir les rappels.",
          "On vient pour courir. On revient pour les gens."
        ]
      }
    ],
    source: {
      label: "Publié sur Strava",
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
