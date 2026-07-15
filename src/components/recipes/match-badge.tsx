import { MATCH_TIER_COLOR_VAR, MATCH_TIER_LABEL, matchTier } from "@/lib/ingredient-match";

export function MatchBadge({ percent }: { percent: number }) {
  const tier = matchTier(percent);
  const color = MATCH_TIER_COLOR_VAR[tier];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-surface/95 backdrop-blur px-3 py-1 text-xs font-semibold shadow-soft"
      style={{ color }}
      title={MATCH_TIER_LABEL[tier]}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {percent}% match
    </span>
  );
}
