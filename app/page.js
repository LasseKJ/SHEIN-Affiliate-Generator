import { NextResponse } from "next/server";
import { getProducts } from "../../../lib/googleSheets";
import { generateImages } from "../../../lib/imageGenerator";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  try {
    const products = await getProducts();

    if (!products || products.length !== 9) {
      throw new Error("Der blev ikke valgt præcis 9 produkter.");
    }

    const images = await generateImages(products);

    return new NextResponse(
      JSON.stringify({
        success: true,
        products,
        images: {
          cover: images.cover.toString("base64"),
          image1: images.image1.toString("base64"),
          image2: images.image2.toString("base64"),
          image3: images.image3.toString("base64")
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Image generation error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Kunne ikke generere billeder."
      },
      {
        status: 500
      }
    );
  }
}
