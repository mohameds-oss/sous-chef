import { Fragment } from "react";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipes, getRecipeById } from "@/data/recipes";
import { DAYS, MEAL_TYPES } from "@/lib/planner";
import { buildShoppingList, totalUniqueIngredients } from "@/lib/shopping-list";
import { INGREDIENT_CATEGORY_ORDER } from "@/lib/ingredient-catalog";
import { PlannerSlot } from "@/components/planner/planner-slot";
import { ShoppingList } from "@/components/planner/shopping-list";
import { ClearPlannerButton } from "@/components/planner/clear-planner-button";

export const metadata: Metadata = { title: "Meal planner — Sous-Chef" };

export default async function PlannerPage() {
  const user = await requireUser("/planner");
  const entries = await db.mealPlanEntry.findMany({ where: { userId: user.id } });

  const entryMap = new Map(entries.map((e) => [`${e.day}-${e.mealType}`, e.recipeId]));
  const pickerOptions = recipes.map((r) => ({ id: r.id, name: r.name, emoji: r.image.emoji }));

  const plannedRecipes = entries
    .map((e) => getRecipeById(e.recipeId))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const shoppingList = buildShoppingList(plannedRecipes);
  const totalIngredients = totalUniqueIngredients(plannedRecipes);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Weekly meal planner
          </h1>
          <p className="text-foreground-muted mt-2">Plan breakfast, lunch, and dinner for the week.</p>
        </div>
        <ClearPlannerButton />
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 gap-4 max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-2xl font-display font-semibold">{entries.length}</p>
          <p className="text-xs text-foreground-faint mt-0.5">Recipes planned</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-2xl font-display font-semibold">{totalIngredients}</p>
          <p className="text-xs text-foreground-faint mt-0.5">Ingredients required</p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <div className="grid grid-cols-[100px_repeat(7,minmax(140px,1fr))] gap-2 min-w-[900px]">
          <div />
          {DAYS.map((day) => (
            <div key={day.value} className="text-center text-sm font-medium text-foreground-muted pb-1">
              {day.label}
            </div>
          ))}

          {MEAL_TYPES.map((meal) => (
            <Fragment key={meal.value}>
              <div className="flex items-center text-sm font-medium text-foreground-faint">
                {meal.label}
              </div>
              {DAYS.map((day) => {
                const recipeId = entryMap.get(`${day.value}-${meal.value}`);
                const recipe = recipeId ? getRecipeById(recipeId) : null;
                return (
                  <div key={`${day.value}-${meal.value}`}>
                    <PlannerSlot
                      day={day.value}
                      mealType={meal.value}
                      recipe={recipe ?? null}
                      pickerOptions={pickerOptions}
                    />
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="font-display text-2xl font-semibold mb-1">Shopping list</h2>
        <p className="text-foreground-muted text-sm mb-6">
          Automatically generated from everything on your planner.
        </p>
        <ShoppingList list={shoppingList} categoryOrder={INGREDIENT_CATEGORY_ORDER} />
      </div>
    </div>
  );
}
