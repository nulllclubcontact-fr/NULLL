export type LoyaltyTier = {
  id?: string;
  name: string;
  min_points: number;
  discount_percent: number;
  position?: number;
};

export type TierProgress = {
  currentTier: LoyaltyTier | null;
  nextTier: LoyaltyTier | null;
  pointsToNext: number;
  progressPercent: number;
};

export function getTierForPoints(points: number, tiers: LoyaltyTier[]): TierProgress {
  const sortedTiers = [...tiers].sort((a, b) => a.min_points - b.min_points);
  const currentTier = [...sortedTiers].reverse().find((tier) => tier.min_points <= points) ?? null;
  const nextTier = sortedTiers.find((tier) => tier.min_points > points) ?? null;
  const pointsToNext = nextTier ? Math.max(nextTier.min_points - points, 0) : 0;

  if (!nextTier) {
    return {
      currentTier,
      nextTier,
      pointsToNext,
      progressPercent: 100
    };
  }

  const currentMin = currentTier?.min_points ?? 0;
  const range = Math.max(nextTier.min_points - currentMin, 1);
  const progressPercent = Math.min(Math.max(((points - currentMin) / range) * 100, 0), 100);

  return {
    currentTier,
    nextTier,
    pointsToNext,
    progressPercent
  };
}
