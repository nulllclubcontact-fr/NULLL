/** Formats partages par l'espace compte et l'admin, pour ne pas diverger. */

const JOUR = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Europe/Paris"
});

const HEURE = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris"
});

const JOUR_COURT = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  timeZone: "Europe/Paris"
});

export function formatJour(iso: string) {
  return JOUR.format(new Date(iso));
}

export function formatHeure(iso: string) {
  return HEURE.format(new Date(iso)).replace(":", "h");
}

export function formatJourCourt(iso: string) {
  return JOUR_COURT.format(new Date(iso));
}

export function formatDistance(km: number | null) {
  if (km === null) return null;
  const texte = Number.isInteger(km) ? String(km) : String(km).replace(".", ",");
  return `${texte} km`;
}
