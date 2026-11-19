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
  /** Rubrique affichee en etiquette au-dessus du titre (facon magazine). */
  rubrique?: string;
  /**
   * Sections du recit. Dans les paragraphes, **texte** est surligne en
   * etiquette, [texte](url) devient un lien. La citation, facultative, sort
   * en grand apres la section.
   */
  sections: Array<{ titre: string; paragraphes: string[]; citation?: string }>;
  /** Pas-a-pas illustre, affiche sous les sections : la video du parcours puis une capture par etape. */
  tuto?: {
    titre: string;
    video?: { src: string; poster: string; description: string; duree: string };
    etapes: Array<{ titre: string; texte: string; image: { src: string; alt: string; largeur: number; hauteur: number } }>;
  };
  source?: { label: string; url: string };
  /** Partenaire de l'actu : mention « Avec la participation de » et logo en tete d'article. */
  avec?: { nom: string; logo: string; ratio: number; url: string; blanchir?: boolean; hauteur?: number };
  /** Boutons d'action en fin d'article (interne ou externe). */
  appels?: Array<{ label: string; href: string }>;
};

export const actus: Actu[] = [
  {
    slug: "red-bull-partenaire-nulll-club",
    rubrique: "Partenaires",
    titre: "C’est officiel : Red Bull court avec nous",
    date: "2026-11-19",
    resume:
      "Les canettes que tu attrapes à l’arrivée ne sont pas là par hasard. Red Bull est désormais partenaire de Nulll Club. Ce que ça change pour tes samedis.",
    image: {
      src: "/assets/actus/red-bull/01.webp",
      alt: "Un membre de Nulll Club, tout sourire, tend une canette Red Bull vers l’objectif"
    },
    galerie: [
      { src: "/assets/actus/red-bull/01.webp", alt: "Un membre de Nulll Club, tout sourire, tend une canette Red Bull vers l’objectif", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/red-bull/02.webp", alt: "Une canette Red Bull en main, au départ d’une sortie", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/red-bull/03.webp", alt: "Un coureur pose avec sa Red Bull sous les arbres", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/red-bull/04.webp", alt: "Les packs Red Bull sur la table du ravito, au parc", largeur: 1600, hauteur: 900 }
    ],
    sections: [
      {
        titre: "C’est officiel",
        paragraphes: [
          "Red Bull est désormais **partenaire de Nulll Club**.",
          "Tu les as sûrement déjà croisées : les canettes Red Bull sont au ravito depuis le tout premier social run, le 26 septembre."
        ],
        citation: "À l’arrivée, il y a des gens, des sourires, et des canettes."
      },
      {
        titre: "Ce que ça change pour toi",
        paragraphes: [
          "Après la sortie, on reste. Et Red Bull est là, **au ravito**, pendant que tout le monde discute.",
          "Le reste ne bouge pas : les sorties restent **gratuites** et ouvertes à tous les niveaux."
        ]
      },
      {
        titre: "Merci",
        paragraphes: [
          "Merci à [Red Bull](https://www.redbull.com/fr-fr/) de soutenir le club. Rendez-vous au prochain samedi pour trinquer."
        ]
      }
    ],
    avec: { nom: "Red Bull", logo: "/assets/partenaires/red-bull.svg", ratio: 607 / 147, url: "https://www.redbull.com/fr-fr/", blanchir: true },
    appels: [
      { label: "Voir les sorties", href: "/fr/runs" },
      { label: "Devenir partenaire", href: "/fr/partenaires" }
    ]
  },
  {
    slug: "bee-zen-partenaire-nulll-club",
    rubrique: "Partenaires",
    titre: "La pyramide de canettes, c’était eux : Bee Zen devient partenaire",
    date: "2026-11-19",
    resume:
      "Tu l’as vue au ravito du 24 octobre, cette pyramide de canettes. Bee Zen est désormais partenaire de Nulll Club. On vous raconte.",
    image: {
      src: "/assets/actus/bee-zen/01.webp",
      alt: "La pyramide de canettes Bee Zen montée au ravito, sous les arbres"
    },
    galerie: [
      { src: "/assets/actus/bee-zen/01.webp", alt: "La pyramide de canettes Bee Zen montée au ravito, sous les arbres", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bee-zen/04.webp", alt: "Deux membres du club font les pitres avec une Bee Zen", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/bee-zen/02.webp", alt: "La pyramide Bee Zen vue d’en bas", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bee-zen/05.webp", alt: "Un coureur tend sa Bee Zen vers l’objectif", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/bee-zen/03.webp", alt: "Une canette Bee Zen sur la table du ravito", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bee-zen/06.webp", alt: "Un membre du club pose avec deux Bee Zen devant la table du ravito", largeur: 1066, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "C’est officiel",
        paragraphes: [
          "**Bee Zen** est désormais **partenaire de Nulll Club**.",
          "Ses canettes sont au ravito depuis le tout premier social run, le 26 septembre."
        ],
        citation: "Une pyramide de canettes, et tout le monde reste."
      },
      {
        titre: "La pyramide",
        paragraphes: [
          "Au **quatrième social run**, le 24 octobre, les canettes Bee Zen ont fini en **pyramide** sur la table du ravito.",
          "On la monte, on la démonte, et pendant ce temps, personne ne repart."
        ]
      },
      {
        titre: "Merci",
        paragraphes: [
          "Merci à [Bee Zen](https://www.beezendrinks.com/) de soutenir le club. On se retrouve samedi, canette en main."
        ]
      }
    ],
    avec: { nom: "Bee Zen", logo: "/assets/partenaires/bee-zen.png", ratio: 764 / 320, url: "https://www.beezendrinks.com/", blanchir: true, hauteur: 52 },
    appels: [
      { label: "Voir les sorties", href: "/fr/runs" },
      { label: "Devenir partenaire", href: "/fr/partenaires" }
    ]
  },
  {
    slug: "equipe-nulll-les-bacchantes-aix-2026",
    rubrique: "Événement",
    titre: "On a couru pour plus grand que nous",
    date: "2026-11-16",
    resume:
      "Dimanche 15 novembre, la team NULLL a troqué le samedi tranquille pour une course qui compte vraiment : Les Bacchantes, à Aix. Avec dix de nos membres au départ. On vous raconte pourquoi celle-là n’était pas comme les autres.",
    image: {
      src: "/assets/actus/parc-de-la-torse/depart.webp",
      alt: "Le groupe de Nulll Club part courir sur un chemin du parc de la Torse"
    },
    sections: [
      {
        titre: "Un dimanche pas comme les autres",
        paragraphes: [
          "D’habitude, NULLL, c’est le samedi matin, l’allure conversation et le ravito qui dure. Ce **dimanche 15 novembre**, on a changé de jour, et un peu de raison de courir.",
          "La team NULLL était au départ des **Bacchantes**, à Aix-en-Provence. Et pas seule : les dix places gagnées au [jeu concours](/fr/actu/jeu-concours-bacchantes-aix-ynov-campus) avec [Aix Ynov Campus](https://www.ynov.com/campus/aix-en-provence) étaient pour ce matin-là."
        ],
        citation: "Courir ensemble, on sait faire. Courir pour quelque chose, c’est encore mieux."
      },
      {
        titre: "Pourquoi celle-là",
        paragraphes: [
          "Les Bacchantes, c’est bien plus qu’une course. C’est un événement solidaire qui sensibilise aux **cancers masculins**, notamment au cancer de la prostate.",
          "Une cause qui nous tient à cœur. Et qui colle à ce qu’on répète depuis le premier run : le sport n’est qu’un prétexte. Là, le prétexte servait à quelque chose."
        ]
      },
      {
        titre: "Et maintenant ?",
        paragraphes: [
          "On retourne à nos samedis. Les prochaines dates sont sur la page Sorties : c’est **gratuit**, ouvert à tous les niveaux, et tu peux venir seul."
        ]
      }
    ],
    appels: [
      { label: "Voir les sorties", href: "/fr/runs" },
      { label: "Le jeu concours", href: "/fr/actu/jeu-concours-bacchantes-aix-ynov-campus" }
    ]
  },
  {
    slug: "jeu-concours-bacchantes-aix-ynov-campus",
    rubrique: "Jeu concours",
    titre: "Dix places offertes, un tirage au sort : le lundi où nos membres ont gagné",
    date: "2026-11-09",
    resume:
      "Un partenariat avec Aix Ynov Campus, un post Instagram, un lundi de tirage. À la clé : dix places pour Les Bacchantes, toutes parties chez des membres de NULLL. Les coulisses d’un jeu concours.",
    image: {
      src: "/assets/actus/parc-de-la-torse/rires-groupe.webp",
      alt: "Des membres de Nulll Club éclatent de rire après une sortie"
    },
    sections: [
      {
        titre: "Le deal",
        paragraphes: [
          "L’idée tenait en une phrase : avec [Aix Ynov Campus](https://www.ynov.com/campus/aix-en-provence), faire gagner **dix places** pour Les Bacchantes, la course solidaire du dimanche 15 novembre à Aix-en-Provence.",
          "Les Bacchantes, c’est un événement qui sensibilise aux cancers masculins, notamment au cancer de la prostate. Une course qu’on avait envie de courir, et de faire courir."
        ],
        citation: "Les dix places sont parties chez des membres de NULLL."
      },
      {
        titre: "Les règles du jeu",
        paragraphes: [
          "Pour tenter ta chance, il fallait être abonné à [@ynovaix](https://www.instagram.com/ynovaix/) et à [@nulll.club](https://www.instagram.com/nulll.club/), liker le post, commenter, et identifier deux amis.",
          "Simple, rapide, et le meilleur moyen de faire découvrir le club à des gens qui ne nous connaissaient pas encore."
        ]
      },
      {
        titre: "Lundi 9 novembre",
        paragraphes: [
          "Le tirage au sort a eu lieu le **lundi 9 novembre**. Les dix places sont toutes parties chez des membres de NULLL.",
          "Bravo à eux, et merci à [Aix Ynov Campus](https://www.ynov.com/campus/aix-en-provence) pour le partenariat. La suite s’est jouée le dimanche suivant, au départ des Bacchantes."
        ]
      }
    ],
    avec: { nom: "Aix Ynov Campus", logo: "/assets/partenaires/ynov.svg", ratio: 395 / 149, url: "https://www.ynov.com/campus/aix-en-provence" },
    source: { label: "Le post du jeu concours sur Instagram", url: "https://www.instagram.com/p/DfFcQDeCOf2/" },
    appels: [
      { label: "Les Bacchantes, on y était", href: "/fr/actu/equipe-nulll-les-bacchantes-aix-2026" },
      { label: "Voir les sorties", href: "/fr/runs" }
    ]
  },
  {
    slug: "duo-nulll-new-york",
    rubrique: "Voyage",
    titre: "Tobias et Tom ont couru New York (et Aix a dû attendre)",
    date: "2026-11-09",
    resume:
      "Central Park en automne, Times Square, la Cinquième Avenue au pas de course. Le samedi 7 novembre, les deux fondateurs du club ont échangé le parc de la Torse contre Manhattan, avec Eliott dans les valises. Carnet de route.",
    image: {
      src: "/assets/actus/new-york/03.webp",
      alt: "Selfie de Tobias dans une rue de New York, avec Tom et Eliott"
    },
    galerie: [
      { src: "/assets/actus/new-york/01.webp", alt: "Selfie de Tobias et Eliott sous un pont, à New York", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/new-york/02.webp", alt: "Une avenue de Midtown sous le soleil, entre les gratte-ciel", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/new-york/03.webp", alt: "Selfie de Tobias dans une rue de New York, avec Tom et Eliott", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/new-york/04.webp", alt: "Pause à un carrefour de Manhattan, entre deux runs", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/new-york/05.webp", alt: "Times Square, avec une voiture du NYPD", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/new-york/06.webp", alt: "Photo souvenir dans Central Park", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/new-york/07.webp", alt: "Une allée de Central Park sous les arbres d’automne", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/new-york/08.webp", alt: "Selfie de Tobias dans Central Park", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/new-york/09.webp", alt: "Une pause au pied des tours de Manhattan", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/new-york/10.webp", alt: "Devant la cathédrale Saint-Patrick, sur la Cinquième Avenue", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/new-york/11.webp", alt: "En contre-jour devant la cathédrale Saint-Patrick", largeur: 900, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Changer de terrain de jeu",
        paragraphes: [
          "Le **samedi 7 novembre**, Tobias et Tom, les deux fondateurs de NULLL, n’étaient pas au départ à Aix. Ils étaient à **New York**, avec **Eliott**, un ami qui donne parfois un coup de main au club.",
          "Pas de dossard, pas de course officielle. Juste des runs en ville, pour le plaisir de courir ailleurs, et de voir ce que ça fait de mettre des baskets dans une ville qui ne dort jamais."
        ],
        citation: "Pas de chrono, pas de dossard : juste New York, au pas de course."
      },
      {
        titre: "Ce qu’ils ont vu",
        paragraphes: [
          "**Central Park** sous les arbres d’automne, **Times Square** et ses écrans, la **cathédrale Saint-Patrick** sur la Cinquième Avenue.",
          "Et entre deux runs, des selfies, des pauses aux carrefours, et la même envie qu’à Aix : courir, puis prendre le temps."
        ]
      },
      {
        titre: "Et Aix, pendant ce temps ?",
        paragraphes: [
          "Avec les fondateurs de l’autre côté de l’Atlantique, il n’y a pas eu de social run à Aix ce samedi-là. On ne recommencera pas souvent.",
          "Les sorties ont repris au rythme habituel : les prochaines dates sont sur la page **Sorties**."
        ]
      }
    ],
    appels: [{ label: "Voir les sorties", href: "/fr/runs" }]
  },
  {
    slug: "cinquieme-social-run-parc-de-la-torse",
    rubrique: "Social run",
    titre: "Cinquième social run : on a changé de décor (et d’heure)",
    date: "2026-10-31",
    resume:
      "Samedi 31 octobre, NULLL a posé ses baskets au parc de la Torse. Nouveau spot, nouvel horaire, même esprit. Pourquoi ce coin d’Aix nous va si bien.",
    image: {
      src: "/assets/actus/parc-de-la-torse/peloton.webp",
      alt: "Le peloton de Nulll Club dans le parc de la Torse, à Aix-en-Provence"
    },
    sections: [
      {
        titre: "Nouveau spot",
        paragraphes: [
          "Pour le **cinquième social run**, on a changé de point de départ : rendez-vous au **parc de la Torse**, à Aix-en-Provence.",
          "Et on a décalé l’horaire : **rendez-vous à 9h, départ à 9h30**. De quoi laisser la ville se réveiller avant nous."
        ],
        citation: "Pas de chrono, pas de pression. Personne n’est laissé derrière."
      },
      {
        titre: "Le même esprit",
        paragraphes: [
          "Le décor change, le reste non. On court ensemble, à allure conversation, et personne n’est laissé derrière.",
          "Chaque sortie annonce son lieu de départ : vérifie toujours la date que tu choisis sur la page **Sorties**."
        ]
      }
    ],
    appels: [
      { label: "Voir les sorties", href: "/fr/runs" },
      { label: "Le club", href: "/fr/communaute" }
    ]
  },
  {
    slug: "quatrieme-social-run-nulll-club-aix",
    rubrique: "Social run",
    titre: "On est venus courir. On est restés pour tout le reste",
    date: "2026-10-26",
    resume:
      "Samedi 24 octobre, quatrième social run à Aix. Une pyramide de canettes, un ravito qui déborde, des discussions qui ont duré plus longtemps que la course. Dix-huit photos pour comprendre pourquoi on revient.",
    image: {
      src: "/assets/actus/quatrieme-run/01.webp",
      alt: "Des membres de Nulll Club partagent le ravito après le quatrième social run à Aix-en-Provence"
    },
    galerie: [
      { src: "/assets/actus/quatrieme-run/01.webp", alt: "Des membres de Nulll Club partagent le ravito après le quatrième social run à Aix-en-Provence", largeur: 1600, hauteur: 900 },
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
          "Samedi **24 octobre**, Nulll Club a couru son **quatrième social run** à Aix-en-Provence.",
          "Même recette que d’habitude : pas de chrono, une allure qui laisse parler, et personne qui repart tout de suite."
        ],
        citation: "On vient pour courir. On revient pour les gens."
      },
      {
        titre: "Le vrai moment, c’est après",
        paragraphes: [
          "Le meilleur arrive souvent quand on s’arrête. Le **ravito**, les canettes, la pyramide qu’on monte et qu’on démonte, les conversations qui s’étirent.",
          "Tu peux venir seul : c’est justement pour ça qu’on court en groupe."
        ]
      },
      {
        titre: "Le prochain",
        paragraphes: [
          "Un samedi sur deux, **rendez-vous à 9h30, départ à 10h**. Le lieu est annoncé avec chaque date.",
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
    rubrique: "Le club",
    titre: "Romane, la nouvelle tête de NULLL (et celle qui choisit tes parcours)",
    date: "2026-10-26",
    resume:
      "NULLL, c’était Tobias et Tom. C’est désormais Tobias, Tom et Romane. Rencontre avec l’associée qui s’occupe de tout ce qui touche à la course.",
    image: {
      src: "/assets/actus/bienvenue/15.webp",
      alt: "Le peloton de Nulll Club sur un chemin ombragé d’Aix-en-Provence pendant le social run du samedi"
    },
    sections: [
      {
        titre: "On est trois",
        paragraphes: [
          "NULLL, c’était **Tobias et Tom**. C’est désormais **Tobias, Tom et Romane**.",
          "Romane devient associée du club, avec un rôle bien à elle."
        ],
        citation: "Les parcours que tu cours le samedi, c’est elle qui les choisit."
      },
      {
        titre: "Le côté sport, c’est elle",
        paragraphes: [
          "Romane prend en main tout ce qui touche à la course : **la préparation des sorties** et **la recherche des tracés**.",
          "Les parcours que tu cours à Aix, c’est elle qui va les chercher, les tester et les choisir. Pour que chaque sortie reste faisable par tout le monde, à allure conversation."
        ]
      },
      {
        titre: "Viens la croiser",
        paragraphes: [
          "Le plus simple pour la rencontrer : venir courir. Rendez-vous au départ, un samedi sur deux.",
          "Tu as un coin d’Aix à faire découvrir au club ? Dis-le-nous, **elle prend**."
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
    rubrique: "Ton compte",
    titre: "Tes photos du run t’attendent. Trois clics, promis",
    date: "2026-10-26",
    resume:
      "Fini de fouiller les stories pour te retrouver. Après chaque social run, tes photos arrivent dans ton compte NULLL, en bonne qualité. Mode d’emploi.",
    image: {
      src: "/assets/actus/bienvenue/07.webp",
      alt: "Trois membres de Nulll Club posent après le social run du samedi à Aix-en-Provence"
    },
    sections: [
      {
        titre: "C’est en ligne",
        paragraphes: [
          "Tu as couru avec nous ? Les photos de la sortie sont **dans ton compte**, et tu peux les garder.",
          "Pas besoin de les chercher dans une story ou de les demander en message. Elles sont là, en bonne qualité, prêtes à partir sur ton téléphone."
        ]
      },
      {
        titre: "Qui y a accès",
        paragraphes: [
          "Seuls **les inscrits de la sortie** voient ses photos. Pas d’album public, pas de lien qui circule.",
          "Pas encore de compte ? Il est **gratuit**, et c’est lui qui t’inscrit aux prochains runs."
        ]
      }
    ],
    tuto: {
      titre: "Comment les télécharger",
      video: {
        src: "/assets/actus/telecharger-photos/parcours.mp4",
        poster: "/assets/actus/telecharger-photos/parcours.webp",
        description: "Le parcours en vidéo : de l’espace membre Nulll Club jusqu’au téléchargement des photos d’une sortie.",
        duree: "PT8S"
      },
      etapes: [
        {
          titre: "Ouvre Mes sorties",
          texte: "Connecte-toi, puis touche Mes sorties dans la barre jaune de ton espace membre.",
          image: {
            src: "/assets/actus/telecharger-photos/etape-1.webp",
            alt: "Espace membre Nulll Club sur mobile, l’onglet Mes sorties est mis en évidence",
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
    rubrique: "Ton compte",
    titre: "Fini de chasser tes photos en story",
    date: "2026-09-28",
    resume:
      "Tu cours, on photographie, et les clichés t’attendent dans ton espace membre. Réservés aux inscrits, à télécharger en un geste. Ce qui change pour toi.",
    image: {
      src: "/assets/actus/bienvenue/12.webp",
      alt: "Un coureur reçoit une canette à l’arrivée d’une sortie Nulll Club"
    },
    sections: [
      {
        titre: "Ce qui change",
        paragraphes: [
          "Après chaque sortie, les photos prises pendant le run sont déposées **dans ton espace membre**.",
          "Plus besoin de les chercher dans une story ou de les demander en message : elles t’attendent dans ton compte."
        ]
      },
      {
        titre: "Réservées aux inscrits",
        paragraphes: [
          "Seuls les inscrits de la sortie voient ses photos. **Pas d’album ouvert à tous**, pas de lien qui circule.",
          "C’est ton inscription à la sortie qui t’ouvre l’accès."
        ]
      },
      {
        titre: "Comment les récupérer",
        paragraphes: [
          "Dans **Mes sorties**, un bouton Photos apparaît sur chaque sortie passée.",
          "Tu les télécharges une par une, ou toutes d’un coup dans un seul fichier. Et quand elles sont en ligne, **on te prévient par mail**."
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
    rubrique: "Ton compte",
    titre: "Le compte NULLL, ou comment ne plus jamais rater un samedi",
    date: "2026-09-28",
    resume:
      "T’inscrire en un clic, recevoir ton QR code, retrouver tes sorties et tes photos. Tout passe par ton compte, et il ne coûte rien. Tour du propriétaire.",
    image: {
      src: "/assets/actus/bienvenue/13.webp",
      alt: "Quatre membres de Nulll Club, canettes en main après la sortie"
    },
    sections: [
      {
        titre: "T’inscrire aux sorties",
        paragraphes: [
          "Tu choisis ta sortie et tu t’inscris **en un clic**. De notre côté, on sait combien on sera samedi.",
          "Ton QR code arrive aussitôt par mail."
        ],
        citation: "Le compte est gratuit, comme les sorties."
      },
      {
        titre: "Ton QR code",
        paragraphes: [
          "Au départ, l’équipe scanne ton **QR code** : c’est ton pointage.",
          "Plus de mail sous la main ? Il est aussi dans ton espace membre."
        ]
      },
      {
        titre: "Tes sorties et tes photos",
        paragraphes: [
          "Tes sorties à venir et passées, au même endroit.",
          "Et après chaque run auquel tu étais inscrit, **les photos à télécharger**."
        ]
      },
      {
        titre: "Ton profil, si tu veux",
        paragraphes: [
          "Un numéro pour te prévenir si une sortie change au dernier moment, une personne à contacter en cas de pépin. **Tout est facultatif.**",
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
    rubrique: "Partenaires",
    titre: "Red Bull, Bee Zen… et pourquoi pas toi ?",
    date: "2026-09-28",
    resume:
      "Deux marques remplissent déjà notre ravito. On cherche les prochaines : commerces d’Aix, marques qui ont envie d’être là quand les gens se retrouvent. Ce qu’on propose, et comment nous écrire.",
    image: {
      src: "/assets/actus/bienvenue/06.webp",
      alt: "Un membre de l’équipe tend des canettes devant la table des boissons après le run"
    },
    sections: [
      {
        titre: "Ils sont avec nous",
        paragraphes: [
          "**Red Bull** et **Bee Zen** soutiennent le club. On les retrouve après les sorties, canette en main.",
          "Merci à eux : sans partenaires, pas de boissons à l’arrivée."
        ],
        citation: "Pas un logo de plus sur une banderole : une marque qui fait partie du moment."
      },
      {
        titre: "Pourquoi s’associer au club",
        paragraphes: [
          "Un samedi sur deux, des Aixois se retrouvent pour courir, puis **restent pour les gens**.",
          "Un partenaire du club, c’est une marque ou un commerce qui fait partie de ce moment, pas un logo de plus sur une banderole."
        ]
      },
      {
        titre: "Pour les commerces d’Aix",
        paragraphes: [
          "Tu tiens un commerce à Aix ? Parlons d’une façon de se retrouver **après les sorties**.",
          "Les partenaires ont leur espace pro sur le site."
        ]
      },
      {
        titre: "Comment devenir partenaire",
        paragraphes: [
          "Écris-nous depuis la page Contact ou à **contact@nulll.club** : présente ta marque ou ton commerce, et ce que tu imagines avec le club.",
          "On te répond."
        ]
      }
    ],
    appels: [
      { label: "Devenir partenaire", href: "/fr/partenaires" },
      { label: "contact@nulll.club", href: "mailto:contact@nulll.club" }
    ]
  },
  {
    slug: "rejoins-le-club-strava",
    rubrique: "Communauté",
    titre: "Sur Strava, le club ne s’arrête jamais",
    date: "2026-09-28",
    resume:
      "Le samedi, on court ensemble. Le reste de la semaine, on se suit sur Strava : l’événement du samedi, les rappels, les sorties de la bande. Pourquoi tu devrais nous rejoindre là-bas aussi.",
    image: {
      src: "/assets/actus/bienvenue/15.webp",
      alt: "Le peloton de Nulll Club sur un chemin ombragé d’Aix-en-Provence"
    },
    sections: [
      {
        titre: "Le club sur Strava",
        paragraphes: [
          "**NULLL CLUB · Social Run Aix** est sur Strava, à l’adresse strava.com/clubs/nulllclub. Rejoindre le club est **gratuit**."
        ],
        citation: "Strava pour se suivre. Le site pour courir avec nous."
      },
      {
        titre: "Ce que tu y trouves",
        paragraphes: [
          "L’événement « Social Run du samedi » : clique sur **« Je participe »** pour recevoir les rappels.",
          "Les publications du club, les sorties des membres et le classement de la semaine."
        ]
      },
      {
        titre: "Strava et le site, les deux",
        paragraphes: [
          "Strava, c’est pour suivre le club et partager tes sorties.",
          "L’inscription aux runs, ton QR code et les photos, c’est **sur le site**. Inscris-toi aux deux."
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
    rubrique: "Le début",
    titre: "Pas de chrono, pas de pression : bienvenue chez NULLL",
    date: "2026-09-28",
    resume:
      "Tout a commencé comme ça : un samedi matin à Aix, des inconnus, quelques kilomètres à allure conversation, et l’envie de recommencer. Le manifeste du social run, en photos.",
    image: {
      src: "/assets/actus/bienvenue/01.webp",
      alt: "Photo de groupe des coureurs de Nulll Club au départ, sous les arbres"
    },
    galerie: [
      { src: "/assets/actus/bienvenue/01.webp", alt: "Photo de groupe des coureurs de Nulll Club au départ, sous les arbres", largeur: 1380, hauteur: 920 },
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
          "Ici, **pas de chrono ni de pression** : un samedi sur deux à 9h30, on court ensemble 5 à 10 km à allure conversation.",
          "Tu peux **venir seul** : c’est justement pour ça qu’on court en groupe."
        ],
        citation: "Le sport n’est qu’un prétexte. Soyons nous, soyons NULLL."
      },
      {
        titre: "Le départ",
        paragraphes: [
          `Rendez-vous au ${DEPART.nom.replace(/^Parking/, "parking")}, ${DEPART.repere}, à Aix-en-Provence.`
        ]
      },
      {
        titre: "Comment venir",
        paragraphes: [
          "Sur Strava, clique sur « Je participe » dans l’événement « Social Run du samedi » du club Nulll Club pour recevoir les rappels.",
          "Et surtout, **inscris-toi sur le site** de NULLL : tu peux gagner des canettes, et même retrouver tes photos du run.",
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
// Les trois actus de l'accueil, dans cet ordre (sans mention « epinglee »).
export const EPINGLEES_ACCUEIL: string[] = ["red-bull-partenaire-nulll-club", "bee-zen-partenaire-nulll-club", "equipe-nulll-les-bacchantes-aix-2026"];

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
