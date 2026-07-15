"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createPasswordResetToken,
  createVerificationToken,
  generateToken,
  getCurrentUser,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { sendEmail } from "@/lib/mailer";
import { clearSession, createSession } from "@/lib/session";

export interface ActionState {
  error?: string;
  success?: string;
}

const signupSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function baseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

async function sendVerificationEmail(userId: string, email: string, name: string) {
  const token = await createVerificationToken(userId);
  const verifyUrl = `${baseUrl()}/verify?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Verify your Sous-Chef account",
    html: `<p>Hi ${name},</p><p>Welcome to Sous-Chef! Confirm your email to unlock saved recipes and the meal planner:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours.</p>`,
  });
}

export async function signupAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists" };
  }

  const hashedPassword = await hashPassword(password);
  const user = await db.user.create({
    data: { name, email, hashedPassword },
  });

  await sendVerificationEmail(user.id, user.email, user.name ?? "there");
  await createSession({ userId: user.id, email: user.email });
  redirect("/welcome");
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Incorrect email or password" };
  }

  const valid = await verifyPassword(password, user.hashedPassword);
  if (!valid) {
    return { error: "Incorrect email or password" };
  }

  await createSession({ userId: user.id, email: user.email });
  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/") ? next : "/");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/");
}

const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export async function requestPasswordResetAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  // Always return the same message to avoid leaking which emails have accounts.
  const genericSuccess = "If an account exists for that email, a reset link is on its way.";

  if (user) {
    const token = await createPasswordResetToken(user.id);
    const resetUrl = `${baseUrl()}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your Sous-Chef password",
      html: `<p>Hi ${user.name ?? "there"},</p><p>Click below to choose a new password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, you can ignore this email.</p>`,
    });
  }

  return { success: genericSuccess };
}

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { token, password } = parsed.data;
  const resetToken = await db.passwordResetToken.findUnique({ where: { token } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  const hashedPassword = await hashPassword(password);
  await db.$transaction([
    db.user.update({ where: { id: resetToken.userId }, data: { hashedPassword } }),
    db.passwordResetToken.update({ where: { token }, data: { usedAt: new Date() } }),
  ]);

  redirect("/login?reset=success");
}

export async function resendVerificationAction(): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You need to be signed in to resend a verification email." };
  }
  if (user.emailVerified) {
    return { success: "Your email is already verified." };
  }
  await sendVerificationEmail(user.id, user.email, user.name ?? "there");
  return { success: "Verification email sent — check /dev/inbox if you haven't configured a real email provider." };
}

export async function verifyEmailToken(token: string): Promise<{ ok: boolean; message: string }> {
  const verificationToken = await db.verificationToken.findUnique({ where: { token } });
  if (!verificationToken || verificationToken.expiresAt < new Date()) {
    return { ok: false, message: "This verification link is invalid or has expired." };
  }

  await db.$transaction([
    db.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    }),
    db.verificationToken.delete({ where: { token } }),
  ]);

  return { ok: true, message: "Your email has been verified." };
}

// Re-exported so callers don't need to import from crypto directly.
export { generateToken };
