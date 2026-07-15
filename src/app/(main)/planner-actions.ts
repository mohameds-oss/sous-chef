"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { DayOfWeek, MealType } from "@/generated/prisma/enums";

export async function setMealPlanEntryAction(
  day: DayOfWeek,
  mealType: MealType,
  recipeId: string
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  await db.mealPlanEntry.upsert({
    where: { userId_day_mealType: { userId: user.id, day, mealType } },
    create: { userId: user.id, day, mealType, recipeId },
    update: { recipeId },
  });
  revalidatePath("/planner");
}

export async function removeMealPlanEntryAction(day: DayOfWeek, mealType: MealType): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  await db.mealPlanEntry.deleteMany({ where: { userId: user.id, day, mealType } });
  revalidatePath("/planner");
}

export async function clearPlannerAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  await db.mealPlanEntry.deleteMany({ where: { userId: user.id } });
  revalidatePath("/planner");
}
