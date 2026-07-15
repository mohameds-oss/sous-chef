"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, RotateCcw, PartyPopper } from "lucide-react";
import type { Recipe } from "@/lib/recipe-types";
import type { UnitSystem } from "@/lib/units";
import { SERVING_MULTIPLIERS } from "@/lib/units";
import { ScaledIngredientList } from "@/components/cooking/scaled-ingredient-list";
import { Timer } from "@/components/timer/timer";
import { SaveButton } from "@/components/recipes/save-button";
import { Button, LinkButton } from "@/components/ui/button";
import { saveCookingProgressAction } from "@/app/(main)/cooking-actions";

interface CookingSessionProps {
  recipe: Recipe;
  isAuthenticated: boolean;
  isSaved: boolean;
  initialProgress: {
    currentStep: number;
    servingsMul: number;
    unitSystem: string;
    completedAt: Date | null;
  } | null;
}

export function CookingSession({
  recipe,
  isAuthenticated,
  isSaved,
  initialProgress,
}: CookingSessionProps) {
  const totalSteps = recipe.steps.length;
  const [stepIndex, setStepIndex] = useState(() =>
    Math.min(Math.max(initialProgress?.currentStep ?? 0, 0), totalSteps - 1)
  );
  const [multiplier, setMultiplier] = useState(initialProgress?.servingsMul ?? 1);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(
    (initialProgress?.unitSystem as UnitSystem) ?? "us"
  );
  const [completed, setCompleted] = useState(Boolean(initialProgress?.completedAt));
  const [showIngredients, setShowIngredients] = useState(false);

  const step = recipe.steps[stepIndex];
  const scaledServings = useMemo(() => recipe.servings * multiplier, [recipe.servings, multiplier]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const timeout = setTimeout(() => {
      saveCookingProgressAction({
        recipeId: recipe.id,
        currentStep: stepIndex,
        servingsMul: multiplier,
        unitSystem,
        completed,
      });
    }, 400);
    return () => clearTimeout(timeout);
  }, [isAuthenticated, recipe.id, stepIndex, multiplier, unitSystem, completed]);

  function goNext() {
    if (stepIndex === totalSteps - 1) {
      setCompleted(true);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }

  function goPrev() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function restart() {
    setStepIndex(0);
    setCompleted(false);
  }

  if (completed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center animate-pop-in">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-soft text-accent-deep mb-6">
          <PartyPopper className="h-10 w-10" />
        </div>
        <h1 className="font-display text-3xl font-semibold">You made {recipe.name}!</h1>
        <p className="text-foreground-muted mt-3">
          Nice work — {totalSteps} steps down. Hope it turned out delicious.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={restart} variant="outline" size="lg">
            <RotateCcw className="h-4 w-4" /> Cook it again
          </Button>
          <SaveButton
            recipeId={recipe.id}
            initiallySaved={isSaved}
            isAuthenticated={isAuthenticated}
            variant="full"
          />
          <LinkButton href="/search" size="lg">
            Find another recipe
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link href={`/recipes/${recipe.id}`} className="text-sm text-foreground-faint hover:text-foreground-muted">
            ← {recipe.name}
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold mt-1">
            Step {stepIndex + 1} of {totalSteps}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={restart}>
            <RotateCcw className="h-4 w-4" /> Restart
          </Button>
          <SaveButton recipeId={recipe.id} initiallySaved={isSaved} isAuthenticated={isAuthenticated} />
        </div>
      </div>

      <div className="mt-4 h-2 w-full rounded-full bg-surface-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500"
          style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border border-border bg-surface p-1">
          {SERVING_MULTIPLIERS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMultiplier(m)}
              className={clsx(
                "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors",
                multiplier === m ? "bg-accent text-white" : "text-foreground-muted hover:text-foreground"
              )}
            >
              {m}×
            </button>
          ))}
        </div>
        <span className="text-sm text-foreground-faint">{scaledServings} servings</span>

        <div className="inline-flex rounded-full border border-border bg-surface p-1 ml-auto">
          {(["us", "metric"] as const).map((system) => (
            <button
              key={system}
              type="button"
              onClick={() => setUnitSystem(system)}
              className={clsx(
                "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors",
                unitSystem === system ? "bg-accent text-white" : "text-foreground-muted hover:text-foreground"
              )}
            >
              {system === "us" ? "US" : "Metric"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-surface">
        <button
          type="button"
          onClick={() => setShowIngredients((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium"
        >
          Ingredient list
          <span className={clsx("transition-transform", showIngredients && "rotate-180")}>⌄</span>
        </button>
        {showIngredients && (
          <div className="px-5 pb-4">
            <ScaledIngredientList
              ingredients={recipe.ingredients}
              multiplier={multiplier}
              unitSystem={unitSystem}
            />
          </div>
        )}
      </div>

      <div key={step.id} className="mt-6 animate-fade-in">
        <div className="rounded-3xl border border-border bg-surface p-7 sm:p-10 shadow-card">
          <p className="text-xl sm:text-2xl leading-relaxed font-display">{step.instruction}</p>
          {step.tip && (
            <p className="mt-5 text-sm text-accent-deep bg-accent-soft rounded-xl px-4 py-3 inline-block">
              💡 {step.tip}
            </p>
          )}
        </div>

        {step.timerMinutes && (
          <div className="mt-6 flex justify-center">
            <Timer initialMinutes={step.timerMinutes} label={`Step ${stepIndex + 1} timer`} />
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" onClick={goPrev} disabled={stepIndex === 0}>
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <Button onClick={goNext}>
          {stepIndex === totalSteps - 1 ? "Finish" : "Next"} <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
