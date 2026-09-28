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
  /** Boutons d'action en fin d'article (interne ou externe). */
  appels?: Array<{ label: string; href: string }>;
};

export const actus: Actu[] = [
  {
    slug: "photos-du-run-dans-ton-compte",
    titre: "Les photos du run, directement dans ton compte NULLL",
    date: "2026-09-28",
    resume:
      "Après chaque sortie, les photos arrivent dans ton espace membre. Réservées aux inscrits, à télécharger une par une ou d’un coup.",
    image: {
      src: "/assets/actus/bienvenue/12.webp",
      alt: "Un coureur reçoit une canette à l’arrivée d’une sortie NULLL.CLUB"
    },
    sections: [
      {
        titre: "Ce qui change",
        paragraphes: [
          "Après chaque sortie, les photos prises pendant le run sont déposées dans ton espace membre.",
          "Plus besoin de les chercher dans une story ou de les demander en message : elles t’attendent dans ton compte."
        ]
      },
      {
        titre: "Réservées aux inscrits",
        paragraphes: [
          "Seuls les inscrits de la sortie voient ses photos. Elles ne sont pas publiques : pas d’album ouvert à tous, pas de lien qui circule.",
          "C’est ton inscription à la sortie qui t’ouvre l’accès."
        ]
      },
      {
        titre: "Comment les récupérer",
        paragraphes: [
          "Dans Mes sorties, un bouton Photos apparaît sur chaque sortie passée.",
          "Tu les télécharges une par une, ou toutes d’un coup dans un seul fichier. Et quand elles sont en ligne, on te prévient par mail."
        ]
      }
    ],
    appels: [
      { label: "Créer mon compte", href: "/membre/register" },
      { label: "Voir les sorties", href: "/fr/runs" }
    ]
  },
  {
    slug: "pourquoi-creer-ton-compte-nulll",
    titre: "Pourquoi créer ton compte NULLL",
    date: "2026-09-28",
    resume:
      "T’inscrire aux sorties, recevoir ton QR code, retrouver ton historique et les photos du run : tout passe par ton compte. Et il est gratuit.",
    image: {
      src: "/assets/actus/bienvenue/13.webp",
      alt: "Quatre membres de NULLL.CLUB, canettes en main après la sortie"
    },
    sections: [
      {
        titre: "T’inscrire aux sorties",
        paragraphes: [
          "Tu choisis ta sortie et tu t’inscris en un clic. De notre côté, on sait combien on sera samedi.",
          "Ton QR code arrive aussitôt par mail."
        ]
      },
      {
        titre: "Ton QR code",
        paragraphes: [
          "Au départ, l’équipe scanne ton QR code : c’est ton pointage.",
          "Plus de mail sous la main ? Il est aussi dans ton espace membre."
        ]
      },
      {
        titre: "Tes sorties et tes photos",
        paragraphes: [
          "Tes sorties à venir et passées, au même endroit.",
          "Et après chaque run auquel tu étais inscrit, les photos à télécharger."
        ]
      },
      {
        titre: "Ton profil, si tu veux",
        paragraphes: [
          "Un numéro pour te prévenir si une sortie change au dernier moment, une personne à contacter en cas de pépin. Tout est facultatif.",
          "Le compte est gratuit, comme les sorties."
        ]
      }
    ],
    appels: [
      { label: "Créer mon compte", href: "/membre/register" },
      { label: "Me connecter", href: "/membre/login" }
    ]
  },
  {
    slug: "partenaires-nulll-club",
    titre: "Nos partenaires, et comment le devenir",
    date: "2026-09-28",
    resume:
      "Red Bull et Bee Zen soutiennent NULLL.CLUB. Tu as une marque ou un commerce à Aix-en-Provence ? Voici comment rejoindre le club.",
    image: {
      src: "/assets/actus/bienvenue/06.webp",
      alt: "Un membre de l’équipe tend des canettes devant la table des boissons après le run"
    },
    sections: [
      {
        titre: "Ils sont avec nous",
        paragraphes: [
          "Red Bull et Bee Zen soutiennent le club. On les retrouve après les sorties, canette en main.",
          "Merci à eux : sans partenaires, pas de boissons à l’arrivée."
        ]
      },
      {
        titre: "Pourquoi s’associer au club",
        paragraphes: [
          "Chaque samedi, des Aixois se retrouvent pour courir, puis restent pour les gens.",
          "Un partenaire du club, c’est une marque ou un commerce qui fait partie de ce moment, pas un logo de plus sur une banderole."
        ]
      },
      {
        titre: "Pour les commerces d’Aix",
        paragraphes: [
          "Tu tiens un commerce à Aix ? Parlons d’une façon de se retrouver après les sorties.",
          "Les partenaires ont leur espace pro sur le site."
        ]
      },
      {
        titre: "Comment devenir partenaire",
        paragraphes: [
          "Écris-nous depuis la page Contact ou à contact@nulll.club : présente ta marque ou ton commerce, et ce que tu imagines avec le club.",
          "On te répond."
        ]
      }
    ],
    appels: [
      { label: "Devenir partenaire", href: "/fr/contact" },
      { label: "contact@nulll.club", href: "mailto:contact@nulll.club" }
    ]
  },
  {
    slug: "rejoins-le-club-strava",
    titre: "Rejoins le club NULLL sur Strava",
    date: "2026-09-28",
    resume:
      "Le club a son espace Strava : l’événement du samedi, les rappels, les publications et les sorties de la bande. Rejoins-le.",
    image: {
      src: "/assets/actus/bienvenue/15.webp",
      alt: "Le peloton de NULLL.CLUB sur un chemin ombragé d’Aix-en-Provence"
    },
    sections: [
      {
        titre: "Le club sur Strava",
        paragraphes: ["NULLL CLUB · Social Run Aix est sur Strava, à l’adresse strava.com/clubs/nulllclub. Rejoindre le club est gratuit."]
      },
      {
        titre: "Ce que tu y trouves",
        paragraphes: [
          "L’événement « Social Run du samedi · 8h30 », chaque semaine : clique sur « Je participe » pour recevoir les rappels.",
          "Les publications du club, les sorties des membres et le classement de la semaine."
        ]
      },
      {
        titre: "Strava et le site, les deux",
        paragraphes: [
          "Strava, c’est pour suivre le club et partager tes sorties.",
          "L’inscription aux runs, ton QR code et les photos, c’est sur le site. Inscris-toi aux deux."
        ]
      }
    ],
    appels: [
      { label: "Rejoindre le club sur Strava", href: "https://www.strava.com/clubs/nulllclub" },
      { label: "Voir les sorties", href: "/fr/runs" }
    ]
  },
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
