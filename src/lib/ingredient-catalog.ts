import { recipes } from "@/data/recipes";
import type { IngredientCategory } from "@/lib/recipe-types";

const CATEGORY_ORDER: IngredientCategory[] = [
  "Produce",
  "Proteins",
  "Seafood",
  "Dairy & Eggs",
  "Grains & Pasta",
  "Herbs & Spices",
  "Condiments & Sauces",
  "Pantry & Baking",
  "Other",
];

function titleCase(name: string): string {
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface CatalogEntry {
  name: string;
  label: string;
  category: IngredientCategory;
}

/** All distinct ingredient names actually used across the recipe database,
 * grouped by category — powers the home page's chip picker so every option
 * shown is guaranteed to be matchable against a real recipe. */
export function getIngredientCatalog(): Record<IngredientCategory, CatalogEntry[]> {
  const seen = new Map<string, CatalogEntry>();

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const key = ingredient.name.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, {
          name: ingredient.name,
          label: titleCase(ingredient.name),
          category: ingredient.category,
        });
      }
    }
  }

  const grouped = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, [] as CatalogEntry[]])) as Record<
    IngredientCategory,
    CatalogEntry[]
  >;

  for (const entry of seen.values()) {
    grouped[entry.category].push(entry);
  }

  for (const category of CATEGORY_ORDER) {
    grouped[category].sort((a, b) => a.label.localeCompare(b.label));
  }

  return grouped;
}

export const INGREDIENT_CATEGORY_ORDER = CATEGORY_ORDER;
