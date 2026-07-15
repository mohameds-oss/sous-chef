"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { setMealPlanEntryAction } from "@/app/(main)/planner-actions";
import type { DayOfWeek, MealType } from "@/generated/prisma/enums";

interface RecipeOption {
  id: string;
  name: string;
  emoji: string;
}

export function RecipePicker({
  day,
  mealType,
  options,
}: {
  day: DayOfWeek;
  mealType: MealType;
  options: RecipeOption[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 30);
    return options.filter((o) => o.name.toLowerCase().includes(q)).slice(0, 30);
  }, [query, options]);

  function pick(recipeId: string) {
    startTransition(async () => {
      await setMealPlanEntryAction(day, mealType, recipeId);
      setOpen(false);
      setQuery("");
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-full min-h-[64px] w-full items-center justify-center rounded-xl border border-dashed border-border text-foreground-faint hover:text-brand hover:border-brand/40 transition-colors"
        aria-label="Add recipe"
      >
        <Plus className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded-3xl bg-surface border border-border shadow-lift p-5 animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold">Add a recipe</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-foreground-faint" />
              </button>
            </div>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes…"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
              {filtered.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={isPending}
                  onClick={() => pick(option.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-surface-muted transition-colors"
                >
                  <span className="text-lg">{option.emoji}</span>
                  {option.name}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-foreground-faint px-3 py-4 text-center">No matches</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
