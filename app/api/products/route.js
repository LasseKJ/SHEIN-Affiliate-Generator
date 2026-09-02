
import { NextResponse } from "next/server";
import { getProducts } from "../../../lib/googleSheets";

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json({
      success: true,
      products
    });
  } catch (error) {
    console.error("Google Sheets error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Kunne ikke hente produkter fra Google Sheet."
      },
      {
        status: 500
      }
    );
  }
}
