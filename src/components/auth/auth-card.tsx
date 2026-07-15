import type { ReactNode } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="bg-surface rounded-3xl shadow-card border border-border p-8 sm:p-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {subtitle && <p className="text-foreground-muted mt-2 text-sm">{subtitle}</p>}
      <div className="mt-7">{children}</div>
      {footer && <div className="mt-6 text-center text-sm text-foreground-muted">{footer}</div>}
    </div>
  );
}
