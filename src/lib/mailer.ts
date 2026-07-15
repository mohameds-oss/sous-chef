import "server-only";
import { db } from "@/lib/db";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/** Sends transactional email via Resend when RESEND_API_KEY is configured;
 * otherwise stores the message so it can be viewed at /dev/inbox. This lets
 * the full signup/verification/reset flow work end-to-end without any
 * email provider configured. */
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    const from = process.env.EMAIL_FROM ?? "Sous-Chef <onboarding@resend.dev>";
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to send email via Resend: ${response.status} ${body}`);
    }
    return;
  }

  await db.devEmail.create({ data: { to, subject, body: html } });
  console.log(`[dev-mail] Queued email to ${to}: "${subject}" — view at /dev/inbox`);
}
