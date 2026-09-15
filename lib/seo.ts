import type { Metadata } from "next";
import { getRoute, type Locale, type RouteKey } from "./site-content";

const SITE_URL = "https://nulll.club";

/** Identifiant commun du club dans les donnees structurees : une seule entite, citee partout. */
const CLUB_ID = `${SITE_URL}/#club`;

/** Meme texte que app/opengraph-image.tsx. */
const IMAGE_PARTAGE_ALT = "NULLL.CLUB, social sport club à Aix-en-Provence";

export function getSiteUrl() {
  return SITE_URL;
}

export function buildWebSiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NULLL.CLUB",
    alternateName: ["NULLL", "NULLL Club", "Nulll Club Aix-en-Provence"],
    url: `${SITE_URL}${getRoute(locale, "home")}`,
    inLanguage: "fr-FR",
    publisher: { "@id": CLUB_ID }
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
      // x-default designe l'equivalent de la meme page, pas l'accueil.
      languages: {
        fr: canonical,
        "x-default": canonical
      }
    },
    // Un openGraph declare par la page remplace celui des fichiers
    // app/opengraph-image.tsx et twitter-image.tsx : l'image doit donc etre
    // redonnee ici, avec ses dimensions et son texte alternatif.
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "NULLL.CLUB",
      locale: "fr_FR",
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: IMAGE_PARTAGE_ALT, type: "image/png" }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: `${SITE_URL}/twitter-image`, width: 1200, height: 630, alt: IMAGE_PARTAGE_ALT }]
    }
  };
}

export function buildOrganizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": CLUB_ID,
    name: "NULLL.CLUB",
    url: `${SITE_URL}${getRoute(locale, "home")}`,
    logo: `${SITE_URL}/assets/brand/icone-n-rose.png`,
    sameAs: [
      "https://www.instagram.com/nulll.club",
      "https://www.linkedin.com/company/nulll-club/"
    ],
    email: "contact@nulll.club",
    areaServed: "Aix-en-Provence",
    description: "Club de course à Aix-en-Provence avec sorties accessibles, événements locaux et communauté réelle."
  };
}

export function buildSportsLocationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    // SportsClub est plus precis que SportsActivityLocation et correspond a ce
    // qu'est NULLL.CLUB : une association, pas un simple lieu de pratique.
    "@type": ["SportsClub", "SportsActivityLocation"],
    "@id": CLUB_ID,
    name: "NULLL.CLUB",
    alternateName: "NULLL Run Club Aix-en-Provence",
    description:
      "Club de course à pied et club de sport associatif à Aix-en-Provence. Sorties running collectives tous les samedis à 8h30, ouvertes à tous les niveaux et gratuites.",
    sport: "Course à pied",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Parking du chemin de la Cible, près du lycée Émile Zola",
      postalCode: "13090",
      addressLocality: "Aix-en-Provence",
      addressRegion: "Provence-Alpes-Côte d’Azur",
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
    // Pas d'openingHoursSpecification : elle annoncait 08:00-12:00 alors que
    // le site dit 8h30, et aucune heure de fin n'est publiee. Le creneau du
    // samedi 8h30 est porte par la description et par chaque Event.
    isAccessibleForFree: true,
    publicAccess: true,
    areaServed: {
      "@type": "City",
      name: "Aix-en-Provence"
    },
    email: "contact@nulll.club",
    telephone: "+33626755273",
    image: `${SITE_URL}/assets/photos/hero-nulll-aix-v2.webp`,
    logo: `${SITE_URL}/assets/brand/icone-n-rose.png`,
    sameAs: [
      "https://www.instagram.com/nulll.club",
      "https://www.linkedin.com/company/nulll-club/"
    ],
    url: `${SITE_URL}${getRoute(locale, "home")}`
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
      "@id": CLUB_ID,
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
