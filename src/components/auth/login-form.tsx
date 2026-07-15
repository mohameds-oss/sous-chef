"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/(auth)/actions";
import { Label, Input, FieldError } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import Link from "next/link";

const initialState: ActionState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}
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
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-sm text-brand hover:text-brand-deep">
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          required
        />
      </div>
      <FieldError>{state.error}</FieldError>
      <SubmitButton pendingLabel="Logging in…" className="w-full" size="lg">
        Log in
      </SubmitButton>
    </form>
  );
}
