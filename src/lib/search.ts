import { recipes } from "@/data/recipes";
import type { Cuisine, DietaryTag, Difficulty, Recipe } from "@/lib/recipe-types";
import { totalTimeMinutes } from "@/lib/recipe-types";
import { computeMatch } from "@/lib/ingredient-match";

export interface SearchParamsInput {
  ingredients?: string;
  q?: string;
  cuisine?: string;
  maxTime?: string;
  difficulty?: string;
  diet?: string;
}

export interface SearchResultItem {
  recipe: Recipe;
  matchPercent?: number;
  haveIngredients?: Recipe["ingredients"];
  missingIngredients?: Recipe["ingredients"];
}

export function runSearch(params: SearchParamsInput): SearchResultItem[] {
  const pantry = params.ingredients
    ? params.ingredients.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const nameQuery = params.q?.trim().toLowerCase() ?? "";
  const cuisine = (params.cuisine as Cuisine) || undefined;
  const maxTime = params.maxTime ? Number(params.maxTime) : undefined;
  const difficulty = (params.difficulty as Difficulty) || undefined;
  const dietTags = params.diet ? (params.diet.split(",").filter(Boolean) as DietaryTag[]) : [];

  let filtered = recipes.filter((recipe) => {
    if (cuisine && recipe.cuisine !== cuisine) return false;
    if (maxTime && totalTimeMinutes(recipe) > maxTime) return false;
    if (difficulty && recipe.difficulty !== difficulty) return false;
    if (dietTags.length > 0 && !dietTags.every((tag) => recipe.dietaryTags.includes(tag))) {
      return false;
    }
    if (nameQuery && !recipe.name.toLowerCase().includes(nameQuery)) return false;
    return true;
  });

  if (pantry.length > 0) {
    const results = filtered.map((recipe) => {
      const { matchPercent, haveIngredients, missingIngredients } = computeMatch(recipe, pantry);
      return { recipe, matchPercent, haveIngredients, missingIngredients };
    });
    results.sort((a, b) => {
      if (b.matchPercent !== a.matchPercent) return b.matchPercent - a.matchPercent;
      return totalTimeMinutes(a.recipe) - totalTimeMinutes(b.recipe);
    });
    return results;
  }

  if (nameQuery) {
    filtered = [...filtered].sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(nameQuery) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(nameQuery) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return a.name.localeCompare(b.name);
    });
  } else {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  return filtered.map((recipe) => ({ recipe }));
}
