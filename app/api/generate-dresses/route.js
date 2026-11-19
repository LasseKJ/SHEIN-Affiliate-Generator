import { NextResponse } from "next/server";
import { getDressProducts } from "../../../lib/googleSheetsClothing";
import { generateDressImage } from "../../../lib/dressImage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 180;

export async function GET() {
  try {
    return NextResponse.json({ products: await getDressProducts() });
  } catch (error) {
    console.error("Dress product lookup failed:", error);
    return NextResponse.json({ error: "Kunne ikke hente kjoler fra Google Sheets." }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!code) {
    return NextResponse.json({ error: "Vælg en kjolekode." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY mangler på serveren." }, { status: 503 });
  }

  try {
    const dress = (await getDressProducts()).find((product) => product.code === code);
    if (!dress) {
      return NextResponse.json({ error: "Kjolekoden findes ikke længere i Google Sheets." }, { status: 404 });
    }
    const image = await generateDressImage(dress, apiKey);
    return new Response(new Uint8Array(image), {
      headers: { "Content-Type": "image/webp", "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("Dress image generation failed:", error);
    return NextResponse.json({ error: "Kunne ikke generere kjolebilledet. Prøv igen." }, { status: 502 });
  }
}
