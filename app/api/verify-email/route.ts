import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { isValidVerificationToken, isVerificationExpired } from "@/lib/email-verification";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!isValidVerificationToken(token)) {
    return NextResponse.redirect(new URL("/login?verification=invalid", request.url));
  }

  const prisma = await getPrisma();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const now = new Date();
  const outcome = await prisma.$transaction(async (transaction) => {
    const verification = await transaction.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    if (!verification) return "invalid";
    if (isVerificationExpired(verification.expiresAt, now)) {
      await transaction.emailVerificationToken.deleteMany({ where: { id: verification.id } });
      return "expired";
    }

    const consumed = await transaction.emailVerificationToken.deleteMany({
      where: { id: verification.id, tokenHash, expiresAt: { gt: now } },
    });
    if (consumed.count !== 1) return "invalid";

    await transaction.user.update({
      where: { id: verification.userId },
      data: { emailVerified: now },
    });
    return "verified";
  });

  const destination = outcome === "verified"
    ? "/login?verified=1"
    : outcome === "expired"
      ? "/login?verification=expired"
      : "/login?verification=invalid";
  return NextResponse.redirect(new URL(destination, request.url));
}
