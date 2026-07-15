import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = { title: "Welcome — Sous-Chef" };

export default function WelcomePage() {
  return (
    <AuthCard
      title="You're in! 🎉"
      subtitle="We've sent a verification link to your email. Confirm it whenever you like — you can start exploring recipes right away."
    >
      <LinkButton href="/" className="w-full" size="lg">
        Start cooking
      </LinkButton>
    </AuthCard>
  );
}
