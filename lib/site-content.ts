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
      description: "T-shirt noir épais pour les runs sociaux à Aix-en-Provence.",
      fit: "Coupe droite, coton lourd, unisexe."
    },
    {
      id: "tee-blanc",
      image: "/assets/merch/tee-white-blank.webp",
      alt: "T-shirt blanc NULLL.CLUB",
      name: "T-shirt blanc signal",
      price: 35,
      badge: "Edition Aix 001",
      description: "Version claire pour les sorties de fin de journée et les événements running à Aix.",
      fit: "Coupe droite, coton lourd, unisexe."
    },
    {
      id: "tee-social",
      image: "/assets/merch/tee-black-blank.webp",
      alt: "T-shirt noir message social NULLL.CLUB",
      name: "T-shirt social warning",
      price: 38,
      badge: "Edition limitée",
      description: "Pièce statement pour soutenir le run club et les prochaines dates.",
      fit: "Coupe droite, coton lourd, unisexe."
    }
  ]
};

const sharedEvents: Array<Omit<RunEvent, "title" | "summary" | "afterRun" | "pace">> = [
  {
    id: "sept-12",
    date: "Samedi 12 septembre 2026",
    isoDate: "2026-09-12T08:30:00+02:00",
    time: "08:30",
    distance: "5 km",
    location: "GF56+VC Aix-en-Provence",
    address: "GF56+VC Aix-en-Provence"
  },
  {
    id: "sept-19",
    date: "Samedi 19 septembre 2026",
    isoDate: "2026-09-19T08:30:00+02:00",
    time: "08:30",
    distance: "6 km",
    location: "GF56+VC Aix-en-Provence",
    address: "GF56+VC Aix-en-Provence"
  },
  {
    id: "sept-26",
    date: "Samedi 26 septembre 2026",
    isoDate: "2026-09-26T08:30:00+02:00",
    time: "08:30",
    distance: "5,5 km",
    location: "GF56+VC Aix-en-Provence",
    address: "GF56+VC Aix-en-Provence"
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
          title: "NULLL.CLUB — Club de course à Aix-en-Provence",
          description:
            "NULLL.CLUB est un club de course à Aix-en-Provence. Rejoins un groupe ouvert à tous avec des sorties et des événements locaux."
        },
        runs: {
          title: "Prochains runs à Aix-en-Provence | NULLL.CLUB",
          description:
            "Découvre les prochains runs du club de running à Aix-en-Provence : dates, horaires, distance, ambiance et informations pratiques."
        },
        community: {
          title: "Communauté running à Aix-en-Provence | NULLL.CLUB",
          description:
            "Rejoins une communauté running ouverte à Aix-en-Provence. Sortie tous les samedis à 8h30, parking Émile Zola : 5 à 6 km à allure conversation, gratuit, sans inscription et sans niveau requis."
        },
        merch: {
          title: "Pièces du club | NULLL.CLUB Aix-en-Provence",
          description:
            "Découvre les pièces NULLL.CLUB quand elles sont disponibles, comme prolongement naturel du run club à Aix-en-Provence."
        },
        about: {
          title: "À propos du club de running | NULLL.CLUB",
          description:
            "Comprends la vision de NULLL.CLUB, run club social à Aix-en-Provence centré sur la communauté, la régularité et le plaisir de courir ensemble."
        },
        contact: {
          title: "Contacter le run club à Aix-en-Provence | NULLL.CLUB",
          description:
            "Contacte NULLL.CLUB pour rejoindre un run, poser une question, proposer un partenariat ou suivre les prochains événements running à Aix."
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
          "Tu comprends immédiatement où tu es : un run club à Aix-en-Provence, pas une marque abstraite.",
          "Tu sais quoi faire ensuite : choisir un prochain run, suivre Instagram, ou venir rencontrer le groupe.",
          "Tu vois la preuve sociale : dates, parcours, ambiance et communauté locale."
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
              text: "Le vrai lien se crée après la course : musique, boisson, discussions, prochains plans."
            }
          ],
          merchTitle: "Les pièces du club",
          merchText:
            "Une sélection courte qui prolonge l'énergie du club sans prendre la place du run.",
          seoTitle: "Pourquoi rejoindre un groupe de course à Aix ?",
          seoBody:
            "Si tu cherches un run club à Aix-en-Provence, un club de running local ou un groupe de course convivial, NULLL.CLUB t’offre un format simple : des événements running récurrents, une communication claire et une communauté ouverte."
        },
        faq: [
          {
            q: "Est-ce que je peux venir seul ?",
            a: "Oui. C’est même le meilleur moyen de découvrir la communauté."
          },
          {
            q: "Faut-il être rapide ?",
            a: "Non. L’allure est pensée pour échanger et rester ensemble."
          },
          {
            q: "Comment connaître le lieu exact ?",
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
        cta: "Recevoir la prochaine date",
        faq: [
          {
            q: "Quel est le niveau demandé ?",
            a: "Aucun niveau minimum. L’objectif est de courir ensemble à une allure accessible."
          },
          {
            q: "Puis-je venir pour la première fois sans prévenir ?",
            a: "Oui, mais tu peux aussi nous écrire pour être rassuré sur le format."
          },
          {
            q: "Y a-t-il des événements spéciaux ?",
            a: "Oui, certaines dates incluent partenaires, musique ou format photo/vidéo."
          }
        ]
      },
      communityPage: {
        title: "Le social sport club d’Aix-en-Provence",
        // Deux temps : la coupure doit tomber au point, pas au milieu.
        punchlineLines: ["On a passé un an à regarder.", "Maintenant on avance."],
        intro:
          "On voulait faire de grandes choses. Pendant un an, on n’en a fait aucune — à part du sport, la seule chose qui tenait vraiment dans nos semaines. Un jour, en rentrant des courses, l’idée est venue : en faire avec des gens qu’on ne connaît pas. Notre club, c’est cette excuse-là, devenue association.",

        // Les trois L du nom. Ils tiennent en un mot chacun : c'est ce qui les
        // rend citables. L'ordre suit l'histoire : on entre libre, on reste
        // pour le lien, on avance ensemble.
        // Le titre pose la question, les cartes y repondent visuellement.
        lettersTitle: "Pourquoi trois L.",
        lettersIntro:
          "Notre nom vient de « null » : on n’a pas besoin d’être un sportif de renom pour faire du sport. Et si on l’écrit avec trois L, c’est que chacun porte un pilier du club.",
        // Chaque pilier reaffiche le nom entier avec SON L allume : on voit
        // d'ou vient chaque lettre sans avoir a l'expliquer. `highlight` est
        // l'index de la lettre a mettre en avant dans « NULLL ».
        letters: [
          {
            highlight: 2,
            word: "Libre",
            text: "Aucun niveau requis, aucune licence, aucune cotisation pour venir essayer. On retire l’intimidation, pas l’exigence."
          },
          {
            highlight: 3,
            word: "Lien",
            text: "Le sport n’est que notre prétexte. On vient courir, on revient pour les gens — c’est notre raison d’être depuis le premier jour."
          },
          {
            highlight: 4,
            word: "Légèreté",
            text: "Ni chrono, ni classement, ni dossard. On ne se prend pas au sérieux — c’est encore la meilleure raison de revenir le samedi suivant."
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
            text: "Et si on faisait du sport avec des gens qu’on ne connaît pas ? Moins pour le sport que pour l’excuse : rencontrer du monde, se faire des amis, créer des choses ensemble.",
            status: "passe" as const
          },
          {
            date: "Puis il a fallu un nom",
            label: "NULLL",
            text: "On le voulait démarquant, et on le voulait honnête : « null », parce qu’on n’a pas besoin d’être un sportif de renom pour faire du sport. Trois L, un par pilier — c’est juste en dessous.",
            status: "passe" as const
          },
          {
            date: "12 septembre 2026",
            label: "Le premier run",
            text: "Notre première sortie collective, 8h30 au parking Émile Zola. 5 à 6 kilomètres à allure conversation. Tout le monde y sera pour la première fois, nous les premiers.",
            status: "aVenir" as const
          },
          {
            date: "Ensuite",
            label: "Pas que la course",
            text: "On est un social sport club, pas un running club. D’autres sports sont déjà sur le feu, et avec eux des événements, des ateliers et des voyages.",
            status: "aVenir" as const
          }
        ],

        foundersTitle: "Nous deux, au départ.",
        founders: [
          { name: "Tobias Ringot", role: "Président" },
          { name: "Tom Brenier", role: "Trésorier" }
        ],

        firstRunTitle: "Le premier run, c’est le 12 septembre.",
        firstRunText:
          "Rien à réserver. Présente-toi à 8h25 au parking Émile Zola à Aix-en-Provence, dis que c’est ta première fois — ce sera le cas de tout le monde, nous compris.",

        editorialTitle: "Rejoindre un club de sport à Aix-en-Provence",
        editorial: [
          {
            heading: "Un social sport club, pas un club de running",
            body: "On commence par la course à pied parce que c’est le sport le plus simple à partager : pas de terrain à réserver, pas de niveau minimum, pas de matériel. Mais l’idée de départ est plus large — créer une communauté autour du sport, du bien-être, de la créativité et du lien social. D’autres formats suivront."
          },
          {
            heading: "Courir en groupe plutôt que seul",
            body: "La difficulté de la course à pied n’est presque jamais la performance : c’est la régularité. Un rendez-vous fixe, avec des gens qui remarquent ton absence, tient mieux qu’une bonne résolution. À Aix-en-Provence, beaucoup de coureurs tournent seuls autour du parc Jourdan ou de la Torse sans jamais croiser les mêmes visages. C’est ce qu’on veut changer."
          },
          {
            heading: "Ancré à Aix et dans ses parcours",
            body: "Nos sorties partent du centre-ville et empruntent les parcours que les Aixois connaissent : le parc Jourdan pour les boucles courtes, le parc de la Torse pour la terre sous les pieds, et plus loin le lac du Réaltor, le plateau de Bibemus ou les sentiers au pied de la Sainte-Victoire pour les sorties longues."
          }
        ],

        faqTitle: "Les questions qu’on nous pose",
        faq: [
          {
            q: "Le club a-t-il déjà commencé ?",
            a: "Notre première sortie collective a lieu le samedi 12 septembre 2026 à 8h30, au parking Émile Zola. Le club, lui, se prépare depuis le printemps 2026."
          },
          {
            q: "Faut-il être membre pour venir courir ?",
            a: "Non. Les sorties du samedi matin sont ouvertes à tous, gratuites et sans inscription préalable. Tu peux venir une fois pour voir, sans que personne ne te relance ensuite."
          },
          {
            q: "Puis-je venir seul ?",
            a: "C’est même notre idée de départ. On a créé le club justement pour rencontrer du monde : venir seul est la situation la plus normale ici."
          },
          {
            q: "Quel niveau faut-il avoir ?",
            a: "Aucun niveau minimum. La sortie fait 5 à 6 kilomètres à allure conversation, c’est-à-dire une allure où l’on peut encore discuter en courant. Personne n’est laissé derrière."
          },
          {
            q: "Pourquoi « NULLL » avec trois L ?",
            a: "Le nom vient de « null » : on n’a pas besoin d’être un sportif de renom pour faire du sport. Les trois L, ce sont nos trois piliers — Libre, Lien, Légèreté."
          },
          {
            q: "Est-ce uniquement un club de course à pied ?",
            a: "Non. On est un social sport club. La course à pied est notre premier format, mais d’autres sports arrivent, avec des événements, des ateliers et des voyages."
          }
        ],

        social: {
          kicker: "La suite se passe là-bas",
          title: "On vit sur Instagram.",
          text: "Les photos, les changements de dernière minute, les gens qui viennent : on met tout là-bas. C’est le meilleur endroit pour nous suivre avant la première sortie.",
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
          "Pour suivre les prochains runs, obtenir le point de départ exact ou parler partenariat, tout passe par un contact direct et rapide.",
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
          title: "Run club à Aix-en-Provence — NULLL.CLUB, sorties gratuites",
          description:
            "NULLL.CLUB est un run club et un club de sport associatif à Aix-en-Provence. Sortie tous les samedis à 8h30, parking Émile Zola, gratuite et ouverte à tous les niveaux.",
          h1: "Run club à Aix-en-Provence : courir en groupe le samedi",
          intro:
            "NULLL.CLUB est un run club associatif basé à Aix-en-Provence. On se retrouve tous les samedis matin à 8h30 au parking Émile Zola pour une sortie de 5 à 6 kilomètres, à allure conversation. C’est gratuit, sans inscription et sans niveau minimum.",
          sections: [
            {
              title: "Le rendez-vous en pratique",
              body: [
                "Rendez-vous le samedi à 8h30 au parking Émile Zola, à Aix-en-Provence. La sortie fait entre 5 et 6 kilomètres selon les semaines, sur un parcours qui reste accessible aux personnes qui reprennent la course à pied.",
                "L’allure est une allure conversation : tu dois pouvoir parler en courant. Personne n’est laissé derrière, et il y a toujours quelqu’un pour rester avec le dernier groupe. Il n’y a rien à payer, rien à signer à l’avance et aucun certificat à fournir pour venir essayer.",
                "Viens en tenue de sport avec de quoi boire. Après la course, on prend un moment ensemble : c’est souvent là que le club se joue vraiment."
              ]
            },
            {
              title: "Pour qui : débutants, reprise, coureurs réguliers",
              body: [
                "Un run club à Aix-en-Provence n’a d’intérêt que s’il est réellement ouvert. Chez NULLL.CLUB, la majorité des personnes qui viennent pour la première fois n’ont pas de club et ne courent pas en compétition.",
                "Si tu reprends après une pause, si tu viens d’arriver à Aix, si tu cherches un club de sport pour rencontrer du monde autrement qu’en salle : le format est fait pour ça. Si tu cours déjà régulièrement, l’allure conversation reste utile comme sortie longue facile en fin de semaine."
              ]
            },
            {
              title: "Où l’on court autour d’Aix",
              body: [
                "Le centre d’Aix permet de partir à pied vers le parc Jourdan et le parc de la Torse, deux boucles courtes et roulantes idéales pour une sortie collective du samedi matin.",
                "Pour les sorties plus longues, la région ne manque pas de terrain : le lac du Réaltor et ses chemins plats, le plateau de Bibemus, le barrage de Bimont et les sentiers au pied de la montagne Sainte-Victoire. On adapte le parcours à la météo et au groupe présent."
              ]
            },
            {
              title: "Un club associatif, pas une salle de sport",
              body: [
                "Il n’y a ni abonnement, ni engagement, ni objectif de performance. On veut juste que courir devienne une habitude sociale plutôt qu’une corvée solitaire, et que ceux qui viennent seuls repartent avec des gens.",
                "C’est la différence principale avec un club de sport classique à Aix-en-Provence : le rendez-vous est public, gratuit, et tu peux venir une fois pour voir sans que personne ne te relance."
              ]
            },
            {
              title: "Comment venir la première fois",
              body: [
                "Tu n’as rien à faire à l’avance : présente-toi samedi à 8h25 au parking Émile Zola, dis que c’est ta première fois, on s’occupe du reste.",
                "Si tu préfères prévenir, écris à contact@nulll.club ou passe par Instagram. La page des prochaines sorties donne la date, l’heure, la distance et le point de départ exact de chaque run."
              ]
            }
          ]
        },
        {
          key: "localRunning",
          slug: "courir-a-aix-en-provence",
          title: "Courir à Aix-en-Provence : où, quand et avec qui",
          description:
            "Les meilleurs endroits pour courir à Aix-en-Provence, du parc Jourdan à la Sainte-Victoire, et comment rejoindre un groupe de course gratuit le samedi matin.",
          h1: "Courir à Aix-en-Provence : les parcours et les groupes",
          intro:
            "Aix-en-Provence est une ville agréable à courir : centre compact, parcs accessibles à pied, et des chemins de campagne à quelques minutes. Voici où courir selon ce que tu cherches, et comment ne pas le faire seul.",
          sections: [
            {
              title: "En ville : parc Jourdan, la Torse, Cours Mirabeau",
              body: [
                "Le parc Jourdan est le point de départ le plus simple quand on habite le centre : boucle courte, ombragée, parfaite pour un footing de semaine ou une reprise en douceur.",
                "Le parc de la Torse offre un parcours plus long le long du ruisseau, avec de la terre sous les pieds, ce qui change du bitume. Pour les sorties tôt le matin, remonter le Cours Mirabeau avant l’affluence reste un classique."
              ]
            },
            {
              title: "Autour d’Aix : Réaltor, Bibemus, Sainte-Victoire",
              body: [
                "Le lac du Réaltor propose une boucle plate d’une dizaine de kilomètres, très roulante, idéale pour tenir une allure régulière sans dénivelé.",
                "Le plateau de Bibemus et le barrage de Bimont demandent plus d’engagement, avec du dénivelé et des chemins caillouteux. Les sentiers au pied de la Sainte-Victoire sont magnifiques mais exigeants : mieux vaut y aller accompagné et bien chaussé.",
                "En été, la chaleur impose de partir tôt. C’est aussi pour ça que les sorties collectives du samedi matin fonctionnent bien à Aix : à 8h30, il fait encore bon."
              ]
            },
            {
              title: "Courir accompagné change tout",
              body: [
                "Le problème de la course à pied n’est presque jamais la performance : c’est la régularité. Un rendez-vous fixe, avec des gens qui remarquent ton absence, tient mieux qu’une bonne résolution.",
                "C’est ce que fait NULLL.CLUB à Aix-en-Provence : un créneau unique le samedi à 8h30, une allure où l’on peut discuter, et un moment après la course. Gratuit, sans inscription, ouvert à tous les niveaux."
              ]
            },
            {
              title: "Ce qu’il faut vérifier avant de rejoindre un groupe",
              body: [
                "Regarde d’abord si l’allure est annoncée. Un groupe qui ne précise pas son rythme finit souvent par courir trop vite pour les nouveaux venus.",
                "Vérifie ensuite que le lieu et l’heure sont fixes et publics, et qu’il existe un moyen simple de poser une question avant de venir. Le reste — le logo, les tee-shirts — vient après."
              ]
            }
          ]
        },
        {
          key: "localEvents",
          slug: "evenements-running-aix",
          title: "Événements running à Aix-en-Provence — agenda NULLL.CLUB",
          description:
            "L’agenda des sorties running à Aix-en-Provence : rendez-vous hebdomadaire du samedi 8h30, événements du club et rencontres après la course.",
          h1: "Événements running à Aix-en-Provence",
          intro:
            "À Aix-en-Provence, l’essentiel de la vie running ne se joue pas sur les courses officielles mais sur les rendez-vous réguliers, gratuits et ouverts. Voici comment se repérer.",
          sections: [
            {
              title: "Le rendez-vous hebdomadaire",
              body: [
                "Le rendez-vous principal de NULLL.CLUB est le samedi à 8h30, au parking Émile Zola. Il a lieu toute l’année, quelle que soit la météo, et ne demande aucune inscription.",
                "Chaque sortie est annoncée avec sa date, son horaire, sa distance et son point de départ. C’est volontairement le même créneau chaque semaine : on retient plus facilement un rendez-vous fixe qu’un calendrier qui change."
              ]
            },
            {
              title: "Les temps forts de l’année à Aix",
              body: [
                "Aix-en-Provence et ses environs accueillent plusieurs courses sur route et trails au fil de la saison, du format court en ville aux parcours dans le massif.",
                "Le club ne remplace pas ces événements : il sert de préparation sociale. Beaucoup de membres utilisent les sorties du samedi comme entraînement régulier avant de s’aligner, individuellement, sur une course locale."
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
                "La page des prochaines sorties liste les runs à venir avec tous les détails pratiques. Les changements de dernière minute — météo, changement de point de départ — passent par Instagram.",
                "Pour toute question avant de venir, écris à contact@nulll.club. Une réponse claire avant un premier run vaut mieux qu’une hésitation de plus."
              ]
            }
          ]
        }
      ] satisfies Article[],
      runs
    };
}
