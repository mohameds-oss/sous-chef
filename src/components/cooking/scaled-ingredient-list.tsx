import { convertUnit, scaleAmount } from "@/lib/units";
import type { RecipeIngredient } from "@/lib/recipe-types";
import type { UnitSystem } from "@/lib/units";

export function ScaledIngredientList({
  ingredients,
  multiplier,
  unitSystem,
}: {
  ingredients: RecipeIngredient[];
  multiplier: number;
  unitSystem: UnitSystem;
}) {
  return (
    <ul className="space-y-2.5">
      {ingredients.map((ingredient) => {
        const scaledAmount = scaleAmount(ingredient.amount, multiplier);
        const { display } = convertUnit(scaledAmount, ingredient.unit, unitSystem);
        return (
          <li key={ingredient.id} className="flex items-baseline justify-between gap-3 text-sm">
            <span className={ingredient.optional ? "text-foreground-faint" : "text-foreground"}>
              {ingredient.name}
              {ingredient.optional && " (optional)"}
            </span>
            <span className="whitespace-nowrap font-medium text-foreground-muted">{display}</span>
          </li>
        );
      })}
    </ul>
  );
}
