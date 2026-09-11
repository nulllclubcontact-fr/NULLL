import Link from "next/link";
import { redirect } from "next/navigation";
import { getProSession } from "../../../../lib/pro/guard";
import { getAdminPartner, listAdminPartnerSales, type AdminPartnerSale } from "../../../../lib/admin/repo";
import { formatEuro } from "../../../../components/races/format";
import {
  BarresClassement,
  ColonnesParJour,
  Intitule,
  TITRE_LIGNE,
  Tuiles,
  cleParisDe,
  decalerJours,
  fenetrePeriodes,
  lundiDe,
  premierDuMois,
  type Granularite
} from "../../../../components/admin/graphiques";

type StatsPageProps = {
  searchParams?: Promise<{
    from?: string;
    to?: string;
    vue?: string;
  }>;
};

type DayStats = {
  day: string;
  revenue: number;
  clients: Set<string>;
  scans: number;
  points: number;
  orders: AdminPartnerSale[];
};

const VUES: Array<{ vue: Granularite; label: string }> = [
  { vue: "jour", label: "30 jours" },
  { vue: "semaine", label: "12 semaines" },
  { vue: "mois", label: "12 mois" }
];

const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;

const JOUR_SEMAINE = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", weekday: "short" });
const SEMAINE = [
  ["Mon", "Lundi"],
  ["Tue", "Mardi"],
  ["Wed", "Mercredi"],
  ["Thu", "Jeudi"],
  ["Fri", "Vendredi"],
  ["Sat", "Samedi"],
  ["Sun", "Dimanche"]
] as const;

// Hors du composant : lire l'heure pendant le rendu est refuse par la
// regle de purete de React.
function aujourdhuiParis() {
  return cleParisDe(new Date());
}

function debutParDefaut(vue: Granularite, fin: string) {
  if (vue === "mois") return premierDuMois(fin, -11);
  if (vue === "semaine") return decalerJours(lundiDe(fin), -7 * 11);
  return decalerJours(fin, -29);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date(`${value}T12:00:00Z`));
}

