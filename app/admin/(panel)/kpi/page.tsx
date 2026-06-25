import { createSupabaseServiceClient } from "../../../../lib/supabase/service";

type KpiPageProps = {
  searchParams?: Promise<{
    from?: string;
    to?: string;
  }>;
};

type TransactionRow = {
  id: string;
  member_id: string;
  partner_id: string;
  amount_eur: number;
  points_awarded: number;
  created_at: string;
  partners: { name: string | null } | null;
};

type ProfileRow = {
  id: string;
  created_at: string;
};

type PartnerStats = {
  id: string;
  name: string;
  revenue: number;
  clients: Set<string>;
  scans: number;
  points: number;
};

type DayStats = {
  day: string;
  revenue: number;
  clients: Set<string>;
  scans: number;
  points: number;
};

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDefaultFrom() {
  const date = new Date();
  date.setDate(date.getDate() - 29);
  return toIsoDate(date);
}

function getParisDay(value: string) {
  return new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00Z`));
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

export default async function AdminKpiPage({ searchParams }: KpiPageProps) {
  const params = await searchParams;
  const from = params?.from || getDefaultFrom();
  const to = params?.to || toIsoDate(new Date());
  const fromDate = new Date(`${from}T00:00:00.000Z`);
  const toDate = new Date(`${to}T23:59:59.999Z`);

  const supabase = createSupabaseServiceClient();
  const [{ data: transactions }, { data: profiles }] = await Promise.all([
    supabase
      .from("transactions")
      .select("id,member_id,partner_id,amount_eur,points_awarded,created_at,partners(name)")
      .gte("created_at", fromDate.toISOString())
      .lte("created_at", toDate.toISOString())
      .order("created_at", { ascending: false })
      .returns<TransactionRow[]>(),
    supabase
      .from("profiles")
      .select("id,created_at")
      .lte("created_at", toDate.toISOString())
      .returns<ProfileRow[]>()
  ]);

  const rows = transactions ?? [];
  const members = profiles ?? [];
  const dayMap = new Map<string, DayStats>();
  const partnerMap = new Map<string, PartnerStats>();

  for (const transaction of rows) {
    const amount = Number(transaction.amount_eur);
    const day = getParisDay(transaction.created_at);
    const dayStats =
      dayMap.get(day) ??
      ({
        day,
        revenue: 0,
        clients: new Set<string>(),
        scans: 0,
        points: 0
      } satisfies DayStats);

    dayStats.revenue += amount;
    dayStats.clients.add(transaction.member_id);
    dayStats.scans += 1;
    dayStats.points += transaction.points_awarded;
    dayMap.set(day, dayStats);

    const partnerStats =
      partnerMap.get(transaction.partner_id) ??
      ({
        id: transaction.partner_id,
        name: transaction.partners?.name ?? "Partenaire NULLL",
        revenue: 0,
        clients: new Set<string>(),
        scans: 0,
        points: 0
      } satisfies PartnerStats);

    partnerStats.revenue += amount;
    partnerStats.clients.add(transaction.member_id);
    partnerStats.scans += 1;
    partnerStats.points += transaction.points_awarded;
    partnerMap.set(transaction.partner_id, partnerStats);
  }

  const days = [...dayMap.values()].sort((a, b) => b.day.localeCompare(a.day));
  const partners = [...partnerMap.values()].sort((a, b) => b.revenue - a.revenue);
  const totalRevenue = rows.reduce((sum, transaction) => sum + Number(transaction.amount_eur), 0);
  const totalScans = rows.length;
  const totalPoints = rows.reduce((sum, transaction) => sum + transaction.points_awarded, 0);
  const activeMembers = new Set(rows.map((transaction) => transaction.member_id)).size;
  const newMembers = members.filter((member) => {
    const createdAt = new Date(member.created_at);
    return createdAt >= fromDate && createdAt <= toDate;
  }).length;
  const averageBasket = totalScans > 0 ? totalRevenue / totalScans : 0;
  const maxRevenue = Math.max(...days.map((day) => day.revenue), 1);

  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.28em] text-shock">Admin KPI</p>
        <h1 className="brutal-title mt-4 font-display text-[clamp(4rem,14vw,10rem)] uppercase">Vue totale.</h1>
        <p className="mt-5 max-w-xl text-white/72">Tous les partenaires. Tous les scans. Une periode.</p>
      </div>

      <form className="panel grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto]" action="/admin/kpi">
        <label className="grid gap-2 font-mono text-xs uppercase tracking-[0.16em]">
          Du
          <input className="field" defaultValue={from} name="from" type="date" />
        </label>
        <label className="grid gap-2 font-mono text-xs uppercase tracking-[0.16em]">
          Au
          <input className="field" defaultValue={to} name="to" type="date" />
        </label>
        <button className="primary-button self-end" type="submit">
          Filtrer
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatBlock label="CA total" value={formatEuro(totalRevenue)} />
        <StatBlock label="Panier moyen" value={formatEuro(averageBasket)} />
        <StatBlock label="Membres actifs" value={String(activeMembers)} />
        <StatBlock label="Nouveaux membres" value={String(newMembers)} />
        <StatBlock label="Scans" value={String(totalScans)} />
        <StatBlock label="Points" value={String(totalPoints)} />
      </div>

      {days.length === 0 ? (
        <div className="panel panel-grid p-5 md:p-8">
          <p className="font-display text-[clamp(2.8rem,7vw,5rem)] uppercase leading-none">Rien sur cette periode.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          <section className="panel p-5">
            <h2 className="font-display text-[clamp(2.8rem,7vw,6rem)] uppercase leading-none">Par jour.</h2>
            <div className="mt-5 grid gap-4">
              {days.map((day) => (
                <div className="grid gap-3 border-b border-white/20 pb-4 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center" key={day.day}>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/55">{formatDate(day.day)}</p>
                    <div className="mt-3 h-4 border-2 border-white bg-black">
                      <div className="h-full bg-shock" style={{ width: `${(day.revenue / maxRevenue) * 100}%` }} />
                    </div>
                  </div>
                  <div className="font-mono text-sm font-black uppercase md:text-right">
                    <p className="text-shock">{formatEuro(day.revenue)}</p>
                    <p>{day.clients.size} client(s)</p>
                    <p>{day.scans} scan(s)</p>
                    <p>{day.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-5">
            <h2 className="font-display text-[clamp(2.8rem,7vw,6rem)] uppercase leading-none">Par partenaire.</h2>
            <div className="mt-5 grid gap-3">
              {partners.map((partner) => (
                <div className="grid gap-2 border-b border-white/20 pb-3 last:border-b-0 md:grid-cols-[1fr_auto_auto_auto]" key={partner.id}>
                  <p className="font-mono text-sm font-black uppercase">{partner.name}</p>
                  <p className="font-mono text-sm font-black uppercase text-shock">{formatEuro(partner.revenue)}</p>
                  <p className="font-mono text-sm uppercase text-white/60">{partner.clients.size} client(s)</p>
                  <p className="font-mono text-sm uppercase text-white/60">{partner.scans} scan(s)</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-5">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/50">{label}</p>
      <p className="mt-3 font-display text-[clamp(2.1rem,5vw,4rem)] uppercase leading-none">{value}</p>
    </div>
  );
}
