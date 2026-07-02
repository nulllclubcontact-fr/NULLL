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
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/membre/login");
  }

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
      <p className="inline-flex w-fit border-2 border-[#351815] bg-[#ffb000] px-3 py-2 font-mono text-xs font-black uppercase">Dashboard membre</p>

      <ResetReminder currentMonthPoints={currentMonthPoints} />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel panel-grid p-5 md:p-8">
          <p className="font-mono text-sm font-black uppercase text-[#351815]/60">
            {profile?.first_name ? `${profile.first_name}, ce mois-ci` : "Ce mois-ci"}
          </p>
          <h1 className="mt-4 font-display text-[clamp(6rem,22vw,18rem)] uppercase leading-none">
            {currentMonthPoints}
          </h1>
          <p className="mt-2 font-mono text-lg font-black uppercase text-[#d96ab4]">points</p>
        </div>

        <div className="grid gap-6">
          <div className="panel p-5">
            <p className="font-mono text-sm font-black uppercase text-[#351815]/60">Palier actuel</p>
            <div className="mt-4 inline-flex border-2 border-[#351815] bg-[#d96ab4] px-4 py-2 font-mono text-sm font-black uppercase text-[#351815]">
              {tierProgress.currentTier?.name ?? "Base"} - {formatDiscount(currentDiscount)}%
            </div>
            <p className="mt-5 font-bold text-[#351815]/72">
              {tierProgress.nextTier
                ? `Encore ${tierProgress.pointsToNext} points pour ${formatDiscount(tierProgress.nextTier.discount_percent)} %.`
                : "Palier max. Tu peux toujours faire tourner."}
            </p>
            <div className="mt-5 h-5 border-2 border-[#351815] bg-[#fff8ef]" aria-label="Progression vers le palier suivant">
              <div className="h-full bg-[#ffb000]" style={{ width: `${tierProgress.progressPercent}%` }} />
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
