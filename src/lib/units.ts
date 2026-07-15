import type { Unit } from "./recipe-types";

export type UnitSystem = "us" | "metric";

const FRACTIONS: Array<[number, string]> = [
  [1 / 8, "1/8"],
  [1 / 4, "1/4"],
  [1 / 3, "1/3"],
  [3 / 8, "3/8"],
  [1 / 2, "1/2"],
  [5 / 8, "5/8"],
  [2 / 3, "2/3"],
  [3 / 4, "3/4"],
  [7 / 8, "7/8"],
];

/** Format a decimal quantity as a mixed number with common cooking
 * fractions (e.g. 1.5 -> "1 1/2") when it's close to one, else a plain
 * rounded decimal. */
export function formatAmount(amount: number): string {
  if (amount === 0) return "0";
  const whole = Math.floor(amount);
  const remainder = amount - whole;

  if (remainder < 0.05) {
    return whole === 0 ? "0" : `${whole}`;
  }

  let closest: [number, string] | null = null;
  let closestDiff = Infinity;
  for (const entry of FRACTIONS) {
    const diff = Math.abs(entry[0] - remainder);
    if (diff < closestDiff) {
      closestDiff = diff;
      closest = entry;
    }
  }

  if (closest && closestDiff < 0.05) {
    return whole > 0 ? `${whole} ${closest[1]}` : closest[1];
  }

  const rounded = Math.round(amount * 100) / 100;
  return `${rounded}`;
}

const US_TO_METRIC: Partial<Record<Unit, (amount: number) => { amount: number; unit: string }>> = {
  cup: (amount) => toVolumeMl(amount * 236.588),
  tbsp: (amount) => toVolumeMl(amount * 14.787),
  tsp: (amount) => toVolumeMl(amount * 4.929),
  oz: (amount) => toWeightG(amount * 28.35),
  lb: (amount) => toWeightG(amount * 453.592),
  "°F": (amount) => ({ amount: Math.round(((amount - 32) * 5) / 9), unit: "°C" }),
};

function toVolumeMl(ml: number) {
  if (ml >= 1000) return { amount: Math.round((ml / 1000) * 100) / 100, unit: "l" };
  return { amount: Math.round(ml), unit: "ml" };
}

function toWeightG(g: number) {
  if (g >= 1000) return { amount: Math.round((g / 1000) * 100) / 100, unit: "kg" };
  return { amount: Math.round(g), unit: "g" };
}

/** Convert an ingredient amount to the requested unit system for display.
 * Non-convertible units (count-based, "to taste", already-metric) pass
 * through unchanged. */
export function convertUnit(
  amount: number,
  unit: Unit,
  system: UnitSystem
): { amount: number; unit: string; display: string } {
  if (system === "metric") {
    const converter = US_TO_METRIC[unit];
    if (converter) {
      const { amount: convertedAmount, unit: convertedUnit } = converter(amount);
      return {
        amount: convertedAmount,
        unit: convertedUnit,
        display: `${formatAmount(convertedAmount)} ${convertedUnit}`,
      };
    }
  }
  return { amount, unit, display: `${formatAmount(amount)}${unit === "whole" || unit === "clove" || unit === "slice" || unit === "piece" || unit === "can" ? "" : " "}${unit === "whole" ? "" : unit}`.trim() };
}

export const SERVING_MULTIPLIERS = [0.5, 1, 2] as const;
export type ServingMultiplier = (typeof SERVING_MULTIPLIERS)[number];

export function scaleAmount(amount: number, multiplier: number): number {
  return amount * multiplier;
}
