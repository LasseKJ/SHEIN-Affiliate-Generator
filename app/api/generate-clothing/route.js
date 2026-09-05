import { NextResponse } from "next/server";

import {
  getClothingProduct
} from "../../../lib/googleSheetsClothing";

import {
  createClothingVideoPrompt
} from "../../../lib/clothingVideoPrompt";

export const dynamic =
  "force-dynamic";

export const runtime =
  "nodejs";

export async function POST(
  request
) {
  try {
    const body =
      await request.json();

    const category =
      body?.category;

    if (!category) {
      throw new Error(
        "Der blev ikke valgt en kategori."
      );
    }

    const product =
      await getClothingProduct(
        category
      );

    if (!product) {
      throw new Error(
        "Kunne ikke finde et tøjprodukt."
      );
    }

    const prompt =
      createClothingVideoPrompt(
        product
      );

    return NextResponse.json({
      success: true,

      category,

      product: {
        id:
          product["Product ID"],

        name:
          product["Product Name"],

        code:
          product["Product Code"],

        price:
          product["Price"],

        currency:
          product["Currency"],

        imageUrl:
          product[
            "Product Image URL"
          ]
      },

      prompt
    });

  } catch (error) {
    console.error(
      "Clothing generate error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error.message ||
          "Kunne ikke generere tøjvideo."
      },
      {
        status: 500
      }
    );
  }
}
