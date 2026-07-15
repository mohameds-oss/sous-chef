import Link from "next/link";
import { ChefHat } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/(auth)/actions";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button, LinkButton } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/search", label: "Find recipes" },
  { href: "/saved", label: "Saved" },
  { href: "/planner", label: "Meal planner" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <ChefHat className="h-6 w-6 text-brand" strokeWidth={2} />
          <span className="font-display text-lg font-semibold tracking-tight">Sous-Chef</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 rounded-full text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Log out
                </Button>
              </form>
            ) : (
              <>
                <LinkButton href="/login" variant="ghost" size="sm">
                  Log in
                </LinkButton>
                <LinkButton href="/signup" size="sm">
                  Sign up
                </LinkButton>
              </>
            )}
          </div>
          <MobileNav
            links={NAV_LINKS}
            user={user ? { name: user.name, email: user.email } : null}
          />
        </div>
      </div>
    </header>
  );
}
