import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Briques visuelles de l'administration : chiffres, histogrammes, classements.
 * Tout reste dans la palette du club, en blocs pleins plutot qu'en opacites :
 * du bordeaux a 50 % sur le creme ne se lisait pas.
 */

// Le style global met la police d'affiche en 900 avec un tracking negatif.
// Elle n'existe qu'en une graisse : en petit, le gras synthetique colle les
// lettres. Les titres de ligne reviennent donc a la graisse native.
export const TITRE_LIGNE = "inline-flex min-h-11 items-center font-display text-2xl font-normal uppercase leading-none tracking-[.03em]";

const TEINTES = {
  bordeaux: "bg-[#773331] text-[#F1EDE9]",
  rose: "bg-[#EBA0CD] text-[#773331]",
  jaune: "bg-[#FFB200] text-[#773331]",
  creme: "bg-[#F1EDE9] text-[#773331]"
} as const;

export type Teinte = keyof typeof TEINTES;

export type Tuile = {
  label: string;
  valeur: string | number;
  detail: string;
  teinte: Teinte;
  /** Pourcentage de 0 a 100, dessine en barre sous le chiffre. */
  jauge?: number;
};

export function Tuiles({ tuiles }: { tuiles: Tuile[] }) {
  const colonnes = tuiles.length > 4 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-4";

  return (
    <dl className={`grid gap-4 ${colonnes}`}>
      {tuiles.map((t) => (
        <div className={`flex flex-col border-2 border-[#773331] p-5 ${TEINTES[t.teinte]}`} key={t.label}>
          <dt className="font-mono text-xs font-black uppercase tracking-[.16em]">{t.label}</dt>
          <dd className="mt-3 font-display text-[clamp(2.6rem,7vw,4rem)] leading-none">{t.valeur}</dd>
          {t.jauge !== undefined ? (
            <div aria-hidden className="mt-4 h-3 border-2 border-[#773331] bg-[#F1EDE9]">
              <div className="h-full bg-[#773331]" style={{ width: `${Math.min(100, t.jauge)}%` }} />
            </div>
          ) : null}
          <p className="mt-auto pt-3 font-mono text-xs font-black uppercase tracking-[.12em]">{t.detail}</p>
        </div>
      ))}
    </dl>
  );
}

export function Intitule({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 border-b-2 border-[#773331] pb-3 font-mono text-xs font-black uppercase tracking-[.18em]">
      <span aria-hidden className="size-3 shrink-0 bg-[#EBA0CD] ring-2 ring-[#773331]" />
      {children}
    </h2>
  );
}

export function Pastille({ couleur }: { couleur: string }) {
  return <span aria-hidden className={`inline-block size-3 border-2 border-[#773331] ${couleur}`} />;
}

export function Etiquette({ teinte, pointillee, children }: { teinte: Teinte; pointillee?: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-block border-2 border-[#773331] px-2 py-1 font-mono text-xs font-black uppercase tracking-[.12em] ${TEINTES[teinte]} ${pointillee ? "border-dashed" : ""}`}
    >
      {children}
    </span>
  );
}

const CLE_JOUR = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" });
const ETIQUETTE_JOUR = new Intl.DateTimeFormat("fr-FR", { weekday: "narrow", day: "numeric", timeZone: "Europe/Paris" });

export type Jour = { cle: string; etiquette: string; total: number };

/**
 * Les n derniers jours a l'heure de Paris, du plus ancien a aujourd'hui,
 * avec un compteur a remplir. Hors d'un composant : lire l'heure pendant
 * le rendu est refuse par la regle de purete de React.
 */
export function fenetreJours(n: number) {
  const maintenant = Date.now();
  const jours: Jour[] = Array.from({ length: n }, (_, i) => {
    const date = new Date(maintenant - (n - 1 - i) * 86_400_000);
    return { cle: CLE_JOUR.format(date), etiquette: ETIQUETTE_JOUR.format(date), total: 0 };
  });
  const parCle = new Map(jours.map((j) => [j.cle, j]));

  return {
    jours,
    ajouter(iso: string, valeur = 1) {
      const jour = parCle.get(CLE_JOUR.format(new Date(iso)));
      if (jour) jour.total += valeur;
    }
  };
}

export type Granularite = "jour" | "semaine" | "mois";

// Cles « AAAA-MM-JJ » : on calcule sur des dates a midi UTC, sans heure
// d'ete ni fuseau pour decaler un jour.
const ETIQUETTE_JOUR_CLE = new Intl.DateTimeFormat("fr-FR", { weekday: "narrow", day: "numeric", timeZone: "UTC" });
const ETIQUETTE_SEMAINE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "numeric", timeZone: "UTC" });
const ETIQUETTE_MOIS = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" });

function dateDeCle(cle: string) {
  return new Date(`${cle}T12:00:00Z`);
}

/** Jour de Paris d'un instant, en « AAAA-MM-JJ ». */
export function cleParisDe(instant: string | Date) {
  return CLE_JOUR.format(new Date(instant));
}

export function decalerJours(cle: string, jours: number) {
  const date = dateDeCle(cle);
  date.setUTCDate(date.getUTCDate() + jours);
  return date.toISOString().slice(0, 10);
}

