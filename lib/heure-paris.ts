/**
 * Le champ datetime-local n'a pas de fuseau : « 08:30 » veut dire 8h30 a
 * Paris, pas a l'heure du serveur (UTC sur Vercel, soit 10h30 a Paris).
 * Sans import : ce module est teste tel quel par node --test.
 */
const HEURE_PARIS = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Paris",
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

/** « 2026-09-26T08:30 », lu comme une heure de Paris, en instant UTC. */
export function heureDeParis(valeur: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(valeur);

  if (!m) {
    return null;
  }

  const [annee, mois, jour, heure, minute] = m.slice(1).map(Number);
  const commeUtc = Date.UTC(annee, mois - 1, jour, heure, minute);
  const parties = Object.fromEntries(HEURE_PARIS.formatToParts(new Date(commeUtc)).map((p) => [p.type, p.value]));
  const vuAParis = Date.UTC(+parties.year, +parties.month - 1, +parties.day, +parties.hour, +parties.minute);
  const resultat = new Date(commeUtc - (vuAParis - commeUtc));

  return Number.isNaN(resultat.getTime()) ? null : resultat;
}
