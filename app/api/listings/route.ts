import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";
import { categories } from "@/lib/sample-data";

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a valid listing." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Send a valid listing." }, { status: 400 });
  }

  const values = body as Record<string, unknown>;
  const title = typeof values.title === "string" ? values.title.trim() : "";
  const description = typeof values.description === "string" ? values.description.trim() : "";
  const price = values.price;
  const category = values.category;
  const condition = values.condition;
  const location = typeof values.location === "string" ? values.location.trim() : "";
  const imageUrls = values.imageUrls;

  if (!title || title.length > 120) {
    return NextResponse.json({ error: "Enter a title up to 120 characters long." }, { status: 400 });
  }
  if (!description || description.length > 5000) {
    return NextResponse.json({ error: "Enter a description up to 5,000 characters long." }, { status: 400 });
  }
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Enter a valid non-negative price." }, { status: 400 });
  }
  if (typeof category !== "string" || !categories.some((allowedCategory) => allowedCategory === category)) {
    return NextResponse.json({ error: "Choose a valid listing category." }, { status: 400 });
  }
  if (typeof condition !== "string" || !["Like New", "Good", "Used", "Needs Repair"].includes(condition)) {
    return NextResponse.json({ error: "Choose a valid item condition." }, { status: 400 });
  }
  if (!location || location.length > 200) {
    return NextResponse.json({ error: "Enter a location up to 200 characters long." }, { status: 400 });
  }
  if (
    !Array.isArray(imageUrls)
    || imageUrls.length > 5
    || !imageUrls.every((url) => {
      if (typeof url !== "string" || url.length > 2048) return false;
      try {
        return ["http:", "https:"].includes(new URL(url).protocol);
      } catch {
        return false;
      }
    })
  ) {
    return NextResponse.json({ error: "Provide up to five valid image URLs." }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      price,
      category,
      condition,
      location,
      imageUrls,
      sellerId: session.user.id,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}
