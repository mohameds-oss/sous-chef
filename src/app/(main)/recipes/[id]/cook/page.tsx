import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRecipeById } from "@/data/recipes";
import { CookingSession } from "@/components/cooking/cooking-session";
import { getCurrentUser } from "@/lib/auth";
import { getSavedRecipeIds } from "@/lib/saved-recipes";
import { db } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const recipe = getRecipeById(id);
  return { title: recipe ? `Cooking ${recipe.name} — Sous-Chef` : "Recipe not found — Sous-Chef" };
}

export default async function CookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = getRecipeById(id);
  if (!recipe) notFound();

  const user = await getCurrentUser();
  const savedIds = user ? await getSavedRecipeIds(user.id) : new Set<string>();

  const progress = user
    ? await db.cookingProgress.findUnique({
        where: { userId_recipeId: { userId: user.id, recipeId: recipe.id } },
      })
    : null;

  return (
    <CookingSession
      recipe={recipe}
      isAuthenticated={Boolean(user)}
      isSaved={savedIds.has(recipe.id)}
      initialProgress={progress}
    />
  );
}
