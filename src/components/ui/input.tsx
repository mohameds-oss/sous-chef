import clsx from "clsx";
import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={clsx("text-sm font-medium text-foreground-muted mb-1.5 block", className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-foreground placeholder:text-foreground-faint transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/60",
        className
      )}
      {...props}
    />
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="text-sm text-red-500 mt-1.5">{children}</p>;
}
