import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Sign up — Sous-Chef" };

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Save recipes, plan your week, and pick up cooking right where you left off."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-brand hover:text-brand-deep font-medium">
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
