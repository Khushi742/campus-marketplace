import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const maxFileSize = 4 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to upload listing images." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (!allowedImageTypes.has(file.type)) {
    return NextResponse.json({ error: "Choose a JPG, PNG, or WebP image." }, { status: 400 });
  }
  if (file.size === 0 || file.size > maxFileSize) {
    return NextResponse.json({ error: "Image must be between 1 byte and 4 MB." }, { status: 400 });
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({ error: "Image uploads are not configured yet. You can use an image URL instead." }, { status: 503 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

    const url = await uploadImageToCloudinary(dataUrl);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Could not upload listing image:", error);
    return NextResponse.json({ error: "Image upload failed. Please try again." }, { status: 502 });
  }
}