function formatCourt(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00Z`));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

// Au-dessus des colonnes, pas de centimes : « 123 € » tient, « 123,45 € » deborde.
function euroCompact(value: number) {
  return `${Math.round(value)} €`;
}

export default async function ProStatsPage({ searchParams }: StatsPageProps) {
  const session = await getProSession();

  if (!session) {
    redirect("/pro/login");
  }

  const params = await searchParams;
  const vue: Granularite = params?.vue === "semaine" || params?.vue === "mois" ? params.vue : "jour";
  const fin = params?.to && DATE_ISO.test(params.to) ? params.to : aujourdhuiParis();
  const debut = params?.from && DATE_ISO.test(params.from) && params.from <= fin ? params.from : debutParDefaut(vue, fin);
  const surMesure = Boolean(params?.from || params?.to);

  // Toutes les ventes du partenaire (lecture paginee, au-dela de 1000),
  // triees de la plus recente ; la periode se filtre en jours de Paris.
  const [ventes, partenaire] = await Promise.all([listAdminPartnerSales(session.partnerId), getAdminPartner(session.partnerId)]);
  const transactions = ventes.filter((vente) => {
    const jour = cleParisDe(vente.created_at);
    return jour >= debut && jour <= fin;
  });

  const caParPeriode = fenetrePeriodes(debut, fin, vue);
  const scansParPeriode = fenetrePeriodes(debut, fin, vue);
  const dayMap = new Map<string, DayStats>();
  const achatsParClient = new Map<string, number>();
  const parJourSemaine = new Map<string, { scans: number; ca: number }>();
  let totalRevenue = 0;
  let totalPoints = 0;

  for (const transaction of transactions) {
    const montant = Number(transaction.amount_eur);
    const day = cleParisDe(transaction.created_at);

    totalRevenue += montant;
    totalPoints += transaction.points_awarded;
    achatsParClient.set(transaction.member_id, (achatsParClient.get(transaction.member_id) ?? 0) + 1);
    caParPeriode.ajouter(transaction.created_at, montant);
    scansParPeriode.ajouter(transaction.created_at);

    const jourSemaine = JOUR_SEMAINE.format(new Date(transaction.created_at));
    const cumul = parJourSemaine.get(jourSemaine) ?? { scans: 0, ca: 0 };
    cumul.scans += 1;
    cumul.ca += montant;
    parJourSemaine.set(jourSemaine, cumul);

    const existing =
      dayMap.get(day) ??
      ({
        day,
        revenue: 0,
        clients: new Set<string>(),
        scans: 0,
        points: 0,
        orders: []
      } satisfies DayStats);

    existing.revenue += montant;
    existing.clients.add(transaction.member_id);
    existing.scans += 1;
    existing.points += transaction.points_awarded;
    existing.orders.push(transaction);
    dayMap.set(day, existing);
  }

  const days = [...dayMap.values()].sort((a, b) => b.day.localeCompare(a.day));
  const totalScans = transactions.length;
  const totalClients = achatsParClient.size;
  const clientsFideles = [...achatsParClient.values()].filter((n) => n > 1).length;
  const panierMoyen = totalScans === 0 ? 0 : totalRevenue / totalScans;
  const nomPeriode = vue === "jour" ? "jour" : vue === "semaine" ? "semaine" : "mois";

  return (
    <section className="shell grid gap-10 py-8 lg:py-12">
      <header>
        <p className="inline-flex border-2 border-[#773331] bg-[#FFB200] px-3 py-2 font-mono text-xs font-black uppercase">
          Stats pro{partenaire ? ` · ${partenaire.name}` : ""}
        </p>
        <h1 className="mt-6 font-display text-[clamp(3.6rem,10vw,8rem)] uppercase leading-[0.94]">
          Ton vrai <span className="bg-[#EBA0CD] px-2">CA.</span>
        </h1>
        <p className="mt-5 max-w-xl font-bold leading-tight">Chaque vente scannée en caisse, et rien d’autre. Choisis ta période.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-end">
        <nav aria-label="Période" className="flex flex-wrap self-start border-2 border-[#773331] lg:self-end">
          {VUES.map(({ vue: choix, label }) => {
            const actif = !surMesure && choix === vue;
            return (
              <Link
                aria-current={actif ? "page" : undefined}
                className={`inline-flex min-h-12 flex-1 items-center justify-center px-4 font-mono text-xs font-black uppercase tracking-[.12em] transition ${
                  actif ? "bg-[#773331] text-[#F1EDE9]" : "bg-[#F1EDE9] text-[#773331] hover:bg-[#EBA0CD]"
                }`}
                href={`/pro/stats?vue=${choix}`}
                key={choix}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <form action="/pro/stats" className="grid gap-3 border-2 border-[#773331] bg-[#EBA0CD]/35 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <input name="vue" type="hidden" value={vue} />
          <label className="grid gap-2 font-mono text-xs font-black uppercase">
            Du
            <input className="field" defaultValue={debut} name="from" type="date" />
          </label>
          <label className="grid gap-2 font-mono text-xs font-black uppercase">
            Au
            <input className="field" defaultValue={fin} name="to" type="date" />
          </label>
          <button className="primary-button" type="submit">
            Filtrer
          </button>
        </form>
      </div>

      <Tuiles
        tuiles={[
          { label: "CA sur la période", valeur: formatEuro(totalRevenue), detail: `panier moyen ${formatEuro(panierMoyen)}`, teinte: "bordeaux" },
          { label: "Clients", valeur: totalClients, detail: `${clientsFideles} revenus plus d’une fois`, teinte: "rose" },
          { label: "Scans", valeur: totalScans, detail: "ventes validées en caisse", teinte: "jaune" },
          { label: "Points donnés", valeur: totalPoints, detail: "aux membres NULLL", teinte: "creme" }
        ]}
      />

      <div>
        <Intitule>
          CA par {nomPeriode} · du {formatCourt(debut)} au {formatCourt(fin)}
        </Intitule>
        <ColonnesParJour
          description={`${formatEuro(totalRevenue)} de ventes, par ${nomPeriode}`}
          formater={euroCompact}
          jours={caParPeriode.periodes}
        />
        <p className="mt-3 font-mono text-xs font-black uppercase tracking-[.12em]">
          {totalRevenue === 0 ? "Aucune vente sur la période" : `${formatEuro(totalRevenue)} · dernier ${nomPeriode} en jaune · survole une colonne pour le détail`}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Intitule>Scans par {nomPeriode}</Intitule>
          <ColonnesParJour description={`${totalScans} scans, par ${nomPeriode}`} jours={scansParPeriode.periodes} />
          <p className="mt-3 font-mono text-xs font-black uppercase tracking-[.12em]">
            {totalScans === 0 ? "Aucun scan sur la période" : `${totalScans} scan${totalScans > 1 ? "s" : ""} au total`}
          </p>
        </div>

        <div>
          <Intitule>Jours où les membres viennent</Intitule>
          <BarresClassement
            lignes={
              totalScans === 0
                ? []
                : SEMAINE.map(([cle, nom]) => {
                    const cumul = parJourSemaine.get(cle) ?? { scans: 0, ca: 0 };
                    return {
                      cle,
                      titre: nom,
                      valeur: cumul.scans,
                      texte: `${cumul.scans} scan${cumul.scans > 1 ? "s" : ""} · ${formatEuro(cumul.ca)}`
                    };
                  })
            }
            vide="Pas encore de scan pour dégager une tendance."
          />
        </div>
      </div>

      <div>
        <Intitule>Le détail, jour par jour</Intitule>
        {days.length === 0 ? (
          <p className="mt-5 border-2 border-dashed border-[#773331] p-6 font-bold">
            Pas encore de scan sur cette période. Quand une commande passe par QR, elle arrive ici.
          </p>
        ) : (
          <div className="mt-5 grid gap-4">
            {days.map((day) => (
              <article className="border-2 border-[#773331] bg-[#F1EDE9]" key={day.day}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#773331] bg-[#EBA0CD]/35 p-4">
                  <h2 className={`${TITRE_LIGNE} first-letter:uppercase`}>{formatDate(day.day)}</h2>
                  <p className="flex flex-wrap gap-2 font-mono text-xs font-black uppercase">
                    <span className="bg-[#773331] px-2 py-1 text-[#F1EDE9]">{formatEuro(day.revenue)}</span>
                    <span className="border-2 border-[#773331] px-2 py-0.5">
                      {day.clients.size} client{day.clients.size > 1 ? "s" : ""}
                    </span>
                    <span className="border-2 border-[#773331] px-2 py-0.5">
                      {day.scans} scan{day.scans > 1 ? "s" : ""}
                    </span>
                    <span className="bg-[#FFB200] px-2 py-1">{day.points} pts</span>
                  </p>
                </div>

                <ul className="grid gap-0 px-4">
                  {day.orders.map((order) => (
                    <li className="grid grid-cols-[4rem_1fr_auto] items-center gap-3 border-b border-[#773331]/30 py-3 last:border-b-0 sm:grid-cols-[5rem_1fr_auto_auto]" key={order.id}>
                      <span className="font-mono text-xs font-black">{formatTime(order.created_at)}</span>
                      <span className="font-bold">{order.label}</span>
                      <span className="font-mono text-sm font-black">{formatEuro(Number(order.amount_eur))}</span>
                      <span className="hidden font-mono text-xs font-black sm:inline">+{order.points_awarded} pts</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
