import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";

const maxIntroductionLength = 280;

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to update your profile." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a valid profile introduction." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body) || !("bio" in body) || typeof body.bio !== "string") {
    return NextResponse.json({ error: "Send a valid profile introduction." }, { status: 400 });
  }

  const bio = body.bio.trim();
  if (bio.length > maxIntroductionLength) {
    return NextResponse.json({ error: `Introduction must be ${maxIntroductionLength} characters or fewer.` }, { status: 400 });
  }

  try {
    await (await getPrisma()).user.update({
      where: { id: session.user.id },
      data: { bio },
    });
  } catch (error) {
    console.error("Could not update student introduction:", error);
    return NextResponse.json({ error: "Could not save your introduction. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ bio });
}
