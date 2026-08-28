import { recipes } from "@/data/recipes";
import type { Recipe, DietaryTag } from "@/lib/recipe-types";

interface Issue {
  recipeId: string;
  recipeName: string;
  category: string;
  detail: string;
}

const issues: Issue[] = [];

function flag(recipe: Recipe, category: string, detail: string) {
  issues.push({ recipeId: recipe.id, recipeName: recipe.name, category, detail });
}

// --- Keyword lists for dietary tag cross-checks ---
const MEAT_FISH_KEYWORDS = [
  "chicken", "beef", "pork", "lamb", "turkey", "duck", "bacon", "sausage", "ham",
  "guanciale", "pancetta", "prosciutto", "chorizo", "steak", "veal", "goat",
  "shrimp", "prawn", "salmon", "tuna", "tilapia", "cod", "fish", "anchov",
  "crab", "lobster", "scallop", "squid", "octopus", "clam", "mussel", "oyster",
  "gelatin",
];
const FISH_SEAFOOD_ONLY = [
  "shrimp", "prawn", "salmon", "tuna", "tilapia", "cod", "fish", "anchov",
  "crab", "lobster", "scallop", "squid", "octopus", "clam", "mussel", "oyster",
];
const DAIRY_KEYWORDS = [
  "milk", "cheese", "butter", "cream", "yogurt", "yoghurt", "ghee", "parmesan",
  "pecorino", "mozzarella", "feta", "ricotta", "mascarpone", "buttermilk",
  "custard", "half-and-half", "half and half",
];
const EGG_KEYWORDS = ["egg"];
const GLUTEN_KEYWORDS = [
  "flour", "bread", "wheat", "pasta", "spaghetti", "noodle", "tortilla",
  "pita", "bun", "breadcrumb", "panko", "soy sauce", "barley", "couscous",
  "orzo", "cracker", "pretzel", "cake flour", "all-purpose",
];
// Rice noodles / gluten-free tamari / corn tortillas are common false positives,
// so GLUTEN_KEYWORDS matches are only a soft signal - reported, not auto-failed
// for the trickiest cases (noodle, soy sauce).
const NUT_KEYWORDS = [
  "walnut", "almond", "cashew", "pecan", "pistachio", "hazelnut", "peanut",
  "macadamia", "pine nut",
];

function textIncludesAny(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  return keywords.filter((k) => lower.includes(k));
}

function allIngredientText(recipe: Recipe): string {
  return recipe.ingredients.map((i) => `${i.name} ${i.note ?? ""}`).join(" | ");
}

