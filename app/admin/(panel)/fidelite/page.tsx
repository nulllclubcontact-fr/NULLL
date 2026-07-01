import {
  createLoyaltyTier,
  deleteLoyaltyTier,
  updateLoyaltyTier,
  updatePointsPerEuro
} from "../../actions";
import { getAdminPointsPerEuro, listAdminLoyaltyTiers, type AdminLoyaltyTier } from "../../../../lib/admin/repo";

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export default async function AdminLoyaltyPage() {
  const [pointsPerEuro, tiers] = await Promise.all([getAdminPointsPerEuro(), listAdminLoyaltyTiers()]);
  const nextPosition = Math.max(...tiers.map((tier) => tier.position), 0) + 1;

  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <div>
        <p className="font-mono text-sm uppercase  text-[#d96ab4]">Admin fidelite</p>
        <h1 className="mt-4 font-display text-[clamp(4rem,14vw,10rem)] uppercase">Points. Paliers. Cash.</h1>
        <p className="mt-5 max-w-xl text-[#351815]/72">Le ratio nourrit les achats. Les paliers pilotent les reductions.</p>
      </div>

      <form action={updatePointsPerEuro} className="panel panel-grid grid gap-4 p-5 md:grid-cols-[1fr_auto]">
        <label className="grid gap-2 font-mono text-xs uppercase ">
          Points par euro
          <input
            className="field"
            defaultValue={formatNumber(pointsPerEuro)}
            min="0.01"
            max="100"
            name="points_per_euro"
            required
            step="0.01"
            type="number"
          />
        </label>
        <button className="primary-button self-end" type="submit">
          Sauver ratio
        </button>
      </form>

      <form action={createLoyaltyTier} className="panel grid gap-4 p-5 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.7fr_auto]">
        <label className="grid gap-2 font-mono text-xs uppercase ">
          Nom
          <input className="field" maxLength={80} name="name" required />
        </label>
        <label className="grid gap-2 font-mono text-xs uppercase ">
          Min points
          <input className="field" min="0" name="min_points" required step="1" type="number" />
        </label>
        <label className="grid gap-2 font-mono text-xs uppercase ">
          Reduction %
          <input className="field" min="0" max="100" name="discount_percent" required step="0.01" type="number" />
        </label>
        <label className="grid gap-2 font-mono text-xs uppercase ">
          Position
          <input className="field" defaultValue={nextPosition} min="0" name="position" required step="1" type="number" />
        </label>
        <button className="primary-button self-end" type="submit">
          Creer
        </button>
      </form>

      {tiers.length === 0 ? (
        <div className="panel p-5 md:p-8">
          <p className="font-display text-[clamp(2.8rem,7vw,5rem)] uppercase leading-none">Aucun palier.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {tiers.map((tier) => (
            <TierBlock key={tier.id} tier={tier} />
          ))}
        </div>
      )}
    </section>
  );
}

function TierBlock({ tier }: { tier: AdminLoyaltyTier }) {
  return (
    <article className="panel p-5">
      <form action={updateLoyaltyTier} className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.7fr_auto]">
        <input name="tier_id" type="hidden" value={tier.id} />
        <label className="grid gap-2 font-mono text-xs uppercase ">
          Nom
          <input className="field" defaultValue={tier.name} maxLength={80} name="name" required />
        </label>
        <label className="grid gap-2 font-mono text-xs uppercase ">
          Min points
          <input className="field" defaultValue={tier.min_points} min="0" name="min_points" required step="1" type="number" />
        </label>
        <label className="grid gap-2 font-mono text-xs uppercase ">
          Reduction %
          <input
            className="field"
            defaultValue={formatNumber(Number(tier.discount_percent))}
            min="0"
            max="100"
            name="discount_percent"
            required
            step="0.01"
            type="number"
          />
        </label>
        <label className="grid gap-2 font-mono text-xs uppercase ">
          Position
          <input className="field" defaultValue={tier.position} min="0" name="position" required step="1" type="number" />
        </label>
        <button className="primary-button self-end" type="submit">
          Sauver
        </button>
      </form>

      <form action={deleteLoyaltyTier} className="mt-4">
        <input name="tier_id" type="hidden" value={tier.id} />
        <button className="secondary-link" type="submit">
          Supprimer
        </button>
      </form>
    </article>
  );
}
