import { NextResponse } from "next/server";
import { getDressProducts } from "../../../lib/googleSheetsClothing";
import { DRESS_VIDEO_COUNTS, generateDressVideos } from "../../../lib/dressPrompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const videoCount = body?.videoCount;
  if (!DRESS_VIDEO_COUNTS.includes(videoCount)) {
    return NextResponse.json({ error: "Vælg mellem 1 og 50 videoer." }, { status: 400 });
  }

  try {
    const products = await getDressProducts();
    return NextResponse.json({ videos: generateDressVideos(products, videoCount) });
  } catch (error) {
    console.error("Dress prompt generation failed:", error);
    return NextResponse.json({ error: error.message || "Kunne ikke hente kjoler fra Google Sheets." }, { status: 500 });
  }
}
