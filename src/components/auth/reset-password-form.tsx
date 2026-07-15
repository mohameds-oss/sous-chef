"use client";

import { useActionState } from "react";
import { resetPasswordAction, type ActionState } from "@/app/(auth)/actions";
import { Label, Input, FieldError } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

const initialState: ActionState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(resetPasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <div>
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          minLength={8}
          required
        />
      </div>
      <FieldError>{state.error}</FieldError>
      <SubmitButton pendingLabel="Saving…" className="w-full" size="lg">
        Set new password
      </SubmitButton>
    </form>
  );
}
