import type { ReactNode } from "react";

export function generateStaticParams() {
  return [{ locale: "fr" }];
}

// Une langue inconnue (/en, /xx) repond 404 des le routage, avec la vraie
// page introuvable, au lieu de la coquille vide rendue par notFound()
// depuis generateMetadata.
export const dynamicParams = false;

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return children;
}
