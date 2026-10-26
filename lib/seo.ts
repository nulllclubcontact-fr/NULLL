import type { Metadata } from "next";
import { getRoute, type Locale, type RouteKey } from "./site-content";

const SITE_URL = "https://nulll.club";

// Identifiant stable du club : le site, les evenements et les actus y
// renvoient par @id au lieu de redeclarer une organisation anonyme.
const ORG_ID = `${SITE_URL}/#organization`;
// Fiche des associes sur oculot.studio : meme @id des deux cotes, pour que
// Google relie les personnes au club et au studio.
const OCULOT_ID = "https://oculot.studio/#organization";

export function getSiteUrl() {
  return SITE_URL;
}

export function buildWebSiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "NULLL.CLUB",
    alternateName: ["NULLL", "NULLL Club", "Nulll Club Aix-en-Provence"],
    url: `${SITE_URL}${getRoute(locale, "home")}`,
    inLanguage: "fr-FR",
    publisher: { "@id": ORG_ID },
    creator: { "@type": "Organization", "@id": OCULOT_ID, name: "Oculot Studio", url: "https://oculot.studio" }
  };
}

export function buildFaqSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`
    }))
  };
}

export function buildPageMetadata({
  locale,
  routeKey,
  title,
  description
}: {
  locale: Locale;
  routeKey: RouteKey;
  title: string;
  description: string;
}): Metadata {
  const canonical = `${SITE_URL}${getRoute(locale, routeKey)}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fr: canonical,
        "x-default": `${SITE_URL}/fr`
      }
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "NULLL.CLUB",
      locale: "fr_FR",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/twitter-image`]
    }
  };
}

const FOUNDERS = [
  {
    "@type": "Person",
    "@id": "https://oculot.studio/studio#tobias",
    name: "Tobias Ringot",
    jobTitle: "Cofondateur",
    sameAs: ["https://www.linkedin.com/in/tobiasringot/", "https://github.com/tbsrgt"]
  },
  {
    "@type": "Person",
    "@id": "https://oculot.studio/studio#tom",
    name: "Tom Brenier",
    jobTitle: "Cofondateur",
    sameAs: ["https://www.linkedin.com/in/tom-brenier-517241333/"]
  },
  {
    "@type": "Person",
    "@id": `${SITE_URL}/#romane`,
    name: "Romane Fournier",
    jobTitle: "Associée, responsable sport et tracés"
  }
];

export function buildOrganizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    // SportsClub (sous-type d'Organization et de LocalBusiness) correspond a
    // ce qu'est NULLL.CLUB : une association, pas un simple lieu de pratique.
    // Une seule fiche, plutot qu'une Organization et un SportsClub en double.
    "@type": "SportsClub",
    "@id": ORG_ID,
    name: "NULLL.CLUB",
    alternateName: ["NULLL", "NULLL Club", "NULLL Run Club Aix-en-Provence"],
    description:
      "Social sport club d’Aix-en-Provence : une sortie running gratuite un samedi sur deux à 8h30, ouverte à tous les niveaux, à une allure qui permet de discuter.",
    url: `${SITE_URL}${getRoute(locale, "home")}`,
    logo: `${SITE_URL}/assets/brand/icone-n-rose.png`,
    image: `${SITE_URL}/assets/photos/hero-nulll-aix-v2.webp`,
    email: "contact@nulll.club",
    telephone: "+33626755273",
    sport: "Course à pied",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Parking du chemin de la Cible, près du lycée Émile Zola",
      postalCode: "13090",
      addressLocality: "Aix-en-Provence",
      addressRegion: "Provence-Alpes-Côte d'Azur",
      addressCountry: "FR"
    },
    // Parking public du chemin de la Cible, a cote du lycee Emile Zola,
    // releve sur OpenStreetMap (way 248421512). Les anciennes coordonnees
    // tombaient a plus de 2 km, sur l'ancien depart.
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.5096,
      longitude: 5.4611
    },
    // Pas d'openingHoursSpecification : la sortie a lieu un samedi sur deux,
    // et des horaires d'ouverture annonceraient tous les samedis. Les dates
    // reelles sont publiees en Event sur les pages des sorties.
    isAccessibleForFree: true,
    publicAccess: true,
    areaServed: {
      "@type": "City",
      name: "Aix-en-Provence"
    },
    founder: FOUNDERS,
    sameAs: [
      "https://www.instagram.com/nulll.club",
      "https://www.linkedin.com/company/nulll-club/",
      "https://www.strava.com/clubs/nulllclub"
    ]
  };
}

