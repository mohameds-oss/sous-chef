import type { Recipe } from "@/lib/recipe-types";
import { INGREDIENT_CATEGORY_ORDER } from "@/lib/ingredient-catalog";
import type { IngredientCategory } from "@/lib/recipe-types";

export interface ShoppingListItem {
  name: string;
  category: IngredientCategory;
  recipeNames: string[];
}

export function buildShoppingList(recipes: Recipe[]): Record<IngredientCategory, ShoppingListItem[]> {
  const byName = new Map<string, ShoppingListItem>();

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const key = ingredient.name.toLowerCase();
      const existing = byName.get(key);
      if (existing) {
        if (!existing.recipeNames.includes(recipe.name)) existing.recipeNames.push(recipe.name);
      } else {
        byName.set(key, {
          name: ingredient.name,
          category: ingredient.category,
          recipeNames: [recipe.name],
        });
      }
    }
  }

  const grouped = Object.fromEntries(
    INGREDIENT_CATEGORY_ORDER.map((c) => [c, [] as ShoppingListItem[]])
  ) as Record<IngredientCategory, ShoppingListItem[]>;

  for (const item of byName.values()) {
    grouped[item.category].push(item);
  }
  for (const category of INGREDIENT_CATEGORY_ORDER) {
    grouped[category].sort((a, b) => a.name.localeCompare(b.name));
  }

  return grouped;
}

export function totalUniqueIngredients(recipes: Recipe[]): number {
  const names = new Set<string>();
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      names.add(ingredient.name.toLowerCase());
    }
  }
  return names.size;
}
