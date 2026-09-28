/**
 * Regles de la roulette de l'accueil. Fonctions pures, testees dans
 * regles.test.ts : le tirage lui-meme (hasard) est fait cote serveur,
 * jamais dans le navigateur, sinon n'importe qui choisirait son lot.
 */

export type Lot = "redbull" | "beezen" | "rien";

/**
 * Chances sur 100 pour chaque lot gagnant ; le reste, c'est « rien ».
 * A AJUSTER avec le club selon les stocks.
 */
export const CHANCES: Record<Exclude<Lot, "rien">, number> = {
  redbull: 10,
  beezen: 10
};

/** Plafond de lots gagnes par semaine, pour ne pas vider le stock. A AJUSTER. */
export const LOTS_PAR_SEMAINE: Record<Exclude<Lot, "rien">, number> = {
  redbull: 5,
  beezen: 5
};

export const LIBELLES_LOT: Record<Lot, string> = {
  redbull: "Une Red Bull",
  beezen: "Une Bee Zen",
  rien: "Rien cette fois"
};

/**
 * Les cases de la roue, dans l'ordre. Autant de cases que de chances
 * reelles (une case = 10 %) : la roue montre les vraies probabilites.
 */
export const CASES: Lot[] = ["redbull", "rien", "rien", "rien", "rien", "beezen", "rien", "rien", "rien", "rien"];

/** Un tirage entre 0 et 99 donne un lot. */
export function lotPourTirage(tirage: number): Lot {
  if (!Number.isInteger(tirage) || tirage < 0 || tirage > 99) return "rien";
  if (tirage < CHANCES.redbull) return "redbull";
  if (tirage < CHANCES.redbull + CHANCES.beezen) return "beezen";
  return "rien";
}

/** Si le stock de la semaine est epuise, le lot devient « rien ». */
export function appliquerPlafond(lot: Lot, dejaGagnesCetteSemaine: number): Lot {
  if (lot === "rien") return lot;
  return dejaGagnesCetteSemaine >= LOTS_PAR_SEMAINE[lot] ? "rien" : lot;
}

// Sans 0/O ni 1/I/L : le code se lit a voix haute le samedi matin.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Code a montrer au run, ex. NULLL-RB-7Q4KX. `octets` : au moins 5 octets aleatoires. */
export function formerCode(lot: Exclude<Lot, "rien">, octets: Uint8Array): string {
  if (octets.length < 5) throw new Error("5 octets minimum");
  const suffixe = Array.from(octets.slice(0, 5), (octet) => ALPHABET[octet % ALPHABET.length]).join("");
  return `NULLL-${lot === "redbull" ? "RB" : "BZ"}-${suffixe}`;
}

/** Normalise un code saisi par l'equipe (espaces, minuscules). */
export function normaliserCode(saisie: string): string {
  return saisie.trim().toUpperCase().replace(/\s+/g, "");
}

export function codeValide(code: string): boolean {
  return /^NULLL-(RB|BZ)-[2-9A-HJKMNP-Z]{5}$/.test(code);
}

/** Case sur laquelle la roue s'arrete pour un lot : une au hasard parmi les siennes. */
export function caseCible(lot: Lot, hasard: number): number {
  const indices = CASES.flatMap((valeur, index) => (valeur === lot ? [index] : []));
  return indices[Math.min(indices.length - 1, Math.floor(Math.max(0, Math.min(0.999999, hasard)) * indices.length))];
}
