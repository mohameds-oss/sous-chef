"use client";

import { useState } from "react";
import clsx from "clsx";
import type { ShoppingListItem } from "@/lib/shopping-list";
import type { IngredientCategory } from "@/lib/recipe-types";

export function ShoppingList({
  list,
  categoryOrder,
}: {
  list: Record<IngredientCategory, ShoppingListItem[]>;
  categoryOrder: IngredientCategory[];
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(name: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const nonEmptyCategories = categoryOrder.filter((c) => list[c]?.length > 0);

  if (nonEmptyCategories.length === 0) {
    return (
      <p className="text-foreground-faint text-sm">
        Add recipes to your planner to generate a shopping list.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {nonEmptyCategories.map((category) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-foreground-faint mb-2">{category}</h3>
          <ul className="space-y-1.5">
            {list[category].map((item) => {
              const isChecked = checked.has(item.name);
              return (
                <li key={item.name}>
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(item.name)}
                      className="mt-1 h-4 w-4 rounded border-border accent-[var(--color-accent)]"
                    />
                    <span>
                      <span
                        className={clsx(
                          "text-sm",
                          isChecked ? "line-through text-foreground-faint" : "text-foreground"
                        )}
                      >
                        {item.name}
                      </span>
                      <span className="block text-xs text-foreground-faint">
                        {item.recipeNames.join(", ")}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
