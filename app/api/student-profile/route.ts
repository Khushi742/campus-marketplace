import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";
import { engineeringBranches, engineeringDegrees, isValidUsn } from "@/lib/student";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in with Google to continue." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send valid student profile details." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Send valid student profile details." }, { status: 400 });
  }

  const values = body as Record<string, unknown>;
  const usn = typeof values.usn === "string" ? values.usn.trim().toUpperCase() : "";
  const degree = typeof values.degree === "string" ? values.degree.trim() : "";
  const branch = typeof values.branch === "string" ? values.branch.trim() : "";
  if (!isValidUsn(usn)) {
    return NextResponse.json({ error: "Enter a valid USN, for example NB25ISE111." }, { status: 400 });
  }
  if (!engineeringDegrees.some((allowed) => allowed === degree)) {
    return NextResponse.json({ error: "Degree must be BE or BTech." }, { status: 400 });
  }
  if (!engineeringBranches.some((allowed) => allowed === branch)) {
    return NextResponse.json({ error: "Select a valid engineering branch." }, { status: 400 });
  }

  try {
    await (await getPrisma()).user.update({
      where: { id: session.user.id },
      data: { usn, degree, branch },
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "That USN is already linked to another account." }, { status: 409 });
    }
    console.error("Could not save student profile:", error);
    return NextResponse.json({ error: "Could not save your student profile. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ message: "Student profile saved." });
}
