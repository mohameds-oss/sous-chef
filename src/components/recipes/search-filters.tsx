"use client";

import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { Cuisine, DietaryTag, Difficulty } from "@/lib/recipe-types";

const TIME_OPTIONS = [
  { label: "Any time", value: "" },
  { label: "Under 15 min", value: "15" },
  { label: "Under 30 min", value: "30" },
  { label: "Under 45 min", value: "45" },
  { label: "Under 60 min", value: "60" },
];

const DIFFICULTY_OPTIONS: Difficulty[] = ["Easy", "Medium", "Hard"];

const DIET_OPTIONS: DietaryTag[] = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Pescatarian",
  "Nut-Free",
  "Low-Carb",
];

export function SearchFilters({ cuisines }: { cuisines: Cuisine[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/search?${params.toString()}`);
  }

  function toggleDiet(tag: string) {
    const current = new Set((searchParams.get("diet") ?? "").split(",").filter(Boolean));
    if (current.has(tag)) current.delete(tag);
    else current.add(tag);
    updateParam("diet", current.size ? Array.from(current).join(",") : null);
  }

  const activeCuisine = searchParams.get("cuisine") ?? "";
  const activeTime = searchParams.get("maxTime") ?? "";
  const activeDifficulty = searchParams.get("difficulty") ?? "";
  const activeDiet = new Set((searchParams.get("diet") ?? "").split(",").filter(Boolean));

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-medium text-foreground-faint uppercase tracking-wide">
          Cuisine
        </label>
        <select
          value={activeCuisine}
          onChange={(e) => updateParam("cuisine", e.target.value || null)}
          className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          <option value="">All cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-foreground-faint uppercase tracking-wide">
          Total time
        </label>
        <select
          value={activeTime}
          onChange={(e) => updateParam("maxTime", e.target.value || null)}
          className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-foreground-faint uppercase tracking-wide">
          Difficulty
        </label>
        <div className="mt-1.5 flex gap-2">
          {DIFFICULTY_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => updateParam("difficulty", activeDifficulty === d ? null : d)}
              className={clsx(
                "flex-1 rounded-xl border px-3 py-2 text-sm transition-colors",
                activeDifficulty === d
                  ? "bg-accent text-white border-accent"
                  : "border-border bg-surface text-foreground-muted hover:text-foreground"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-foreground-faint uppercase tracking-wide">
          Dietary
        </label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {DIET_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleDiet(tag)}
              className={clsx(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                activeDiet.has(tag)
                  ? "bg-accent text-white border-accent"
                  : "border-border bg-surface text-foreground-muted hover:text-foreground"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {(activeCuisine || activeTime || activeDifficulty || activeDiet.size > 0) && (
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("cuisine");
            params.delete("maxTime");
            params.delete("difficulty");
            params.delete("diet");
            router.push(`/search?${params.toString()}`);
          }}
          className="text-sm text-brand hover:text-brand-deep font-medium"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
