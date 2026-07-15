"use client";

import { useActionState, useState } from "react";
import { resendVerificationAction, type ActionState } from "@/app/(auth)/actions";
import { X } from "lucide-react";

const initialState: ActionState = {};

export function VerificationBanner() {
  const [state, formAction] = useActionState(resendVerificationAction, initialState);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-brand-soft border-b border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-center">
        <span className="text-foreground-muted">
          {state.success ?? "Verify your email to unlock saved recipes and the meal planner."}
        </span>
        {!state.success && (
          <form action={formAction}>
            <button type="submit" className="font-medium text-brand hover:text-brand-deep underline">
              Resend verification email
            </button>
          </form>
        )}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="text-foreground-faint hover:text-foreground-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
