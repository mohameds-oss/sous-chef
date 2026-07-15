import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Reset password — Sous-Chef" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthCard title="Reset link missing">
        <p className="text-foreground-muted text-sm">
          This page needs a reset token. Request a new link from{" "}
          <Link href="/forgot-password" className="text-brand hover:text-brand-deep font-medium">
            the forgot password page
          </Link>
          .
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" subtitle="Make it something you'll remember this time.">
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
