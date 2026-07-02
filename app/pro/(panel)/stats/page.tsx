import { redirect } from "next/navigation";
import { getProSession } from "../../../../lib/pro/guard";
import { createSupabaseServiceClient } from "../../../../lib/supabase/service";

type StatsPageProps = {
  searchParams?: Promise<{
    from?: string;
    to?: string;
  }>;
};

type TransactionRow = {
  id: string;
  member_id: string;
  label: string;
  amount_eur: number;
  points_awarded: number;
  created_at: string;
};

type DayStats = {
  day: string;
  revenue: number;
  clients: Set<string>;
  scans: number;
  points: number;
  orders: TransactionRow[];
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

function formatTime(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

export default async function ProStatsPage({ searchParams }: StatsPageProps) {
  const session = await getProSession();

  if (!session) {
    redirect("/pro/login");
  }

  const params = await searchParams;
  const from = params?.from || getDefaultFrom();
  const to = params?.to || toIsoDate(new Date());
  const fromDate = new Date(`${from}T00:00:00.000Z`);
  const toDate = new Date(`${to}T23:59:59.999Z`);

  const supabase = createSupabaseServiceClient();
  const { data: transactions } = await supabase
    .from("transactions")
    .select("id,member_id,label,amount_eur,points_awarded,created_at")
    .eq("partner_id", session.partnerId)
    .gte("created_at", fromDate.toISOString())
    .lte("created_at", toDate.toISOString())
    .order("created_at", { ascending: false })
    .returns<TransactionRow[]>();

  const dayMap = new Map<string, DayStats>();

  for (const transaction of transactions ?? []) {
    const day = getParisDay(transaction.created_at);
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

    existing.revenue += Number(transaction.amount_eur);
    existing.clients.add(transaction.member_id);
    existing.scans += 1;
    existing.points += transaction.points_awarded;
    existing.orders.push(transaction);
    dayMap.set(day, existing);
  }

  const days = [...dayMap.values()].sort((a, b) => b.day.localeCompare(a.day));
  const totalRevenue = days.reduce((sum, day) => sum + day.revenue, 0);
  const totalScans = days.reduce((sum, day) => sum + day.scans, 0);
  const totalPoints = days.reduce((sum, day) => sum + day.points, 0);
  const totalClients = new Set((transactions ?? []).map((transaction) => transaction.member_id)).size;
  const maxRevenue = Math.max(...days.map((day) => day.revenue), 1);

  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <div>
        <p className="inline-flex border-2 border-[#351815] bg-[#ffb000] px-3 py-2 font-mono text-xs font-black uppercase">Stats pro</p>
        <h1 className="mt-6 font-display text-[clamp(3.6rem,10vw,8rem)] uppercase leading-[0.94]">Ton vrai CA.</h1>
        <p className="mt-5 max-w-xl font-bold leading-tight text-[#351815]/72">Addition des commandes scannées. Filtré sur ton partenaire. Rien d’autre.</p>
      </div>

      <form className="panel grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto]" action="/pro/stats">
        <label className="grid gap-2 font-mono text-xs font-black uppercase">
          Du
          <input className="field" defaultValue={from} name="from" type="date" />
        </label>
        <label className="grid gap-2 font-mono text-xs font-black uppercase">
          Au
          <input className="field" defaultValue={to} name="to" type="date" />
        </label>
        <button className="primary-button self-end" type="submit">
          Filtrer
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-4">
        <StatBlock label="CA total" value={formatEuro(totalRevenue)} />
        <StatBlock label="Clients" value={String(totalClients)} />
        <StatBlock label="Scans" value={String(totalScans)} />
        <StatBlock label="Points" value={String(totalPoints)} />
      </div>

      {days.length === 0 ? (
        <div className="panel panel-grid p-5 md:p-8">
          <p className="font-display text-[clamp(2.6rem,6vw,4.6rem)] uppercase leading-[0.96]">Pas encore de scan.</p>
          <p className="mt-4 font-bold text-[#351815]/72">Quand une commande passe par QR, elle finit ici.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {days.map((day) => (
            <article className="panel p-5" key={day.day}>
              <div className="grid gap-4 border-b-2 border-[#351815] pb-5 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <h2 className="font-display text-[clamp(2.4rem,6vw,5rem)] uppercase leading-[0.96]">{formatDate(day.day)}</h2>
                  <div className="mt-4 h-4 border-2 border-[#351815] bg-[#fff8ef]">
                    <div className="h-full bg-[#ffb000]" style={{ width: `${(day.revenue / maxRevenue) * 100}%` }} />
                  </div>
                </div>
                <div className="font-mono text-sm font-black uppercase md:text-right">
                  <p className="text-[#d96ab4]">{formatEuro(day.revenue)}</p>
                  <p>{day.clients.size} client(s)</p>
                  <p>{day.scans} scan(s)</p>
                  <p>{day.points} points</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {day.orders.map((order) => (
                  <div className="grid gap-2 border-b border-[#351815]/20 pb-3 last:border-b-0 md:grid-cols-[80px_1fr_auto_auto]" key={order.id}>
                    <p className="font-mono text-xs font-black uppercase text-[#351815]/50">{formatTime(order.created_at)}</p>
                    <p>{order.label}</p>
                    <p className="font-mono text-sm font-black uppercase">{formatEuro(Number(order.amount_eur))}</p>
                    <p className="font-mono text-sm font-black uppercase text-[#d96ab4]">+{order.points_awarded} pts</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-5">
      <p className="font-mono text-xs font-black uppercase text-[#351815]/50">{label}</p>
      <p className="mt-3 font-display text-[clamp(2.3rem,6vw,4.8rem)] uppercase leading-none">{value}</p>
    </div>
  );
}
