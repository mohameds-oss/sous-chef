import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Log in — Sous-Chef" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const { next, reset } = await searchParams;

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to get back into your kitchen."
      footer={
        <>
          New to Sous-Chef?{" "}
          <Link href="/signup" className="text-brand hover:text-brand-deep font-medium">
            Create an account
          </Link>
        </>
      }
    >
      {reset === "success" && (
        <p className="mb-5 rounded-xl bg-accent-soft text-accent-deep text-sm px-4 py-3">
          Your password has been reset. Log in with your new password.
        </p>
      )}
      <LoginForm next={next} />
    </AuthCard>
  );
}
