"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

export interface NameSearchItem {
  id: string;
  name: string;
  cuisine: string;
  emoji: string;
}

export function NameSearchPanel({ items }: { items: NameSearchItem[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items.filter((item) => item.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, items]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search recipes by name — try “tacos” or “risotto”"
            className="w-full rounded-2xl border border-border bg-surface pl-12 pr-5 py-4 text-foreground placeholder:text-foreground-faint focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/60 transition-colors"
          />
        </div>
      </form>

      {matches.length > 0 && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border border-border bg-surface shadow-lift overflow-hidden animate-fade-in">
          {matches.map((item) => (
            <Link
              key={item.id}
              href={`/recipes/${item.id}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-surface-muted transition-colors"
            >
              <span className="text-xl">{item.emoji}</span>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-foreground-faint">{item.cuisine}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
