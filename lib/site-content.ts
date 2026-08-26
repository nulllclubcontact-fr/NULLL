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
        linkedin: "https://www.linkedin.com/company/nulll-club/"
      },
      nav: [
        { key: "home" as const, label: "Accueil" },
        { key: "runs" as const, label: "Sorties" },
        { key: "community" as const, label: "Communauté" },
        { key: "merch" as const, label: "Merch" },
        { key: "about" as const, label: "À propos" },
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
        title: "Tu viens seul. Tu ne repars jamais seul.",
        intro:
          "NULLL.CLUB n’est pas seulement un groupe de course à Aix-en-Provence. C’est un rendez-vous récurrent pour créer des liens dans une ville où il est facile de rester dans son cercle.",
        ticker: "Zéro écouteurs — Allure conversation — Personne derrière — Ouvert à tous — After run",
        facts: [
          { label: "Quand", value: "Samedi, 8h30" },
          { label: "Où", value: "Parking Émile Zola" },
          { label: "Distance", value: "5 à 6 km" },
          { label: "Combien", value: "Gratuit" }
        ],
        steps: [
          {
            title: "Tu arrives",
            text: "Présente-toi et dis que c’est ta première fois. Quelqu’un te prend en charge. Rien à préparer, rien à signer.",
            photo: "/assets/photos/principle-fun.webp",
            position: "object-[50%_26%]",
            alt: "Un membre du club accueille un nouveau venu avant le départ"
          },
          {
            title: "On court",
            text: "5 à 6 km à allure conversation, celle où l’on peut encore parler. Personne n’est laissé derrière.",
            photo: "/assets/photos/principle-meet.webp",
            position: "object-[50%_45%]",
            alt: "Deux coureurs du club sur un chemin ombragé à Aix-en-Provence"
          },
          {
            title: "On reste",
            text: "Le moment qui suit la course compte autant que la course. C’est là que les gens se parlent vraiment.",
            photo: "/assets/photos/runs-crew.webp",
            position: "object-[45%_38%]",
            alt: "Deux membres du club discutent en riant après la sortie"
          }
        ],
        // Les photos editoriales du club — chambre, douche, lunettes miroir —
        // n'etaient utilisees nulle part. Elles racontent la vie autour du run.
        galleryTitle: "Les 23 autres heures.",
        galleryIntro:
          "Le run dure une heure. Le club, c’est surtout ce qu’il y a autour.",
        gallery: [
          {
            label: "Le réveil",
            text: "Le samedi à 7h40, la seule vraie difficulté de la semaine.",
            src: "/assets/photos/editorial-bed.webp",
            position: "object-[50%_32%]",
            alt: "Réveil difficile un samedi matin avant la sortie du club"
          },
          {
            label: "Le reflet",
            text: "Tu arrives seul. Au bout de dix minutes tu es dans le groupe.",
            src: "/assets/photos/editorial-glasses.webp",
            position: "object-[52%_48%]",
            alt: "Le groupe du club se reflète dans le verre miroir de lunettes de sport"
          },
          {
            label: "Le matériel",
            text: "Une paire, une clé, une gourde. Il n’en faut pas plus.",
            src: "/assets/photos/runner-ground.webp",
            position: "object-[50%_52%]",
            alt: "Chaussures, clés et gourde posées au sol après la course"
          },
          {
            label: "La douche",
            text: "Et le reste de la journée qui reprend, en mieux.",
            src: "/assets/photos/editorial-shower.webp",
            position: "object-[50%_26%]",
            alt: "Portrait décalé sous la douche après la sortie du samedi"
          },
          {
            label: "Le lendemain",
            text: "On recommence samedi. C’est tout l’intérêt d’un rendez-vous fixe.",
            src: "/assets/photos/motion-run.webp",
            position: "object-[50%_32%]",
            alt: "Deux membres du club en mouvement, saisis en flou"
          }
        ],
        mapTitle: "La carte du club.",
        mapIntro:
          "Trois piliers, un seul rendez-vous. Survole un pilier pour le détail.",
        pillars: [
          {
            title: "Ouvert aux nouveaux",
            text: "La majorité des personnes qui viennent pour la première fois n’ont pas de club et ne courent pas en compétition.",
            detail: "Aucun niveau requis",
            accent: "bg-[#ffb000]"
          },
          {
            title: "Ancré à Aix",
            text: "Les parcours partent du centre : parc Jourdan, la Torse, et plus loin le Réaltor ou la Sainte-Victoire.",
            detail: "Départ parking Émile Zola",
            accent: "bg-[#d96ab4]"
          },
          {
            title: "Le lien d’abord",
            text: "Le sport est le point de départ, pas la seule promesse. On vient pour courir, on revient pour les gens.",
            detail: "L’after run fait partie du run",
            accent: "bg-[#f6eadf]"
          }
        ],
        ctaTitle: "Le prochain rendez-vous est samedi.",
        ctaText: "Rien à réserver. Présente-toi à 8h25 au parking Émile Zola, on s’occupe du reste."
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
                "NULLL.CLUB est une association loi 1901 déclarée à Aix-en-Provence. Il n’y a ni abonnement, ni engagement, ni objectif de performance : le club existe pour que courir devienne une habitude sociale plutôt qu’une corvée solitaire.",
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
