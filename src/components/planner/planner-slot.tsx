"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { removeMealPlanEntryAction } from "@/app/(main)/planner-actions";
import { RecipePicker } from "@/components/planner/recipe-picker";
import type { DayOfWeek, MealType } from "@/generated/prisma/enums";
import type { Recipe } from "@/lib/recipe-types";

export function PlannerSlot({
  day,
  mealType,
  recipe,
  pickerOptions,
}: {
  day: DayOfWeek;
  mealType: MealType;
  recipe: Recipe | null;
  pickerOptions: { id: string; name: string; emoji: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!recipe) {
    return <RecipePicker day={day} mealType={mealType} options={pickerOptions} />;
  }

  return (
    <div className="relative flex h-full min-h-[64px] items-center gap-2 rounded-xl border border-border bg-surface-muted px-3 py-2">
      <Link href={`/recipes/${recipe.id}`} className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-lg shrink-0">{recipe.image.emoji}</span>
        <span className="text-sm font-medium truncate">{recipe.name}</span>
      </Link>
      <button
        type="button"
        aria-label="Remove"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await removeMealPlanEntryAction(day, mealType);
            router.refresh();
          })
        }
        className="shrink-0 text-foreground-faint hover:text-red-500"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
