"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function saveCookingProgressAction(input: {
  recipeId: string;
  currentStep: number;
  servingsMul: number;
  unitSystem: "us" | "metric";
  completed?: boolean;
}): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  await db.cookingProgress.upsert({
    where: { userId_recipeId: { userId: user.id, recipeId: input.recipeId } },
    create: {
      userId: user.id,
      recipeId: input.recipeId,
      currentStep: input.currentStep,
      servingsMul: input.servingsMul,
      unitSystem: input.unitSystem,
      completedAt: input.completed ? new Date() : null,
    },
    update: {
      currentStep: input.currentStep,
      servingsMul: input.servingsMul,
      unitSystem: input.unitSystem,
      completedAt: input.completed ? new Date() : null,
    },
  });
}
