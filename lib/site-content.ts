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
      image: "/assets/merch/tee-black-blank.png",
      alt: "T-shirt noir NULLL.CLUB",
      name: "T-shirt noir club",
      price: 35,
      badge: "Edition Aix 001",
      description: "T-shirt noir épais pour les runs sociaux à Aix-en-Provence.",
      fit: "Coupe droite, coton lourd, unisexe."
    },
    {
      id: "tee-blanc",
      image: "/assets/merch/tee-white-blank.png",
      alt: "T-shirt blanc NULLL.CLUB",
      name: "T-shirt blanc signal",
      price: 35,
      badge: "Edition Aix 001",
      description: "Version claire pour les sorties de fin de journée et les événements running à Aix.",
      fit: "Coupe droite, coton lourd, unisexe."
    },
    {
      id: "tee-social",
      image: "/assets/merch/tee-black-blank.png",
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
    date: "Vendredi 12 septembre 2026",
    isoDate: "2026-09-12T08:30:00+02:00",
    time: "08:30",
    distance: "5 km",
    location: "Aix-en-Provence centre",
    address: "Rotonde, 13100 Aix-en-Provence"
  },
  {
    id: "sept-19",
    date: "Vendredi 19 septembre 2026",
    isoDate: "2026-09-19T08:30:00+02:00",
    time: "08:30",
    distance: "6 km",
    location: "Quartier Mazarin",
    address: "Cours Mirabeau, 13100 Aix-en-Provence"
  },
  {
    id: "sept-26",
    date: "Vendredi 26 septembre 2026",
    isoDate: "2026-09-26T08:30:00+02:00",
    time: "08:30",
    distance: "5,5 km",
    location: "Parc Jourdan",
    address: "Avenue Jules Ferry, 13100 Aix-en-Provence"
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
      title: "Run coucher de soleil",
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
      brandLine: "Run club social à Aix-en-Provence",
      city: "Aix-en-Provence",
      contact: {
        instagram: "https://www.instagram.com/nulll.club",
        instagramLabel: "@nulll.club",
        email: "contact@nulll.club",
        linkedin: "https://www.linkedin.com/company/nulll-club/"
      },
      nav: [
        { key: "home" as const, label: "Accueil" },
        { key: "runs" as const, label: "Runs" },
        { key: "community" as const, label: "Communauté" },
        { key: "merch" as const, label: "Merch" },
        { key: "about" as const, label: "À propos" },
        { key: "contact" as const, label: "Contact" }
      ],
      meta: {
        home: {
          title: "NULLL.CLUB — Run club social à Aix-en-Provence",
          description:
            "NULLL.CLUB est un run club social à Aix-en-Provence. Rejoins un groupe de course inclusif avec sorties, communauté locale et événements running."
        },
        runs: {
          title: "Prochains runs à Aix-en-Provence | NULLL.CLUB",
          description:
            "Découvre les prochains runs du club de running à Aix-en-Provence : dates, horaires, distance, ambiance et informations pratiques."
        },
        community: {
          title: "Communauté running sociale à Aix | NULLL.CLUB",
          description:
            "Une communauté running ouverte à Aix-en-Provence pour courir ensemble, rencontrer du monde et participer à des événements conviviaux."
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
        title: "Une communauté running locale, régulière et accueillante.",
        intro:
          "NULLL.CLUB n’est pas seulement un groupe de course à Aix. C’est un rendez-vous récurrent pour créer des liens dans une ville où il est facile de rester dans son cercle.",
        pillars: [
          {
            title: "Ouvert aux nouveaux",
            text: "Chaque run est pensé pour qu’une première venue soit simple et agréable."
          },
          {
            title: "Ancré à Aix-en-Provence",
            text: "Le club valorise les parcours, les rencontres et les lieux de la ville."
          },
          {
            title: "Orienté lien social",
            text: "Le sport est le point de départ, pas la seule promesse."
          }
        ]
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
            title: "LinkedIn",
            value: "NULLL.CLUB",
            text: "Pour les partenaires, collaborations locales et projets de marque.",
            href: "https://www.linkedin.com/company/nulll-club/"
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
          title: "Run club Aix-en-Provence | Guide local NULLL.CLUB",
          description:
            "Guide pratique pour trouver un run club à Aix-en-Provence et rejoindre une communauté running locale.",
          h1: "Trouver un run club à Aix-en-Provence",
          intro:
            "Si tu cherches un run club à Aix-en-Provence, tu veux surtout trois choses : un rendez-vous clair, un groupe accessible et une ambiance qui donne envie de revenir.",
          sections: [
            {
              title: "Pourquoi rejoindre un run club à Aix-en-Provence ?",
              body: [
                "Courir seul fonctionne pour l’entraînement, mais pas toujours pour la régularité. Un club de running à Aix-en-Provence aide à garder une routine simple.",
                "Le bon groupe de course local donne un horaire clair, un rythme accessible et un cadre social qui motive."
              ]
            },
            {
              title: "Ce que propose NULLL.CLUB",
              body: [
                "Des runs sociaux récurrents, une communication lisible, une identité forte et une vraie ouverture aux nouveaux.",
                "Le club met l’accent sur la clarté des informations, la qualité du parcours utilisateur et la convivialité après la course."
              ]
            }
          ]
        },
        {
          key: "localRunning",
          slug: "courir-a-aix-en-provence",
          title: "Courir à Aix-en-Provence | Conseils et communauté",
          description:
            "Où courir à Aix-en-Provence, comment rejoindre un groupe de course et à quoi s’attendre sur un run social.",
          h1: "Courir à Aix-en-Provence en groupe",
          intro:
            "Courir à Aix-en-Provence devient plus simple quand tu connais les bons points de rendez-vous, les bons créneaux et le bon groupe.",
          sections: [
            {
              title: "Les bons formats pour courir à Aix",
              body: [
                "Les runs sociaux en fin de journée sont souvent les plus accessibles pour créer une habitude durable.",
                "Un groupe de course à Aix qui annonce son allure et sa distance retire une grande partie de la friction."
              ]
            },
            {
              title: "Comment choisir le bon groupe",
              body: [
                "Regarde la clarté des horaires, le niveau d’accueil des débutants et la qualité du suivi sur Instagram ou par email.",
                "Privilégie un format qui affiche la distance, le lieu et l’après-run, pas seulement une identité visuelle."
              ]
            }
          ]
        },
        {
          key: "localEvents",
          slug: "evenements-running-aix",
          title: "Événements running Aix | Agenda local NULLL.CLUB",
          description:
            "Retrouve les événements running à Aix-en-Provence, les runs sociaux et les rendez-vous communautaires de NULLL.CLUB.",
          h1: "Les événements running à Aix-en-Provence",
          intro:
            "Un bon agenda running à Aix-en-Provence doit être lisible, local et suffisamment précis pour donner envie de venir dès la première lecture.",
          sections: [
            {
              title: "Quels événements suivre ?",
              body: [
                "Les événements running sociaux sont les plus faciles à rejoindre pour rencontrer du monde et reprendre un rythme.",
                "Les formats récurrents créent un vrai sentiment de communauté, surtout quand ils s’accompagnent d’un moment après la course."
              ]
            },
            {
              title: "Comment NULLL.CLUB les présente",
              body: [
                "Chaque run met en avant une date, un horaire, une distance, un lieu de rendez-vous et un contexte clair.",
                "Cette structure répond mieux à l’intention de recherche qu’une page purement manifeste."
              ]
            }
          ]
        }
      ] satisfies Article[],
      runs
    };
}
