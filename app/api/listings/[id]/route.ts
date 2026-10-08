import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const prisma = await getPrisma();
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { seller: true },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  return NextResponse.json({
    ...listing,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const prisma = await getPrisma();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a valid listing update." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Send a valid listing update." }, { status: 400 });
  }
  const updates = body as Record<string, unknown>;
  if (updates.status !== undefined && updates.status !== "ACTIVE" && updates.status !== "SOLD") {
    return NextResponse.json({ error: "Status must be ACTIVE or SOLD." }, { status: 400 });
  }
  const data: {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    condition?: string;
    location?: string;
    imageUrls?: string[];
    status?: "ACTIVE" | "SOLD";
  } = {};

  for (const field of ["title", "description", "category", "condition", "location"] as const) {
    const value = updates[field];
    if (value !== undefined) {
      if (typeof value !== "string" || !value.trim()) {
        return NextResponse.json({ error: `${field} must be a non-empty string.` }, { status: 400 });
      }
      const trimmedValue = value.trim();
      const maximumLength = {
        title: 120,
        description: 5000,
        category: 100,
        condition: 100,
        location: 200,
      }[field];
      if (trimmedValue.length > maximumLength) {
        return NextResponse.json({ error: `${field} must be ${maximumLength} characters or fewer.` }, { status: 400 });
      }
      data[field] = trimmedValue;
    }
  }
  if (updates.price !== undefined) {
    if (typeof updates.price !== "number" || !Number.isFinite(updates.price) || updates.price < 0) {
      return NextResponse.json({ error: "Price must be a non-negative number." }, { status: 400 });
    }
    data.price = updates.price;
  }
  if (updates.imageUrls !== undefined) {
    if (
      !Array.isArray(updates.imageUrls)
      || updates.imageUrls.length > 5
      || !updates.imageUrls.every((url) => typeof url === "string" && url.length <= 2048)
    ) {
      return NextResponse.json({ error: "Provide up to five valid image URLs." }, { status: 400 });
    }
    data.imageUrls = updates.imageUrls;
  }
  if (updates.status !== undefined) {
    data.status = updates.status;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No listing changes were provided." }, { status: 400 });
  }

  const updated = await prisma.listing.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const prisma = await getPrisma();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  await prisma.listing.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
