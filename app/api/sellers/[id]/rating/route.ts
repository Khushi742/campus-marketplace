import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";
import { isValidSellerRating } from "@/lib/seller-rating";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to rate a seller." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a rating from 1 to 5." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || !("rating" in body)) {
    return NextResponse.json({ error: "Send a rating from 1 to 5." }, { status: 400 });
  }
  const rating = body.rating;
  if (!isValidSellerRating(rating)) {
    return NextResponse.json({ error: "Rating must be a whole number from 1 to 5." }, { status: 400 });
  }

  const { id: sellerId } = await params;
  if (sellerId === session.user.id) {
    return NextResponse.json({ error: "You cannot rate yourself." }, { status: 400 });
  }

  const prisma = await getPrisma();
  const seller = await prisma.user.findUnique({ where: { id: sellerId }, select: { id: true } });
  if (!seller) return NextResponse.json({ error: "Seller not found." }, { status: 404 });

  const savedRating = await prisma.sellerRating.upsert({
    where: { sellerId_reviewerId: { sellerId, reviewerId: session.user.id } },
    update: { rating },
    create: { sellerId, reviewerId: session.user.id, rating },
  });

  return NextResponse.json({ rating: savedRating.rating });
}