for (const recipe of recipes) {
  const ingredientText = allIngredientText(recipe);
  const tags = new Set<DietaryTag>(recipe.dietaryTags);

  // --- Timing ---
  const prep = recipe.prepTimeMinutes;
  const cook = recipe.cookTimeMinutes;
  if (prep < 0 || cook < 0) flag(recipe, "timing", `negative time: prep=${prep} cook=${cook}`);
  if (prep === 0 && cook === 0) flag(recipe, "timing", "both prep and cook time are 0");

  // --- Nutrition math sanity: 4/4/9 kcal per g protein/carb/fat ---
  const { calories, proteinG, carbsG, fatG } = recipe.nutrition;
  const computed = proteinG * 4 + carbsG * 4 + fatG * 9;
  const diff = Math.abs(computed - calories);
  const pctDiff = diff / Math.max(calories, 1);
  if (pctDiff > 0.25 && diff > 60) {
    flag(
      recipe,
      "nutrition",
      `calories (${calories}) vs macro math (${Math.round(computed)}) differ by ${Math.round(pctDiff * 100)}%`
    );
  }
  if (calories <= 0 || proteinG < 0 || carbsG < 0 || fatG < 0) {
    flag(recipe, "nutrition", "non-positive calorie or negative macro value");
  }

  // --- Ingredient sanity ---
  for (const ing of recipe.ingredients) {
    if (ing.amount <= 0 && ing.unit !== "to taste" && ing.unit !== "pinch") {
      flag(recipe, "ingredient", `"${ing.name}" has non-positive amount (${ing.amount} ${ing.unit})`);
    }
  }

  // --- Dietary tag cross-checks ---
  const meatFishHits = textIncludesAny(ingredientText, MEAT_FISH_KEYWORDS);
  const dairyHits = textIncludesAny(ingredientText, DAIRY_KEYWORDS);
  const eggHits = textIncludesAny(ingredientText, EGG_KEYWORDS);
  const nutHits = textIncludesAny(ingredientText, NUT_KEYWORDS);
  const glutenHits = textIncludesAny(ingredientText, GLUTEN_KEYWORDS);

  const nonOptionalHasKeyword = (keywords: string[]) =>
    recipe.ingredients.some(
      (i) => !i.optional && textIncludesAny(`${i.name} ${i.note ?? ""}`, keywords).length > 0
    );

  if (tags.has("Vegan")) {
    if (nonOptionalHasKeyword(MEAT_FISH_KEYWORDS)) flag(recipe, "diet-vegan", `tagged Vegan but contains meat/fish: ${meatFishHits.join(", ")}`);
    if (nonOptionalHasKeyword(DAIRY_KEYWORDS)) flag(recipe, "diet-vegan", `tagged Vegan but contains dairy: ${dairyHits.join(", ")}`);
    if (nonOptionalHasKeyword(EGG_KEYWORDS)) flag(recipe, "diet-vegan", `tagged Vegan but contains egg: ${eggHits.join(", ")}`);
    if (ingredientText.toLowerCase().includes("honey")) flag(recipe, "diet-vegan", "tagged Vegan but contains honey");
  }
  if (tags.has("Vegetarian")) {
    if (nonOptionalHasKeyword(MEAT_FISH_KEYWORDS)) flag(recipe, "diet-vegetarian", `tagged Vegetarian but contains meat/fish: ${meatFishHits.join(", ")}`);
  }
  if (tags.has("Pescatarian")) {
    const meatOnly = meatFishHits.filter((k) => !FISH_SEAFOOD_ONLY.includes(k));
    if (recipe.ingredients.some((i) => !i.optional && textIncludesAny(i.name, meatOnly).length > 0)) {
      flag(recipe, "diet-pescatarian", `tagged Pescatarian but contains land meat: ${meatOnly.join(", ")}`);
    }
  }
  if (tags.has("Dairy-Free")) {
    if (nonOptionalHasKeyword(DAIRY_KEYWORDS)) flag(recipe, "diet-dairy-free", `tagged Dairy-Free but contains dairy: ${dairyHits.join(", ")}`);
  }
  if (tags.has("Nut-Free")) {
    if (nonOptionalHasKeyword(NUT_KEYWORDS)) flag(recipe, "diet-nut-free", `tagged Nut-Free but contains nuts: ${nutHits.join(", ")}`);
  }
  if (tags.has("Gluten-Free")) {
    const strongGluten = glutenHits.filter((k) => !["noodle", "soy sauce"].includes(k));
    if (recipe.ingredients.some((i) => !i.optional && textIncludesAny(i.name, strongGluten).length > 0)) {
      flag(recipe, "diet-gluten-free", `tagged Gluten-Free but contains: ${strongGluten.join(", ")}`);
    }
  }

  // --- Missing-tag heuristics (recipe looks vegan/vegetarian but isn't tagged) ---
  const hasAnyMeatFishDairyEgg =
    meatFishHits.length > 0 || dairyHits.length > 0 || eggHits.length > 0;
  if (!hasAnyMeatFishDairyEgg && !tags.has("Vegan") && recipe.ingredients.length > 3) {
    flag(recipe, "diet-missing", "no meat/fish/dairy/egg detected but not tagged Vegan (verify)");
  }
}

// --- Cross-recipe: duplicate names/ids already checked elsewhere ---

console.log(`Audited ${recipes.length} recipes, found ${issues.length} flagged issues.\n`);

const byCategory = new Map<string, Issue[]>();
for (const issue of issues) {
  const list = byCategory.get(issue.category) ?? [];
  list.push(issue);
  byCategory.set(issue.category, list);
}

for (const [category, list] of [...byCategory.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n=== ${category} (${list.length}) ===`);
  for (const issue of list) {
    console.log(`  [${issue.recipeId}] ${issue.recipeName}: ${issue.detail}`);
  }
}
