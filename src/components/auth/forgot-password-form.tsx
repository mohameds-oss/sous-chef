"use client";

import { useActionState } from "react";
import { requestPasswordResetAction, type ActionState } from "@/app/(auth)/actions";
import { Label, Input, FieldError } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

const initialState: ActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordResetAction, initialState);

  if (state.success) {
    return (
      <p className="rounded-xl bg-accent-soft text-accent-deep text-sm px-4 py-3">
        {state.success}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <FieldError>{state.error}</FieldError>
      <SubmitButton pendingLabel="Sending…" className="w-full" size="lg">
        Send reset link
      </SubmitButton>
    </form>
  );
}
