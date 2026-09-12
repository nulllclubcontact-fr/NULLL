export const locales = ["fr"] as const;

export type Locale = (typeof locales)[number];

export type RouteKey =
  | "home"
  | "runs"
  | "community"
  | "merch"
  | "about"
  | "contact"
  | "checkout"
  | "localClub"
  | "localRunning"
  | "localEvents";

export type RunEvent = {
  id: string;
  date: string;
  isoDate: string;
  time: string;
  title: string;
  distance: string;
  pace: string;
  location: string;
  address: string;
  summary: string;
  afterRun: string;
  /** Photo choisie dans l'admin ; a defaut, la page prend une photo du club. */
  image?: string | null;
  /** Faux si l'admin a ferme les inscriptions ou si la date limite est passee. */
  inscriptionsOuvertes?: boolean;
};

export type Product = {
  id: string;
  image: string;
  alt: string;
  name: string;
  price: number;
  badge: string;
  description: string;
  fit: string;
};

export type Article = {
  key: Exclude<RouteKey, "home" | "runs" | "community" | "merch" | "about" | "contact" | "checkout">;
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: Array<{
    title: string;
    body: string[];
  }>;
};

const routeSlugs: Record<Locale, Record<RouteKey, string>> = {
  fr: {
    home: "",
    runs: "runs",
    community: "communaute",
    merch: "merch",
    about: "a-propos",
    contact: "contact",
    checkout: "commande",
    localClub: "run-club-aix-en-provence",
    localRunning: "courir-a-aix-en-provence",
    localEvents: "evenements-running-aix"
  }
};

export const productsByLocale: Record<Locale, Product[]> = {
  fr: [
    {
      id: "tee-noir",
      image: "/assets/merch/tee-black-blank.webp",
      alt: "T-shirt noir NULLL.CLUB",
      name: "T-shirt noir club",
      price: 35,
      badge: "Edition Aix 001",
      description: "Le t-shirt noir du club.",
      fit: "Coupe droite, coton lourd, unisexe."
    },
    {
      id: "tee-blanc",
      image: "/assets/merch/tee-white-blank.webp",
      alt: "T-shirt blanc NULLL.CLUB",
      name: "T-shirt blanc signal",
      price: 35,
      badge: "Edition Aix 001",
      description: "La version claire du t-shirt du club.",
      fit: "Coupe droite, coton lourd, unisexe."
    },
    {
      id: "tee-social",
      image: "/assets/merch/tee-black-blank.webp",
      alt: "T-shirt noir message social NULLL.CLUB",
      name: "T-shirt social warning",
      price: 38,
      badge: "Edition 001",
      description: "Une pièce avec un message, pour soutenir le club.",
      fit: "Coupe droite, coton lourd, unisexe."
    }
  ]
};

const sharedEvents: Array<Omit<RunEvent, "title" | "summary" | "afterRun" | "pace">> = [
  {
    id: "sept-26",
    date: "Samedi 26 septembre 2026",
    isoDate: "2026-09-26T08:30:00+02:00",
    time: "08:30",
    distance: "5 km",
    location: "Parking Émile Zola",
    address: "Parking Émile Zola, Aix-en-Provence"
  },
  {
    id: "oct-03",
    date: "Samedi 3 octobre 2026",
    isoDate: "2026-10-03T08:30:00+02:00",
    time: "08:30",
    distance: "6 km",
    location: "Parking Émile Zola",
    address: "Parking Émile Zola, Aix-en-Provence"
  },
  {
    id: "oct-10",
    date: "Samedi 10 octobre 2026",
    isoDate: "2026-10-10T08:30:00+02:00",
    time: "08:30",
    distance: "5,5 km",
    location: "Parking Émile Zola",
    address: "Parking Émile Zola, Aix-en-Provence"
  }
];


