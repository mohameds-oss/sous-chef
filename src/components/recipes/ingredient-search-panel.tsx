"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogEntry } from "@/lib/ingredient-catalog";
import type { IngredientCategory } from "@/lib/recipe-types";

interface IngredientSearchPanelProps {
  catalog: Record<IngredientCategory, CatalogEntry[]>;
  categoryOrder: IngredientCategory[];
}

function parseFreeText(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function IngredientSearchPanel({ catalog, categoryOrder }: IngredientSearchPanelProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [freeText, setFreeText] = useState("");

  const freeTextItems = useMemo(() => parseFreeText(freeText), [freeText]);
  const totalCount = selected.size + freeTextItems.length;

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const combined = Array.from(new Set([...selected, ...freeTextItems]));
    if (combined.length === 0) return;
    router.push(`/search?ingredients=${encodeURIComponent(combined.join(","))}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="Type ingredients you have — comma or line separated (e.g. chicken, garlic, rice)"
          rows={3}
          className="w-full resize-none rounded-2xl border border-border bg-surface px-5 py-4 text-foreground placeholder:text-foreground-faint focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/60 transition-colors"
        />
      </div>

      <div className="space-y-3">
        {categoryOrder.map((category) => {
          const items = catalog[category];
          if (!items || items.length === 0) return null;
          return (
            <details key={category} className="group rounded-2xl border border-border bg-surface open:pb-2">
              <summary className="cursor-pointer select-none list-none px-5 py-3.5 flex items-center justify-between text-sm font-medium">
                <span>{category}</span>
                <span className="text-foreground-faint text-xs group-open:rotate-180 transition-transform">
                  ⌄
                </span>
              </summary>
              <div className="flex flex-wrap gap-2 px-5 pb-3">
                {items.map((item) => {
                  const active = selected.has(item.name);
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => toggle(item.name)}
                      className={clsx(
                        "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-accent text-white border-accent"
                          : "bg-surface-muted text-foreground-muted border-border hover:border-accent/50 hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={totalCount === 0}>
        <Search className="h-4 w-4" />
        Find recipes{totalCount > 0 ? ` with ${totalCount} ingredient${totalCount === 1 ? "" : "s"}` : ""}
      </Button>
    </form>
  );
}
