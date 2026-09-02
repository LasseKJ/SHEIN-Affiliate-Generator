import { NextResponse } from "next/server";
import { getProducts } from "../../../lib/googleSheets";
import { getTemplateSet } from "../../../lib/templates";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await getProducts();

    const templates = getTemplateSet(products);

    return NextResponse.json({
      success: true,
      products,
      templates
    });
  } catch (error) {
    console.error("Generation setup error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Kunne ikke hente produkter eller oprette templates."
      },
      {
        status: 500
      }
    );
  }
}
