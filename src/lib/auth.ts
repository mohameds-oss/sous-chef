import "server-only";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

const SALT_ROUNDS = 10;
const VERIFICATION_TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24h
const RESET_TOKEN_TTL_MS = 1000 * 60 * 60; // 1h

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return db.user.findUnique({ where: { id: session.userId } });
}

/** Use in server components / layouts that require an authenticated user.
 * Redirects to /login (preserving the original path) when signed out. */
export async function requireUser(currentPath?: string) {
  const user = await getCurrentUser();
  if (!user) {
    const redirectParam = currentPath ? `?next=${encodeURIComponent(currentPath)}` : "";
    redirect(`/login${redirectParam}`);
  }
  return user;
}

export async function createVerificationToken(userId: string): Promise<string> {
  const token = generateToken();
  await db.verificationToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
    },
  });
  return token;
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = generateToken();
  await db.passwordResetToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });
  return token;
}
