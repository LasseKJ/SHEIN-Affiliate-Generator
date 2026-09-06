import { NextResponse } from "next/server";

import {
  getProducts
} from "../../../lib/googleSheets";

import {
  createPromptSet,
  createCoverPrompt
} from "../../../lib/promptTemplate";

export const dynamic =
  "force-dynamic";

export const runtime =
  "nodejs";

const ALLOWED_VIDEO_COUNTS = [
  1,
  2,
  4,
  8
];

export async function POST(
  request
) {
  try {
    const body =
      await request.json();

    const requestedCount =
      Number(
        body?.videoCount || 1
      );

    if (
      !ALLOWED_VIDEO_COUNTS.includes(
        requestedCount
      )
    ) {
      throw new Error(
        "Antallet af videoer skal være 1, 2, 4 eller 8."
      );
    }

    const videos = [];

    const usedProductCodes =
      [];

    for (
      let videoIndex = 0;
      videoIndex <
      requestedCount;
      videoIndex++
    ) {
      const products =
        await getProducts(
          9,
          usedProductCodes
        );

      if (
        !products ||
        products.length !== 9
      ) {
        throw new Error(
          `Video ${videoIndex + 1} kunne ikke få præcis 9 unikke produkter.`
        );
      }

      products.forEach(
        (product) => {
          const code =
            product[
              "Product Code"
            ];

          if (
            code &&
            !usedProductCodes.includes(
              code
            )
          ) {
            usedProductCodes.push(
              code
            );
          }
        }
      );

      const prompts =
        createPromptSet(
          products
        );

      const coverPrompt =
        createCoverPrompt();

      const groups = [
        products.slice(
          0,
          3
        ),

        products.slice(
          3,
          6
        ),

        products.slice(
          6,
          9
        )
      ];

      videos.push({
        videoNumber:
          videoIndex + 1,

        prompts: [
          prompts[0],
          prompts[1],
          prompts[2],
          coverPrompt
        ],

        groups:
          groups.map(
            (
              group,
              groupIndex
            ) => ({
              number:
                groupIndex + 1,

              prompt:
                prompts[
                  groupIndex
                ],

              products:
                group.map(
                  (product) => ({
                    id:
                      product[
                        "Product ID"
                      ],

                    name:
                      product[
                        "Product Name"
                      ],

                    code:
                      product[
                        "Product Code"
                      ],

                    price:
                      product[
                        "Price"
                      ],

                    currency:
                      product[
                        "Currency"
                      ],

                    imageUrl:
                      product[
                        "Product Image URL"
                      ]
                  })
                )
            })
          ),

        coverPrompt
      });
    }

    const coverTemplateUrl =
      process.env.TEMPLATE_COVER_URL;

    const imageTemplateUrl =
      process.env.TEMPLATE_IMAGE_URL;

    if (
      !coverTemplateUrl
    ) {
      throw new Error(
        "TEMPLATE_COVER_URL mangler i Environment Variables."
      );
    }

    if (
      !imageTemplateUrl
    ) {
      throw new Error(
        "TEMPLATE_IMAGE_URL mangler i Environment Variables."
      );
    }

    return NextResponse.json({
      success: true,

      videoCount:
        videos.length,

      totalPrompts:
        videos.length * 4,

      totalProducts:
        videos.length * 9,

      templates: {
        cover:
          coverTemplateUrl,

        image:
          imageTemplateUrl
      },

      videos
    });

  } catch (error) {
    console.error(
      "Generate error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error?.message ||
          "Kunne ikke generere Squishy videoer."
      },
      {
        status: 500
      }
    );
  }
}
