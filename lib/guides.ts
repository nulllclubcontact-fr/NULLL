/**
 * Guides locaux de Nulll Club (SEO et GEO) : courir, rencontrer du monde,
 * sortir a Aix-en-Provence. Rien d'invente : les faits sur le club viennent
 * du site, ceux sur Aix sont des reperes publics et durables (pas d'adresse
 * de bar ni d'horaire qui change chaque saison).
 *
 * Dans les paragraphes : **texte** est mis en avant, [texte](url) est un lien.
 */
import type { PhotoMagazine, SectionMagazine } from "../components/article-magazine";

export type Guide = {
  slug: string;
  /** Adresse de la page : les trois premiers guides gardent leur ancienne URL. */
  chemin: string;
  rubrique: string;
  /** Titre accrocheur, affiche en H1. */
  titre: string;
  /** Balise title (60 caracteres environ). */
  seoTitle: string;
  description: string;
  /** Chapo sous le titre. */
  resume: string;
  /** Reponses directes en tete d'article (lisibles par les moteurs IA). */
  enBref: string[];
  image: { src: string; alt: string };
  photos: PhotoMagazine[];
  sections: SectionMagazine[];
  faq: Array<{ q: string; a: string }>;
  /** Guides a lire ensuite (slugs). */
  liens: string[];
  datePublication: string;
  dateMiseAJour: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "courir-a-aix-en-provence",
    chemin: "/fr/courir-a-aix-en-provence",
    rubrique: "Courir à Aix",
    titre: "Courir à Aix-en-Provence : le guide pour s’y mettre (et ne plus lâcher)",
    seoTitle: "Courir à Aix-en-Provence : parcours, horaires, groupes",
    description:
      "Courir à Aix-en-Provence : où aller, à quelle heure partir, comment gérer la chaleur et le mistral, et où trouver un groupe gratuit le samedi.",
    resume:
      "Des parcs en plein centre, la Sainte-Victoire à l’horizon, du soleil presque toute l’année : Aix est faite pour courir. Encore faut-il savoir où, quand, et avec qui. Voici tout ce qu’on aurait aimé savoir avant notre premier footing ici.",
    enBref: [
      "En ville, le parc Jourdan et le parc de la Torse sont les deux spots les plus simples pour un footing.",
      "Hors de la ville, le plateau de Bibémus, les barrages de Bimont et Zola et la Sainte-Victoire offrent du trail.",
      "De mai à septembre, cours tôt le matin ou en fin de journée : la chaleur monte vite à Aix.",
      "Pour courir en groupe gratuitement, Nulll Club donne rendez-vous un samedi sur deux à 9h30, départ 10h."
    ],
    image: { src: "/assets/guides/couvertures/courir-a-aix-en-provence.webp", alt: "Le peloton du club court sur une route ombragée, le long d’un mur" },
    photos: [
      { src: "/assets/actus/quatrieme-run/03.webp", alt: "Le groupe file sur un chemin bordé d’une barrière en bois, sous les arbres", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/parc-de-la-torse/peloton.webp", alt: "Le peloton du club longe une barrière en bois au parc de la Torse", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/bienvenue/15.webp", alt: "Le peloton du samedi sur un chemin ombragé", largeur: 1067, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/08.webp", alt: "Le groupe se retrouve sur la pelouse après la course", largeur: 1600, hauteur: 900 }
    ],
    sections: [
      {
        titre: "Pourquoi Aix est une ville à courir",
        paragraphes: [
          "Aix-en-Provence coche toutes les cases d’une ville de coureurs : un **centre compact** qu’on traverse à pied, des **parcs ombragés** à quelques minutes, et des chemins de campagne dès qu’on sort de la ville. Le tout avec la Sainte-Victoire en toile de fond.",
          "Le climat aide aussi. Il pleut peu, l’hiver reste doux, et on peut courir dehors presque toute l’année. Le revers de la médaille, c’est l’été : il faut apprendre à composer avec la chaleur.",
          "Et c’est une ville jeune, avec beaucoup d’étudiants et de nouveaux arrivants. Résultat : il y a toujours quelqu’un pour courir avec toi, à condition de savoir où le trouver."
        ],
        citation: "À Aix, le plus dur n’est pas de trouver où courir. C’est de trouver avec qui."
      },
      {
        titre: "Les meilleurs spots en ville",
        paragraphes: [
          "Le **parc Jourdan** est le plus grand parc du centre. C’est le point de départ le plus simple si tu habites en ville : quelques tours pour un footing de semaine, une reprise en douceur, ou des fractionnés sur ses allées.",
          "Le **parc de la Torse** suit le ruisseau du même nom, à l’est du centre. On y court sur des chemins de terre, à l’ombre des arbres, et c’est l’un des terrains de jeu préférés de [Nulll Club](/fr/run-club-aix-en-provence).",
          "Tôt le matin, remonter le **Cours Mirabeau** et se perdre dans les ruelles du vieil Aix avant l’arrivée des terrasses reste un classique. Pour une liste complète, lis notre guide [Où courir à Aix-en-Provence](/fr/guide/ou-courir-a-aix-en-provence)."
        ]
      },
      {
        titre: "Sortir de la ville : le terrain des trailers",
        paragraphes: [
          "Dès qu’on quitte Aix vers l’est, le décor change. Le **plateau de Bibémus**, cher à Cézanne, offre des chemins caillouteux et des couleurs ocre. Plus loin, les sentiers autour des **barrages de Bimont et Zola** alternent montées et descentes au-dessus de l’eau.",
          "La **Sainte-Victoire** est le grand terrain de jeu de la région. Ses sentiers sont magnifiques mais exigeants : prévois de l’eau, de bonnes chaussures, et vérifie toujours les conditions d’accès, car l’accès aux massifs peut être restreint en été à cause du risque d’incendie."
        ]
      },
      {
        titre: "Chaleur et mistral : à quelle heure courir",
        paragraphes: [
          "De mai à septembre, la règle est simple : **pars tôt**. Avant 9h ou après 19h, la ville est plus fraîche, l’ombre plus longue, et ton corps te dira merci. Emporte toujours de l’eau, même pour une sortie courte.",
          "L’autre particularité, c’est le **mistral**. Ce vent du nord peut souffler fort plusieurs jours d’affilée. Il rafraîchit en été, mais il rend les sorties plus dures : commence face au vent pour finir avec lui dans le dos.",
          "En hiver, les matinées peuvent être fraîches, mais les journées ensoleillées sont nombreuses. C’est souvent la meilleure saison pour courir à Aix."
        ]
      },
      {
        titre: "Courir seul ou en groupe ?",
        paragraphes: [
          "Courir seul, c’est pratique. Mais c’est aussi le meilleur moyen de lâcher au bout de trois semaines. Avoir **un rendez-vous fixe** et des gens qui t’attendent change tout.",
          "C’est pour ça qu’on a créé Nulll Club : un **run club gratuit** à Aix, un samedi sur deux, à une allure qui permet de discuter. Rendez-vous à **9h30, départ 10h**, pour 5 à 6 km, et personne n’est laissé derrière. Les dates sont sur la page [Sorties](/fr/runs)."
        ],
        citation: "Un rendez-vous fixe et des gens qui t’attendent : c’est ça qui fait tenir l’habitude."
      }
    ],
    faq: [
      { q: "Où courir à Aix-en-Provence quand on habite le centre ?", a: "Le parc Jourdan est le plus simple : il est en plein centre et ombragé. Le parc de la Torse, un peu plus à l’est, offre des chemins de terre le long du ruisseau." },
      { q: "À quelle heure courir à Aix en été ?", a: "Tôt le matin, avant 9h, ou en fin de journée, après 19h. La chaleur monte vite à Aix de mai à septembre, et il faut toujours emporter de l’eau." },
      { q: "Existe-t-il un club de course gratuit à Aix-en-Provence ?", a: "Oui. Nulll Club organise un social run gratuit un samedi sur deux à Aix : rendez-vous à 9h30, départ à 10h, pour 5 à 6 km à allure conversation. Il suffit de créer un compte et de s’inscrire à la sortie." },
      { q: "Peut-on courir sur la Sainte-Victoire ?", a: "Oui, ses sentiers sont très prisés des traileurs, mais exigeants. Vérifie les conditions d’accès avant de partir : en été, l’accès aux massifs peut être limité à cause du risque d’incendie." }
    ],
    liens: ["ou-courir-a-aix-en-provence", "commencer-la-course-a-pied", "run-club-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "run-club-aix-en-provence",
    chemin: "/fr/run-club-aix-en-provence",
    rubrique: "Run club",
    titre: "Run club à Aix-en-Provence : pourquoi tout le monde s’y met (et comment nous rejoindre)",
    seoTitle: "Run club à Aix-en-Provence : gratuit, le samedi | Nulll Club",
    description:
      "Un run club gratuit à Aix-en-Provence : Nulll Club court un samedi sur deux, 9h30, 5 à 6 km à allure conversation. Comment ça marche et comment venir.",
    resume:
      "Le run club, c’est le nouveau rendez-vous des villes. Pas de chrono, pas de licence, juste des gens qui courent ensemble et restent pour discuter. À Aix, c’est Nulll Club. On t’explique le concept, le déroulé d’un samedi, et comment venir la première fois.",
    enBref: [
      "Nulll Club est un run club gratuit à Aix-en-Provence, ouvert à tous les niveaux.",
      "On court un samedi sur deux : rendez-vous 9h30, départ 10h, au parking du chemin de la Cible.",
      "La sortie fait 5 à 6 km à allure conversation, et personne n’est laissé derrière.",
      "Pour venir, il suffit de créer un compte gratuit et de s’inscrire à la sortie : tu reçois un QR code."
    ],
    image: { src: "/assets/guides/couvertures/run-club-aix-en-provence.webp", alt: "Les membres du club se retrouvent autour de la table avant la sortie" },
    photos: [
      { src: "/assets/actus/bienvenue/02.webp", alt: "Des coureuses et coureurs du club le long d’un mur, en pleine sortie", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/16.webp", alt: "Discussions autour de la table des boissons après la course", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/09.webp", alt: "Trois coureuses sourient à l’objectif après le run", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/bienvenue/13.webp", alt: "Quatre membres du club, canettes en main", largeur: 1066, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Un run club, c’est quoi exactement ?",
        paragraphes: [
          "Un **run club**, c’est un groupe de personnes qui se donnent rendez-vous pour courir ensemble, à heure fixe, sans compétition. Pas de licence, pas de classement, pas de chrono obligatoire.",
          "La différence avec un club d’athlétisme classique, c’est l’objectif. Ici, on ne prépare pas un record : on vient **rencontrer du monde**, bouger, et passer un bon moment. La course est un prétexte."
        ],
        citation: "Le sport n’est qu’un prétexte. Soyons nous, soyons NULLL."
      },
      {
        titre: "Nulll Club, le run club d’Aix",
        paragraphes: [
          "Nulll Club est une **association** créée en 2026 à Aix-en-Provence par Tobias et Tom, rejoints ensuite par Romane, qui prépare les sorties et choisit les parcours.",
          "Le principe tient en une phrase : un **social run gratuit**, un samedi sur deux, ouvert à tous les niveaux. Tu peux venir seul : c’est justement pour ça qu’on court en groupe."
        ]
      },
      {
        titre: "Un samedi type, minute par minute",
        paragraphes: [
          "**9h30** : on se retrouve au parking du chemin de la Cible, près du lycée Émile Zola. L’équipe scanne ton QR code à l’arrivée.",
          "**10h** : départ. On court **5 à 6 km** à une allure qui permet de parler. Les plus rapides attendent les autres, et personne ne finit seul.",
          "**Après la course** : c’est là que tout se joue. Ravito, canettes de nos partenaires, discussions qui durent plus longtemps que la sortie. Certains samedis, il y a même de la musique."
        ]
      },
      {
        titre: "Pour qui ?",
        paragraphes: [
          "Pour **les débutants** qui n’osent pas courir seuls. Pour ceux qui **reprennent** après une pause. Pour les **nouveaux arrivants** à Aix qui veulent rencontrer du monde. Et pour les coureurs réguliers qui cherchent une sortie facile et sympa en fin de semaine.",
          "Le seul prérequis : pouvoir courir une demi-heure à allure tranquille. Si ce n’est pas encore ton cas, lis notre guide [Commencer la course à pied](/fr/guide/commencer-la-course-a-pied)."
        ]
      },
      {
        titre: "Comment venir la première fois",
        paragraphes: [
          "Crée ton **compte gratuit** sur le site, choisis ta date sur la page [Sorties](/fr/runs) et inscris-toi. Ton QR code arrive aussitôt par mail.",
          "Viens en tenue de sport, avec de quoi boire. Après chaque sortie, les photos du run t’attendent dans ton compte. Une question avant de venir ? Écris-nous depuis la page [Contact](/fr/contact)."
        ]
      }
    ],
    faq: [
      { q: "Le run club Nulll Club est-il gratuit ?", a: "Oui, totalement. Il faut seulement créer un compte gratuit sur le site et s’inscrire à la sortie choisie." },
      { q: "Quand et où a lieu le run club ?", a: "Un samedi sur deux, rendez-vous à 9h30 et départ à 10h, au parking du chemin de la Cible, près du lycée Émile Zola, à Aix-en-Provence. Chaque sortie annonce son point de départ sur la page Sorties." },
      { q: "Quel niveau faut-il pour venir ?", a: "Aucun niveau minimum. On court 5 à 6 km à allure conversation et personne n’est laissé derrière." },
      { q: "Peut-on venir seul ?", a: "Oui. Le run club est justement pensé pour rencontrer du monde : tu peux venir seul et repartir avec des gens." },
      { q: "Faut-il une licence ou un certificat médical ?", a: "Non, le run club n’est pas une compétition. Il suffit de s’inscrire à la sortie sur le site." }
    ],
    liens: ["rencontrer-des-gens-a-aix-en-provence", "commencer-la-course-a-pied", "nouveau-a-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "commencer-la-course-a-pied",
    chemin: "/fr/guide/commencer-la-course-a-pied",
    rubrique: "Débuter",
    titre: "Commencer la course à pied : le plan simple pour passer du canapé aux 5 km",
    seoTitle: "Commencer la course à pied : plan débutant en 8 semaines",
    description:
      "Débuter la course à pied sans se blesser : alterner marche et course, courir lentement, bien s’équiper, et un plan de 8 semaines pour tenir 30 minutes.",
    resume:
      "Tu as envie de courir, mais tu t’essouffles au bout de deux minutes ? C’est normal, et ça se règle. Le secret tient en trois mots : lentement, régulièrement, à plusieurs. Voici la méthode la plus simple pour t’y mettre sans te dégoûter.",
    enBref: [
      "Commence en alternant marche et course : 1 minute de course, 1 à 2 minutes de marche.",
      "Cours lentement, à une allure où tu peux parler : c’est la règle d’or des débutants.",
      "Trois sorties par semaine suffisent, avec un jour de repos entre chaque.",
      "En 8 semaines environ, la plupart des débutants courent 30 minutes d’affilée."
    ],
    image: { src: "/assets/guides/couvertures/commencer-la-course-a-pied.webp", alt: "Deux coureuses du club sur la passerelle du parc, en pleine sortie" },
    photos: [
      { src: "/assets/actus/bienvenue/04.webp", alt: "Deux coureuses arrivent sur un chemin de terre", largeur: 1067, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/02.webp", alt: "Des coureuses et coureurs du club sur un sentier, en pleine sortie", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/10.webp", alt: "Une coureuse en gilet d’hydratation, au soleil, après la sortie", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/parc-de-la-torse/rires-groupe.webp", alt: "Des membres de Nulll Club éclatent de rire après une sortie", largeur: 1600, hauteur: 900 }
    ],
    sections: [
      {
        titre: "L’erreur que font presque tous les débutants",
        paragraphes: [
          "La plupart des gens qui abandonnent la course font la même erreur : ils **courent trop vite**. Ils partent à fond, s’essoufflent en deux minutes, et en concluent que « la course, ce n’est pas pour eux ».",
          "La bonne allure pour débuter, c’est celle où tu peux **tenir une conversation**. Si tu n’arrives plus à parler, ralentis. Même si tu as l’impression de marcher vite, c’est très bien comme ça."
        ],
        citation: "Si tu peux parler en courant, tu cours à la bonne allure."
      },
      {
        titre: "Alterner marche et course",
        paragraphes: [
          "Pour tes premières sorties, n’essaie pas de courir 20 minutes d’un coup. Alterne : **1 minute de course, 1 à 2 minutes de marche**, à répéter 8 à 10 fois.",
          "Chaque semaine, augmente doucement le temps de course et réduis la marche. Ton cœur, tes muscles et surtout tes tendons ont besoin de temps pour s’adapter. Mieux vaut progresser lentement que se blesser vite."
        ]
      },
      {
        titre: "Un plan simple sur 8 semaines",
        paragraphes: [
          "**Semaines 1 et 2** : 1 minute de course, 2 minutes de marche, 8 fois. **Semaines 3 et 4** : 3 minutes de course, 1 minute de marche, 6 fois. **Semaines 5 et 6** : 5 minutes de course, 1 minute de marche, 4 à 5 fois.",
          "**Semaines 7 et 8** : 10 minutes de course, 1 minute de marche, 3 fois, puis une première sortie de **30 minutes sans t’arrêter**. Trois séances par semaine, avec un jour de repos entre chaque.",
          "Ce plan est un repère, pas une loi. Si une semaine te paraît dure, refais-la. Et en cas de douleur qui ne passe pas, demande conseil à un médecin."
        ]
      },
      {
        titre: "Le matériel : moins qu’on ne croit",
        paragraphes: [
          "Le seul achat vraiment important, ce sont **les chaussures**. Choisis une paire de running confortable, idéalement essayée en magasin spécialisé. Pour le reste, un tee-shirt respirant et un short suffisent.",
          "À Aix, ajoute **de l’eau** dès qu’il fait chaud, une casquette en été, et une couche légère contre le mistral en hiver. Une montre GPS ou une appli, c’est un plus, pas une obligation."
        ]
      },
      {
        titre: "Le vrai secret : ne pas courir seul",
        paragraphes: [
          "La motivation, ça va et ça vient. Ce qui fait tenir, c’est **un rendez-vous** et des gens qui t’attendent. Courir en groupe rend aussi les kilomètres beaucoup plus courts.",
          "À Aix, [Nulll Club](/fr/run-club-aix-en-provence) organise un social run gratuit un samedi sur deux, à allure conversation. Les débutants y sont les bienvenus : on court **5 à 6 km**, et personne n’est laissé derrière."
        ]
      }
    ],
    faq: [
      { q: "Combien de temps faut-il pour courir 5 km quand on débute ?", a: "En alternant marche et course trois fois par semaine, la plupart des débutants courent 30 minutes d’affilée, soit environ 4 à 5 km, au bout de 8 semaines environ." },
      { q: "Combien de fois par semaine courir quand on commence ?", a: "Trois séances par semaine suffisent, avec un jour de repos entre chaque pour laisser le corps récupérer." },
      { q: "Quelle allure pour débuter la course à pied ?", a: "Une allure où tu peux tenir une conversation. Si tu es trop essoufflé pour parler, ralentis ou marche." },
      { q: "Peut-on débuter la course à pied en groupe ?", a: "Oui, c’est même recommandé. À Aix-en-Provence, Nulll Club accueille les débutants un samedi sur deux, gratuitement, à allure conversation." }
    ],
    liens: ["run-club-aix-en-provence", "courir-a-aix-en-provence", "ou-courir-a-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "ou-courir-a-aix-en-provence",
    chemin: "/fr/guide/ou-courir-a-aix-en-provence",
    rubrique: "Parcours",
    titre: "Où courir à Aix-en-Provence : nos spots préférés, du parc Jourdan à la Sainte-Victoire",
    seoTitle: "Où courir à Aix-en-Provence : les meilleurs spots running",
    description:
      "Où courir à Aix-en-Provence : parc Jourdan, parc de la Torse, centre historique, plateau de Bibémus, barrages de Bimont et Zola, Sainte-Victoire.",
    resume:
      "Bitume, terre, cailloux ou dénivelé : Aix a un terrain pour chaque envie. On a fait le tour de nos spots préférés, du footing de 20 minutes en plein centre au trail avec vue sur la Sainte-Victoire.",
    enBref: [
      "Pour un footing en ville : le parc Jourdan, au centre, et le parc de la Torse, à l’est.",
      "Pour du bitume tôt le matin : le Cours Mirabeau et les rues du centre historique.",
      "Pour du trail : le plateau de Bibémus, les barrages de Bimont et Zola, la Sainte-Victoire.",
      "En été, vérifie l’accès aux massifs avant de partir : il peut être limité à cause du risque d’incendie."
    ],
    image: { src: "/assets/guides/couvertures/ou-courir-a-aix-en-provence.webp", alt: "Des coureurs du club traversent la pelouse du parc" },
    photos: [
      { src: "/assets/actus/parc-de-la-torse/sentier.webp", alt: "Des coureurs du club sur un sentier ombragé du parc de la Torse", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/parc-de-la-torse/passerelle.webp", alt: "Des coureurs du club traversent une passerelle du parc de la Torse", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/14.webp", alt: "Un coureur pose au milieu des arbres", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/13.webp", alt: "Un coureur en gilet bleu profite de l’après-run sous les arbres", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/15.webp", alt: "Une coureuse assise à l’ombre d’un arbre, au calme après l’effort", largeur: 1600, hauteur: 900 }
    ],
    sections: [
      {
        titre: "Le parc Jourdan, le classique du centre",
        paragraphes: [
          "C’est le plus grand parc du centre d’Aix, et le spot le plus simple quand on habite en ville. Ses allées ombragées se prêtent aux **footings courts**, aux reprises et aux exercices de fractionné.",
          "**Idéal pour** : une sortie de 20 à 40 minutes en semaine. **Bon à savoir** : vérifie ses horaires d’ouverture, surtout tôt le matin."
        ]
      },
      {
        titre: "Le parc de la Torse, notre terrain de jeu",
        paragraphes: [
          "À l’est du centre, le parc de la Torse suit le ruisseau qui lui donne son nom. On y court sur des **chemins de terre**, entre les arbres et les passerelles, loin du bruit des voitures.",
          "C’est l’un des spots favoris de [Nulll Club](/fr/run-club-aix-en-provence) : le club y a donné rendez-vous pour plusieurs de ses social runs. **Idéal pour** : courir à l’ombre et changer du bitume."
        ],
        citation: "De la terre sous les pieds et de l’ombre au-dessus : la Torse, c’est notre spot."
      },
      {
        titre: "Le centre historique, au lever du jour",
        paragraphes: [
          "Remonter le **Cours Mirabeau**, passer devant la Rotonde, filer vers le quartier Mazarin et sa fontaine des Quatre-Dauphins : courir dans le vieil Aix, c’est visiter la ville autrement.",
          "Le bon créneau, c’est **tôt le matin**, avant l’ouverture des terrasses et l’arrivée des marchés. Après, les rues deviennent trop animées pour courir tranquillement."
        ]
      },
      {
        titre: "Le plateau de Bibémus, pour les amoureux de Cézanne",
        paragraphes: [
          "À l’est de la ville, le plateau de Bibémus offre des chemins caillouteux au milieu des pins et des roches ocre qui ont inspiré Cézanne. Le terrain est plus technique : **du trail facile**, avec quelques montées.",
          "**Idéal pour** : une sortie nature sans aller loin. **Bon à savoir** : les anciennes carrières elles-mêmes se visitent uniquement avec un guide."
        ]
      },
      {
        titre: "Bimont, Zola et la Sainte-Victoire, pour le dénivelé",
        paragraphes: [
          "Au-dessus du Tholonet, les sentiers qui relient le **barrage Zola** et le **barrage de Bimont** offrent des vues superbes sur l’eau et la montagne. C’est un terrain de trail exigeant, avec du dénivelé et des cailloux.",
          "Plus haut, la **Sainte-Victoire** est le grand défi local. Ses sentiers montent vers la Croix de Provence, avec une vue spectaculaire. **Bon à savoir** : prévois beaucoup d’eau et vérifie toujours les conditions d’accès aux massifs en été."
        ]
      },
      {
        titre: "Le plus simple : courir avec nous",
        paragraphes: [
          "Tu ne connais pas encore les chemins ? Laisse-nous faire. Un samedi sur deux, Nulll Club part en groupe, à allure conversation, sur un parcours préparé à l’avance par Romane.",
          "C’est gratuit, ouvert à tous, et le point de départ est annoncé avec chaque date sur la page [Sorties](/fr/runs). Pour les conseils de saison, lis aussi [Courir à Aix-en-Provence](/fr/courir-a-aix-en-provence)."
        ]
      }
    ],
    faq: [
      { q: "Quel est le meilleur endroit pour courir à Aix-en-Provence ?", a: "En ville, le parc Jourdan et le parc de la Torse sont les plus pratiques. Pour du trail, le plateau de Bibémus, les barrages de Bimont et Zola et la Sainte-Victoire sont les plus beaux." },
      { q: "Où courir à l’ombre à Aix ?", a: "Le parc de la Torse et le parc Jourdan sont bien ombragés. En été, privilégie quand même les sorties tôt le matin." },
      { q: "Où faire du trail près d’Aix-en-Provence ?", a: "Le plateau de Bibémus pour une initiation, les sentiers des barrages de Bimont et Zola pour du dénivelé, et la Sainte-Victoire pour les sorties les plus exigeantes." },
      { q: "Peut-on courir dans le centre historique d’Aix ?", a: "Oui, idéalement tôt le matin, avant l’arrivée des terrasses et des marchés : le Cours Mirabeau, la Rotonde et le quartier Mazarin font une belle boucle." }
    ],
    liens: ["courir-a-aix-en-provence", "run-club-aix-en-provence", "que-faire-a-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "rencontrer-des-gens-a-aix-en-provence",
    chemin: "/fr/guide/rencontrer-des-gens-a-aix-en-provence",
    rubrique: "Rencontrer",
    titre: "Rencontrer des gens à Aix-en-Provence : les vraies bonnes idées (testées par nous)",
    seoTitle: "Rencontrer des gens à Aix-en-Provence : 6 idées qui marchent",
    description:
      "Comment rencontrer du monde à Aix-en-Provence : run club gratuit, associations, sport en groupe, marchés, culture. Des idées concrètes pour se faire des amis.",
    resume:
      "Se faire des amis après les études, ou en arrivant dans une nouvelle ville, c’est plus dur qu’on ne le dit. À Aix, on a trouvé la parade : faire des choses ensemble, régulièrement. Voici les idées qui marchent vraiment.",
    enBref: [
      "Le plus efficace pour rencontrer des gens : une activité régulière en groupe, au même endroit, à la même heure.",
      "Le sport collectif sans compétition, comme un run club, est idéal : on parle en bougeant, puis on reste après.",
      "Les associations, le bénévolat et les événements culturels d’Aix sont d’autres portes d’entrée.",
      "Nulll Club organise un social run gratuit un samedi sur deux, pensé pour venir seul et repartir avec des gens."
    ],
    image: { src: "/assets/guides/couvertures/rencontrer-des-gens-a-aix-en-provence.webp", alt: "Deux coureuses éclatent de rire après la sortie" },
    photos: [
      { src: "/assets/actus/parc-de-la-torse/trio-sourires.webp", alt: "Trois membres de Nulll Club tout sourire après une sortie", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/bienvenue/19.webp", alt: "Un membre du club en pleine discussion après la sortie", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/07.webp", alt: "Une coureuse en sweat jaune raconte sa sortie au groupe", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/bienvenue/05.webp", alt: "Les mains d’un DJ sur ses platines pendant l’après-run", largeur: 1066, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Pourquoi c’est si dur de se faire des amis adulte",
        paragraphes: [
          "Au lycée ou à la fac, on voit les mêmes personnes tous les jours sans rien organiser. Une fois adulte, ce cadre disparaît : chacun a son travail, ses horaires, ses habitudes.",
          "Or les amitiés naissent rarement d’une seule rencontre. Elles se construisent avec **la répétition** : revoir les mêmes têtes, semaine après semaine, jusqu’à ce que la conversation devienne naturelle."
        ],
        citation: "Les amitiés ne naissent pas d’une rencontre. Elles naissent d’un rendez-vous qui revient."
      },
      {
        titre: "Le sport en groupe, la méthode la plus simple",
        paragraphes: [
          "Faire du sport ensemble, c’est l’excuse parfaite : on a un sujet de conversation tout trouvé, on partage un effort, et personne n’a besoin de briser la glace.",
          "Le **run club** pousse l’idée encore plus loin. À [Nulll Club](/fr/run-club-aix-en-provence), on court à **allure conversation** : assez lentement pour discuter pendant la sortie. Et après, il y a le ravito, où tout le monde reste."
        ]
      },
      {
        titre: "Le moment qui compte : l’après",
        paragraphes: [
          "Dans un club de sport classique, chacun repart dès la fin de la séance. Dans un social run, c’est l’inverse : **la course n’est qu’une introduction**.",
          "Chez nous, l’après-course dure souvent plus longtemps que la sortie. Canettes de nos partenaires, discussions, photos : c’est là que les inconnus du départ deviennent des têtes connues."
        ]
      },
      {
        titre: "Les autres bonnes idées à Aix",
        paragraphes: [
          "**Les associations** : Aix en compte énormément, du sport à la culture en passant par la solidarité. S’engager comme bénévole, c’est rencontrer des gens qui partagent tes valeurs.",
          "**Les événements culturels** : expositions, concerts, festivals. Aix est une ville de culture, et ces moments créent des occasions de discuter. Pour des idées, lis notre guide [Que faire à Aix-en-Provence](/fr/guide/que-faire-a-aix-en-provence).",
          "**Les marchés** : faire son marché au même endroit chaque semaine, c’est finir par connaître les commerçants et les habitués du quartier."
        ]
      },
      {
        titre: "Venir seul, sans stress",
        paragraphes: [
          "La plus grande peur, c’est d’arriver seul dans un groupe où tout le monde se connaît. Chez Nulll Club, **tu peux venir seul** : le format est pensé pour ça, et l’équipe est là pour t’accueillir.",
          "Le rendez-vous est **gratuit**, un samedi sur deux, à 9h30. Crée ton compte, choisis ta date sur la page [Sorties](/fr/runs), et viens comme tu es."
        ]
      }
    ],
    faq: [
      { q: "Comment rencontrer des gens à Aix-en-Provence ?", a: "Le plus efficace est de rejoindre une activité régulière en groupe : un run club comme Nulll Club, une association, du bénévolat ou un cours hebdomadaire. La répétition crée les amitiés." },
      { q: "Peut-on venir seul à un run club ?", a: "Oui. À Nulll Club, le format est justement pensé pour ça : tu peux venir seul et repartir avec des gens." },
      { q: "Quelle activité gratuite pour rencontrer du monde à Aix ?", a: "Le social run de Nulll Club est gratuit, un samedi sur deux à Aix-en-Provence, ouvert à tous les niveaux." },
      { q: "Comment se faire des amis quand on est nouveau à Aix ?", a: "Choisis une ou deux activités régulières et tiens-les plusieurs semaines. Revoir les mêmes personnes est ce qui transforme une rencontre en amitié." }
    ],
    liens: ["nouveau-a-aix-en-provence", "run-club-aix-en-provence", "sortir-a-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "nouveau-a-aix-en-provence",
    chemin: "/fr/guide/nouveau-a-aix-en-provence",
    rubrique: "Nouvel arrivant",
    titre: "Nouveau à Aix-en-Provence ? Le guide pour te sentir chez toi en un mois",
    seoTitle: "Nouveau à Aix-en-Provence : le guide du nouvel arrivant",
    description:
      "Tu viens d’arriver à Aix-en-Provence ? Quartiers, marchés, transports, sport, sorties et comment rencontrer du monde : le guide pratique pour t’installer.",
    resume:
      "Nouveau job, études, envie de soleil : tu viens de poser tes cartons à Aix. Bonne nouvelle, c’est une ville où l’on s’intègre vite, à condition de connaître les bons réflexes. Voici ceux qu’on aurait aimé avoir dès la première semaine.",
    enBref: [
      "Aix-en-Provence compte près de 150 000 habitants et un centre historique qui se parcourt à pied.",
      "Les marchés du centre, le Cours Mirabeau et les places animées sont les meilleurs endroits pour prendre ses repères.",
      "Marseille est à une trentaine de kilomètres : la mer est facile d’accès.",
      "Pour rencontrer du monde vite, rejoins une activité régulière, comme le social run gratuit de Nulll Club."
    ],
    image: { src: "/assets/guides/couvertures/nouveau-a-aix-en-provence.webp", alt: "Trois membres du club sourient dans le parc" },
    photos: [
      { src: "/assets/actus/quatrieme-run/11.webp", alt: "Un membre du club en sweat gris, souriant dans le parc", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/bienvenue/03.webp", alt: "Le groupe rassemblé à l’ombre avant de partir", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/12.webp", alt: "Une coureuse rit, canette dans une main, eau dans l’autre", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/10.webp", alt: "Une coureuse ouvre sa canette après l’effort", largeur: 1200, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Aix en quelques mots",
        paragraphes: [
          "Aix-en-Provence, c’est près de **150 000 habitants**, un centre historique aux façades ocre, des fontaines à chaque coin de rue et la **montagne Sainte-Victoire** en arrière-plan. C’est aussi une grande ville étudiante, ce qui la rend jeune et vivante.",
          "La ville est assez compacte pour que le centre se vive **à pied**. Et avec Marseille à une trentaine de kilomètres, la mer n’est jamais très loin."
        ]
      },
      {
        titre: "Prendre ses repères la première semaine",
        paragraphes: [
          "Commence par le **Cours Mirabeau**, l’artère principale, puis perds-toi dans le vieil Aix jusqu’à la place de l’Hôtel de Ville et la cathédrale Saint-Sauveur. Au sud du Cours, le **quartier Mazarin** est plus calme et élégant.",
          "Le matin, passe par la **place Richelme** et son marché de producteurs. Les grands marchés du centre, le mardi, le jeudi et le samedi matin, sont parfaits pour sentir le rythme de la ville."
        ],
        citation: "À Aix, on apprend la ville en marchant, et on la retient en revenant au même marché."
      },
      {
        titre: "Bouger dans et autour d’Aix",
        paragraphes: [
          "Dans le centre, la marche suffit pour presque tout. Pour aller plus loin, la ville dispose d’un réseau de **bus**, et des cars relient régulièrement Aix et Marseille.",
          "Aix a deux gares : la **gare du centre-ville** pour les trains régionaux, et la **gare TGV**, à l’extérieur de la ville, pour les grandes lignes. Pense à vérifier les correspondances avant de réserver."
        ]
      },
      {
        titre: "Trouver son sport et ses gens",
        paragraphes: [
          "Le meilleur raccourci pour s’intégrer, c’est une **activité régulière**. Sport, association, bénévolat : choisis quelque chose qui revient chaque semaine, et tiens-le un mois.",
          "On a créé [Nulll Club](/fr/run-club-aix-en-provence) pour ça. Un samedi sur deux, on court ensemble **gratuitement**, à allure conversation, puis on reste discuter. Tu peux venir seul : c’est justement pour ça qu’on court en groupe. Lis aussi [Rencontrer des gens à Aix](/fr/guide/rencontrer-des-gens-a-aix-en-provence)."
        ]
      },
      {
        titre: "Ta checklist du premier mois",
        paragraphes: [
          "**Semaine 1** : marche le centre, repère ta boulangerie et ton marché. **Semaine 2** : visite un musée, comme le musée Granet, et monte voir la Sainte-Victoire depuis le Terrain des Peintres.",
          "**Semaine 3** : rejoins une activité régulière, par exemple un samedi avec nous. **Semaine 4** : sors un soir avec les gens rencontrés. Pour les idées, lis [Sortir à Aix-en-Provence](/fr/guide/sortir-a-aix-en-provence)."
        ]
      }
    ],
    faq: [
      { q: "Comment s’intégrer quand on arrive à Aix-en-Provence ?", a: "Rejoins une activité régulière en groupe dès les premières semaines : sport, association ou bénévolat. Le social run gratuit de Nulll Club, un samedi sur deux, est ouvert à tous et pensé pour venir seul." },
      { q: "Quels sont les quartiers à connaître à Aix ?", a: "Le centre historique autour du Cours Mirabeau, le quartier Mazarin au sud du Cours, et les abords de la place de l’Hôtel de Ville et de la cathédrale Saint-Sauveur." },
      { q: "Quand ont lieu les marchés à Aix-en-Provence ?", a: "La place Richelme accueille un marché de producteurs chaque matin. Les grands marchés du centre ont lieu le mardi, le jeudi et le samedi matin." },
      { q: "Aix est-elle loin de la mer ?", a: "Marseille et la Méditerranée sont à une trentaine de kilomètres d’Aix-en-Provence." }
    ],
    liens: ["rencontrer-des-gens-a-aix-en-provence", "que-faire-a-aix-en-provence", "run-club-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "que-faire-a-aix-en-provence",
    chemin: "/fr/guide/que-faire-a-aix-en-provence",
    rubrique: "Que faire",
    titre: "Que faire à Aix-en-Provence ? Nos idées pour un jour, un week-end ou toute l’année",
    seoTitle: "Que faire à Aix-en-Provence : idées, visites et activités",
    description:
      "Que faire à Aix-en-Provence : centre historique, Cézanne, musées, marchés, Sainte-Victoire, festivals et activités gratuites. Nos idées, testées par des Aixois.",
    resume:
      "Fontaines, Cézanne, marchés, randonnées, festivals : Aix a de quoi remplir des semaines. Pour ne pas passer à côté de l’essentiel, on a rangé nos idées par envie. Il y en a pour les curieux, les sportifs et les fauchés.",
    enBref: [
      "Incontournables : le Cours Mirabeau, le vieil Aix, la cathédrale Saint-Sauveur et le quartier Mazarin.",
      "Sur les pas de Cézanne : son atelier, le Terrain des Peintres et le plateau de Bibémus.",
      "Culture : le musée Granet, l’Hôtel de Caumont, la Fondation Vasarely et le Festival d’Aix en juillet.",
      "Plein air : la Sainte-Victoire, les barrages de Bimont et Zola, et le social run gratuit de Nulll Club."
    ],
    image: { src: "/assets/guides/couvertures/que-faire-a-aix-en-provence.webp", alt: "Une coureuse et un coureur discutent dans le parc après la sortie" },
    photos: [
      { src: "/assets/actus/bienvenue/09.webp", alt: "Des coureurs sur le parking au retour du run", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/06.webp", alt: "Deux membres du club posent ensemble, bouteille d’eau à la main", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/14.webp", alt: "Un membre du club en casquette lève sa canette en riant", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/16.webp", alt: "Une coureuse en lunettes de soleil attrape une Red Bull", largeur: 1200, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Les incontournables du centre",
        paragraphes: [
          "Commence par le **Cours Mirabeau**, ses platanes et ses fontaines, de la Rotonde jusqu’en haut du Cours. Puis plonge dans les ruelles du vieil Aix jusqu’à la **place de l’Hôtel de Ville** et la **cathédrale Saint-Sauveur**.",
          "Au sud du Cours, le **quartier Mazarin** offre des rues plus calmes, des hôtels particuliers et la fontaine des Quatre-Dauphins. Et n’oublie pas de goûter un **calisson**, la spécialité de la ville."
        ]
      },
      {
        titre: "Sur les pas de Cézanne",
        paragraphes: [
          "Aix est la ville de **Paul Cézanne**. Son **atelier des Lauves** se visite, et un peu plus haut, le **Terrain des Peintres** offre l’une des plus belles vues sur la Sainte-Victoire, celle qu’il a peinte tant de fois.",
          "Pour aller plus loin, le **plateau de Bibémus** et ses anciennes carrières ocre se découvrent lors de visites guidées. Renseigne-toi à l’office de tourisme avant d’y aller."
        ],
        citation: "Voir la Sainte-Victoire depuis le Terrain des Peintres, c’est comprendre Cézanne en une seconde."
      },
      {
        titre: "Musées et culture",
        paragraphes: [
          "Le **musée Granet** abrite de belles collections de peinture, dont des œuvres de Cézanne. L’**Hôtel de Caumont** accueille de grandes expositions temporaires dans un hôtel particulier, et la **Fondation Vasarely** est une expérience à part, entre art et architecture.",
          "En juillet, le **Festival d’Aix-en-Provence** fait vibrer la ville autour de l’art lyrique. Toute l’année, le **Grand Théâtre de Provence** et le **Pavillon Noir**, maison du Ballet Preljocaj, programment spectacles et danse."
        ]
      },
      {
        titre: "Prendre l’air",
        paragraphes: [
          "La **Sainte-Victoire** est le grand terrain de randonnée local. Les sentiers autour des **barrages de Bimont et Zola**, au-dessus du Tholonet, sont une belle porte d’entrée. En été, vérifie toujours les conditions d’accès aux massifs.",
          "En ville, le **parc Jourdan** et le **parc de la Torse** sont parfaits pour une balade ou un footing. Toutes nos idées de parcours sont dans [Où courir à Aix-en-Provence](/fr/guide/ou-courir-a-aix-en-provence)."
        ]
      },
      {
        titre: "Les idées gratuites",
        paragraphes: [
          "Flâner dans le centre, admirer les fontaines, faire le tour des **marchés** du matin, monter au Terrain des Peintres ou pique-niquer au parc : beaucoup des meilleures choses à faire à Aix ne coûtent rien.",
          "Et un samedi sur deux, viens courir avec [Nulll Club](/fr/run-club-aix-en-provence) : c’est **gratuit**, ouvert à tous, et c’est une façon originale de découvrir Aix tout en rencontrant du monde."
        ]
      }
    ],
    faq: [
      { q: "Que faire à Aix-en-Provence en une journée ?", a: "Le Cours Mirabeau, le vieil Aix et la cathédrale Saint-Sauveur le matin, un marché, puis le musée Granet ou l’atelier de Cézanne l’après-midi, et le Terrain des Peintres pour la vue sur la Sainte-Victoire." },
      { q: "Que faire gratuitement à Aix-en-Provence ?", a: "Flâner dans le centre historique, faire les marchés, monter au Terrain des Peintres, se balader au parc Jourdan, ou courir avec Nulll Club un samedi sur deux." },
      { q: "Que faire à Aix-en-Provence le week-end ?", a: "Le samedi matin, les marchés et le social run de Nulll Club. Le dimanche, une randonnée autour de la Sainte-Victoire ou des barrages de Bimont et Zola." },
      { q: "Quand a lieu le Festival d’Aix-en-Provence ?", a: "Le Festival d’Aix-en-Provence, consacré à l’art lyrique, se tient chaque année en juillet." }
    ],
    liens: ["sortie-a-aix-en-provence", "sortir-a-aix-en-provence", "ou-courir-a-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "sortie-a-aix-en-provence",
    chemin: "/fr/guide/sortie-a-aix-en-provence",
    rubrique: "Idées de sortie",
    titre: "Idée de sortie à Aix-en-Provence : 10 plans pour ton prochain week-end",
    seoTitle: "Idée de sortie à Aix-en-Provence : 10 plans pour le week-end",
    description:
      "Une idée de sortie à Aix-en-Provence ce week-end ? Marchés, social run gratuit, Sainte-Victoire, musées, pique-nique, mer : 10 plans testés.",
    resume:
      "Le week-end arrive et tu n’as toujours pas de plan ? On a listé dix sorties à faire à Aix et autour, seul, entre amis ou en famille. Du samedi matin au dimanche soir, tu n’as plus d’excuse.",
    enBref: [
      "Samedi matin : le marché, puis un social run gratuit avec Nulll Club, un samedi sur deux.",
      "En plein air : randonnée à la Sainte-Victoire, barrages de Bimont et Zola, pique-nique au parc Jourdan.",
      "Culture : musée Granet, Hôtel de Caumont, atelier de Cézanne, Terrain des Peintres.",
      "Envie de mer : Marseille et la Méditerranée sont à une trentaine de kilomètres."
    ],
    image: { src: "/assets/guides/couvertures/sortie-a-aix-en-provence.webp", alt: "Une membre du club rit, canette Bee Zen à la main" },
    photos: [
      { src: "/assets/actus/quatrieme-run/05.webp", alt: "Un coureur en maillot rose, tout sourire après la sortie", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/06.webp", alt: "Un membre de l’équipe tend des canettes Bee Zen devant la table des boissons", largeur: 1067, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/18.webp", alt: "Un membre de l’équipe prépare le ravito, bouteilles d’eau sur la table", largeur: 900, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Le samedi matin, à l’aixoise",
        paragraphes: [
          "**1. Le marché.** Commence par la place Richelme et son marché de producteurs, puis file vers les grands marchés du centre, le samedi matin. Fruits, fromages, fleurs : c’est le meilleur moyen de démarrer la journée.",
          "**2. Le social run.** Un samedi sur deux, rejoins [Nulll Club](/fr/run-club-aix-en-provence) : rendez-vous à **9h30, départ 10h**, 5 à 6 km à allure conversation, puis ravito et discussions. C’est **gratuit**, et tu peux venir seul.",
          "**3. Le café en terrasse.** Après l’effort, le Cours Mirabeau et les places du centre t’attendent pour un café au soleil."
        ],
        citation: "Le plan parfait : marché, run, terrasse. Dans cet ordre."
      },
      {
        titre: "En plein air",
        paragraphes: [
          "**4. Une randonnée à la Sainte-Victoire.** Le grand classique local, avec des sentiers pour tous les niveaux. Vérifie les conditions d’accès aux massifs en été.",
          "**5. Les barrages de Bimont et Zola.** Une balade plus courte au-dessus du Tholonet, avec de l’eau, des pins et la montagne en face.",
          "**6. Un pique-nique au parc Jourdan.** Une couverture, des produits du marché, et un après-midi à l’ombre en plein centre."
        ]
      },
      {
        titre: "Culture et curiosité",
        paragraphes: [
          "**7. Le musée Granet ou l’Hôtel de Caumont.** Parfaits quand il fait trop chaud ou qu’il pleut. Regarde les expositions en cours avant d’y aller.",
          "**8. L’atelier de Cézanne et le Terrain des Peintres.** L’atelier se visite, et le Terrain des Peintres, juste au-dessus, offre une vue imprenable sur la Sainte-Victoire au coucher du soleil."
        ]
      },
      {
        titre: "Partir un peu plus loin",
        paragraphes: [
          "**9. Une escapade à la mer.** Marseille est à une trentaine de kilomètres : une journée sur le littoral se prépare facilement depuis Aix.",
          "**10. Les villages autour d’Aix.** Le Tholonet, au pied de la Sainte-Victoire, est à quelques kilomètres du centre. Idéal pour une sortie en fin de journée."
        ]
      },
      {
        titre: "Et le soir ?",
        paragraphes: [
          "Une fois la journée finie, Aix a aussi de quoi t’occuper le soir : terrasses, concerts, cinéma, spectacles. On a tout rassemblé dans notre guide [Sortir à Aix-en-Provence](/fr/guide/sortir-a-aix-en-provence)."
        ]
      }
    ],
    faq: [
      { q: "Quelle sortie faire à Aix-en-Provence ce week-end ?", a: "Le samedi matin, le marché puis le social run gratuit de Nulll Club, un samedi sur deux. Le dimanche, une randonnée à la Sainte-Victoire ou aux barrages de Bimont et Zola." },
      { q: "Quelle sortie gratuite à Aix-en-Provence ?", a: "Les marchés, le Terrain des Peintres, un pique-nique au parc Jourdan, une randonnée autour d’Aix, ou le social run de Nulll Club." },
      { q: "Quelle sortie faire à Aix quand il fait chaud ?", a: "Le matin tôt pour les activités en plein air, puis un musée l’après-midi, comme le musée Granet ou l’Hôtel de Caumont." },
      { q: "Quelle sortie entre amis à Aix-en-Provence ?", a: "Un social run avec Nulll Club suivi d’un café en terrasse, ou un pique-nique au parc Jourdan avec des produits du marché." }
    ],
    liens: ["que-faire-a-aix-en-provence", "sortir-a-aix-en-provence", "rencontrer-des-gens-a-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "sortir-a-aix-en-provence",
    chemin: "/fr/guide/sortir-a-aix-en-provence",
    rubrique: "Sortir",
    titre: "Sortir à Aix-en-Provence : terrasses, concerts, ciné… le guide pour tes soirées",
    seoTitle: "Sortir à Aix-en-Provence : où aller le soir ?",
    description:
      "Où sortir à Aix-en-Provence le soir : terrasses du centre, place des Cardeurs, concerts au 6MIC, cinémas, théâtre et spectacles. Le guide des soirées aixoises.",
    resume:
      "Aix ne s’endort pas après le coucher du soleil. Entre les terrasses du centre, les salles de concert et les théâtres, il y a de quoi remplir toutes tes soirées. Voici où aller selon ton humeur.",
    enBref: [
      "Pour un verre en terrasse : le Cours Mirabeau et la place des Cardeurs, au cœur du centre historique.",
      "Pour les concerts : le 6MIC, la salle de musiques actuelles d’Aix.",
      "Pour les spectacles : le Grand Théâtre de Provence, le Pavillon Noir et le théâtre du Jeu de Paume.",
      "Pour le cinéma : les cinémas du centre-ville, dont plusieurs proposent des films en version originale."
    ],
    image: { src: "/assets/guides/couvertures/sortir-a-aix-en-provence.webp", alt: "Deux membres du club trinquent après la course" },
    photos: [
      { src: "/assets/actus/bienvenue/11.webp", alt: "Une canette tendue à un membre du club en casquette", largeur: 1200, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/17.webp", alt: "Un coureur reçoit une canette au retour", largeur: 1200, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/14.webp", alt: "Un membre du club en casquette lève sa canette en riant", largeur: 900, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Les terrasses, le cœur des soirées aixoises",
        paragraphes: [
          "À Aix, une soirée commence presque toujours en **terrasse**. Le **Cours Mirabeau** reste l’adresse emblématique, mais c’est sur la **place des Cardeurs**, dans le vieil Aix, que l’on trouve la plus forte concentration de bars et de restaurants.",
          "Les petites places du centre, autour de l’Hôtel de Ville et de la place Richelme, prennent aussi le relais le soir. Aux beaux jours, toute la ville vit dehors."
        ],
        citation: "À Aix, la soirée commence toujours en terrasse. La suite, c’est toi qui vois."
      },
      {
        titre: "Concerts et musique",
        paragraphes: [
          "Le **6MIC** est la salle de musiques actuelles d’Aix-en-Provence, avec une programmation variée toute l’année. C’est l’adresse à surveiller pour les concerts.",
          "L’été, la musique sort dans la rue et les festivals se multiplient, dont le **Festival d’Aix-en-Provence** en juillet, pour les amateurs d’art lyrique."
        ]
      },
      {
        titre: "Théâtre, danse et cinéma",
        paragraphes: [
          "Le **Grand Théâtre de Provence** accueille opéras, concerts et grands spectacles. Le **Pavillon Noir**, maison du Ballet Preljocaj, est le lieu de la danse contemporaine, et le **théâtre du Jeu de Paume** propose une programmation de théâtre dans une salle à l’italienne.",
          "Côté cinéma, les **cinémas du centre-ville** proposent de nombreux films en version originale. Pratique pour une soirée sans prise de tête."
        ]
      },
      {
        titre: "Sortir autrement : les soirées du club",
        paragraphes: [
          "Sortir, ce n’est pas forcément faire la fête jusqu’à 4h. Chez Nulll Club, on organise aussi des **rendez-vous en dehors des runs**, pour se retrouver autrement.",
          "Le prochain : le **mardi 1er décembre à 19h, au Cutback**, à Aix-en-Provence. Les détails sont sur la page [Sorties](/fr/runs), et toutes nos nouvelles dans les [actus](/fr/actu)."
        ]
      },
      {
        titre: "Sortir et rencontrer du monde",
        paragraphes: [
          "Arriver dans une ville et ne connaître personne avec qui sortir, c’est frustrant. Le plus simple, c’est de commencer par une activité en journée, puis de prolonger le soir avec les gens rencontrés.",
          "C’est exactement ce qui se passe chez nous : on se rencontre en courant le samedi, et on finit par sortir ensemble. Lis aussi [Rencontrer des gens à Aix-en-Provence](/fr/guide/rencontrer-des-gens-a-aix-en-provence)."
        ]
      }
    ],
    faq: [
      { q: "Où sortir le soir à Aix-en-Provence ?", a: "Le Cours Mirabeau et la place des Cardeurs pour les terrasses, le 6MIC pour les concerts, le Grand Théâtre de Provence et le Pavillon Noir pour les spectacles, et les cinémas du centre-ville." },
      { q: "Où boire un verre à Aix-en-Provence ?", a: "Sur la place des Cardeurs, qui concentre de nombreux bars et restaurants, ou en terrasse sur le Cours Mirabeau." },
      { q: "Où voir un concert à Aix-en-Provence ?", a: "Au 6MIC, la salle de musiques actuelles d’Aix, et au Grand Théâtre de Provence pour les concerts classiques et les grands spectacles." },
      { q: "Comment trouver des gens avec qui sortir à Aix ?", a: "Rejoins une activité régulière en journée, comme le social run gratuit de Nulll Club, puis prolonge avec les gens rencontrés. Le club organise aussi des soirées." }
    ],
    liens: ["sortie-a-aix-en-provence", "rencontrer-des-gens-a-aix-en-provence", "que-faire-a-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "evenements-running-aix",
    chemin: "/fr/evenements-running-aix",
    rubrique: "Agenda",
    titre: "Événements running à Aix-en-Provence : l’agenda pour ne rien rater",
    seoTitle: "Événements running à Aix-en-Provence : l’agenda du club",
    description:
      "L’agenda running à Aix-en-Provence : les social runs gratuits de Nulll Club un samedi sur deux, les rendez-vous du club et les courses auxquelles on participe.",
    resume:
      "Courir à Aix, ce n’est pas seulement attendre la prochaine course officielle. Toute l’année, des rendez-vous réguliers, gratuits et ouverts font vivre la ville. Voici comment suivre l’agenda et nous retrouver.",
    enBref: [
      "Nulll Club organise un social run gratuit un samedi sur deux à Aix-en-Provence, rendez-vous 9h30, départ 10h.",
      "Chaque sortie est annoncée sur le site avec sa date, son heure, sa distance et son point de départ.",
      "Le club participe aussi à des courses, comme Les Bacchantes à Aix en novembre 2026.",
      "Le prochain rendez-vous hors run : le mardi 1er décembre à 19h, au Cutback."
    ],
    image: { src: "/assets/guides/couvertures/evenements-running-aix.webp", alt: "Le groupe se dirige vers le départ du premier social run" },
    photos: [
      { src: "/assets/actus/bienvenue/12.webp", alt: "Un coureur reçoit une Red Bull à l’arrivée", largeur: 1200, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/17.webp", alt: "La pyramide de canettes Bee Zen du ravito", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/08.webp", alt: "Un coureur souriant reçoit une canette après la sortie", largeur: 1200, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Le rendez-vous du samedi",
        paragraphes: [
          "Le cœur de l’agenda, c’est le **social run du samedi**. Un samedi sur deux, rendez-vous à **9h30**, départ à **10h**, pour 5 à 6 km à allure conversation. C’est gratuit et ouvert à tous les niveaux.",
          "Le point de départ habituel est le parking du chemin de la Cible, près du lycée Émile Zola, mais certaines sorties partent d’ailleurs, comme le **parc de la Torse**. Vérifie toujours la date choisie sur la page [Sorties](/fr/runs)."
        ],
        citation: "Un rendez-vous fixe, un samedi sur deux : on le retient mieux qu’un calendrier qui change."
      },
      {
        titre: "Les courses où l’on se retrouve",
        paragraphes: [
          "Nos sorties ne sont pas des compétitions, mais il nous arrive de prendre un dossard ensemble. En novembre 2026, la team NULLL était au départ des **Bacchantes**, à Aix, une course solidaire qui sensibilise aux cancers masculins.",
          "Dix de nos membres y ont couru grâce à un [jeu concours](/fr/actu/jeu-concours-bacchantes-aix-ynov-campus) organisé avec Aix Ynov Campus. On raconte tout dans l’article [On a couru pour plus grand que nous](/fr/actu/equipe-nulll-les-bacchantes-aix-2026)."
        ]
      },
      {
        titre: "Les rendez-vous hors run",
        paragraphes: [
          "Le club vit aussi en dehors des sorties. Le prochain rendez-vous : le **mardi 1er décembre à 19h, au Cutback**, à Aix-en-Provence.",
          "Et après chaque run, l’après-course fait partie du programme : ravito, canettes de nos partenaires et discussions."
        ]
      },
      {
        titre: "Comment suivre l’agenda",
        paragraphes: [
          "Toutes les dates sont sur la page [Sorties](/fr/runs), où tu peux t’inscrire en un clic. Les nouvelles du club sont dans les [actus](/fr/actu), et les rappels de l’événement du samedi arrivent sur Strava, quand tu cliques sur « Je participe ».",
          "Une question avant de venir ? Écris-nous depuis la page [Contact](/fr/contact). On répond avant ton premier samedi."
        ]
      }
    ],
    faq: [
      { q: "Quand ont lieu les sorties running de Nulll Club ?", a: "Un samedi sur deux, avec un rendez-vous à 9h30 et un départ à 10h. Les dates exactes sont publiées sur la page Sorties." },
      { q: "Les sorties de Nulll Club sont-elles payantes ?", a: "Non, elles sont gratuites. Il suffit de créer un compte et de s’inscrire à la sortie." },
      { q: "Où partent les sorties ?", a: "Le plus souvent du parking du chemin de la Cible, près du lycée Émile Zola, à Aix-en-Provence. Certaines sorties partent d’ailleurs, comme le parc de la Torse : le point de départ est indiqué pour chaque date." },
      { q: "Comment être prévenu des prochaines dates ?", a: "En consultant la page Sorties du site, en suivant les actus, et en rejoignant le club sur Strava et Instagram." }
    ],
    liens: ["run-club-aix-en-provence", "courir-a-aix-en-provence", "sortir-a-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "trail-aix-en-provence",
    chemin: "/fr/guide/trail-aix-en-provence",
    rubrique: "Trail",
    titre: "Trail autour d’Aix-en-Provence : Sainte-Victoire, Bibémus, Bimont, le guide pour débuter",
    seoTitle: "Trail à Aix-en-Provence : où courir, conseils, sécurité",
    description:
      "Trail autour d’Aix-en-Provence : Sainte-Victoire, plateau de Bibémus, barrages de Bimont et Zola. Spots, matériel, sécurité et accès aux massifs en été.",
    resume:
      "À quelques kilomètres du Cours Mirabeau, les chemins deviennent cailloux, pins et dénivelé. Aix est une porte d’entrée rêvée vers le trail, à condition de respecter la montagne. Voici où aller, comment s’équiper et les règles à connaître avant de partir.",
    enBref: [
      "Les spots de trail près d’Aix : le plateau de Bibémus, les barrages de Bimont et Zola, et la montagne Sainte-Victoire.",
      "Pour débuter, choisis des boucles courtes avec peu de dénivelé, et pars toujours avec de l’eau.",
      "En été, l’accès aux massifs des Bouches-du-Rhône est réglementé : vérifie la carte de la préfecture avant chaque sortie.",
      "Le trail se prépare aussi sur le plat : courir régulièrement en groupe, comme avec Nulll Club, construit l’endurance."
    ],
    image: { src: "/assets/guides/couvertures/trail-aix-en-provence.webp", alt: "Des coureurs du club sur un chemin bordé d’arbres" },
    photos: [
      { src: "/assets/guides/069.webp", alt: "Le groupe s’éloigne en courant sur une allée du parc", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/02.webp", alt: "Des coureuses et coureurs du club sur un sentier, en pleine sortie", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/parc-de-la-torse/sentier.webp", alt: "Des coureurs du club sur un sentier ombragé du parc de la Torse", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/10.webp", alt: "Une coureuse en gilet d’hydratation, au soleil, après la sortie", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/15.webp", alt: "Une coureuse assise à l’ombre d’un arbre, au calme après l’effort", largeur: 1600, hauteur: 900 }
    ],
    sections: [
      {
        titre: "Le trail, c’est quoi ?",
        paragraphes: [
          "Le **trail**, c’est de la course à pied en nature : sur des chemins, des sentiers de montagne, avec du **dénivelé** et un terrain irrégulier. On marche souvent dans les montées, on court sur le plat et dans les descentes.",
          "C’est une discipline plus lente que la route, mais plus variée. On regarde ses pieds, on apprend à lire le terrain, et on profite de paysages qu’on ne voit jamais depuis le bitume.",
          "Autour d’Aix-en-Provence, la nature commence presque aux portes de la ville. C’est ce qui fait de la région l’un des plus beaux terrains de jeu du sud de la France pour s’y mettre."
        ],
        citation: "Le trail, c’est accepter de marcher dans les montées. Et de sourire dans les descentes."
      },
      {
        titre: "Le plateau de Bibémus, pour commencer",
        paragraphes: [
          "À l’est de la ville, le **plateau de Bibémus** est le spot idéal pour une première sortie trail. Des chemins larges, des pins, des roches ocre, et un dénivelé raisonnable.",
          "C’est aussi un lieu chargé d’histoire : ses anciennes carrières ont inspiré **Paul Cézanne**. Les carrières elles-mêmes se visitent uniquement avec un guide, mais les chemins alentour se prêtent bien à la course.",
          "**Bon pour** : une sortie de 45 minutes à 1 heure, pour apprendre à courir sur les cailloux sans se mettre dans le rouge."
        ]
      },
      {
        titre: "Les barrages de Bimont et Zola, pour monter en puissance",
        paragraphes: [
          "Au-dessus du Tholonet, les sentiers qui relient le **barrage Zola** au **barrage de Bimont** offrent un parcours plus engagé. Ça monte, ça descend, et la vue sur l’eau et sur la Sainte-Victoire récompense chaque effort.",
          "Le barrage Zola porte le nom de **François Zola**, l’ingénieur qui l’a conçu, père de l’écrivain Émile Zola. Le lac de Bimont, lui, est une étape classique des randonneurs.",
          "**Bon pour** : une sortie plus longue, avec du dénivelé, une fois que tu es à l’aise sur les chemins."
        ]
      },
      {
        titre: "La Sainte-Victoire, le grand défi",
        paragraphes: [
          "La **montagne Sainte-Victoire** est le symbole de la région. Ses sentiers montent vers la **Croix de Provence**, d’où la vue sur la Provence est spectaculaire. Son point culminant, le pic des Mouches, dépasse les 1 000 mètres.",
          "C’est un terrain exigeant : pentes raides, pierres, passages techniques. Prévois **beaucoup d’eau**, des chaussures de trail avec une bonne accroche, et ne pars jamais sans avoir regardé la météo.",
          "Pour une première fois, le mieux est d’y aller **accompagné** de quelqu’un qui connaît les sentiers, et de choisir un itinéraire balisé."
        ]
      },
      {
        titre: "Sécurité et accès aux massifs",
        paragraphes: [
          "Du 1er juin au 30 septembre, l’accès aux massifs des Bouches-du-Rhône est réglementé selon le risque d’incendie : consulte la carte publiée chaque jour par la préfecture avant de partir.",
          "Les jours de risque élevé, l’accès peut être déconseillé ou interdit. Ce n’est pas une formalité : les incendies sont un vrai danger en Provence, et les règles protègent autant les coureurs que la forêt.",
          "Toute l’année, préviens quelqu’un de ton itinéraire, emporte un téléphone chargé, une couche contre le vent, et reste sur les sentiers balisés. Le **mistral** peut rendre les crêtes glaciales même par beau temps."
        ]
      },
      {
        titre: "Se préparer au trail depuis Aix",
        paragraphes: [
          "Le trail se prépare aussi en ville. Courir **régulièrement**, à allure tranquille, construit l’endurance dont tu auras besoin en montagne. Ajoute des côtes et des escaliers pour renforcer les jambes.",
          "Un samedi sur deux, [Nulll Club](/fr/run-club-aix-en-provence) court 5 à 6 km à allure conversation, souvent sur des chemins de terre comme au **parc de la Torse**. C’est une bonne base, et l’occasion de rencontrer d’autres coureurs qui aiment la nature.",
          "Pour connaître tous les terrains autour de la ville, lis aussi notre guide [Où courir à Aix-en-Provence](/fr/guide/ou-courir-a-aix-en-provence)."
        ]
      }
    ],
    faq: [
      { q: "Où faire du trail à Aix-en-Provence ?", a: "Les principaux spots sont le plateau de Bibémus pour débuter, les sentiers des barrages de Bimont et Zola pour le dénivelé, et la montagne Sainte-Victoire pour les sorties les plus exigeantes." },
      { q: "Peut-on courir sur la Sainte-Victoire en été ?", a: "Cela dépend du risque d’incendie. Du 1er juin au 30 septembre, l’accès aux massifs des Bouches-du-Rhône est réglementé : il faut consulter la carte publiée chaque jour par la préfecture." },
      { q: "Quel matériel pour débuter le trail ?", a: "Des chaussures de trail avec une bonne accroche, de l’eau, une couche coupe-vent et un téléphone chargé. Un sac ou une ceinture d’hydratation devient vite indispensable sur les sorties longues." },
      { q: "Comment se préparer au trail quand on court en ville ?", a: "En courant régulièrement à allure tranquille pour l’endurance, et en ajoutant des côtes et des escaliers pour les jambes. Le social run de Nulll Club, un samedi sur deux, est une bonne base." }
    ],
    liens: ["ou-courir-a-aix-en-provence", "courir-quand-il-fait-chaud-a-aix", "sport-en-plein-air-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "courir-quand-il-fait-chaud-a-aix",
    chemin: "/fr/guide/courir-quand-il-fait-chaud-a-aix",
    rubrique: "Conseils",
    titre: "Courir quand il fait chaud à Aix : nos règles pour survivre à l’été (et au mistral)",
    seoTitle: "Courir par forte chaleur à Aix-en-Provence : nos conseils",
    description:
      "Courir l’été à Aix-en-Provence sans souffrir : horaires, hydratation, parcours à l’ombre, mistral et signes d’alerte. Les conseils d’un run club aixois.",
    resume:
      "Aix en été, c’est la lumière, les cigales, et des températures qui grimpent dès le matin. Courir reste possible, mais pas n’importe comment. Voici les règles qu’on applique au club pour continuer à courir de juin à septembre.",
    enBref: [
      "En été à Aix, cours tôt le matin ou en fin de journée, quand il fait plus frais.",
      "Bois avant, pendant et après la sortie, même pour un footing court.",
      "Choisis des parcours à l’ombre, comme le parc de la Torse ou le parc Jourdan.",
      "Ralentis : par forte chaleur, il est normal de courir moins vite. Arrête-toi au moindre signe de malaise."
    ],
    image: { src: "/assets/guides/couvertures/courir-quand-il-fait-chaud-a-aix.webp", alt: "Un membre du club boit une canette après l’effort" },
    photos: [
      { src: "/assets/actus/quatrieme-run/18.webp", alt: "Un membre de l’équipe prépare le ravito, bouteilles d’eau sur la table", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/06.webp", alt: "Deux membres du club posent ensemble, bouteille d’eau à la main", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/parc-de-la-torse/passerelle.webp", alt: "Des coureurs du club traversent une passerelle du parc de la Torse", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/10.webp", alt: "Une coureuse ouvre sa canette après l’effort", largeur: 1200, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/15.webp", alt: "Une coureuse assise à l’ombre d’un arbre, au calme après l’effort", largeur: 1600, hauteur: 900 }
    ],
    sections: [
      {
        titre: "Le climat d’Aix, en deux mots",
        paragraphes: [
          "Aix-en-Provence a un **climat méditerranéen** : des hivers doux, beaucoup de soleil, et des étés **chauds et secs**. De juin à septembre, la chaleur s’installe vite dans la journée.",
          "S’y ajoute le **mistral**, ce vent du nord qui peut souffler fort plusieurs jours d’affilée. Il rafraîchit l’air, mais il assèche aussi, et rend certaines sorties plus dures qu’elles n’en ont l’air.",
          "Bonne nouvelle : avec quelques règles simples, on peut courir toute l’année à Aix. Il suffit d’adapter l’heure, le parcours et l’allure."
        ]
      },
      {
        titre: "Règle n°1 : choisir le bon horaire",
        paragraphes: [
          "En été, le meilleur moment pour courir, c’est **tôt le matin**. Avant 9h, la ville est encore fraîche, l’ombre est longue, et le sol n’a pas emmagasiné la chaleur de la journée.",
          "La **fin de journée**, après 19h, est l’autre bonne option, même si la chaleur accumulée met parfois du temps à retomber. Évite à tout prix le milieu de journée.",
          "C’est aussi pour ça que les sorties collectives du **samedi matin** marchent bien à Aix : à 10h, il fait encore bon une bonne partie de l’année."
        ],
        citation: "En été à Aix, le meilleur chrono, c’est celui de ton réveil."
      },
      {
        titre: "Règle n°2 : boire, avant, pendant, après",
        paragraphes: [
          "Bois un grand verre d’eau avant de partir, et emporte **de l’eau** même pour une sortie de 30 minutes. Une gourde à la main ou une ceinture d’hydratation suffit.",
          "Après la sortie, continue à boire. Sur les sorties longues ou très chaudes, l’eau seule peut ne pas suffire : pense à compenser les sels minéraux perdus avec la transpiration.",
          "Au club, il y a toujours un **ravito** à l’arrivée : eau et canettes de nos partenaires. C’est aussi le moment où tout le monde reste discuter."
        ]
      },
      {
        titre: "Règle n°3 : courir à l’ombre",
        paragraphes: [
          "Les parcours ombragés font une énorme différence. En ville, le **parc de la Torse** et le **parc Jourdan** offrent de l’ombre sous les arbres, et la terre y chauffe moins que le bitume.",
          "Évite les longues lignes droites en plein soleil et les côtes exposées aux heures chaudes. Pour toutes nos idées de parcours, lis [Où courir à Aix-en-Provence](/fr/guide/ou-courir-a-aix-en-provence).",
          "En montagne, souviens-toi que l’accès aux massifs est réglementé en été à cause du risque d’incendie. Vérifie toujours avant de partir."
        ]
      },
      {
        titre: "Règle n°4 : ralentir, sans culpabiliser",
        paragraphes: [
          "Par forte chaleur, le corps travaille plus pour se refroidir. Il est **normal** de courir moins vite qu’en hiver à effort égal. Ralentis, raccourcis la sortie, marche si besoin.",
          "Une casquette, des vêtements clairs et respirants, et de la crème solaire complètent l’équipement. Et apprends à reconnaître les **signes d’alerte** : vertiges, maux de tête, nausées, frissons. Au moindre doute, arrête-toi, mets-toi à l’ombre et bois."
        ]
      },
      {
        titre: "Et le mistral ?",
        paragraphes: [
          "Quand le mistral souffle, commence ta sortie **face au vent** pour finir avec lui dans le dos, quand tu es fatigué. Une couche légère coupe-vent est utile en hiver, quand il rend l’air glacial.",
          "En été, il donne une fausse impression de fraîcheur : tu transpires sans t’en rendre compte. Bois donc autant, voire plus.",
          "Courir en groupe aide aussi : on s’abrite derrière les autres, on se relaie, et les kilomètres passent plus vite. Un samedi sur deux, viens essayer avec [Nulll Club](/fr/run-club-aix-en-provence)."
        ]
      }
    ],
    faq: [
      { q: "À quelle heure courir l’été à Aix-en-Provence ?", a: "Tôt le matin, idéalement avant 9h, ou en fin de journée après 19h. Évite le milieu de journée, quand la chaleur est la plus forte." },
      { q: "Où courir à l’ombre à Aix ?", a: "Le parc de la Torse et le parc Jourdan sont les plus ombragés du centre. Leurs chemins chauffent aussi moins que le bitume." },
      { q: "Combien boire quand on court par forte chaleur ?", a: "Bois avant de partir, emporte de l’eau même pour une sortie courte, et continue à boire après. Sur les sorties longues, pense aussi aux sels minéraux." },
      { q: "Quels sont les signes d’un coup de chaleur en courant ?", a: "Vertiges, maux de tête, nausées, frissons ou confusion. Au moindre signe, arrête-toi, mets-toi à l’ombre, bois, et demande de l’aide si ça ne passe pas." }
    ],
    liens: ["courir-a-aix-en-provence", "trail-aix-en-provence", "ou-courir-a-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "sport-gratuit-aix-en-provence",
    chemin: "/fr/guide/sport-gratuit-aix-en-provence",
    rubrique: "Sport gratuit",
    titre: "Faire du sport gratuitement à Aix-en-Provence : les meilleures options (sans abonnement)",
    seoTitle: "Sport gratuit à Aix-en-Provence : nos meilleures idées",
    description:
      "Faire du sport gratuitement à Aix-en-Provence : run club gratuit le samedi, parcs, randonnée à la Sainte-Victoire, sport en plein air. Sans abonnement ni salle.",
    resume:
      "Pas envie de payer une salle de sport ? Bonne nouvelle : à Aix, le soleil, les parcs et la montagne sont gratuits. On a rassemblé les meilleures façons de se bouger sans sortir la carte bleue, seul ou en groupe.",
    enBref: [
      "Le plus simple : la course à pied, gratuite et praticable partout dans Aix.",
      "Nulll Club organise un run club gratuit un samedi sur deux, ouvert à tous les niveaux.",
      "Les parcs Jourdan et de la Torse sont parfaits pour courir, marcher ou faire du renforcement.",
      "La randonnée autour de la Sainte-Victoire et des barrages de Bimont et Zola ne coûte rien."
    ],
    image: { src: "/assets/guides/couvertures/sport-gratuit-aix-en-provence.webp", alt: "Un membre de l’équipe prépare le ravito sur la table, dans le parc" },
    photos: [
      { src: "/assets/guides/015.webp", alt: "Des membres du club trottinent sur la pelouse du parc", largeur: 900, hauteur: 1600 },
      { src: "/assets/guides/060.webp", alt: "Des coureurs du club traversent la passerelle, en pleine sortie", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/04.webp", alt: "Deux coureuses arrivent sur un chemin de terre", largeur: 1067, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/09.webp", alt: "Trois coureuses sourient à l’objectif après le run", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/bienvenue/13.webp", alt: "Quatre membres du club, canettes en main", largeur: 1066, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Pourquoi Aix est faite pour le sport gratuit",
        paragraphes: [
          "Aix-en-Provence a un atout que peu de villes ont : **le climat**. Avec beaucoup de soleil et des hivers doux, on peut faire du sport dehors presque toute l’année.",
          "La ville compte des **parcs** accessibles à pied, et la nature commence aux portes du centre. Pas besoin de matériel coûteux ni d’abonnement pour se bouger.",
          "Le vrai défi, ce n’est pas le prix. C’est la **régularité**. Et pour ça, rien ne vaut un rendez-vous fixe avec d’autres personnes."
        ]
      },
      {
        titre: "Le run club gratuit du samedi",
        paragraphes: [
          "Un samedi sur deux, [Nulll Club](/fr/run-club-aix-en-provence) organise un **social run gratuit** à Aix. Rendez-vous à **9h30**, départ à **10h**, pour 5 à 6 km à allure conversation.",
          "Pas de cotisation, pas de licence : il suffit de **créer un compte gratuit** sur le site et de s’inscrire à la sortie. Tu reçois un QR code, et après chaque run, les photos t’attendent dans ton compte.",
          "C’est ouvert à tous les niveaux, et personne n’est laissé derrière. Tu peux venir seul : c’est justement pour ça qu’on court en groupe."
        ],
        citation: "Pas d’abonnement, pas de licence, pas de prise de tête. Juste un rendez-vous, un samedi sur deux."
      },
      {
        titre: "Courir seul, n’importe quand",
        paragraphes: [
          "La course à pied reste le sport gratuit par excellence. Une paire de chaussures, et c’est parti. Le **parc Jourdan**, en plein centre, et le **parc de la Torse**, à l’est, sont parfaits pour un footing.",
          "Tôt le matin, le centre historique se prête aussi à de jolies boucles. Toutes nos idées sont dans le guide [Où courir à Aix-en-Provence](/fr/guide/ou-courir-a-aix-en-provence).",
          "Tu débutes ? Notre guide [Commencer la course à pied](/fr/guide/commencer-la-course-a-pied) te donne un plan simple sur 8 semaines."
        ]
      },
      {
        titre: "Randonner autour d’Aix",
        paragraphes: [
          "La randonnée est l’autre grand sport gratuit de la région. La **Sainte-Victoire**, le **plateau de Bibémus** et les sentiers des **barrages de Bimont et Zola** offrent des itinéraires pour tous les niveaux.",
          "Pense à vérifier la météo, à emporter de l’eau, et, en été, à consulter les conditions d’accès aux massifs, réglementé du 1er juin au 30 septembre à cause du risque d’incendie."
        ]
      },
      {
        titre: "Le renforcement en plein air",
        paragraphes: [
          "Pas besoin de salle pour se muscler. Pompes, squats, gainage, fentes : un coin de pelouse dans un parc suffit pour une séance complète au poids du corps.",
          "Les escaliers et les petites côtes du centre-ville sont aussi parfaits pour travailler les jambes et le cardio. Le tout, c’est de commencer doucement et d’être régulier."
        ]
      },
      {
        titre: "Le secret : ne pas le faire seul",
        paragraphes: [
          "Le sport gratuit a un piège : comme personne ne t’attend, il est facile de laisser tomber. La solution, c’est de te trouver **un rendez-vous** et des gens.",
          "C’est toute l’idée de Nulll Club : un créneau fixe, des têtes qu’on retrouve, et un après-course où tout le monde reste. Choisis ta date sur la page [Sorties](/fr/runs) et viens nous rejoindre."
        ]
      }
    ],
    faq: [
      { q: "Où faire du sport gratuitement à Aix-en-Provence ?", a: "Dans les parcs Jourdan et de la Torse pour courir ou se renforcer, en randonnée autour de la Sainte-Victoire, ou avec le run club gratuit de Nulll Club, un samedi sur deux." },
      { q: "Existe-t-il un club de sport gratuit à Aix ?", a: "Oui. Nulll Club est un run club associatif gratuit : un social run un samedi sur deux, ouvert à tous les niveaux, sans cotisation ni licence." },
      { q: "Comment faire du sport sans salle à Aix ?", a: "Course à pied, randonnée et renforcement au poids du corps dans les parcs. Le climat d’Aix permet de s’entraîner dehors presque toute l’année." },
      { q: "Faut-il une licence pour courir avec Nulll Club ?", a: "Non. Il suffit de créer un compte gratuit sur le site et de s’inscrire à la sortie choisie." }
    ],
    liens: ["run-club-aix-en-provence", "sport-en-plein-air-aix-en-provence", "commencer-la-course-a-pied"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "etudiant-a-aix-en-provence",
    chemin: "/fr/guide/etudiant-a-aix-en-provence",
    rubrique: "Étudiant",
    titre: "Étudiant à Aix-en-Provence : le guide pour profiter de la ville (et pas que des cours)",
    seoTitle: "Étudiant à Aix-en-Provence : le guide de la vie étudiante",
    description:
      "Étudiant à Aix-en-Provence : s’installer, sortir, faire du sport gratuitement, rencontrer du monde hors de la fac. Le guide de la vie étudiante à Aix.",
    resume:
      "Aix est l’une des grandes villes étudiantes du sud. Entre les amphis, les terrasses et la Sainte-Victoire, il y a de quoi vivre une belle vie étudiante, à condition de sortir de sa bulle. Voici nos conseils pour en profiter dès la rentrée.",
    enBref: [
      "Aix accueille notamment des facultés d’Aix-Marseille Université, Sciences Po Aix et des écoles comme Aix Ynov Campus.",
      "Le centre historique, ses places et ses terrasses sont le cœur de la vie étudiante.",
      "Pour faire du sport sans payer, Nulll Club organise un run club gratuit un samedi sur deux.",
      "Pour rencontrer du monde hors de ta promo, rejoins une activité régulière dès les premières semaines."
    ],
    image: { src: "/assets/guides/couvertures/etudiant-a-aix-en-provence.webp", alt: "Une coureuse tire la langue, bras dessus bras dessous avec un ami" },
    photos: [
      { src: "/assets/guides/063.webp", alt: "Une coureuse en sweat bleu court avec le groupe sur la passerelle", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/04.webp", alt: "Éclats de rire entre coureuses après le run", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/bienvenue/18.webp", alt: "Deux coureurs font les pitres avec une Bee Zen", largeur: 1066, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/14.webp", alt: "Un membre du club en casquette lève sa canette en riant", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/16.webp", alt: "Une coureuse en lunettes de soleil attrape une Red Bull", largeur: 1200, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Aix, une ville étudiante",
        paragraphes: [
          "Aix-en-Provence accueille chaque année de nombreux étudiants. On y trouve notamment des facultés d’**Aix-Marseille Université**, **Sciences Po Aix**, et des écoles comme **Aix Ynov Campus**, avec qui le club a organisé un [jeu concours](/fr/actu/jeu-concours-bacchantes-aix-ynov-campus).",
          "Résultat : une ville jeune, vivante, où les terrasses se remplissent dès les premiers rayons de soleil. Mais aussi une ville où il est facile de rester enfermé dans sa promo, si on n’y prend pas garde."
        ]
      },
      {
        titre: "S’installer et prendre ses repères",
        paragraphes: [
          "Le centre d’Aix se vit **à pied**. Commence par le Cours Mirabeau, puis explore le vieil Aix, la place de l’Hôtel de Ville et le quartier Mazarin. Les **marchés** du matin, comme celui de la place Richelme, sont parfaits pour faire ses courses à petit prix.",
          "Pour les démarches liées au logement et aux bourses, le **Crous** est l’interlocuteur des étudiants. Et pour tout le reste, notre guide [Nouveau à Aix-en-Provence](/fr/guide/nouveau-a-aix-en-provence) te donne une checklist du premier mois."
        ]
      },
      {
        titre: "Faire du sport sans se ruiner",
        paragraphes: [
          "Le budget étudiant est souvent serré. Bonne nouvelle : à Aix, le sport peut être **gratuit**. Les parcs, les chemins et le climat font le travail.",
          "Un samedi sur deux, [Nulll Club](/fr/run-club-aix-en-provence) organise un **social run gratuit** : 5 à 6 km à allure conversation, puis un ravito où tout le monde reste discuter. Pas de cotisation, pas de licence, juste un compte gratuit à créer.",
          "Et si tu n’as jamais couru, pas de panique : lis [Commencer la course à pied](/fr/guide/commencer-la-course-a-pied), puis viens essayer."
        ],
        citation: "Le meilleur moyen de rencontrer des gens hors de ta promo ? Courir avec eux le samedi."
      },
      {
        titre: "Sortir le soir",
        paragraphes: [
          "La vie nocturne étudiante se concentre dans le **centre historique**, autour de la **place des Cardeurs** et du Cours Mirabeau. Concerts, cinémas, théâtres : il y a aussi de quoi varier les plaisirs.",
          "Toutes nos idées sont dans le guide [Sortir à Aix-en-Provence](/fr/guide/sortir-a-aix-en-provence)."
        ]
      },
      {
        titre: "Rencontrer du monde hors de la fac",
        paragraphes: [
          "Les amis de promo, c’est bien. Mais rencontrer des gens d’autres horizons, c’est encore mieux. La clé : rejoindre **une activité régulière** dès la rentrée, et s’y tenir plusieurs semaines.",
          "Sport, association, bénévolat : l’important, c’est la répétition. Pour des idées concrètes, lis [Rencontrer des gens à Aix-en-Provence](/fr/guide/rencontrer-des-gens-a-aix-en-provence)."
        ]
      },
      {
        titre: "Le week-end, prendre l’air",
        paragraphes: [
          "Aix a un avantage énorme : la nature est à côté. Une randonnée à la **Sainte-Victoire**, une balade aux **barrages de Bimont et Zola**, ou une journée à la mer, avec Marseille à une trentaine de kilomètres.",
          "Pour remplir tes week-ends, notre guide [Idée de sortie à Aix-en-Provence](/fr/guide/sortie-a-aix-en-provence) liste dix plans testés."
        ]
      }
    ],
    faq: [
      { q: "Aix-en-Provence est-elle une ville étudiante ?", a: "Oui. Elle accueille notamment des facultés d’Aix-Marseille Université, Sciences Po Aix et plusieurs écoles, dont Aix Ynov Campus." },
      { q: "Comment faire du sport gratuitement quand on est étudiant à Aix ?", a: "En courant dans les parcs, en randonnant autour de la Sainte-Victoire, ou en rejoignant le run club gratuit de Nulll Club, un samedi sur deux." },
      { q: "Où sortir quand on est étudiant à Aix ?", a: "Dans le centre historique, autour de la place des Cardeurs et du Cours Mirabeau, ainsi que dans les salles de concert, cinémas et théâtres de la ville." },
      { q: "Comment rencontrer des gens hors de sa promo à Aix ?", a: "Rejoins une activité régulière dès la rentrée, comme un run club, une association ou du bénévolat, et tiens-la plusieurs semaines." }
    ],
    liens: ["nouveau-a-aix-en-provence", "sortir-a-aix-en-provence", "sport-gratuit-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "activites-entre-amis-aix-en-provence",
    chemin: "/fr/guide/activites-entre-amis-aix-en-provence",
    rubrique: "Entre amis",
    titre: "Activités entre amis à Aix-en-Provence : 12 idées pour sortir du sempiternel apéro",
    seoTitle: "Activités entre amis à Aix-en-Provence : 12 idées",
    description:
      "Que faire entre amis à Aix-en-Provence ? Run club gratuit, randonnée, pique-nique, marchés, musées, concerts, mer : 12 idées pour sortir du quotidien.",
    resume:
      "L’apéro, c’est bien. Mais à force, on finit toujours à la même terrasse avec les mêmes conversations. À Aix, il y a mieux à faire entre amis, et souvent pour pas cher. Voici douze idées pour vos prochains week-ends.",
    enBref: [
      "Bouger ensemble : un social run gratuit avec Nulll Club, une randonnée à la Sainte-Victoire, un footing au parc.",
      "Prendre l’air : un pique-nique au parc Jourdan, le Terrain des Peintres au coucher du soleil, une journée à la mer.",
      "Se cultiver : le musée Granet, l’Hôtel de Caumont, un spectacle au Pavillon Noir ou au Grand Théâtre de Provence.",
      "Le soir : un concert au 6MIC, un film en VO, une terrasse place des Cardeurs."
    ],
    image: { src: "/assets/guides/couvertures/activites-entre-amis-aix-en-provence.webp", alt: "Deux membres du club rient, penchées vers la table du ravito" },
    photos: [
      { src: "/assets/guides/054.webp", alt: "Une coureuse en tee-shirt rose mène le groupe sur la passerelle", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/07.webp", alt: "Trois membres du club posent après la course", largeur: 1600, hauteur: 1067 },
      { src: "/assets/actus/quatrieme-run/16.webp", alt: "Discussions autour de la table des boissons après la course", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/bee-zen/04.webp", alt: "Deux membres du club font les pitres avec une Bee Zen", largeur: 1066, hauteur: 1600 }
    ],
    sections: [
      {
        titre: "Bouger ensemble",
        paragraphes: [
          "**1. Un social run.** Un samedi sur deux, venez courir avec [Nulll Club](/fr/run-club-aix-en-provence). C’est **gratuit**, 5 à 6 km à allure conversation, et il y a un ravito à l’arrivée. Parfait pour embarquer le pote qui « ne court jamais ».",
          "**2. Une randonnée à la Sainte-Victoire.** Le grand classique aixois, avec des sentiers pour tous les niveaux. Vérifiez l’accès aux massifs en été.",
          "**3. Un footing au parc.** Le parc Jourdan ou le parc de la Torse, en fin de journée, suivi d’un verre bien mérité."
        ],
        citation: "Le meilleur souvenir entre amis, c’est rarement le dixième apéro. C’est le jour où vous avez fait quelque chose ensemble."
      },
      {
        titre: "Prendre l’air",
        paragraphes: [
          "**4. Un pique-nique au parc Jourdan.** Passez d’abord au marché du centre pour remplir le panier, puis installez-vous à l’ombre.",
          "**5. Le Terrain des Peintres au coucher du soleil.** Juste au-dessus de l’atelier de Cézanne, la vue sur la Sainte-Victoire est imbattable.",
          "**6. Une journée à la mer.** Marseille est à une trentaine de kilomètres d’Aix : une escapade sur le littoral s’organise facilement."
        ]
      },
      {
        titre: "Se cultiver sans s’ennuyer",
        paragraphes: [
          "**7. Une expo.** Le **musée Granet** et l’**Hôtel de Caumont** proposent des expositions qui valent le détour. Parfait les jours de grosse chaleur ou de pluie.",
          "**8. Sur les pas de Cézanne.** Son atelier des Lauves se visite, et le plateau de Bibémus se découvre lors de visites guidées.",
          "**9. Un spectacle.** Danse au **Pavillon Noir**, maison du Ballet Preljocaj, ou grande soirée au **Grand Théâtre de Provence**."
        ]
      },
      {
        titre: "Le soir, autrement",
        paragraphes: [
          "**10. Un concert au 6MIC**, la salle de musiques actuelles d’Aix.",
          "**11. Un film en VO** dans l’un des cinémas du centre-ville.",
          "**12. Une terrasse place des Cardeurs**, mais cette fois pour fêter quelque chose que vous avez fait ensemble. Plus d’idées dans [Sortir à Aix-en-Provence](/fr/guide/sortir-a-aix-en-provence)."
        ]
      },
      {
        titre: "Et si vous ne connaissez pas encore assez de monde ?",
        paragraphes: [
          "Pas d’amis à Aix pour l’instant ? C’est le cas de beaucoup de nouveaux arrivants. La solution, c’est de commencer par une activité régulière où l’on rencontre du monde.",
          "Chez nous, on se rencontre en courant le samedi, et on finit souvent par faire d’autres choses ensemble. Lis aussi [Rencontrer des gens à Aix-en-Provence](/fr/guide/rencontrer-des-gens-a-aix-en-provence)."
        ]
      }
    ],
    faq: [
      { q: "Que faire entre amis à Aix-en-Provence ?", a: "Un social run gratuit avec Nulll Club, une randonnée à la Sainte-Victoire, un pique-nique au parc Jourdan, une expo au musée Granet, un concert au 6MIC ou une escapade à la mer." },
      { q: "Quelle activité gratuite faire entre amis à Aix ?", a: "Le run club de Nulll Club, un samedi sur deux, un pique-nique au parc, une randonnée ou le Terrain des Peintres au coucher du soleil." },
      { q: "Que faire entre amis à Aix quand il pleut ?", a: "Une exposition au musée Granet ou à l’Hôtel de Caumont, un film en VO dans un cinéma du centre, ou un spectacle." },
      { q: "Quelle activité sportive faire entre amis à Aix ?", a: "Courir ensemble avec Nulll Club, faire une randonnée autour de la Sainte-Victoire ou des barrages de Bimont et Zola." }
    ],
    liens: ["sortie-a-aix-en-provence", "sortir-a-aix-en-provence", "que-faire-a-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "reprendre-la-course-a-pied",
    chemin: "/fr/guide/reprendre-la-course-a-pied",
    rubrique: "Reprise",
    titre: "Reprendre la course à pied après une pause : la méthode douce pour revenir sans se blesser",
    seoTitle: "Reprendre la course à pied après une pause : la méthode",
    description:
      "Reprendre la course à pied après plusieurs mois d’arrêt : repartir lentement, alterner marche et course, écouter son corps et retrouver la motivation en groupe.",
    resume:
      "Tu as couru, puis la vie a pris le dessus : boulot, études, blessure, déménagement. Aujourd’hui, tu veux t’y remettre. Bonne nouvelle : le corps se souvient. Mauvaise nouvelle : il faut lui laisser le temps. Voici comment revenir sans brûler les étapes.",
    enBref: [
      "Après une longue pause, repars plus bas que ton ancien niveau : volume réduit, allure lente.",
      "Alterne marche et course les premières semaines, puis augmente progressivement.",
      "Ne monte pas le volume de plus de 10 % environ par semaine, et garde des jours de repos.",
      "Un rendez-vous régulier en groupe, comme le social run de Nulll Club, aide à tenir dans la durée."
    ],
    image: { src: "/assets/guides/couvertures/reprendre-la-course-a-pied.webp", alt: "Un coureur en gilet d’hydratation sourit dans le parc" },
    photos: [
      { src: "/assets/guides/013.webp", alt: "Un coureur en sweat gris trottine sur la pelouse du parc", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/04.webp", alt: "Deux coureuses arrivent sur un chemin de terre", largeur: 1067, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/11.webp", alt: "Un membre du club en sweat gris, souriant dans le parc", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/13.webp", alt: "Un coureur en gilet bleu profite de l’après-run sous les arbres", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/09.webp", alt: "Trois coureuses sourient à l’objectif après le run", largeur: 1600, hauteur: 900 }
    ],
    sections: [
      {
        titre: "Le piège de la reprise",
        paragraphes: [
          "Quand on reprend, on a en tête **son ancien niveau**. On se souvient de ses 10 km faciles, de son allure d’avant. Et on veut y retourner tout de suite.",
          "C’est là que les blessures arrivent. Le souffle revient vite, mais les **tendons, les articulations et les muscles** mettent plus de temps à se réhabituer aux chocs de la course.",
          "La règle d’or : **repartir plus bas** que ce que tu crois pouvoir faire. Tu auras l’impression d’en faire trop peu. C’est exactement le but."
        ],
        citation: "Le souffle revient en deux semaines. Les tendons, eux, prennent leur temps."
      },
      {
        titre: "Les premières semaines",
        paragraphes: [
          "Selon la durée de ta pause, commence par **alterner marche et course** : par exemple 3 minutes de course, 1 minute de marche, à répéter 5 ou 6 fois. Trois sorties par semaine, avec un jour de repos entre chaque.",
          "Cours **lentement**, à une allure où tu peux parler. Oublie le chrono pour l’instant : la vitesse reviendra d’elle-même quand la base sera reconstruite.",
          "Si tu n’as jamais vraiment couru, ou si ta pause a duré plusieurs années, suis plutôt notre plan [Commencer la course à pied](/fr/guide/commencer-la-course-a-pied)."
        ]
      },
      {
        titre: "Augmenter sans se blesser",
        paragraphes: [
          "Une fois que tu cours 30 minutes sans t’arrêter, augmente **progressivement**. Un repère souvent cité : ne pas augmenter ton volume de plus de **10 % environ** d’une semaine à l’autre.",
          "Toutes les trois ou quatre semaines, prévois une semaine plus légère pour laisser le corps assimiler. Et garde au moins **un jour de repos** entre deux sorties au début."
        ]
      },
      {
        titre: "Écouter son corps",
        paragraphes: [
          "Une fatigue musculaire après une sortie, c’est normal. Une **douleur** qui persiste, qui s’aggrave en courant ou qui te fait boiter, non. Dans ce cas, arrête-toi et consulte un professionnel de santé.",
          "Après une blessure, demande l’avis d’un médecin ou d’un kiné avant de reprendre. Et n’hésite pas à remplacer une sortie par de la marche ou du vélo les jours où le corps dit stop."
        ]
      },
      {
        titre: "Retrouver la motivation",
        paragraphes: [
          "La reprise, c’est souvent plus une affaire de **tête** que de jambes. On se compare à avant, on se décourage. Le meilleur remède : un objectif simple et un rendez-vous fixe.",
          "Un samedi sur deux, [Nulll Club](/fr/run-club-aix-en-provence) court **5 à 6 km à allure conversation** à Aix-en-Provence. Personne n’est laissé derrière, et personne ne regarde ton chrono. C’est le cadre idéal pour reprendre en douceur.",
          "Et après la course, il y a le ravito. C’est souvent ce moment-là qui donne envie de revenir la fois suivante."
        ]
      },
      {
        titre: "Où reprendre à Aix",
        paragraphes: [
          "Pour les premières sorties, privilégie des terrains **souples et plats** : les allées du **parc Jourdan** ou les chemins de terre du **parc de la Torse** ménagent davantage les articulations que le bitume.",
          "En été, cours tôt le matin, et lis nos conseils pour [courir quand il fait chaud à Aix](/fr/guide/courir-quand-il-fait-chaud-a-aix)."
        ]
      }
    ],
    faq: [
      { q: "Comment reprendre la course à pied après plusieurs mois d’arrêt ?", a: "En repartant plus bas que ton ancien niveau : alterne marche et course, cours lentement, trois fois par semaine, puis augmente progressivement." },
      { q: "Combien de temps pour retrouver son niveau en course à pied ?", a: "Cela dépend de la durée de l’arrêt et de ton niveau d’avant. Le souffle revient vite, mais il faut souvent plusieurs semaines pour que les tendons et les articulations se réhabituent." },
      { q: "Faut-il voir un médecin avant de reprendre la course ?", a: "C’est recommandé après une blessure, une longue période d’inactivité ou en cas de problème de santé. Au moindre doute, demande l’avis d’un professionnel." },
      { q: "Où reprendre la course à pied en groupe à Aix ?", a: "Avec Nulll Club, un samedi sur deux : 5 à 6 km à allure conversation, gratuit et ouvert à tous les niveaux." }
    ],
    liens: ["commencer-la-course-a-pied", "courir-en-groupe", "run-club-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "courir-en-groupe",
    chemin: "/fr/guide/courir-en-groupe",
    rubrique: "Courir en groupe",
    titre: "Courir en groupe : pourquoi ça change tout (et comment trouver le bon à Aix)",
    seoTitle: "Courir en groupe à Aix-en-Provence : pourquoi ça change tout",
    description:
      "Pourquoi courir en groupe aide à progresser et à tenir : motivation, régularité, rencontres. Comment choisir son groupe de course à Aix-en-Provence.",
    resume:
      "Courir seul, c’est la liberté. Courir en groupe, c’est la régularité, la motivation, et des rencontres qu’on n’aurait jamais faites autrement. Voici pourquoi tant de gens s’y mettent, et comment choisir le groupe qui te correspond à Aix.",
    enBref: [
      "Courir en groupe aide à tenir : un rendez-vous fixe et des gens qui t’attendent rendent la régularité plus facile.",
      "Les kilomètres passent plus vite quand on discute, et l’effort paraît moins dur.",
      "Avant de rejoindre un groupe, vérifie l’allure annoncée, le lieu, l’horaire et le niveau attendu.",
      "À Aix, Nulll Club court un samedi sur deux à allure conversation, gratuitement et sans laisser personne derrière."
    ],
    image: { src: "/assets/guides/couvertures/courir-en-groupe.webp", alt: "Des coureurs du club partent au soleil sur un chemin de terre" },
    photos: [
      { src: "/assets/guides/060.webp", alt: "Des coureurs du club traversent la passerelle, en pleine sortie", largeur: 900, hauteur: 1600 },
      { src: "/assets/guides/015.webp", alt: "Des membres du club trottinent sur la pelouse du parc", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/15.webp", alt: "Le peloton du samedi sur un chemin ombragé", largeur: 1067, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/08.webp", alt: "Le groupe se retrouve sur la pelouse après la course", largeur: 1600, hauteur: 900 }
    ],
    sections: [
      {
        titre: "La régularité, avant tout",
        paragraphes: [
          "Le plus dur en course à pied, ce n’est pas de courir. C’est de **continuer** à courir semaine après semaine. Seul, il suffit d’une journée fatigante ou d’un ciel gris pour annuler.",
          "En groupe, il y a **un rendez-vous** et des gens qui t’attendent. On y va même quand on n’a pas très envie, et on rentre content d’y être allé. Sur la durée, c’est ce qui fait la différence."
        ],
        citation: "Seul, on court quand on a envie. En groupe, on court parce qu’on a rendez-vous."
      },
      {
        titre: "Des kilomètres qui passent plus vite",
        paragraphes: [
          "Quand on discute en courant, on ne compte plus les minutes. L’effort paraît plus léger, et on se surprend à finir des distances qu’on n’aurait jamais tentées seul.",
          "C’est tout l’intérêt de **l’allure conversation** : assez lente pour parler, assez régulière pour progresser. C’est aussi la meilleure allure pour construire son endurance."
        ]
      },
      {
        titre: "Rencontrer du monde",
        paragraphes: [
          "Un groupe de course, c’est aussi une **communauté**. On y croise des étudiants, des actifs, des nouveaux arrivants, des débutants et des habitués. Tous partagent au moins une chose : l’envie de bouger ensemble.",
          "Dans un **social run**, l’après-course compte autant que la course. C’est là que les inconnus du départ deviennent des têtes connues. Lis aussi [Rencontrer des gens à Aix-en-Provence](/fr/guide/rencontrer-des-gens-a-aix-en-provence)."
        ]
      },
      {
        titre: "Bien choisir son groupe",
        paragraphes: [
          "Avant de rejoindre un groupe, vérifie **l’allure annoncée**. Un groupe qui ne précise pas son rythme finit souvent par courir trop vite pour les nouveaux venus.",
          "Regarde aussi le **lieu et l’horaire**, la **distance**, le **prix** éventuel, et la façon de contacter les organisateurs. Un bon groupe répond à tes questions avant ta première venue.",
          "Enfin, demande-toi ce que tu cherches : préparer une course, progresser en vitesse, ou simplement courir avec des gens sympas. Il y a un groupe pour chaque envie."
        ]
      },
      {
        titre: "Le groupe du samedi à Aix",
        paragraphes: [
          "À Aix-en-Provence, [Nulll Club](/fr/run-club-aix-en-provence) a fait un choix clair : courir **ensemble**, pas les uns contre les autres. Un samedi sur deux, rendez-vous à **9h30**, départ à **10h**, pour 5 à 6 km à allure conversation.",
          "C’est **gratuit**, ouvert à tous les niveaux, et **personne n’est laissé derrière**. Pour venir, crée ton compte gratuit et inscris-toi à la sortie sur la page [Sorties](/fr/runs)."
        ]
      }
    ],
    faq: [
      { q: "Pourquoi courir en groupe ?", a: "Pour la régularité, grâce à un rendez-vous fixe, pour la motivation, et pour les rencontres. Les kilomètres passent aussi plus vite quand on discute." },
      { q: "Comment trouver un groupe de course à pied à Aix-en-Provence ?", a: "Nulll Club organise un social run gratuit un samedi sur deux à Aix, ouvert à tous les niveaux. Vérifie toujours l’allure, le lieu et l’horaire d’un groupe avant d’y aller." },
      { q: "Faut-il un bon niveau pour courir en groupe ?", a: "Pas forcément. Certains groupes, comme Nulll Club, courent à allure conversation et attendent tout le monde. D’autres sont orientés performance : renseigne-toi avant." },
      { q: "C’est quoi l’allure conversation ?", a: "C’est une allure assez lente pour pouvoir discuter en courant. C’est la meilleure pour construire son endurance et la plus agréable en groupe." }
    ],
    liens: ["run-club-aix-en-provence", "rencontrer-des-gens-a-aix-en-provence", "reprendre-la-course-a-pied"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "preparer-sa-premiere-course",
    chemin: "/fr/guide/preparer-sa-premiere-course",
    rubrique: "Première course",
    titre: "Préparer sa première course de 5 ou 10 km : le guide pour franchir la ligne avec le sourire",
    seoTitle: "Préparer sa première course de 5 ou 10 km : le guide",
    description:
      "Préparer sa première course à pied de 5 ou 10 km : choisir sa course, s’entraîner, gérer la veille et le jour J, les formalités. Conseils d’un run club aixois.",
    resume:
      "Accrocher un dossard, entendre le départ, franchir la ligne : la première course, on s’en souvient toute sa vie. Pas besoin d’être un athlète pour s’y lancer. Voici comment choisir ta course, t’entraîner et vivre le jour J sereinement.",
    enBref: [
      "Choisis une première course courte, 5 ou 10 km, sur un parcours plutôt plat.",
      "Compte plusieurs semaines de préparation, avec trois sorties par semaine à allure tranquille.",
      "Vérifie les formalités dans le règlement : en France, les non-licenciés doivent souvent suivre le Parcours Prévention Santé (PPS).",
      "Le jour J, ne teste rien de nouveau, pars doucement, et profite."
    ],
    image: { src: "/assets/guides/couvertures/preparer-sa-premiere-course.webp", alt: "Un membre du club éclate de rire au départ" },
    photos: [
      { src: "/assets/guides/054.webp", alt: "Une coureuse en tee-shirt rose mène le groupe sur la passerelle", largeur: 900, hauteur: 1600 },
      { src: "/assets/guides/048.webp", alt: "Une quinzaine de coureurs du club arrivent le long d’une barrière en bois, au parc", largeur: 1600, hauteur: 900 },
      { src: "/assets/actus/quatrieme-run/05.webp", alt: "Un coureur en maillot rose, tout sourire après la sortie", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/12.webp", alt: "Un coureur reçoit une Red Bull à l’arrivée", largeur: 1200, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/04.webp", alt: "Éclats de rire entre coureuses après le run", largeur: 1600, hauteur: 900 }
    ],
    sections: [
      {
        titre: "Choisir sa première course",
        paragraphes: [
          "Pour une première, vise **court** : un **5 km** si tu débutes, un **10 km** si tu cours déjà régulièrement. Un parcours plutôt plat, en ville ou sur route, rend l’expérience plus agréable.",
          "Choisis aussi une course qui a du sens pour toi. En novembre 2026, la team NULLL a couru **Les Bacchantes** à Aix, une course solidaire qui sensibilise aux cancers masculins. On raconte tout dans [On a couru pour plus grand que nous](/fr/actu/equipe-nulll-les-bacchantes-aix-2026)."
        ],
        citation: "Ta première course, ce n’est pas un chrono. C’est un souvenir."
      },
      {
        titre: "Combien de temps pour se préparer",
        paragraphes: [
          "Si tu pars de zéro, compte d’abord le temps de pouvoir **courir 30 minutes sans t’arrêter**, environ 8 semaines avec notre plan [Commencer la course à pied](/fr/guide/commencer-la-course-a-pied). Un 5 km devient alors accessible.",
          "Pour un 10 km, ajoute plusieurs semaines pour allonger progressivement ta sortie la plus longue. **Trois sorties par semaine**, majoritairement à allure tranquille, suffisent largement pour finir avec le sourire."
        ]
      },
      {
        titre: "Une semaine d’entraînement type",
        paragraphes: [
          "**Une sortie facile** de 30 à 45 minutes, à allure conversation. **Une sortie un peu plus rythmée**, avec quelques accélérations ou des côtes. **Une sortie longue**, qui s’allonge un peu chaque semaine.",
          "Entre les deux, du repos. Les progrès se font pendant la récupération, pas pendant l’effort. Et si tu as un doute sur ta santé, demande l’avis d’un médecin avant de te lancer."
        ]
      },
      {
        titre: "Les formalités à ne pas oublier",
        paragraphes: [
          "Lis attentivement le **règlement** de la course. En France, pour les courses hors stade, les coureurs non licenciés doivent souvent avoir suivi le **Parcours Prévention Santé** (PPS), à faire en ligne avant l’épreuve.",
          "Vérifie aussi le lieu et l’heure de retrait des **dossards**, l’heure du départ, et les éventuelles consignes d’accès. Mieux vaut tout préparer la veille."
        ]
      },
      {
        titre: "La veille et le jour J",
        paragraphes: [
          "La veille, mange normalement, bois bien et prépare tes affaires. Le jour J, **ne teste rien de nouveau** : ni chaussures, ni tenue, ni petit-déjeuner inhabituel.",
          "Arrive en avance, échauffe-toi doucement, et **pars lentement**. L’adrénaline du départ pousse à partir trop vite : c’est l’erreur la plus fréquente. Garde des forces pour la fin, et profite de l’ambiance."
        ]
      },
      {
        titre: "S’entraîner en groupe à Aix",
        paragraphes: [
          "Préparer une course seul, c’est possible. Mais c’est bien plus facile avec des gens. Un samedi sur deux, [Nulll Club](/fr/run-club-aix-en-provence) court 5 à 6 km à allure conversation à Aix : une parfaite sortie facile pour ta semaine.",
          "Et qui sait, tu y trouveras peut-être des partenaires pour ta première course. Les dates sont sur la page [Sorties](/fr/runs)."
        ]
      }
    ],
    faq: [
      { q: "Combien de temps pour préparer un 5 km ?", a: "Si tu pars de zéro, environ 8 semaines pour courir 30 minutes d’affilée, soit à peu près la durée d’un 5 km à allure tranquille." },
      { q: "Faut-il un certificat médical pour courir une course en France ?", a: "Pour les courses hors stade, les non-licenciés doivent souvent avoir suivi le Parcours Prévention Santé (PPS), à faire en ligne. Vérifie toujours le règlement de la course." },
      { q: "Quelle est l’erreur la plus fréquente lors d’une première course ?", a: "Partir trop vite, porté par l’adrénaline du départ. Pars lentement et garde des forces pour la fin." },
      { q: "Peut-on préparer sa première course en groupe à Aix ?", a: "Oui. Le social run gratuit de Nulll Club, un samedi sur deux, est une bonne sortie facile à intégrer à ta préparation." }
    ],
    liens: ["commencer-la-course-a-pied", "courir-en-groupe", "evenements-running-aix"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "samedi-matin-a-aix-en-provence",
    chemin: "/fr/guide/samedi-matin-a-aix-en-provence",
    rubrique: "Samedi matin",
    titre: "Que faire le samedi matin à Aix-en-Provence ? Le programme parfait, de 8h à midi",
    seoTitle: "Que faire le samedi matin à Aix-en-Provence ?",
    description:
      "Que faire le samedi matin à Aix-en-Provence : marchés, run club gratuit, café en terrasse, balade au centre ou à la Sainte-Victoire. Notre programme idéal.",
    resume:
      "Le samedi matin, Aix est à son meilleur : les marchés s’installent, l’air est encore frais, et la ville s’éveille doucement. Voici notre programme idéal pour en profiter, de l’heure du croissant à celle de l’apéro.",
    enBref: [
      "Le samedi matin, les marchés du centre sont ouverts, dont le marché de producteurs de la place Richelme.",
      "Un samedi sur deux, Nulll Club donne rendez-vous à 9h30 pour un social run gratuit, départ 10h.",
      "Après l’effort, le Cours Mirabeau et les places du centre attendent pour un café en terrasse.",
      "Pour les plus matinaux, une balade au Terrain des Peintres ou au pied de la Sainte-Victoire."
    ],
    image: { src: "/assets/guides/couvertures/samedi-matin-a-aix-en-provence.webp", alt: "Le ravito du samedi matin, entouré de membres du club" },
    photos: [
      { src: "/assets/actus/bienvenue/03.webp", alt: "Le groupe rassemblé à l’ombre avant de partir", largeur: 1066, hauteur: 1600 },
      { src: "/assets/guides/069.webp", alt: "Le groupe s’éloigne en courant sur une allée du parc", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/06.webp", alt: "Un membre de l’équipe tend des canettes Bee Zen devant la table des boissons", largeur: 1067, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/07.webp", alt: "Une coureuse en sweat jaune raconte sa sortie au groupe", largeur: 1600, hauteur: 900 }
    ],
    sections: [
      {
        titre: "8h : le marché",
        paragraphes: [
          "Commence par le **marché de producteurs de la place Richelme**, ouvert tous les matins. Fruits, légumes, fromages : c’est le cœur gourmand du centre.",
          "Le samedi, c’est aussi jour de **grand marché** dans le centre-ville, comme le mardi et le jeudi. Prends le temps de flâner entre les étals avant que la foule n’arrive."
        ]
      },
      {
        titre: "9h30 : le social run",
        paragraphes: [
          "Un samedi sur deux, rejoins [Nulll Club](/fr/run-club-aix-en-provence) pour le **social run** : rendez-vous à **9h30**, départ à **10h**, au parking du chemin de la Cible, près du lycée Émile Zola, sauf si la sortie annonce un autre point de départ.",
          "On court **5 à 6 km à allure conversation**, puis on reste pour le ravito. C’est **gratuit**, ouvert à tous les niveaux, et tu peux venir seul. Les dates sont sur la page [Sorties](/fr/runs)."
        ],
        citation: "Le samedi matin à Aix : marché, run, terrasse. Dans cet ordre."
      },
      {
        titre: "11h30 : la terrasse",
        paragraphes: [
          "Après l’effort, le réconfort. Le **Cours Mirabeau** et les places du centre historique sont parfaits pour un café ou un jus en terrasse, au soleil.",
          "C’est souvent là que les conversations commencées pendant la course se prolongent. Et que naissent les plans du week-end."
        ]
      },
      {
        titre: "Pour les lève-tôt : prendre de la hauteur",
        paragraphes: [
          "Tu préfères la nature ? Monte au **Terrain des Peintres**, au-dessus de l’atelier de Cézanne, pour voir la Sainte-Victoire dans la lumière du matin.",
          "Plus sportif, une sortie aux **barrages de Bimont et Zola** ou sur les sentiers de la Sainte-Victoire. En été, pars très tôt et vérifie l’accès aux massifs."
        ]
      },
      {
        titre: "Les samedis sans run",
        paragraphes: [
          "Le club court un samedi sur deux. Les autres samedis, profite-en pour courir seul dans les parcs, découvrir un musée ou partir en balade.",
          "Toutes nos idées sont dans [Idée de sortie à Aix-en-Provence](/fr/guide/sortie-a-aix-en-provence) et [Que faire à Aix-en-Provence](/fr/guide/que-faire-a-aix-en-provence)."
        ]
      }
    ],
    faq: [
      { q: "Que faire le samedi matin à Aix-en-Provence ?", a: "Le marché, un social run gratuit avec Nulll Club un samedi sur deux, puis un café en terrasse sur le Cours Mirabeau." },
      { q: "Y a-t-il un marché le samedi à Aix-en-Provence ?", a: "Oui. Le marché de producteurs de la place Richelme a lieu tous les matins, et les grands marchés du centre se tiennent le mardi, le jeudi et le samedi matin." },
      { q: "À quelle heure est le run club du samedi à Aix ?", a: "Nulll Club donne rendez-vous à 9h30 pour un départ à 10h, un samedi sur deux. Chaque sortie annonce son point de départ." },
      { q: "Que faire le samedi matin à Aix quand on est nouveau ?", a: "Rejoindre le social run de Nulll Club : c’est gratuit, ouvert à tous, et pensé pour rencontrer du monde." }
    ],
    liens: ["sortie-a-aix-en-provence", "run-club-aix-en-provence", "nouveau-a-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  },
  {
    slug: "sport-en-plein-air-aix-en-provence",
    chemin: "/fr/guide/sport-en-plein-air-aix-en-provence",
    rubrique: "Plein air",
    titre: "Sport en plein air à Aix-en-Provence : courir, randonner, se muscler au soleil",
    seoTitle: "Sport en plein air à Aix-en-Provence : où et comment",
    description:
      "Faire du sport en plein air à Aix-en-Provence : course à pied, run club, trail, randonnée, renforcement dans les parcs. Les meilleurs spots et nos conseils.",
    resume:
      "À Aix, la meilleure salle de sport n’a pas de toit. Parcs ombragés, chemins de terre, montagne à l’horizon : tout invite à bouger dehors. Voici comment profiter du plein air, quel que soit ton sport.",
    enBref: [
      "Les parcs Jourdan et de la Torse sont les deux spots de sport en plein air les plus pratiques du centre.",
      "Pour la nature : le plateau de Bibémus, les barrages de Bimont et Zola et la Sainte-Victoire.",
      "Le climat permet de faire du sport dehors presque toute l’année, en adaptant l’horaire l’été.",
      "Pour bouger en groupe, Nulll Club organise un run club gratuit un samedi sur deux."
    ],
    image: { src: "/assets/guides/couvertures/sport-en-plein-air-aix-en-provence.webp", alt: "Des coureuses du club traversent la passerelle du parc" },
    photos: [
      { src: "/assets/guides/054.webp", alt: "Une coureuse en tee-shirt rose mène le groupe sur la passerelle", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/parc-de-la-torse/sentier.webp", alt: "Des coureurs du club sur un sentier ombragé du parc de la Torse", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/bienvenue/14.webp", alt: "Un coureur pose au milieu des arbres", largeur: 1066, hauteur: 1600 },
      { src: "/assets/guides/013.webp", alt: "Un coureur en sweat gris trottine sur la pelouse du parc", largeur: 900, hauteur: 1600 },
      { src: "/assets/actus/quatrieme-run/13.webp", alt: "Un coureur en gilet bleu profite de l’après-run sous les arbres", largeur: 1600, hauteur: 900 }
    ],
    sections: [
      {
        titre: "Pourquoi bouger dehors à Aix",
        paragraphes: [
          "Le climat méditerranéen d’Aix-en-Provence offre **beaucoup de soleil** et des hivers doux. C’est l’une des villes les plus agréables pour faire du sport en plein air, presque toute l’année.",
          "Bouger dehors, c’est aussi changer de décor, respirer, et profiter de paysages qui ont inspiré Cézanne. Sans abonnement, sans file d’attente aux machines."
        ],
        citation: "À Aix, la plus belle salle de sport a la Sainte-Victoire pour plafond."
      },
      {
        titre: "La course à pied, le sport roi",
        paragraphes: [
          "Courir est le sport de plein air le plus simple : une paire de chaussures et c’est parti. En ville, le **parc Jourdan** et le **parc de la Torse** sont les spots les plus pratiques.",
          "Pour courir en groupe, [Nulll Club](/fr/run-club-aix-en-provence) organise un social run **gratuit** un samedi sur deux : 5 à 6 km à allure conversation, puis ravito. Tous nos parcours préférés sont dans [Où courir à Aix-en-Provence](/fr/guide/ou-courir-a-aix-en-provence)."
        ]
      },
      {
        titre: "Trail et randonnée",
        paragraphes: [
          "Dès qu’on quitte le centre, la nature prend le relais. Le **plateau de Bibémus**, les sentiers des **barrages de Bimont et Zola** et la **Sainte-Victoire** offrent des terrains de randonnée et de trail pour tous les niveaux.",
          "Du 1er juin au 30 septembre, l’accès aux massifs des Bouches-du-Rhône est réglementé selon le risque d’incendie : consulte la carte de la préfecture avant de partir. Pour aller plus loin, lis [Trail autour d’Aix-en-Provence](/fr/guide/trail-aix-en-provence)."
        ]
      },
      {
        titre: "Le renforcement au parc",
        paragraphes: [
          "Une pelouse, un banc, quelques marches : c’est tout ce qu’il faut pour une séance de **renforcement au poids du corps**. Pompes, squats, fentes, gainage, à enchaîner en circuit.",
          "Combiner course et renforcement est idéal : les muscles renforcés protègent les articulations et rendent la course plus efficace. Deux petites séances par semaine suffisent pour sentir la différence."
        ]
      },
      {
        titre: "Adapter sa pratique aux saisons",
        paragraphes: [
          "En **été**, bouge tôt le matin ou en fin de journée, cherche l’ombre et emporte de l’eau. Nos conseils sont dans [Courir quand il fait chaud à Aix](/fr/guide/courir-quand-il-fait-chaud-a-aix).",
          "En **hiver**, les journées ensoleillées sont nombreuses, mais le **mistral** peut rendre l’air glacial. Une couche coupe-vent et des gants légers font l’affaire."
        ]
      },
      {
        titre: "Bouger ensemble",
        paragraphes: [
          "Le sport en plein air est encore meilleur à plusieurs. On se motive, on se relaie, et on prolonge par un moment ensemble.",
          "Un samedi sur deux, viens courir avec nous. C’est gratuit, ouvert à tous, et ça se passe dehors, évidemment. Les dates sont sur la page [Sorties](/fr/runs)."
        ]
      }
    ],
    faq: [
      { q: "Où faire du sport en plein air à Aix-en-Provence ?", a: "Dans les parcs Jourdan et de la Torse pour la course et le renforcement, et autour de la Sainte-Victoire, du plateau de Bibémus et des barrages de Bimont et Zola pour la randonnée et le trail." },
      { q: "Peut-on faire du sport dehors toute l’année à Aix ?", a: "Oui, le climat méditerranéen le permet. L’été, il faut adapter les horaires à la chaleur, et l’hiver se protéger du mistral." },
      { q: "Quel sport de plein air faire en groupe à Aix ?", a: "La course à pied avec Nulll Club, un samedi sur deux, gratuitement et à allure conversation, ou la randonnée entre amis." },
      { q: "Faut-il une autorisation pour aller dans les massifs l’été ?", a: "Du 1er juin au 30 septembre, l’accès aux massifs des Bouches-du-Rhône est réglementé selon le risque d’incendie : il faut consulter la carte publiée chaque jour par la préfecture." }
    ],
    liens: ["sport-gratuit-aix-en-provence", "trail-aix-en-provence", "ou-courir-a-aix-en-provence"],
    datePublication: "2026-11-19",
    dateMiseAJour: "2026-11-19"
  }
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

/** Guides servis par la route generique /fr/guide/[slug]. */
export function guidesDeLaRubrique(): Guide[] {
  return GUIDES.filter((guide) => guide.chemin.startsWith("/fr/guide/"));
}
