import "server-only";
import { db } from "@/lib/db";

export async function getSavedRecipeIds(userId: string): Promise<Set<string>> {
  const rows = await db.savedRecipe.findMany({ where: { userId }, select: { recipeId: true } });
  return new Set(rows.map((r) => r.recipeId));
}

export interface SavedRecipeRow {
  recipeId: string;
  folder: string;
}

export async function getSavedRecipesWithFolders(userId: string): Promise<SavedRecipeRow[]> {
  return db.savedRecipe.findMany({
    where: { userId },
    select: { recipeId: true, folder: true },
    orderBy: { createdAt: "desc" },
  });
}
