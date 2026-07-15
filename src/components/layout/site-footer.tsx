import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground-faint">
        <p>© {new Date().getFullYear()} Sous-Chef. Cook with what you have.</p>
        <div className="flex items-center gap-6">
          <Link href="/search" className="hover:text-foreground-muted">
            Find recipes
          </Link>
          <Link href="/planner" className="hover:text-foreground-muted">
            Meal planner
          </Link>
        </div>
      </div>
    </footer>
  );
}
