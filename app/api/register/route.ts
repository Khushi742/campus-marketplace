import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getPrisma } from "@/lib/db";
import { engineeringBranches, engineeringDegrees, isValidUsn } from "@/lib/student";
import {
  createVerificationToken,
  escapeHtml,
  getVerificationUrl,
  isValidStudentEmail,
  normalizeStudentEmail,
  VERIFICATION_TOKEN_TTL_MS,
} from "@/lib/email-verification";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Send a valid account form." }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Send a valid account form." }, { status: 400 });
  }
  const name = String(body?.name ?? "").trim();
  const email = normalizeStudentEmail(String(body?.email ?? ""));
  const password = String(body?.password ?? "");
  const usn = String(body?.usn ?? "").trim().toUpperCase();
  const degree = String(body?.degree ?? "").trim();
  const branch = String(body?.branch ?? "").trim();

  if (!name || name.length > 100 || !email || !password || password.length < 8 || !usn || !degree || !branch) {
    return NextResponse.json({ error: "Name, email, USN, degree, branch, and a password (8+ characters) are required." }, { status: 400 });
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    return NextResponse.json({ error: "Password must be no longer than 72 UTF-8 bytes." }, { status: 400 });
  }

  if (!isValidStudentEmail(email)) {
    return NextResponse.json({ error: "Use your college email address ending in @nmit.ac.in." }, { status: 400 });
  }

  if (!isValidUsn(usn)) {
    return NextResponse.json({ error: "Enter a valid USN, for example NB25ISE111." }, { status: 400 });
  }

  if (!engineeringDegrees.some((allowedDegree) => allowedDegree === degree)) {
    return NextResponse.json({ error: "Degree must be BE or BTech." }, { status: 400 });
  }

  if (!engineeringBranches.some((allowedBranch) => allowedBranch === branch)) {
    return NextResponse.json({ error: "Select a valid engineering branch." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  const appUrl = process.env.NEXTAUTH_URL;
  if (!resendApiKey || !emailFrom || !appUrl) {
    return NextResponse.json({ error: "Email verification is not configured. Please contact the administrator." }, { status: 503 });
  }
  let verificationUrl: URL;
  try {
    verificationUrl = getVerificationUrl(appUrl, "token-placeholder");
  } catch {
    return NextResponse.json({ error: "Email verification is not configured with a valid application URL." }, { status: 503 });
  }

  const prisma = await getPrisma();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account already exists with this email." }, { status: 409 });
  }

  const existingUsn = await prisma.user.findUnique({ where: { usn } });
  if (existingUsn) {
    return NextResponse.json({ error: "An account already exists with this USN." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { token: rawToken, tokenHash } = createVerificationToken();
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  let user;
  try {
    user = await prisma.user.create({
      data: {
        name,
        email,
        usn,
        degree,
        branch,
        passwordHash,
        emailVerificationToken: {
          create: { tokenHash, expiresAt },
        },
      },
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "An account already exists with this email or USN." }, { status: 409 });
    }
    console.error("Could not create pending account:", error);
    return NextResponse.json({ error: "Could not create your account. Please try again." }, { status: 500 });
  }

  verificationUrl.searchParams.set("token", rawToken);
  let emailResponse: Response;
  try {
    emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [email],
        subject: "Verify your Campus Marketplace account",
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#10243e"><h1>Verify your college email</h1><p>Hi ${escapeHtml(name)},</p><p>Confirm your email address to activate your Campus Marketplace account.</p><p><a href="${verificationUrl.toString()}" style="display:inline-block;padding:12px 20px;background:#102f59;color:#fff;text-decoration:none;border-radius:8px">Verify email</a></p><p>This link expires in one hour. If you did not request this, you can ignore this email.</p></div>`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("Could not send account verification email:", error instanceof Error ? error.name : "Unknown error");
    await prisma.user.delete({ where: { id: user.id } }).catch((cleanupError: unknown) => {
      console.error("Could not clean up pending account after email failure:", cleanupError);
    });
    return NextResponse.json({ error: "Could not send the verification email. Please try again." }, { status: 502 });
  }

  if (!emailResponse.ok) {
    console.error("Resend rejected verification email with status:", emailResponse.status);
    await prisma.user.delete({ where: { id: user.id } }).catch((cleanupError: unknown) => {
      console.error("Could not clean up pending account after email failure:", cleanupError);
    });
    return NextResponse.json({ error: "Could not send the verification email. Please try again." }, { status: 502 });
  }

  return NextResponse.json({
    message: "Account created. Check your college email for a verification link.",
    user: { id: user.id, name: user.name, email: user.email },
  }, { status: 201 });
}
