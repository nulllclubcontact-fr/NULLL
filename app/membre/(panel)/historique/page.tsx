import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

type TransactionRow = {
  id: string;
  label: string;
  amount_eur: number;
  points_awarded: number;
  created_at: string;
  partners: { name: string | null } | null;
};

type ResetRow = {
  id: string;
  points: number;
  description: string | null;
  created_at: string;
};

type HistoryItem =
  | {
      id: string;
      kind: "transaction";
      createdAt: string;
      label: string;
      partnerName: string;
      amountEur: number;
      points: number;
    }
  | {
      id: string;
      kind: "reset";
      createdAt: string;
      points: number;
    };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "2-digit",
    month: "short",
    year: "numeric",
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

export default async function MemberHistoryPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/membre/login");
  }

  const [{ data: transactions }, { data: resets }] = await Promise.all([
    supabase
      .from("transactions")
      .select("id,label,amount_eur,points_awarded,created_at,partners(name)")
      .eq("member_id", user.id)
      .order("created_at", { ascending: false })
      .returns<TransactionRow[]>(),
    supabase
      .from("points_log")
      .select("id,points,description,created_at")
      .eq("user_id", user.id)
      .eq("type", "reset")
      .order("created_at", { ascending: false })
      .returns<ResetRow[]>()
  ]);

  const items: HistoryItem[] = [
    ...(transactions ?? []).map((transaction) => ({
      id: transaction.id,
      kind: "transaction" as const,
      createdAt: transaction.created_at,
      label: transaction.label,
      partnerName: transaction.partners?.name ?? "Partenaire NULLL",
      amountEur: Number(transaction.amount_eur),
      points: transaction.points_awarded
    })),
    ...(resets ?? []).map((reset) => ({
      id: reset.id,
      kind: "reset" as const,
      createdAt: reset.created_at,
      points: reset.points
    }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.28em] text-shock">Historique</p>
        <h1 className="brutal-title mt-4 font-display text-[clamp(4rem,14vw,10rem)] uppercase">Ce que tu as fait compter.</h1>
      </div>

      {items.length === 0 ? (
        <div className="panel panel-grid max-w-3xl p-5 md:p-8">
          <p className="font-display text-[clamp(2.8rem,7vw,5rem)] uppercase leading-none">Rien encore.</p>
          <p className="mt-4 text-white/72">Scanne chez un partenaire NULLL. Les points arriveront ici.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) =>
            item.kind === "transaction" ? (
              <article className="panel grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center" key={item.id}>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/50">{formatDate(item.createdAt)}</p>
                  <h2 className="mt-2 font-display text-[clamp(2.4rem,6vw,4.8rem)] uppercase leading-none">{item.label}</h2>
                  <p className="mt-3 text-white/72">{item.partnerName}</p>
                </div>
                <div className="grid gap-2 border-t-2 border-white pt-4 font-mono text-sm font-black uppercase md:border-l-2 md:border-t-0 md:pl-6 md:pt-0 md:text-right">
                  <p>{formatEuro(item.amountEur)}</p>
                  <p className="text-shock">+{item.points} points</p>
                </div>
              </article>
            ) : (
              <article className="border-2 border-shock bg-shock p-5 text-black" key={item.id}>
                <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-black/60">{formatDate(item.createdAt)}</p>
                <h2 className="mt-2 font-display text-[clamp(2.3rem,6vw,4.2rem)] uppercase leading-none">
                  Réinitialisation mensuelle - retour à 0
                </h2>
                <p className="mt-3 font-mono text-sm font-black uppercase">{item.points} points reset</p>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}
