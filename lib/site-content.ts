export const locales = ["fr", "eng"] as const;

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
  },
  eng: {
    home: "",
    runs: "runs",
    community: "community",
    merch: "merch",
    about: "about",
    contact: "contact",
    checkout: "checkout",
    localClub: "aix-en-provence-run-club",
    localRunning: "running-in-aix-en-provence",
    localEvents: "aix-running-events"
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
  ],
  eng: [
    {
      id: "tee-black",
      image: "/assets/merch/tee-black-blank.png",
      alt: "Black NULLL.CLUB t-shirt",
      name: "Club black tee",
      price: 35,
      badge: "Aix Edition 001",
      description: "Heavy black t-shirt built for social runs in Aix-en-Provence.",
      fit: "Straight fit, heavy cotton, unisex."
    },
    {
      id: "tee-white",
      image: "/assets/merch/tee-white-blank.png",
      alt: "White NULLL.CLUB t-shirt",
      name: "Signal white tee",
      price: 35,
      badge: "Aix Edition 001",
      description: "Bright version for sunset sessions and running events in Aix.",
      fit: "Straight fit, heavy cotton, unisex."
    },
    {
      id: "tee-social",
      image: "/assets/merch/tee-black-blank.png",
      alt: "Black NULLL.CLUB social warning t-shirt",
      name: "Social warning tee",
      price: 38,
      badge: "Limited edition",
      description: "Statement piece supporting the run club and upcoming events.",
      fit: "Straight fit, heavy cotton, unisex."
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

function buildRuns(locale: Locale): RunEvent[] {
  if (locale === "fr") {
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

  return [
    {
      ...sharedEvents[0],
      date: "Friday, September 12 2026",
      title: "Social discovery run",
      pace: "Conversation pace",
      summary: "Ideal first session to discover the Aix-en-Provence run club without pressure.",
      afterRun: "Drinks and music after the run"
    },
    {
      ...sharedEvents[1],
      date: "Friday, September 19 2026",
      title: "Sunset social run",
      pace: "Easy pace",
      summary: "Simple city loop to run in Aix-en-Provence and meet new people.",
      afterRun: "Group photo and partner drink"
    },
    {
      ...sharedEvents[2],
      date: "Friday, September 26 2026",
      title: "Community run",
      pace: "Social pace",
      summary: "Collective session designed for regular members and first-timers.",
      afterRun: "Informal meetup after the session"
    }
  ];
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getRoute(locale: Locale, key: RouteKey) {
  const slug = routeSlugs[locale][key];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export function switchLocalePath(locale: Locale, pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) {
    return `/${locale}`;
  }

  const current = parts[0];
  if (!isLocale(current)) {
    return `/${locale}`;
  }

  const nextParts = [...parts];
  nextParts[0] = locale;
  return `/${nextParts.join("/")}`;
}

export function getArticleBySlug(locale: Locale, slug: string) {
  return getSiteCopy(locale).articles.find((article) => article.slug === slug);
}

export function getSiteCopy(locale: Locale) {
  const runs = buildRuns(locale);

  if (locale === "fr") {
    return {
      locale,
      siteName: "NULLL.CLUB",
      languageLabel: "Français",
      alternateLanguageLabel: "English",
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
          title: "Run club à Aix-en-Provence | NULLL.CLUB",
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
          title: "Merch du run club | NULLL.CLUB Aix-en-Provence",
          description:
            "Retrouve le merchandising officiel du run club NULLL.CLUB à Aix-en-Provence et commande les pièces disponibles."
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
          "Tu sais quoi faire ensuite : choisir un prochain run, suivre Instagram, ou commander une pièce du club.",
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
          merchTitle: "Le merch du club",
          merchText:
            "Un merchandising limité, cohérent avec l’identité du club, avec une commande simple et une demande confirmée en ligne.",
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
        title: "Le merchandising officiel du run club.",
        intro:
          "Une sélection courte, claire et directement commandable, pensée pour soutenir le club et renforcer son identité à Aix-en-Provence.",
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

  return {
    locale,
    siteName: "NULLL.CLUB",
    languageLabel: "English",
    alternateLanguageLabel: "Français",
    brandLine: "Social run club in Aix-en-Provence",
    city: "Aix-en-Provence",
    contact: {
      instagram: "https://www.instagram.com/nulll.club",
      instagramLabel: "@nulll.club",
      email: "contact@nulll.club",
      linkedin: "https://www.linkedin.com/company/nulll-club/"
    },
    nav: [
      { key: "home" as const, label: "Home" },
      { key: "runs" as const, label: "Runs" },
      { key: "community" as const, label: "Community" },
      { key: "merch" as const, label: "Merch" },
      { key: "about" as const, label: "About" },
      { key: "contact" as const, label: "Contact" }
    ],
    meta: {
      home: {
        title: "Aix-en-Provence Run Club | NULLL.CLUB",
        description:
          "NULLL.CLUB is a social run club in Aix-en-Provence with inclusive weekly runs, local community energy and clear event information."
      },
      runs: {
        title: "Upcoming Runs in Aix-en-Provence | NULLL.CLUB",
        description:
          "See the next runs from the Aix-en-Provence running club: dates, distance, meeting point, pace and social details."
      },
      community: {
        title: "Social Running Community in Aix | NULLL.CLUB",
        description:
          "Discover a welcoming social running community in Aix-en-Provence built around shared runs, local connections and recurring events."
      },
      merch: {
        title: "Run Club Merch | NULLL.CLUB Aix-en-Provence",
        description:
          "Shop the official NULLL.CLUB merch collection and send your order request directly from the site."
      },
      about: {
        title: "About the Running Club | NULLL.CLUB",
        description:
          "Learn how NULLL.CLUB builds a social running club in Aix-en-Provence focused on clarity, community and consistency."
      },
      contact: {
        title: "Contact the Aix-en-Provence Run Club | NULLL.CLUB",
        description:
          "Contact NULLL.CLUB to join a run, ask a question, discuss partnerships or follow upcoming running events in Aix."
      },
      checkout: {
        title: "Complete Your Order | NULLL.CLUB",
        description: "Review your cart, add your details and submit your merch order request."
      }
    },
    home: {
      hero: {
        title: "The social run club that gives Aix-en-Provence a real meeting point.",
        intro:
          "NULLL.CLUB hosts accessible runs in Aix-en-Provence for people who want to move, meet others and keep showing up week after week.",
        primaryCta: "See upcoming runs",
        secondaryCta: "Explore the community",
        stats: [
          { label: "City", value: "Aix-en-Provence" },
          { label: "Format", value: "Weekly social run" },
          { label: "Pace", value: "Conversation pace and beginner-friendly" }
        ]
      },
      promise: [
        "You immediately understand the offer: a real run club in Aix-en-Provence.",
        "You know what to do next: join a run, follow the club or place a merch order.",
        "You get proof, not just branding: dates, routes, atmosphere and local community signals."
      ],
      sections: {
        nextRunsTitle: "Upcoming runs in Aix-en-Provence",
        nextRunsText:
          "Every session displays a clear date, exact area, distance and the after-run plan.",
        howTitle: "How it works",
        howSteps: [
          {
            title: "Show up without pressure",
            text: "You do not need to be fast, fully equipped or already connected to the group."
          },
          {
            title: "Run at social pace",
            text: "Routes are designed for conversation, comfort and staying together."
          },
          {
            title: "Stay after the run",
            text: "The real value comes after the effort: music, drinks, names and future plans."
          }
        ],
        merchTitle: "Official club merch",
        merchText:
          "A short, coherent collection with a clear order flow and confirmation request built into the site.",
        seoTitle: "Why join a running group in Aix?",
        seoBody:
          "If you are looking for an Aix-en-Provence run club, a local running club or social running events in Aix, NULLL.CLUB offers clear event information, recurring sessions and an open community."
      },
      faq: [
        {
          q: "Can I come alone?",
          a: "Yes. That is often the best way to experience the group for the first time."
        },
        {
          q: "Do I need to be fast?",
          a: "No. The pace is built for conversation and shared movement."
        },
        {
          q: "How do I get the exact meeting point?",
          a: "The exact start location is shown on the runs page and repeated on Instagram."
        }
      ]
    },
    runsPage: {
      title: "Clear, recurring runs that are easy to join.",
      intro:
        "Every running event in Aix comes with a precise meeting area, expected effort level, distance and after-run context.",
      checklist: [
        "Conversation pace",
        "Meeting point announced in advance",
        "Distance matched to a social format",
        "After-run moment included"
      ],
      cta: "Get the next date",
      faq: [
        {
          q: "What level do I need?",
          a: "No minimum level is required. The goal is to move together at an accessible pace."
        },
        {
          q: "Can I join for the first time without messaging first?",
          a: "Yes, although you can message us if you want reassurance before your first session."
        },
        {
          q: "Do you host special events?",
          a: "Yes. Some dates include partners, music or photo and video coverage."
        }
      ]
    },
    communityPage: {
      title: "A local, welcoming and recurring running community.",
      intro:
        "NULLL.CLUB is more than a running group in Aix. It is a repeated reason to meet people in a city where staying inside your own circle is easy.",
      pillars: [
        {
          title: "Open to newcomers",
          text: "Every run is designed so a first visit feels simple and comfortable."
        },
        {
          title: "Rooted in Aix-en-Provence",
          text: "The club highlights local routes, local people and the city itself."
        },
        {
          title: "Built around connection",
          text: "Sport is the entry point, not the whole promise."
        }
      ]
    },
    aboutPage: {
      title: "A social running club, not a performance posture.",
      intro:
        "NULLL.CLUB exists to make running in Aix-en-Provence easier to join, easier to understand and more human.",
      values: [
        {
          title: "Clarity",
          text: "Readable pages, visible dates and an obvious next step."
        },
        {
          title: "Consistency",
          text: "A club only exists when its events keep coming back reliably."
        },
        {
          title: "Accessibility",
          text: "We remove intimidation without removing identity."
        },
        {
          title: "Design",
          text: "A brutalist and forward-looking direction that still stays understandable."
        }
      ]
    },
    contactPage: {
      title: "Join the club, ask a question or start a project.",
      intro:
        "To follow the next runs, get the exact meeting point or discuss a partnership, every channel is direct and explicit.",
      channels: [
        {
          title: "Instagram",
          value: "@nulll.club",
          text: "The main channel for new dates, quick updates and social proof.",
          href: "https://www.instagram.com/nulll.club"
        },
        {
          title: "Email",
          value: "contact@nulll.club",
          text: "Best for orders, partnerships, media requests and detailed questions.",
          href: "mailto:contact@nulll.club"
        },
        {
          title: "LinkedIn",
          value: "NULLL.CLUB",
          text: "For local partners, collaborations and brand projects.",
          href: "https://www.linkedin.com/company/nulll-club/"
        }
      ]
    },
    merchPage: {
      title: "Official run club merch.",
      intro:
        "A focused collection with a clear order flow designed to support the club and reinforce the local identity of the project.",
      trust: [
        "Per-product stock labels",
        "Built-in online order request",
        "Confirmation message with reference",
        "Local pickup or email coordination"
      ]
    },
    checkoutPage: {
      title: "Complete your order",
      intro:
        "Review your cart, add your details and submit your request. You will get a confirmation with the next steps."
    },
    articles: [
      {
        key: "localClub",
        slug: "aix-en-provence-run-club",
        title: "Aix-en-Provence Run Club | Local Guide by NULLL.CLUB",
        description:
          "Learn how to choose a run club in Aix-en-Provence and what makes a local running community easier to join.",
        h1: "Finding a run club in Aix-en-Provence",
        intro:
          "If you are looking for a run club in Aix-en-Provence, you usually want three things: clear timing, an accessible group and a reason to come back.",
        sections: [
          {
            title: "Why join a run club in Aix-en-Provence?",
            body: [
              "Running alone works for training, but not always for consistency. A local running club gives you a repeatable routine.",
              "The right running group in Aix combines a clear schedule, an accessible pace and social energy."
            ]
          },
          {
            title: "What NULLL.CLUB offers",
            body: [
              "Recurring social runs, readable communication, a strong identity and a real welcome for newcomers.",
              "The club focuses on clarity, local relevance and a better user journey than a vague manifesto-only website."
            ]
          }
        ]
      },
      {
        key: "localRunning",
        slug: "running-in-aix-en-provence",
        title: "Running in Aix-en-Provence | Local Advice and Community",
        description:
          "See where to run in Aix-en-Provence, how to join a running group and what to expect from a social running event.",
        h1: "Running in Aix-en-Provence with a group",
        intro:
          "Running in Aix-en-Provence becomes easier when you know the right timing, the right meeting points and the right local group.",
        sections: [
          {
            title: "Best formats for running in Aix",
            body: [
              "Sunset social runs are often the easiest format for building a lasting habit.",
              "A running group that clearly states pace and distance removes a large part of the friction."
            ]
          },
          {
            title: "How to choose the right group",
            body: [
              "Look for clear timing, beginner-friendly messaging and good follow-up on Instagram or email.",
              "Choose a group that shows distance, area and after-run context rather than just attitude."
            ]
          }
        ]
      },
      {
        key: "localEvents",
        slug: "aix-running-events",
        title: "Aix Running Events | Local Agenda by NULLL.CLUB",
        description:
          "Follow local running events in Aix-en-Provence, including social runs and recurring community sessions from NULLL.CLUB.",
        h1: "Running events in Aix-en-Provence",
        intro:
          "A strong running events page for Aix-en-Provence should be local, readable and precise enough to trigger action on the first visit.",
        sections: [
          {
            title: "What events matter most?",
            body: [
              "Social running events are often the easiest entry point for meeting people and rebuilding consistency.",
              "Recurring formats create stronger community memory, especially when the run continues with a shared moment afterwards."
            ]
          },
          {
            title: "How NULLL.CLUB presents them",
            body: [
              "Each run highlights a date, a time, a distance, an area and a clear context.",
              "That structure answers search intent much better than concept copy alone."
            ]
          }
        ]
      }
    ] satisfies Article[],
    runs
  };
}
