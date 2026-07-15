import Link from "next/link";
import { Clock, Users, ChevronRight } from "lucide-react";
import { RecipeArt } from "@/components/recipes/recipe-art";
import { SaveButton } from "@/components/recipes/save-button";
import { MatchBadge } from "@/components/recipes/match-badge";
import { LinkButton } from "@/components/ui/button";
import type { Recipe, RecipeIngredient } from "@/lib/recipe-types";
import { totalTimeMinutes } from "@/lib/recipe-types";

interface RecipeCardProps {
  recipe: Recipe;
  isAuthenticated: boolean;
  isSaved: boolean;
  matchPercent?: number;
  haveIngredients?: RecipeIngredient[];
  missingIngredients?: RecipeIngredient[];
}

export function RecipeCard({
  recipe,
  isAuthenticated,
  isSaved,
  matchPercent,
  haveIngredients,
  missingIngredients,
}: RecipeCardProps) {
  return (
    <article className="group flex flex-col rounded-3xl border border-border bg-surface shadow-soft hover:shadow-lift transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <Link href={`/recipes/${recipe.id}`}>
          <RecipeArt cuisine={recipe.cuisine} emoji={recipe.image.emoji} size="lg" className="h-44 w-full transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="absolute top-3 right-3">
          <SaveButton recipeId={recipe.id} initiallySaved={isSaved} isAuthenticated={isAuthenticated} />
        </div>
        {matchPercent !== undefined && (
          <div className="absolute top-3 left-3">
            <MatchBadge percent={matchPercent} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/recipes/${recipe.id}`} className="hover:text-brand transition-colors">
          <h3 className="font-display text-lg font-semibold leading-snug">{recipe.name}</h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-faint">
          <span>{recipe.cuisine}</span>
          <span aria-hidden>•</span>
          <span>{recipe.difficulty}</span>
          <span aria-hidden>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {totalTimeMinutes(recipe)} min
          </span>
          <span aria-hidden>•</span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {recipe.servings}
          </span>
        </div>

        {haveIngredients && missingIngredients && (
          <div className="mt-3 space-y-1.5">
            <details className="text-sm">
              <summary className="cursor-pointer select-none text-match-perfect font-medium">
                Ingredients you have ({haveIngredients.length})
              </summary>
              <ul className="mt-1.5 pl-4 text-foreground-muted list-disc space-y-0.5">
                {haveIngredients.map((ing) => (
                  <li key={ing.id}>{ing.name}</li>
                ))}
              </ul>
            </details>
            {missingIngredients.length > 0 && (
              <details className="text-sm">
                <summary className="cursor-pointer select-none text-foreground-faint font-medium">
                  Ingredients missing ({missingIngredients.length})
                </summary>
                <ul className="mt-1.5 pl-4 text-foreground-muted list-disc space-y-0.5">
                  {missingIngredients.map((ing) => (
                    <li key={ing.id}>{ing.name}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center gap-2">
          <SaveButton
            recipeId={recipe.id}
            initiallySaved={isSaved}
            isAuthenticated={isAuthenticated}
            variant="full"
          />
          <LinkButton href={`/recipes/${recipe.id}/cook`} size="sm" className="flex-1">
            Start Cooking <ChevronRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </div>
    </article>
  );
}
