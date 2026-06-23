import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./site-content";

export function resolveLocale(value: string): Locale {
  if (!isLocale(value)) {
    notFound();
  }

  return value;
}
