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
  /** Pas-a-pas illustre, affiche sous les sections : la video du parcours puis une capture par etape. */
  tuto?: {
    titre: string;
    video?: { src: string; poster: string; description: string; duree: string };
    etapes: Array<{ titre: string; texte: string; image: { src: string; alt: string; largeur: number; hauteur: number } }>;
  };
  source?: { label: string; url: string };
  /** Boutons d'action en fin d'article (interne ou externe). */
  appels?: Array<{ label: string; href: string }>;
};

export const actus: Actu[] = [
  {
    slug: "quatrieme-social-run-nulll-club-aix",
    titre: "Quatrième social run de NULLL.CLUB à Aix : les photos",
    date: "2026-10-26",
    resume:
      "Samedi 24 octobre, quatrième social run de NULLL.CLUB à Aix-en-Provence. On a couru, on est restés, on a ri. Les photos sont là.",
    image: {
      src: "/assets/actus/quatrieme-run/01.webp",
      alt: "Des membres de NULLL.CLUB partagent le ravito après le quatrième social run à Aix-en-Provence"
    },
    galerie: [
      { src: "/assets/actus/quatrieme-run/01.webp", alt: "Des membres de NULLL.CLUB partagent le ravito après le quatrième social run à Aix-en-Provence", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/02.webp", alt: "Des coureuses et coureurs du club sur un sentier, en pleine sortie", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/03.webp", alt: "Le groupe file sur un chemin bordé d’une barrière en bois, sous les arbres", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/04.webp", alt: "Éclats de rire entre coureuses après le run", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/05.webp", alt: "Un coureur en maillot rose, tout sourire après la sortie", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/06.webp", alt: "Deux membres du club posent ensemble, bouteille d’eau à la main", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/07.webp", alt: "Une coureuse en sweat jaune raconte sa sortie au groupe", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/08.webp", alt: "Le groupe se retrouve sur la pelouse après la course", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/09.webp", alt: "Trois coureuses sourient à l’objectif après le run", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/10.webp", alt: "Une coureuse en gilet d’hydratation, au soleil, après la sortie", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/11.webp", alt: "Un membre du club en sweat gris, souriant dans le parc", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/12.webp", alt: "Une coureuse rit, canette dans une main, eau dans l’autre", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/13.webp", alt: "Un coureur en gilet bleu profite de l’après-run sous les arbres", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/14.webp", alt: "Un membre du club en casquette lève sa canette en riant", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/15.webp", alt: "Une coureuse assise à l’ombre d’un arbre, au calme après l’effort", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/16.webp", alt: "Discussions autour de la table des boissons après la course", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/17.webp", alt: "La pyramide de canettes Bee Zen du ravito", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/18.webp", alt: "Un membre de l’équipe prépare le ravito, bouteilles d’eau sur la table", largeur: 900, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Et de quatre",
        paragraphes: [
          "Samedi 24 octobre, NULLL.CLUB a couru son quatrième social run à Aix-en-Provence.",
          "Même principe que d’habitude : pas de chrono, une allure qui laisse parler, et personne ne repart tout de suite."
        ]
      },
      {
        titre: "Après la course",
        paragraphes: [
          "Le meilleur moment arrive souvent après : le ravito, les canettes, les discussions qui durent.",
          "Tu peux venir seul : c’est justement pour ça qu’on court en groupe."
        ]
      },
      {
        titre: "Le prochain",
        paragraphes: [
          `Un samedi sur deux à 8h30, au ${DEPART.nom.replace(/^Parking/, "parking")}, ${DEPART.repere}.`,
          "Inscris-toi sur le site : tu reçois ton QR code, et tu retrouves ensuite toutes les photos de ta sortie dans ton compte."
        ]
      }
    ],
    source: {
      label: "Voir le post sur Instagram",
      url: "https://www.instagram.com/p/De9ErDjCMWj/"
    },
    appels: [
      { label: "Voir les sorties", href: "/fr/runs" },
      { label: "Créer mon compte", href: "/membre/register" }
    ]
  },
  {
    slug: "romane-fournier-associee-nulll-club",
    titre: "Romane rejoint NULLL comme associée",
    date: "2026-10-26",
    resume:
      "Romane Fournier devient associée de NULLL.CLUB, le social run club d’Aix-en-Provence. Elle s’occupe du sport : la préparation des sorties et la recherche des tracés.",
    image: {
      src: "/assets/actus/bienvenue/15.webp",
      alt: "Le peloton de NULLL.CLUB sur un chemin ombragé d’Aix-en-Provence pendant le social run du samedi"
    },
    sections: [
      {
        titre: "On est trois",
        paragraphes: [
          "NULLL, c’était Tom et Tobias. C’est désormais Tom, Tobias et Romane.",
          "Romane devient associée du club, avec un rôle bien à elle."
        ]
      },
      {
        titre: "Le côté sport, c’est elle",
        paragraphes: [
          "Romane prend en main tout ce qui touche à la course : la préparation des sorties et la recherche des tracés.",
          "Les parcours que tu cours à Aix un samedi sur deux, c’est elle qui va les chercher, les tester et les choisir. Pour que chaque sortie reste faisable par tout le monde, à allure conversation."
        ]
      },
      {
        titre: "Viens la croiser",
        paragraphes: [
          "Le plus simple pour la rencontrer : venir courir. Rendez-vous au départ, un samedi sur deux à 8h30.",
          "Tu as un coin d’Aix à faire découvrir au club ? Dis-le-nous, elle prend."
        ]
      }
    ],
    appels: [
      { label: "Voir les sorties", href: "/fr/runs" },
      { label: "Le club", href: "/fr/a-propos" }
    ]
  },
  {
    slug: "telecharger-photos-social-run-aix",
    titre: "Les photos du run sont téléchargeables après chaque sortie",
    date: "2026-10-26",
    resume:
      "Après chaque social run à Aix-en-Provence, tes photos t’attendent dans ton compte NULLL. Trois clics pour les télécharger, une par une ou toutes d’un coup.",
    image: {
      src: "/assets/actus/bienvenue/07.webp",
      alt: "Trois membres de NULLL.CLUB posent après le social run du samedi à Aix-en-Provence"
    },
    sections: [
      {
        titre: "C’est en ligne",
        paragraphes: [
          "Tu as couru avec nous ? Les photos de la sortie sont dans ton compte, et tu peux les garder.",
          "Pas besoin de les chercher dans une story ou de les demander en message. Elles sont là, en bonne qualité, prêtes à partir sur ton téléphone."
        ]
      },
      {
        titre: "Qui y a accès",
        paragraphes: [
          "Seuls les inscrits de la sortie voient ses photos. Pas d’album public, pas de lien qui circule.",
          "Pas encore de compte ? Il est gratuit, et c’est lui qui t’inscrit aux prochains runs."
        ]
      }
    ],
    tuto: {
      titre: "Comment les télécharger",
      video: {
        src: "/assets/actus/telecharger-photos/parcours.mp4",
        poster: "/assets/actus/telecharger-photos/parcours.webp",
        description: "Le parcours en vidéo : de l’espace membre NULLL.CLUB jusqu’au téléchargement des photos d’une sortie.",
        duree: "PT8S"
      },
      etapes: [
        {
          titre: "Ouvre Mes sorties",
          texte: "Connecte-toi, puis touche Mes sorties dans la barre jaune de ton espace membre.",
          image: {
            src: "/assets/actus/telecharger-photos/etape-1.webp",
            alt: "Espace membre NULLL.CLUB sur mobile, l’onglet Mes sorties est mis en évidence",
            largeur: 720,
            hauteur: 1558
          }
        },
        {
          titre: "Choisis ta sortie",
          texte: "Dans Sorties passées, touche le bouton rose Photos à côté du run qui t’intéresse.",
          image: {
            src: "/assets/actus/telecharger-photos/etape-2.webp",
            alt: "Liste des sorties passées, le bouton Photos de la dernière sortie est mis en évidence",
            largeur: 720,
            hauteur: 1558
          }
        },
        {
          titre: "Télécharge",
          texte: "Tout télécharger récupère toutes les photos dans un seul fichier. Sous chaque photo, Télécharger la récupère seule.",
          image: {
            src: "/assets/actus/telecharger-photos/etape-3.webp",
            alt: "Page Les photos d’une sortie, le bouton Tout télécharger est mis en évidence",
            largeur: 720,
            hauteur: 1558
          }
        }
      ]
    },
    appels: [
      { label: "Mes photos", href: "/membre/sorties" },
      { label: "Créer mon compte", href: "/membre/register" }
    ]
  },
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
          "Un samedi sur deux, des Aixois se retrouvent pour courir, puis restent pour les gens.",
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
          "L’événement « Social Run du samedi · 8h30 », un samedi sur deux : clique sur « Je participe » pour recevoir les rappels.",
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
      "Pas de chrono, pas de pression : un samedi sur deux à 8h30, on court ensemble 5 à 10 km à allure conversation, au départ du chemin de la Cible à Aix-en-Provence.",
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
          "Ici, pas de chrono ni de pression : un samedi sur deux à 8h30, on court ensemble 5 à 10 km à allure conversation.",
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

/**
 * Actus epinglees sur l'accueil, dans cet ordre. Les autres suivent,
 * les plus recentes d'abord.
 */
export const EPINGLEES_ACCUEIL = ["quatrieme-social-run-nulll-club-aix", "romane-fournier-associee-nulll-club", "telecharger-photos-social-run-aix"];

export function listActusAccueil(nombre = 3): Array<Actu & { epinglee: boolean }> {
  const epinglees = EPINGLEES_ACCUEIL.flatMap((slug) => {
    const actu = getActu(slug);
    return actu ? [{ ...actu, epinglee: true }] : [];
  });
  const autres = listActus()
    .filter((actu) => !EPINGLEES_ACCUEIL.includes(actu.slug))
    .map((actu) => ({ ...actu, epinglee: false }));
  return [...epinglees, ...autres].slice(0, nombre);
}

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
