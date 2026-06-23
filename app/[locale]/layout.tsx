import type { ReactNode } from "react";
import { locales } from "../../lib/site-content";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return children;
}
