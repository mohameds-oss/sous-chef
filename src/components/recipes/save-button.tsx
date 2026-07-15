"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import clsx from "clsx";
import { toggleSavedRecipeAction } from "@/app/(main)/saved-actions";

export function SaveButton({
  recipeId,
  initiallySaved,
  isAuthenticated,
  variant = "icon",
}: {
  recipeId: string;
  initiallySaved: boolean;
  isAuthenticated: boolean;
  variant?: "icon" | "full";
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    const nextSaved = !saved;
    setSaved(nextSaved);
    startTransition(async () => {
      const result = await toggleSavedRecipeAction(recipeId);
      if ("error" in result) {
        setSaved(!nextSaved);
        router.push("/login");
      } else {
        setSaved(result.saved);
      }
    });
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border transition-colors",
          saved
            ? "bg-brand-soft border-brand/30 text-brand-deep"
            : "border-border bg-surface text-foreground-muted hover:text-foreground"
        )}
        aria-pressed={saved}
      >
        <Heart className={clsx("h-4 w-4", saved && "fill-current")} />
        {saved ? "Saved" : "Save recipe"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={saved ? "Remove from saved recipes" : "Save recipe"}
      aria-pressed={saved}
      className={clsx(
        "inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors",
        saved ? "bg-white/90 text-brand" : "bg-black/25 text-white hover:bg-black/40"
      )}
    >
      <Heart className={clsx("h-4 w-4", saved && "fill-current")} />
    </button>
  );
}
