import "server-only";
import { db } from "@/lib/db";

export async function getSavedRecipeIds(userId: string): Promise<Set<string>> {
  const rows = await db.savedRecipe.findMany({ where: { userId }, select: { recipeId: true } });
  return new Set(rows.map((r) => r.recipeId));
}
