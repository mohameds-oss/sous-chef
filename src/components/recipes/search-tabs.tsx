"use client";

import { useState } from "react";
import clsx from "clsx";
import { IngredientSearchPanel } from "@/components/recipes/ingredient-search-panel";
import { NameSearchPanel, type NameSearchItem } from "@/components/recipes/name-search-panel";
import type { CatalogEntry } from "@/lib/ingredient-catalog";
import type { IngredientCategory } from "@/lib/recipe-types";

type Mode = "ingredients" | "name";

export function SearchTabs({
  catalog,
  categoryOrder,
  nameItems,
}: {
  catalog: Record<IngredientCategory, CatalogEntry[]>;
  categoryOrder: IngredientCategory[];
  nameItems: NameSearchItem[];
}) {
  const [mode, setMode] = useState<Mode>("ingredients");

  return (
    <div>
      <div className="inline-flex rounded-full border border-border bg-surface p-1 mb-6">
        {(
          [
            ["ingredients", "Search by ingredients"],
            ["name", "Search by name"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={clsx(
              "px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-colors",
              mode === value ? "bg-brand text-white" : "text-foreground-muted hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "ingredients" ? (
        <IngredientSearchPanel catalog={catalog} categoryOrder={categoryOrder} />
      ) : (
        <NameSearchPanel items={nameItems} />
      )}
    </div>
  );
}
