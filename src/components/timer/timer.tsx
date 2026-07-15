"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw, Check } from "lucide-react";
import clsx from "clsx";
import { useCountdown } from "@/hooks/use-countdown";
import { Button } from "@/components/ui/button";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function Timer({
  initialMinutes = 5,
  allowCustomDuration = false,
  label,
}: {
  initialMinutes?: number;
  allowCustomDuration?: boolean;
  label?: string;
}) {
  const [minutesInput, setMinutesInput] = useState(initialMinutes);
  const { totalSeconds, remainingSeconds, running, justCompleted, start, pause, reset } =
    useCountdown(initialMinutes * 60);

  const progress = totalSeconds === 0 ? 0 : (totalSeconds - remainingSeconds) / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const isDone = remainingSeconds === 0 && totalSeconds > 0;

  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-4 rounded-3xl border p-6 transition-colors",
        justCompleted
          ? "border-accent bg-accent-soft animate-pop-in"
          : "border-border bg-surface"
      )}
    >
      {label && <p className="text-sm font-medium text-foreground-muted">{label}</p>}

      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--color-border)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke={isDone ? "var(--color-match-perfect)" : "var(--color-brand)"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isDone ? (
            <Check className="h-9 w-9 text-match-perfect" />
          ) : (
            <span className="font-display text-3xl font-semibold tabular-nums">
              {formatTime(remainingSeconds)}
            </span>
          )}
        </div>
      </div>

      {allowCustomDuration && !running && remainingSeconds === totalSeconds && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={60}
            value={minutesInput}
            onChange={(e) => {
              const value = Math.min(60, Math.max(1, Number(e.target.value) || 1));
              setMinutesInput(value);
              reset(value * 60);
            }}
            className="w-16 rounded-lg border border-border bg-surface px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
          <span className="text-sm text-foreground-faint">minutes</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {running ? (
          <Button variant="outline" size="sm" onClick={pause}>
            <Pause className="h-4 w-4" /> Pause
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={start}
            disabled={remainingSeconds === 0}
          >
            <Play className="h-4 w-4" /> Start
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => reset()}>
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>

      {isDone && <p className="text-sm font-medium text-match-perfect">Time&rsquo;s up!</p>}
    </div>
  );
}
