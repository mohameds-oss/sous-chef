export type Difficulty = "Easy" | "Medium" | "Hard";

export type Cuisine =
  | "American"
  | "Italian"
  | "Mexican"
  | "Japanese"
  | "Korean"
  | "Thai"
  | "Vietnamese"
  | "Mediterranean"
  | "Middle Eastern"
  | "Persian"
  | "Indian"
  | "Caribbean";

export type DietaryTag =
  | "Vegetarian"
  | "Vegan"
  | "Gluten-Free"
  | "Dairy-Free"
  | "Pescatarian"
  | "Nut-Free"
  | "Low-Carb";

/** Categories used to group ingredients in the home-page picker and in
 * expandable "have / missing" lists. */
export type IngredientCategory =
  | "Produce"
  | "Proteins"
  | "Seafood"
  | "Dairy & Eggs"
  | "Grains & Pasta"
  | "Herbs & Spices"
  | "Condiments & Sauces"
  | "Pantry & Baking"
  | "Other";

/** Units are always authored in US customary form; metric display is
 * derived at render time via lib/units.ts so recipes only need one set of
 * numbers. */
export type Unit =
  | "cup"
  | "tbsp"
  | "tsp"
  | "oz"
  | "lb"
  | "clove"
  | "slice"
  | "piece"
  | "whole"
  | "can"
  | "pinch"
  | "to taste"
  | "g"
  | "ml"
  | "l"
  | "kg"
  | "°F";

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: number;
  unit: Unit;
  category: IngredientCategory;
  substitutions?: string[];
  optional?: boolean;
  /** Free-form note, e.g. "diced" or "room temperature" */
  note?: string;
}

export interface RecipeStep {
  id: string;
  instruction: string;
  tip?: string;
  /** If set, the guided cooking view offers a one-tap timer for this step */
  timerMinutes?: number;
}

export interface NutritionInfo {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  sodiumMg: number;
}

export interface RecipeImage {
  emoji: string;
}

export interface Recipe {
  id: string;
  name: string;
  cuisine: Cuisine;
  difficulty: Difficulty;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  dietaryTags: DietaryTag[];
  image: RecipeImage;
  description: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  /** Per-serving nutrition at the recipe's base `servings` count */
  nutrition: NutritionInfo;
  tags?: string[];
}

export function totalTimeMinutes(recipe: Recipe): number {
  return recipe.prepTimeMinutes + recipe.cookTimeMinutes;
}
