import type { Recipe, RecipeIngredient } from "./recipe-types";

export function normalizeIngredientName(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function singularize(word: string): string {
  if (word.endsWith("ies") && word.length > 4) return `${word.slice(0, -3)}y`;
  if (word.endsWith("oes") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("es") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) return word.slice(0, -1);
  return word;
}

function tokensMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const singularA = singularize(a);
  const singularB = singularize(b);
  if (singularA === singularB) return true;
  if (a.length > 3 && b.includes(a)) return true;
  if (b.length > 3 && a.includes(b)) return true;
  if (singularA.length > 3 && b.includes(singularA)) return true;
  if (singularB.length > 3 && a.includes(singularB)) return true;
  return false;
}

export function ingredientMatchesPantry(ingredientName: string, pantry: string[]): boolean {
  const normalizedIngredient = normalizeIngredientName(ingredientName);
  return pantry.some((item) => tokensMatch(normalizeIngredientName(item), normalizedIngredient));
}

export interface MatchResult {
  matchPercent: number;
  haveIngredients: RecipeIngredient[];
  missingIngredients: RecipeIngredient[];
}

export function computeMatch(recipe: Recipe, pantry: string[]): MatchResult {
  const normalizedPantry = pantry.map(normalizeIngredientName).filter(Boolean);
  const haveIngredients: RecipeIngredient[] = [];
  const missingIngredients: RecipeIngredient[] = [];

  for (const ingredient of recipe.ingredients) {
    if (normalizedPantry.length > 0 && ingredientMatchesPantry(ingredient.name, normalizedPantry)) {
      haveIngredients.push(ingredient);
    } else {
      missingIngredients.push(ingredient);
    }
  }

  const total = recipe.ingredients.length || 1;
  const matchPercent =
    normalizedPantry.length === 0 ? 0 : Math.round((haveIngredients.length / total) * 100);

  return { matchPercent, haveIngredients, missingIngredients };
}

export type MatchTier = "perfect" | "great" | "okay" | "low";

export function matchTier(percent: number): MatchTier {
  if (percent >= 100) return "perfect";
  if (percent >= 70) return "great";
  if (percent >= 30) return "okay";
  return "low";
}

export const MATCH_TIER_LABEL: Record<MatchTier, string> = {
  perfect: "Perfect match",
  great: "Great match",
  okay: "Okay match",
  low: "Low match",
};

export const MATCH_TIER_COLOR_VAR: Record<MatchTier, string> = {
  perfect: "var(--color-match-perfect)",
  great: "var(--color-match-great)",
  okay: "var(--color-match-okay)",
  low: "var(--color-match-low)",
};
