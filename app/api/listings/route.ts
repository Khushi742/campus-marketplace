import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";

export async function GET() {
  const prisma = await getPrisma();
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    include: {
      seller: { select: { id: true, name: true, branch: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    })),
  );
}

export async function POST(request: Request) {
  const prisma = await getPrisma();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = await request.json();
  const title = String(body?.title ?? "").trim();
  const description = String(body?.description ?? "").trim();
  const price = Number(body?.price ?? 0);
  const category = String(body?.category ?? "Other").trim();
  const condition = String(body?.condition ?? "Used").trim();
  const location = String(body?.location ?? "Campus").trim();
  const imageUrls = Array.isArray(body?.imageUrls) ? body.imageUrls.filter(Boolean).slice(0, 5) : [];

  if (!title || !description || !location || !Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Title, description, valid price, and location are required." }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      price,
      category,
      condition,
      location,
      imageUrls: imageUrls.length ? imageUrls : ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"],
      sellerId: session.user.id,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}
