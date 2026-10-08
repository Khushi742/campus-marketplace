import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing location query." }, { status: 400 });
  }

  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}`, {
    headers: {
      "User-Agent": "CampusMartApp/1.0 (student-marketplace@example.com)",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Unable to geocode location." }, { status: 502 });
  }

  const data = await response.json();
  const first = Array.isArray(data) ? data[0] : null;

  if (!first) {
    return NextResponse.json({ error: "No match found for that location." }, { status: 404 });
  }

  return NextResponse.json({
    lat: Number(first.lat),
    lon: Number(first.lon),
    displayName: first.display_name,
  });
}
