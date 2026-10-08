import { createHash, randomBytes } from "node:crypto";

export const VERIFICATION_TOKEN_TTL_MS = 60 * 60 * 1000;

export function normalizeStudentEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidStudentEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@nmit\.ac\.in$/i.test(value);
}

export function createVerificationToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("hex");
  return { token, tokenHash: hashVerificationToken(token) };
}

export function hashVerificationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function isValidVerificationToken(token: string | null): token is string {
  return token !== null && /^[a-f0-9]{64}$/i.test(token);
}

export function isVerificationExpired(expiresAt: Date, now = new Date()): boolean {
  return expiresAt.getTime() <= now.getTime();
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return character;
    }
  });
}

export function getVerificationUrl(appUrl: string, token: string): URL {
  const baseUrl = new URL(appUrl);
  const isLocalHttp = baseUrl.protocol === "http:" && ["localhost", "127.0.0.1"].includes(baseUrl.hostname);
  if (baseUrl.protocol !== "https:" && !isLocalHttp) {
    throw new Error("Verification URL must use HTTPS outside local development.");
  }
  if (baseUrl.username || baseUrl.password) {
    throw new Error("Verification URL must not contain credentials.");
  }

  const verificationUrl = new URL("/api/verify-email", baseUrl);
  verificationUrl.searchParams.set("token", token);
  return verificationUrl;
}