function buildRuns(): RunEvent[] {
  return [
    {
      ...sharedEvents[0],
      title: "Run social découverte",
      pace: "Allure conversation",
      summary: "Premier format idéal pour découvrir le run club à Aix-en-Provence sans pression.",
      afterRun: "Boissons et musique après le run"
    },
    {
      ...sharedEvents[1],
      title: "Run du samedi matin",
      pace: "Allure douce",
      summary: "Boucle urbaine simple pour courir à Aix-en-Provence et rencontrer du monde.",
      afterRun: "Photo de groupe et verre partenaire"
    },
    {
      ...sharedEvents[2],
      title: "Run communauté",
      pace: "Allure sociale",
      summary: "Sortie collective pensée pour les membres réguliers et les nouveaux venus.",
      afterRun: "Rencontre informelle après la sortie"
    }
  ];
}

export function isLocale(value: string): value is Locale {
  return value === "fr";
}

export function getRoute(locale: Locale, key: RouteKey) {
  const slug = routeSlugs[locale][key];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export function getArticleBySlug(locale: Locale, slug: string) {
  return getSiteCopy(locale).articles.find((article) => article.slug === slug);
}

export function getSiteCopy(locale: Locale) {
  const runs = buildRuns();

  return {
      locale,
      siteName: "NULLL.CLUB",
      brandLine: "Social sport club à Aix-en-Provence",
      city: "Aix-en-Provence",
      contact: {
        instagram: "https://www.instagram.com/nulll.club",
        instagramLabel: "@nulll.club",
        email: "contact@nulll.club",
        // Meme numero que la fiche Google : les coordonnees doivent se
        // recouper d'une source a l'autre.
        phone: "+33626755273",
        phoneLabel: "06 26 75 52 73",
        linkedin: "https://www.linkedin.com/company/nulll-club/?viewAsMember=true"
      },
      nav: [
        { key: "home" as const, label: "Accueil" },
        { key: "runs" as const, label: "Sorties" },
        { key: "community" as const, label: "Le club" },
        { key: "merch" as const, label: "Merch" },
        { key: "contact" as const, label: "Contact" }
      ],
      meta: {
        home: {
          title: "NULLL.CLUB | Courir ensemble à Aix",
          description:
            "Le social sport club d’Aix-en-Provence : une sortie gratuite chaque samedi à 8h30, à une allure qui permet de discuter."
        },
        runs: {
          title: "Sorties à Aix-en-Provence | NULLL.CLUB",
          description:
            "Les prochaines sorties du club à Aix-en-Provence : date, heure, distance et point de départ. Choisis la tienne."
        },
        community: {
          title: "Le club et son histoire | NULLL.CLUB",
          description:
            "NULLL.CLUB, le club du samedi à Aix-en-Provence. On court pour se rencontrer. Découvre le club et les prochaines sorties gratuites."
        },
        merch: {
          title: "Les pièces du club | NULLL.CLUB",
          description:
            "Les pièces NULLL.CLUB arrivent. En attendant, les sorties du samedi sont déjà là."
        },
        about: {
          title: "À propos du club de running | NULLL.CLUB",
          description:
            "Comprends la vision de NULLL.CLUB, social sport club à Aix-en-Provence centré sur la communauté, la régularité et le plaisir de courir ensemble."
        },
        contact: {
          title: "Contacter NULLL.CLUB",
          description:
            "Une question avant ta première sortie, une idée de partenariat ou un projet ? Écris à NULLL.CLUB."
        },
        checkout: {
          title: "Finaliser ma commande | NULLL.CLUB",
          description:
            "Valide ta commande de merchandising NULLL.CLUB et envoie ta demande de confirmation."
        }
      },
      home: {
        hero: {
          title: "Le run club social qui fait vraiment bouger Aix-en-Provence.",
          intro:
            "NULLL.CLUB organise des runs accessibles à Aix-en-Provence pour courir, rencontrer du monde et revenir chaque semaine avec une vraie raison de sortir.",
          primaryCta: "Voir les prochains runs",
          secondaryCta: "Découvrir la communauté",
          stats: [
            { label: "Ville", value: "Aix-en-Provence" },
            { label: "Format", value: "Run social hebdomadaire" },
            { label: "Allure", value: "Conversation et débutants bienvenus" }
          ]
        },
        promise: [
          "Tu comprends immédiatement où tu es : un run club à Aix-en-Provence, pas une marque abstraite.",
          "Tu sais quoi faire ensuite : choisir un prochain run, suivre Instagram, ou venir rencontrer le groupe.",
          "Tu vois la preuve sociale : dates, parcours, ambiance et communauté locale."
        ],
        sections: {
          nextRunsTitle: "Les prochains runs à Aix-en-Provence",
          nextRunsText:
            "Chaque sortie affiche une date claire, un lieu précis, une distance et l’ambiance prévue après le run.",
          howTitle: "Comment ça se passe",
          howSteps: [
            {
              title: "Tu arrives sans pression",
              text: "Pas besoin d’être rapide, équipé ou déjà intégré. Tu viens comme tu es."
            },
            {
              title: "Tu cours à allure sociale",
              text: "Les parcours sont pensés pour parler, respirer et garder le groupe ensemble."
            },
            {
              title: "Tu restes après",
              text: "Le vrai lien se crée après la course : musique, boisson, discussions, prochains plans."
            }
          ],
          merchTitle: "Les pièces du club",
          merchText:
            "Une sélection courte qui prolonge l'énergie du club sans prendre la place du run.",
          seoTitle: "Pourquoi rejoindre un groupe de course à Aix ?",
          seoBody:
            "Si tu cherches un run club à Aix-en-Provence, un club de running local ou un groupe de course convivial, NULLL.CLUB t’offre un format simple : des événements running récurrents, une communication claire et une communauté ouverte."
        },
        faq: [
          {
            q: "Est-ce que je peux venir seul ?",
            a: "Oui. C’est même le meilleur moyen de découvrir la communauté."
          },
          {
            q: "Faut-il être rapide ?",
            a: "Non. L’allure est pensée pour échanger et rester ensemble."
          },
          {
            q: "Comment connaître le lieu exact ?",
            a: "Le point de départ précis est rappelé sur la page runs et sur Instagram."
          }
        ]
      },
      runsPage: {
        title: "Des sorties lisibles, régulières et faciles à rejoindre.",
        intro:
          "Chaque événement running à Aix est présenté avec un niveau d’effort clair, un point de rendez-vous, un rythme et un format après-run.",
        checklist: [
          "Allure conversation",
          "Départ annoncé à l’avance",
          "Distance adaptée au format social",
          "After convivial après la sortie"
        ],
        cta: "Poser une question",
        faq: [
          {
            q: "Quel est le niveau demandé ?",
            a: "Aucun niveau minimum. L’objectif est de courir ensemble à une allure accessible."
          },
          {
            q: "Faut-il s’inscrire ?",
            a: "Oui, et c’est gratuit. Crée ton compte, choisis ta sortie : ton QR t’attend dans ton espace, et on le scanne au départ."
          },
          {
            q: "Y a-t-il des événements spéciaux ?",
            a: "Les formats particuliers seront annoncés avec chaque date, sur cette page."
          }
        ]
      },
      communityPage: {
        title: "Le social sport club d’Aix-en-Provence",
        // Deux temps : la coupure doit tomber au point, pas au milieu.
        punchlineLines: ["On a passé un an à regarder.", "Maintenant on avance."],
        intro:
          "Pendant un an, on a eu de grandes idées. Le sport était la seule qui tenait dans nos semaines. Alors on s’est dit : pourquoi ne pas le partager avec des gens qu’on ne connaît pas ? NULLL.CLUB est parti de là.",

        // Les trois L du nom. Ils tiennent en un mot chacun : c'est ce qui les
        // rend citables. L'ordre suit l'histoire : on entre libre, on reste
        // pour le lien, on avance ensemble.
        // Le titre pose la question, les cartes y repondent visuellement.
        lettersTitle: "Pourquoi trois L.",
        lettersIntro:
          "Notre nom vient de « null » : on n’a pas besoin d’être un sportif de renom pour faire du sport. Et si on l’écrit avec trois L, c’est que chacun porte un pilier du club.",
        // Chaque pilier reaffiche le nom entier avec SON L allume : on voit
        // d'ou vient chaque lettre sans avoir a l'expliquer. `highlight` est
        // l'index de la lettre a mettre en avant dans « NULLL ».
        letters: [
          {
            highlight: 2,
            word: "Libre",
            text: "Pas besoin d’un chrono à défendre. Tu viens pour courir et rencontrer du monde."
          },
          {
            highlight: 3,
            word: "Lien",
            text: "Le sport n’est que notre prétexte. On vient courir. On revient pour les gens."
          },
          {
            highlight: 4,
            word: "Légèreté",
            text: "Ni chrono, ni classement, ni dossard. On garde le plaisir de se retrouver samedi."
          }
        ],

        // Ligne de vie. Toutes les dates sont verifiables : PV d'assemblee
        // constitutive, annonce au Journal officiel, calendrier des sorties.
        timelineTitle: "Notre ligne de vie.",
        timeline: [
          {
            date: "2025",
            label: "Deux spectateurs",
            text: "Ça fait un an qu’on se dit qu’on va faire de grandes choses. Au bout du compte, on regarde surtout celles des autres. Le sport est la seule chose qui tient vraiment dans nos semaines.",
            status: "passe" as const
          },
          {
            date: "Un soir, en rentrant des courses",
            label: "L’idée",
            text: "Et si on faisait du sport avec des gens qu’on ne connaît pas ? Moins pour le sport que pour l’excuse : rencontrer du monde, se faire des amis, créer des choses ensemble.",
            status: "passe" as const
          },
          {
            date: "Puis il a fallu un nom",
            label: "NULLL",
            text: "Le nom vient de « null ». Pas besoin d’être un grand sportif pour faire partie du club. Les trois L racontent le reste : Libre, Lien, Légèreté.",
            status: "passe" as const
          },
          {
            date: "26 septembre 2026",
            label: "La première sortie",
            text: "Notre première sortie collective, 8h30 au parking du chemin de la Cible, près du lycée Émile Zola. 5 à 6 kilomètres à allure conversation. Tout le monde y sera pour la première fois, nous les premiers.",
            status: "aVenir" as const
          },
          {
            date: "Ensuite",
            label: "Pas que la course",
            text: "On est un social sport club, pas seulement un club de course. D’autres formats seront annoncés quand ils seront prêts.",
            status: "aVenir" as const
          }
        ],

        foundersTitle: "Nous deux, au départ.",
        founders: [
          { name: "Tobias Ringot", role: "Président" },
          { name: "Tom Brenier", role: "Trésorier" }
        ],

        firstRunTitle: "Pour ta première sortie.",
        firstRunText:
          "Pour ta première sortie, consulte la date et le point de départ sur la page Sorties. Une question avant de venir ? Écris-nous.",

        editorialTitle: "Rejoindre un club de sport à Aix-en-Provence",
        editorial: [
          {
            heading: "Un social sport club, pas un club de running",
            body: "On commence par la course à pied. Une façon simple de se retrouver, de bouger et de discuter."
          },
          {
            heading: "Courir en groupe plutôt que seul",
            body: "Un rendez-vous dans la semaine. Des gens à retrouver. C’est déjà une bonne raison de sortir, plutôt que de tourner seul autour du parc Jourdan."
          },
          {
            heading: "Ancré à Aix et dans ses parcours",
            body: "Chaque sortie annonce son point de départ et sa distance. Consulte la date qui t’intéresse pour savoir où l’on se retrouve."
          }
        ],

        faqTitle: "Les questions qu’on nous pose",
        faq: [
          {
            q: "Le club a-t-il déjà commencé ?",
            a: "Notre première sortie collective a lieu le samedi 26 septembre 2026 à 8h30, au parking du chemin de la Cible, près du lycée Émile Zola. Le club, lui, se prépare depuis le printemps 2026."
          },
          {
            q: "Faut-il être membre pour venir courir ?",
            a: "Pour retrouver ton QR, crée ton compte puis choisis une sortie. La participation est gratuite."
          },
          {
            q: "Puis-je venir seul ?",
            a: "Oui. Rencontrer du monde, c’est justement l’idée."
          },
          {
            q: "Quel niveau faut-il avoir ?",
            a: "Aucun niveau minimum. La sortie fait 5 à 6 kilomètres à allure conversation, c’est-à-dire une allure où l’on peut encore discuter en courant. Personne n’est laissé derrière."
          },
          {
            q: "Pourquoi « NULLL » avec trois L ?",
            a: "Les trois L, ce sont Libre, Lien et Légèreté."
          },
          {
            q: "Est-ce uniquement un club de course à pied ?",
            a: "Pour l’instant, on commence par la course à pied. Les autres formats seront annoncés quand ils seront prêts."
          }
        ],

        social: {
          kicker: "La suite se passe là-bas",
          title: "On vit sur Instagram.",
          text: "Les photos, les changements de dernière minute, les gens qui viennent : on met tout là-bas. C’est le meilleur endroit pour nous suivre avant la première sortie.",
          cta: "Voir le compte"
        }
      },
      aboutPage: {
        title: "Un club de running social, pas une posture.",
        intro:
          "NULLL.CLUB existe pour rendre les sorties running à Aix-en-Provence plus simples à rejoindre, plus lisibles et plus humaines.",
        values: [
          {
            title: "Clarté",
            text: "Des pages lisibles, des dates visibles, un prochain pas évident."
          },
          {
            title: "Régularité",
            text: "Un club existe quand ses rendez-vous reviennent et restent fiables."
          },
          {
            title: "Accessibilité",
            text: "On retire l’intimidation, pas l’identité."
          },
          {
            title: "Style",
            text: "Une direction brutaliste et avant-gardiste qui reste compréhensible."
          }
        ]
      },
      contactPage: {
        title: "Rejoins le club, pose une question ou propose un projet.",
        intro:
          "Une question avant ta première sortie, une idée de partenariat ou un projet : écris-nous.",
        channels: [
          {
            title: "Instagram",
            value: "@nulll.club",
            text: "Le canal principal pour suivre les prochaines sorties et les annonces rapides.",
            href: "https://www.instagram.com/nulll.club"
          },
          {
            title: "Email",
            value: "contact@nulll.club",
            text: "Le bon canal pour les commandes, partenariats, médias et demandes détaillées.",
            href: "mailto:contact@nulll.club"
          },
          {
            title: "Téléphone",
            value: "06 26 75 52 73",
            text: "Pour une question rapide avant de venir, ou le samedi matin si tu nous cherches.",
            href: "tel:+33626755273"
          },
          {
            title: "LinkedIn",
            value: "NULLL.CLUB",
            text: "Pour les partenaires, collaborations locales et projets de marque.",
            href: "https://www.linkedin.com/company/nulll-club/?viewAsMember=true"
          }
        ]
      },
      merchPage: {
        title: "Les pièces du club.",
        intro:
          "Une sélection courte, pensée comme une trace du club, pas comme le centre du projet.",
        trust: [
          "Stocks affichés par article",
          "Demande de commande validée en ligne",
          "Confirmation envoyée avec référence",
          "Retrait local ou coordination par email"
        ]
      },
      checkoutPage: {
        title: "Finalise ta commande",
        intro:
          "Vérifie ton panier, renseigne tes informations et envoie ta demande. Tu reçois ensuite une confirmation avec la suite."
      },
      articles: [
        {
          key: "localClub",
          slug: "run-club-aix-en-provence",
          title: "Run club à Aix-en-Provence | NULLL.CLUB",
          description:
            "Courir en groupe le samedi à Aix-en-Provence avec NULLL.CLUB. Retrouve les prochaines dates et les informations pratiques pour venir.",
          h1: "Run club à Aix-en-Provence : courir en groupe le samedi",
          intro:
            "NULLL.CLUB propose des sorties gratuites le samedi à Aix-en-Provence. On court à une allure qui permet de discuter. Choisis une date pour retrouver l’heure, la distance et le point de départ.",
          sections: [
            {
              title: "Le rendez-vous en pratique",
              body: [
                "Le départ habituel est à 8h30, au parking du chemin de la Cible, près du lycée Émile Zola. Vérifie les informations de la sortie choisie avant de venir.",
                "On court à une allure qui permet de discuter. Il n’y a rien à payer : un compte gratuit et l’inscription à la sortie suffisent. Si tu hésites sur le format, écris-nous avant de venir.",
                "Viens en tenue de sport avec de quoi boire. Après la course, on prend un moment ensemble : c’est souvent là que le club se joue vraiment."
              ]
            },
            {
              title: "Pour qui : débutants, reprise, coureurs réguliers",
              body: [
                "Tu reprends la course, tu viens d’arriver à Aix ou tu cherches simplement des gens avec qui courir ? Tu peux découvrir le format sur la page Sorties.",
                "Si tu reprends après une pause, si tu viens d’arriver à Aix, si tu cherches un club de sport pour rencontrer du monde autrement qu’en salle : le format est fait pour ça. Si tu cours déjà régulièrement, l’allure conversation reste utile comme sortie longue facile en fin de semaine."
              ]
            },
            {
              title: "Où l’on court autour d’Aix",
              body: [
                "Le centre d’Aix permet de partir à pied vers le parc Jourdan et le parc de la Torse, deux boucles courtes et roulantes.",
                "Pour les sorties plus longues, la région ne manque pas de terrain : le lac du Réaltor, le plateau de Bibemus, le barrage de Bimont et les sentiers au pied de la Sainte-Victoire. Chaque sortie du club annonce son propre parcours."
              ]
            },
            {
              title: "Un club associatif, pas une salle de sport",
              body: [
                "Il n’y a ni abonnement, ni engagement, ni objectif de performance. On veut juste que courir devienne une habitude sociale plutôt qu’une corvée solitaire, et que ceux qui viennent seuls repartent avec des gens.",
                "C’est la différence principale avec un club de sport classique à Aix-en-Provence : le rendez-vous est gratuit, et tu peux venir une fois pour voir sans que personne ne te relance."
              ]
            },
            {
              title: "Comment venir la première fois",
              body: [
                "Choisis ta sortie et consulte ses informations pratiques. Pour retrouver ton QR, connecte-toi à ton compte.",
                "Si tu préfères prévenir, écris à contact@nulll.club ou passe par Instagram. La page des prochaines sorties donne la date, l’heure, la distance et le point de départ exact de chaque sortie."
              ]
            }
          ]
        },
        {
          key: "localRunning",
          slug: "courir-a-aix-en-provence",
          title: "Courir à Aix-en-Provence | Lieux et repères",
          description:
            "Courir à Aix-en-Provence : des lieux à découvrir et les informations à vérifier avant de partir, seul ou en groupe.",
          h1: "Courir à Aix-en-Provence : les parcours et les groupes",
          intro:
            "Aix-en-Provence est une ville agréable à courir : centre compact, parcs accessibles à pied, et des chemins de campagne à quelques minutes. Voici où courir selon ce que tu cherches, et comment ne pas le faire seul.",
          sections: [
            {
              title: "En ville : parc Jourdan, la Torse, Cours Mirabeau",
              body: [
                "Le parc Jourdan est le point de départ le plus simple quand on habite le centre : une boucle courte et ombragée, pour un footing de semaine ou une reprise. Vérifie ses horaires d’ouverture avant de partir.",
                "Le parc de la Torse offre un parcours plus long le long du ruisseau, avec de la terre sous les pieds, ce qui change du bitume. Pour les sorties tôt le matin, remonter le Cours Mirabeau avant l’affluence reste un classique."
              ]
            },
            {
              title: "Autour d’Aix : Réaltor, Bibemus, Sainte-Victoire",
              body: [
                "Le lac du Réaltor propose une boucle plate d’une dizaine de kilomètres, très roulante, idéale pour tenir une allure régulière sans dénivelé.",
                "Le plateau de Bibemus et le barrage de Bimont demandent plus d’engagement, avec du dénivelé et des chemins caillouteux. Les sentiers au pied de la Sainte-Victoire sont magnifiques mais exigeants : mieux vaut y aller accompagné et bien chaussé.",
                "En été, la chaleur impose de partir tôt. C’est aussi pour ça que les sorties collectives du samedi matin fonctionnent bien à Aix : à 8h30, il fait encore bon."
              ]
            },
            {
              title: "Courir accompagné change tout",
              body: [
                "Un rendez-vous dans la semaine, des gens à retrouver : c’est souvent ce qui fait tenir l’habitude.",
                "Pour courir en groupe le samedi, retrouve les prochaines sorties de NULLL.CLUB."
              ]
            },
            {
              title: "Ce qu’il faut vérifier avant de rejoindre un groupe",
              body: [
                "Regarde d’abord si l’allure est annoncée. Un groupe qui ne précise pas son rythme finit souvent par courir trop vite pour les nouveaux venus.",
                "Vérifie le lieu, l’heure et la façon de contacter le groupe. Le logo et les tee-shirts peuvent attendre."
              ]
            }
          ]
        },
        {
          key: "localEvents",
          slug: "evenements-running-aix",
          title: "Les rendez-vous du club à Aix | NULLL.CLUB",
          description:
            "L’agenda des sorties running à Aix-en-Provence : rendez-vous hebdomadaire du samedi 8h30, événements du club et rencontres après la course.",
          h1: "Événements running à Aix-en-Provence",
          intro:
            "À Aix-en-Provence, l’essentiel de la vie running ne se joue pas sur les courses officielles mais sur les rendez-vous réguliers, gratuits et ouverts. Voici comment se repérer.",
          sections: [
            {
              title: "Le rendez-vous hebdomadaire",
              body: [
                "Les dates et les informations pratiques sont annoncées sur la page Sorties.",
                "Chaque sortie est annoncée avec sa date, son horaire, sa distance et son point de départ. C’est volontairement le même créneau chaque semaine : on retient plus facilement un rendez-vous fixe qu’un calendrier qui change."
              ]
            },
            {
              title: "Les temps forts de l’année à Aix",
              body: [
                "Aix-en-Provence et ses environs accueillent plusieurs courses sur route et trails au fil de la saison, du format court en ville aux parcours dans le massif.",
                "Les sorties du club ne sont pas des compétitions. L’idée reste de courir ensemble et de rencontrer du monde."
              ]
            },
            {
              title: "L’après-course, la vraie raison de revenir",
              body: [
                "Le moment qui suit la sortie compte autant que la course. C’est là que les gens se parlent vraiment, et c’est ce qui fait revenir la semaine suivante.",
                "Ce format convient particulièrement aux personnes qui viennent d’arriver à Aix-en-Provence et cherchent un club de sport pour rencontrer du monde sans passer par une salle."
              ]
            },
            {
              title: "Se tenir au courant",
              body: [
                "Consulte la page Sorties pour les dates et les informations pratiques.",
                "Pour toute question avant de venir, écris à contact@nulll.club. Une réponse claire avant une première sortie vaut mieux qu’une hésitation de plus."
              ]
            }
          ]
        }
      ] satisfies Article[],
      runs
    };
}
