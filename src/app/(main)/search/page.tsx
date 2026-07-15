import type { Metadata } from "next";
import { recipes } from "@/data/recipes";
import { runSearch, type SearchParamsInput } from "@/lib/search";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { SearchFilters } from "@/components/recipes/search-filters";
import { getCurrentUser } from "@/lib/auth";
import { getSavedRecipeIds } from "@/lib/saved-recipes";
import type { Cuisine } from "@/lib/recipe-types";

export const metadata: Metadata = { title: "Find recipes — Sous-Chef" };

const CUISINES = Array.from(new Set(recipes.map((r) => r.cuisine))).sort() as Cuisine[];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const params = await searchParams;
  const results = runSearch(params);

  const user = await getCurrentUser();
  const savedIds = user ? await getSavedRecipeIds(user.id) : new Set<string>();

  const heading = params.ingredients
    ? "Recipes ranked by ingredient match"
    : params.q
      ? `Results for “${params.q}”`
      : "Browse all recipes";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">{heading}</h1>
      <p className="text-foreground-muted mt-2">
        {results.length} recipe{results.length === 1 ? "" : "s"} found
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="rounded-3xl border border-border bg-surface p-5 h-fit lg:sticky lg:top-24">
          <SearchFilters cuisines={CUISINES} />
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="rounded-3xl border border-border bg-surface p-10 text-center text-foreground-muted">
              No recipes match those filters yet — try loosening a filter or adding fewer
              ingredients.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map(({ recipe, matchPercent, haveIngredients, missingIngredients }) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isAuthenticated={Boolean(user)}
                  isSaved={savedIds.has(recipe.id)}
                  matchPercent={matchPercent}
                  haveIngredients={haveIngredients}
                  missingIngredients={missingIngredients}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
