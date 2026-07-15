"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { logoutAction } from "@/app/(auth)/actions";

interface MobileNavProps {
  links: { href: string; label: string }[];
  user: { name: string | null; email: string } | null;
}

export function MobileNav({ links, user }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-muted"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background animate-fade-in">
          <div className="flex items-center justify-between p-6">
            <span className="font-display text-xl font-semibold">Sous-Chef</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-lg font-medium border-b border-border"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="px-6 mt-6 flex flex-col gap-3">
            {user ? (
              <form action={logoutAction}>
                <Button type="submit" variant="outline" className="w-full" size="lg">
                  Log out
                </Button>
              </form>
            ) : (
              <>
                <LinkButton href="/login" variant="outline" className="w-full" size="lg">
                  Log in
                </LinkButton>
                <LinkButton href="/signup" className="w-full" size="lg">
                  Sign up
                </LinkButton>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
