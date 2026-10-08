import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";

export async function POST(request: Request) {
  const prisma = await getPrisma();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { listingId } = await request.json();
  if (!listingId) {
    return NextResponse.json({ error: "Listing ID is required." }, { status: 400 });
  }

  const favorite = await prisma.favorite.upsert({
    where: {
      userId_listingId: {
        userId: session.user.id,
        listingId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      listingId,
    },
  });

  return NextResponse.json({ success: true, favorite });
}

export async function DELETE(request: Request) {
  const prisma = await getPrisma();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { listingId } = await request.json();
  if (!listingId) {
    return NextResponse.json({ error: "Listing ID is required." }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: session.user.id,
      listingId,
    },
  });

  return NextResponse.json({ success: true });
}
