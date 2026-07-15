import Link from "next/link";
import { recipes } from "@/data/recipes";
import { getIngredientCatalog, INGREDIENT_CATEGORY_ORDER } from "@/lib/ingredient-catalog";
import { SearchTabs } from "@/components/recipes/search-tabs";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { getCurrentUser } from "@/lib/auth";
import { getSavedRecipeIds } from "@/lib/saved-recipes";

const CUISINES = Array.from(new Set(recipes.map((r) => r.cuisine))).sort();

const FEATURED_IDS = [
  "chicken-tikka-masala",
  "classic-pasta-carbonara",
  "fesenjan-persian-pomegranate-chicken",
  "pad-thai",
  "margherita-pizza",
  "shrimp-scampi",
];

export default async function HomePage() {
  const catalog = getIngredientCatalog();
  const nameItems = recipes.map((r) => ({
    id: r.id,
    name: r.name,
    cuisine: r.cuisine,
    emoji: r.image.emoji,
  }));

  const user = await getCurrentUser();
  const savedIds = user ? await getSavedRecipeIds(user.id) : new Set<string>();

  const featured = FEATURED_IDS.map((id) => recipes.find((r) => r.id === id)).filter(
    (r): r is NonNullable<typeof r> => Boolean(r)
  );
  const fallbackFeatured = featured.length >= 6 ? featured : recipes.slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 15% 0%, var(--color-brand-soft) 0%, transparent 60%), radial-gradient(50% 40% at 90% 10%, var(--color-accent-soft) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 sm:pt-24 pb-14 text-center">
          <p className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-foreground-muted mb-6">
            93 recipes · 12 cuisines · zero guesswork
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
            What can you cook <br className="hidden sm:block" /> with what you have?
          </h1>
          <p className="mt-5 text-lg text-foreground-muted max-w-xl mx-auto">
            Tell Sous-Chef what&rsquo;s in your kitchen, and we&rsquo;ll find recipes ranked by how well
            they match — then guide you through every step.
          </p>
        </div>

        <div className="mx-auto max-w-2xl px-4 sm:px-6 pb-16">
          <div className="rounded-3xl border border-border bg-surface/70 backdrop-blur-md p-5 sm:p-8 shadow-card">
            <SearchTabs catalog={catalog} categoryOrder={INGREDIENT_CATEGORY_ORDER} nameItems={nameItems} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-6">
        <h2 className="text-sm font-medium text-foreground-faint mb-3">Explore by cuisine</h2>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((cuisine) => (
            <Link
              key={cuisine}
              href={`/search?cuisine=${encodeURIComponent(cuisine)}`}
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground-muted hover:text-foreground hover:border-accent/50 transition-colors"
            >
              {cuisine}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Popular right now
          </h2>
          <Link href="/search" className="text-sm font-medium text-brand hover:text-brand-deep">
            Browse all recipes →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fallbackFeatured.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isAuthenticated={Boolean(user)}
              isSaved={savedIds.has(recipe.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
