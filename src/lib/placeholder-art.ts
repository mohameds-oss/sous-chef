import type { Cuisine } from "./recipe-types";

/** Deterministic gradient + pattern per cuisine, used by <RecipeArt> so
 * every recipe gets elegant, on-brand cover art without hotlinking real
 * photography. */
export const CUISINE_GRADIENTS: Record<Cuisine, [string, string]> = {
  American: ["#e8a86c", "#c9694a"],
  Italian: ["#dfae5a", "#a3593f"],
  Mexican: ["#e2895a", "#b8433c"],
  Chinese: ["#d94f4f", "#8f2d2d"],
  Japanese: ["#e8c3a6", "#c1595f"],
  Korean: ["#e0765f", "#9c3b50"],
  Thai: ["#8fae63", "#4f7a5b"],
  Vietnamese: ["#9bbf7a", "#3e7a63"],
  Mediterranean: ["#93ab6f", "#5b7a53"],
  "Middle Eastern": ["#d19a54", "#9c5a3c"],
  Persian: ["#c9838a", "#7a3b4f"],
  Indian: ["#d98a3d", "#a1432f"],
  Caribbean: ["#e0b356", "#5f8a5a"],
};

export function cuisineGradient(cuisine: Cuisine): string {
  const [from, to] = CUISINE_GRADIENTS[cuisine] ?? ["#d9a24c", "#b8613a"];
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}
