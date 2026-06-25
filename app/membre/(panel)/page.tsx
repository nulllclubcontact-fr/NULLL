import Link from "next/link";
import { redirect } from "next/navigation";
import { ResetReminder } from "../../../components/loyalty/ResetReminder";
import { getTierForPoints, type LoyaltyTier } from "../../../lib/loyalty/tiers";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

type Profile = {
  first_name: string | null;
  current_month_points: number | null;
};

function formatDiscount(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);
}

export default async function MemberDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/membre/login");
  }

  const [{ data: profile }, { data: tiers }] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name,current_month_points")
      .eq("id", user.id)
      .maybeSingle<Profile>(),
    supabase
      .from("loyalty_tiers")
      .select("id,name,min_points,discount_percent,position")
      .order("min_points", { ascending: true })
      .returns<LoyaltyTier[]>()
  ]);

  const currentMonthPoints = profile?.current_month_points ?? 0;
  const tierProgress = getTierForPoints(currentMonthPoints, tiers ?? []);
  const currentDiscount = tierProgress.currentTier?.discount_percent ?? 0;

  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <p className="font-mono text-sm uppercase tracking-[0.28em] text-shock">Dashboard membre</p>

      <ResetReminder currentMonthPoints={currentMonthPoints} />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel panel-grid p-5 md:p-8">
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-white/60">
            {profile?.first_name ? `${profile.first_name}, ce mois-ci` : "Ce mois-ci"}
          </p>
          <h1 className="brutal-title mt-4 font-display text-[clamp(6rem,22vw,18rem)] uppercase leading-none">
            {currentMonthPoints}
          </h1>
          <p className="mt-2 font-mono text-lg font-black uppercase text-shock">points</p>
        </div>

        <div className="grid gap-6">
          <div className="panel p-5">
            <p className="font-mono text-sm uppercase tracking-[0.16em] text-white/60">Palier actuel</p>
            <div className="mt-4 inline-flex border-2 border-shock bg-shock px-4 py-2 font-mono text-sm font-black uppercase text-black">
              {tierProgress.currentTier?.name ?? "Base"} - {formatDiscount(currentDiscount)}%
            </div>
            <p className="mt-5 text-white/72">
              {tierProgress.nextTier
                ? `Encore ${tierProgress.pointsToNext} points pour ${formatDiscount(tierProgress.nextTier.discount_percent)} %.`
                : "Palier max. Tu peux toujours faire tourner."}
            </p>
            <div className="mt-5 h-5 border-2 border-white bg-black" aria-label="Progression vers le palier suivant">
              <div className="h-full bg-shock" style={{ width: `${tierProgress.progressPercent}%` }} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link className="primary-link" href="/membre/qr">
              Mon QR
            </Link>
            <Link className="secondary-link" href="/membre/historique">
              Historique
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
