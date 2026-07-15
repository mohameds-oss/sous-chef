import type { Metadata } from "next";
import Link from "next/link";
import { getRecipeById } from "@/data/recipes";
import { getSavedRecipesWithFolders } from "@/lib/saved-recipes";
import { requireUser } from "@/lib/auth";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { FolderSelect } from "@/components/recipes/folder-select";

export const metadata: Metadata = { title: "Saved recipes — Sous-Chef" };

export default async function SavedPage() {
  const user = await requireUser("/saved");
  const savedRows = await getSavedRecipesWithFolders(user.id);

  const withRecipes = savedRows
    .map((row) => ({ ...row, recipe: getRecipeById(row.recipeId) }))
    .filter((row): row is typeof row & { recipe: NonNullable<typeof row.recipe> } =>
      Boolean(row.recipe)
    );

  const folders = Array.from(new Set(["All Recipes", ...withRecipes.map((r) => r.folder)]));

  const grouped = folders
    .map((folder) => ({
      folder,
      items: withRecipes.filter((row) => row.folder === folder),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
        Saved recipes
      </h1>
      <p className="text-foreground-muted mt-2">
        {withRecipes.length} recipe{withRecipes.length === 1 ? "" : "s"} saved
      </p>

      {withRecipes.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-border bg-surface p-10 text-center text-foreground-muted">
          You haven&rsquo;t saved any recipes yet.{" "}
          <Link href="/search" className="text-brand hover:text-brand-deep font-medium">
            Find something to cook
          </Link>
          .
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {grouped.map((group) => (
            <section key={group.folder}>
              <h2 className="font-display text-xl font-semibold mb-4">
                {group.folder}{" "}
                <span className="text-foreground-faint font-sans text-sm font-normal">
                  ({group.items.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {group.items.map(({ recipe, folder }) => (
                  <div key={recipe.id} className="space-y-2">
                    <RecipeCard recipe={recipe} isAuthenticated isSaved />
                    <FolderSelect recipeId={recipe.id} currentFolder={folder} existingFolders={folders} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
