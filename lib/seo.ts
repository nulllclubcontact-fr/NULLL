import type { Metadata } from "next";
import { getRoute, type Locale, type RouteKey } from "./site-content";

const SITE_URL = "https://nulll.club";

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
    publisher: {
      "@type": "Organization",
      name: "NULLL.CLUB",
      url: SITE_URL,
      logo: `${SITE_URL}/assets/brand/nulll-mark.png`
    }
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

export function buildOrganizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NULLL.CLUB",
    url: `${SITE_URL}${getRoute(locale, "home")}`,
    logo: `${SITE_URL}/assets/brand/nulll-mark.png`,
    sameAs: [
      "https://www.instagram.com/nulll.club",
      "https://www.linkedin.com/company/nulll-club/"
    ],
    email: "contact@nulll.club",
    areaServed: "Aix-en-Provence",
    description: "Run club social à Aix-en-Provence avec runs accessibles, événements locaux et communauté réelle."
  };
}

export function buildSportsLocationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "NULLL.CLUB Aix-en-Provence",
    description: "Groupe de course et communauté running à Aix-en-Provence.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Aix-en-Provence",
      addressCountry: "FR"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.5298,
      longitude: 5.4474
    },
    url: `${SITE_URL}/${locale}/runs`
  };
}

export function buildEventSchema(event: {
  locale: Locale;
  name: string;
  description: string;
  startDate: string;
  locationName: string;
  address: string;
  route: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [`${SITE_URL}/assets/photos/motion-run.png`],
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
      name: "NULLL.CLUB",
      url: `${SITE_URL}${getRoute(event.locale, "home")}`
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${event.route}`
    }
  };
}
