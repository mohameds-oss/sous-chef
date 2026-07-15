import { cuisineGradient } from "@/lib/placeholder-art";
import type { Cuisine } from "@/lib/recipe-types";

interface RecipeArtProps {
  cuisine: Cuisine;
  emoji: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_EMOJI: Record<NonNullable<RecipeArtProps["size"]>, string> = {
  sm: "text-4xl",
  md: "text-6xl",
  lg: "text-8xl",
};

export function RecipeArt({ cuisine, emoji, className = "", size = "md" }: RecipeArtProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundImage: cuisineGradient(cuisine) }}
      role="img"
      aria-label={`${cuisine} dish illustration`}
    >
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 0%, transparent 45%), radial-gradient(circle at 85% 80%, white 0%, transparent 40%)",
        }}
      />
      <span className={`${SIZE_EMOJI[size]} drop-shadow-sm select-none`}>{emoji}</span>
    </div>
  );
}