export function buildEventSchema(event: {
  locale: Locale;
  name: string;
  description: string;
  startDate: string;
  locationName: string;
  address: string;
  image?: string | null;
  /** Inscriptions fermees : pas d'offre annoncee comme disponible. */
  ouverte?: boolean;
  route: string;
}) {
  // Pas de endDate : l'heure de fin n'est pas connue, et une fin egale au
  // depart annoncait une sortie de zero minute.
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [event.image || `${SITE_URL}/assets/photos/motion-run.webp`],
    location: {
      "@type": "Place",
      name: event.locationName,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.address,
        addressLocality: "Aix-en-Provence",
        addressCountry: "FR"
      }
    },
    organizer: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "NULLL.CLUB",
      url: `${SITE_URL}${getRoute(event.locale, "home")}`
    },
    ...(event.ouverte === false
      ? {}
      : {
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}${event.route}`
          }
        })
  };
}

/** Une actu : NewsArticle, avec la vraie date et l'image de l'article. */
export function buildNewsArticleSchema(actu: {
  titre: string;
  resume: string;
  date: string;
  image: { src: string };
  galerie?: Array<{ src: string }>;
  tuto?: { titre: string; video?: { src: string; poster: string; description: string; duree: string }; etapes: Array<{ image: { src: string } }> };
  url: string;
}) {
  const images = [actu.image.src, ...(actu.galerie ?? []).map((photo) => photo.src), ...(actu.tuto?.etapes ?? []).map((etape) => etape.image.src)].filter(
    (src, i, tout) => tout.indexOf(src) === i
  );
  const video = actu.tuto?.video;
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: actu.titre,
    description: actu.resume,
    datePublished: actu.date,
    dateModified: actu.date,
    inLanguage: "fr-FR",
    image: images.slice(0, 6).map((src) => `${SITE_URL}${src}`),
    mainEntityOfPage: `${SITE_URL}${actu.url}`,
    // Google indexe la video de l'article (resultats Videos) a partir de cette fiche.
    ...(video
      ? {
          video: {
            "@type": "VideoObject",
            name: `${actu.tuto!.titre} · ${actu.titre}`,
            description: video.description,
            thumbnailUrl: `${SITE_URL}${video.poster}`,
            contentUrl: `${SITE_URL}${video.src}`,
            uploadDate: actu.date,
            duration: video.duree
          }
        }
      : {}),
    author: { "@type": "Organization", "@id": ORG_ID, name: "NULLL.CLUB", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "NULLL.CLUB",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/brand/icone-n-rose.png` }
    }
  };
}

/** Metadonnees d'une actu : canonique propre, type article, image de l'actu. */
export function buildActuMetadata({ titre, resume, date, image, url }: {
  titre: string;
  resume: string;
  date: string;
  image: { src: string; alt: string };
  url: string;
}): Metadata {
  const canonical = `${SITE_URL}${url}`;
  const title = `${titre} | NULLL.CLUB`;
  return {
    title,
    description: resume,
    alternates: { canonical, languages: { fr: canonical, "x-default": canonical } },
    openGraph: {
      title,
      description: resume,
      url: canonical,
      siteName: "NULLL.CLUB",
      locale: "fr_FR",
      type: "article",
      publishedTime: date,
      images: [{ url: `${SITE_URL}${image.src}`, alt: image.alt }]
    },
    twitter: { card: "summary_large_image", title, description: resume, images: [`${SITE_URL}${image.src}`] }
  };
}
