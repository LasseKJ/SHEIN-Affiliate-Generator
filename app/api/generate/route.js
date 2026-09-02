import { NextResponse } from "next/server";
import { getProducts } from "../../../lib/googleSheets";
import { createPromptSet } from "../../../lib/promptTemplate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  try {
    const products = await getProducts();

    if (!products || products.length !== 9) {
      throw new Error("Der blev ikke valgt præcis 9 produkter.");
    }

    const prompts = createPromptSet(products);

    const groups = [
      products.slice(0, 3),
      products.slice(3, 6),
      products.slice(6, 9)
    ];

    return NextResponse.json({
      success: true,

      groups: groups.map((group, index) => ({
        number: index + 1,

        prompt: prompts[index],

        products: group.map((product) => ({
          id: product["Product ID"],
          name: product["Product Name"],
          code: product["Product Code"],
          price: product["Price"],
          currency: product["Currency"],
          imageUrl: product["Product Image URL"]
        }))
      }))
    });
  } catch (error) {
    console.error("Generate error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Kunne ikke generere produkter og prompts."
      },
      {
        status: 500
      }
    );
  }
}
