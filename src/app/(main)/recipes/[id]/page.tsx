import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Users, ChefHat } from "lucide-react";
import { getRecipeById } from "@/data/recipes";
import { RecipeArt } from "@/components/recipes/recipe-art";
import { SaveButton } from "@/components/recipes/save-button";
import { LinkButton } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getSavedRecipeIds } from "@/lib/saved-recipes";
import { totalTimeMinutes } from "@/lib/recipe-types";
import { formatIngredientAmount } from "@/lib/units";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const recipe = getRecipeById(id);
  return { title: recipe ? `${recipe.name} — Sous-Chef` : "Recipe not found — Sous-Chef" };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = getRecipeById(id);
  if (!recipe) notFound();

  const user = await getCurrentUser();
  const savedIds = user ? await getSavedRecipeIds(user.id) : new Set<string>();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <RecipeArt
          cuisine={recipe.cuisine}
          emoji={recipe.image.emoji}
          size="lg"
          className="h-56 md:h-full rounded-3xl w-full"
        />

        <div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {recipe.dietaryTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-accent-soft text-accent-deep text-xs font-medium px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            {recipe.name}
          </h1>
          <p className="text-foreground-muted mt-3">{recipe.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground-muted">
            <span>{recipe.cuisine}</span>
            <span className="inline-flex items-center gap-1.5">
              <ChefHat className="h-4 w-4" /> {recipe.difficulty}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {totalTimeMinutes(recipe)} min total ({recipe.prepTimeMinutes}m
              prep, {recipe.cookTimeMinutes}m cook)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {recipe.servings} servings
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <LinkButton href={`/recipes/${recipe.id}/cook`} size="lg">
              Start Cooking
            </LinkButton>
            <SaveButton
              recipeId={recipe.id}
              initiallySaved={savedIds.has(recipe.id)}
              isAuthenticated={Boolean(user)}
              variant="full"
            />
          </div>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10">
        <section>
          <h2 className="font-display text-xl font-semibold mb-4">
            Ingredients <span className="text-foreground-faint font-sans text-sm font-normal">({recipe.servings} servings)</span>
          </h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id} className="text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <span className={ingredient.optional ? "text-foreground-faint" : "text-foreground"}>
                    {ingredient.name}
                    {ingredient.optional && " (optional)"}
                    {ingredient.note && (
                      <span className="text-foreground-faint"> — {ingredient.note}</span>
                    )}
                  </span>
                  <span className="whitespace-nowrap text-foreground-muted font-medium">
                    {formatIngredientAmount(ingredient.amount, ingredient.unit)}
                  </span>
                </div>
                {ingredient.substitutions && ingredient.substitutions.length > 0 && (
                  <p className="text-xs text-foreground-faint mt-0.5">
                    Substitute: {ingredient.substitutions.join(" or ")}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
            <h3 className="font-medium mb-3">Nutrition (per serving)</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <NutritionRow label="Calories" value={`${recipe.nutrition.calories}`} />
              <NutritionRow label="Protein" value={`${recipe.nutrition.proteinG}g`} />
              <NutritionRow label="Carbs" value={`${recipe.nutrition.carbsG}g`} />
              <NutritionRow label="Fat" value={`${recipe.nutrition.fatG}g`} />
              <NutritionRow label="Fiber" value={`${recipe.nutrition.fiberG}g`} />
              <NutritionRow label="Sugar" value={`${recipe.nutrition.sugarG}g`} />
              <NutritionRow label="Sodium" value={`${recipe.nutrition.sodiumMg}mg`} />
            </dl>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold mb-4">Preparation</h2>
          <ol className="space-y-6">
            {recipe.steps.map((step, index) => (
              <li key={step.id} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-deep font-display font-semibold text-sm">
                  {index + 1}
                </span>
                <div>
                  <p className="text-foreground">{step.instruction}</p>
                  {step.tip && (
                    <p className="text-sm text-accent-deep bg-accent-soft rounded-xl px-3 py-2 mt-2">
                      💡 {step.tip}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

function NutritionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-1.5">
      <dt className="text-foreground-faint">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
