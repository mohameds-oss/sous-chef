import { recipes } from "@/data/recipes";

let ok = true;

console.log(`Total recipes: ${recipes.length}`);
if (recipes.length !== 93) {
  console.error(`Expected 93 recipes, got ${recipes.length}`);
  ok = false;
}

const idCounts = new Map<string, number>();
for (const r of recipes) {
  idCounts.set(r.id, (idCounts.get(r.id) ?? 0) + 1);
}
for (const [id, count] of idCounts) {
  if (count > 1) {
    console.error(`Duplicate id "${id}" appears ${count} times`);
    ok = false;
  }
}

for (const r of recipes) {
  if (r.ingredients.length === 0) {
    console.error(`${r.id}: no ingredients`);
    ok = false;
  }
  if (r.steps.length === 0) {
    console.error(`${r.id}: no steps`);
    ok = false;
  }
  const ingredientIds = new Set<string>();
  for (const ing of r.ingredients) {
    if (ingredientIds.has(ing.id)) {
      console.error(`${r.id}: duplicate ingredient id "${ing.id}"`);
      ok = false;
    }
    ingredientIds.add(ing.id);
  }
  if (!r.image?.emoji) {
    console.error(`${r.id}: missing emoji`);
    ok = false;
  }
  if (!r.nutrition || typeof r.nutrition.calories !== "number") {
    console.error(`${r.id}: missing/invalid nutrition`);
    ok = false;
  }
}

console.log(ok ? "All checks passed." : "Checks FAILED.");
process.exit(ok ? 0 : 1);
