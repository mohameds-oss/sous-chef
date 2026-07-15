import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { VerificationBanner } from "@/components/auth/verification-banner";
import { getCurrentUser } from "@/lib/auth";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const showBanner = Boolean(user && !user.emailVerified);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {showBanner && <VerificationBanner />}
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
