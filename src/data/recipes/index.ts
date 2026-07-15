import type { Recipe } from "@/lib/recipe-types";
import { recipes as breakfastSandwiches } from "./breakfast-sandwiches";
import { recipes as pastaNoodlesRice } from "./pasta-noodles-rice";
import { recipes as soupsSalads } from "./soups-salads";
import { recipes as chicken } from "./chicken";
import { recipes as beefSeafoodTacos } from "./beef-seafood-tacos";
import { recipes as vegetarianSidesInternational } from "./vegetarian-sides-international";

export const recipes: Recipe[] = [
  ...breakfastSandwiches,
  ...pastaNoodlesRice,
  ...soupsSalads,
  ...chicken,
  ...beefSeafoodTacos,
  ...vegetarianSidesInternational,
];

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.id === id);
}
