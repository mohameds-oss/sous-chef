"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function toggleSavedRecipeAction(
  recipeId: string
): Promise<{ saved: boolean } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "not-authenticated" };
  }

  const existing = await db.savedRecipe.findUnique({
    where: { userId_recipeId: { userId: user.id, recipeId } },
  });

  if (existing) {
    await db.savedRecipe.delete({ where: { id: existing.id } });
    revalidatePath("/saved");
    return { saved: false };
  }

  await db.savedRecipe.create({ data: { userId: user.id, recipeId } });
  revalidatePath("/saved");
  return { saved: true };
}

export async function updateSavedRecipeFolderAction(
  recipeId: string,
  folder: string
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  await db.savedRecipe.update({
    where: { userId_recipeId: { userId: user.id, recipeId } },
    data: { folder: folder.trim() || "All Recipes" },
  });
  revalidatePath("/saved");
}