export function lundiDe(cle: string) {
  return decalerJours(cle, -((dateDeCle(cle).getUTCDay() + 6) % 7));
}

export function premierDuMois(cle: string, decalageMois = 0) {
  const date = dateDeCle(`${cle.slice(0, 7)}-01`);
  date.setUTCMonth(date.getUTCMonth() + decalageMois);
  return date.toISOString().slice(0, 10);
}

function clePeriode(cleJour: string, granularite: Granularite) {
  if (granularite === "semaine") return lundiDe(cleJour);
  if (granularite === "mois") return cleJour.slice(0, 7);
  return cleJour;
}

function etiquettePeriode(cle: string, granularite: Granularite) {
  if (granularite === "semaine") return ETIQUETTE_SEMAINE.format(dateDeCle(cle));
  if (granularite === "mois") return ETIQUETTE_MOIS.format(dateDeCle(`${cle}-01`));
  return ETIQUETTE_JOUR_CLE.format(dateDeCle(cle));
}

/**
 * Jours, semaines (du lundi) ou mois entre deux jours de Paris inclus,
 * avec un compteur a remplir. Une vente hors de la fenetre est ignoree.
 */
export function fenetrePeriodes(debut: string, fin: string, granularite: Granularite) {
  const periodes: Jour[] = [];
  const parCle = new Map<string, Jour>();

  for (let cle = debut; cle <= fin; cle = decalerJours(cle, 1)) {
    const cleP = clePeriode(cle, granularite);

    if (!parCle.has(cleP)) {
      const periode = { cle: cleP, etiquette: etiquettePeriode(cleP, granularite), total: 0 };
      parCle.set(cleP, periode);
      periodes.push(periode);
    }
  }

  return {
    periodes,
    ajouter(iso: string, valeur = 1) {
      const jour = cleParisDe(iso);
      if (jour < debut || jour > fin) return;
      const periode = parCle.get(clePeriode(jour, granularite));
      if (periode) periode.total += valeur;
    }
  };
}

/** Histogramme par jour (ou par periode) ; la derniere colonne en jaune. */
export function ColonnesParJour({
  jours,
  description,
  formater = (n) => String(n)
}: {
  jours: Jour[];
  description: string;
  formater?: (n: number) => string;
}) {
  const max = Math.max(1, ...jours.map((j) => j.total));
  // Au-dela de deux semaines, les valeurs ne tiennent plus au-dessus des
  // colonnes et une etiquette sur trois suffit.
  const avecValeurs = jours.length <= 14;
  const pas = Math.ceil(jours.length / 14);

  return (
    <div aria-label={description} className="chart-scroll min-w-0 max-w-full overflow-x-auto" tabIndex={0}>
      <div style={{ minWidth: `${jours.length * (avecValeurs ? 52 : 24)}px` }}>
      <div aria-label={description} className="mt-6 flex h-40 items-end gap-1 border-b-2 border-[#773331]" role="img">
        {jours.map((j, index) => (
          <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1" key={j.cle} title={`${j.etiquette} : ${formater(j.total)}`}>
            {avecValeurs && j.total > 0 ? <span className="font-mono text-xs font-black">{formater(j.total)}</span> : null}
            <div
              className={`w-full border-2 border-b-0 border-[#773331] ${index === jours.length - 1 ? "bg-[#FFB200]" : "bg-[#EBA0CD]"}`}
              style={{ height: j.total > 0 ? `${(j.total / max) * 80}%` : "0" }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden className="mt-2 flex gap-1">
        {jours.map((j, index) => (
          <span className="min-w-0 flex-1 whitespace-nowrap text-center font-mono text-xs font-black uppercase leading-tight" key={j.cle}>
            {index % pas === 0 || index === jours.length - 1 ? j.etiquette : ""}
          </span>
        ))}
      </div>
      </div>
    </div>
  );
}

export type LigneClassement = {
  cle: string;
  titre: string;
  href?: string;
  valeur: number;
  texte: string;
  detail?: string;
};

/** Barres horizontales, la plus longue sert d'etalon. */
export function BarresClassement({ lignes, vide }: { lignes: LigneClassement[]; vide: string }) {
  if (lignes.length === 0) {
    return <p className="mt-5 border-2 border-dashed border-[#773331] p-6 font-bold">{vide}</p>;
  }

  const max = Math.max(1, ...lignes.map((l) => l.valeur));

  return (
    <ul className="mt-6 grid gap-5">
      {lignes.map((l) => (
        <li key={l.cle}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            {l.href ? (
              <Link className={`${TITRE_LIGNE} hover:underline hover:decoration-[#EBA0CD] hover:decoration-4`} href={l.href}>
                {l.titre}
              </Link>
            ) : (
              <span className={TITRE_LIGNE}>{l.titre}</span>
            )}
            <span className="font-mono text-xs font-black uppercase tracking-[.08em]">{l.texte}</span>
          </div>
          {l.detail ? <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[.1em]">{l.detail}</p> : null}
          <div aria-hidden className="mt-2 h-5 border-2 border-[#773331] bg-[#F1EDE9]">
            <div className="h-full bg-[#EBA0CD]" style={{ width: `${(l.valeur / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
