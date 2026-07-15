import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LinkButton } from "@/components/ui/button";
import { verifyEmailToken } from "@/app/(auth)/actions";

export const metadata: Metadata = { title: "Verify email — Sous-Chef" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthCard title="Missing verification token">
        <p className="text-foreground-muted text-sm">
          This link is incomplete. Check your email for the full verification link.
        </p>
      </AuthCard>
    );
  }

  const result = await verifyEmailToken(token);

  return (
    <AuthCard title={result.ok ? "Email verified" : "Verification failed"}>
      <p className="text-foreground-muted text-sm mb-6">{result.message}</p>
      <LinkButton href={result.ok ? "/" : "/login"} className="w-full" size="lg">
        {result.ok ? "Start cooking" : "Back to login"}
      </LinkButton>
    </AuthCard>
  );
}
