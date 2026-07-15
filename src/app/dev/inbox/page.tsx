import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Dev Inbox — Sous-Chef" };
export const dynamic = "force-dynamic";

export default async function DevInboxPage() {
  const emails = await db.devEmail.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-semibold">Dev Inbox</h1>
        <p className="text-foreground-muted mt-2 text-sm">
          No email provider is configured (set <code>RESEND_API_KEY</code> to send real emails).
          Verification and password reset emails land here instead.
        </p>

        <div className="mt-8 space-y-4">
          {emails.length === 0 && (
            <p className="text-foreground-faint text-sm">No emails yet.</p>
          )}
          {emails.map((email) => (
            <div key={email.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-medium">{email.subject}</p>
                <p className="text-xs text-foreground-faint whitespace-nowrap">
                  {email.createdAt.toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-foreground-faint mt-1">To: {email.to}</p>
              <div
                className="prose prose-sm mt-4 max-w-none text-foreground-muted [&_a]:text-brand [&_a]:break-all"
                dangerouslySetInnerHTML={{ __html: email.body }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
