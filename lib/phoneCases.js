import {
  getClothingProduct
} from "./googleSheetsClothing";

const ALLOWED_VIDEO_COUNTS = [
  1,
  2,
  4,
  8
];

const CASES_PER_VIDEO = 16;

async function getUniquePhoneCases() {
  const products = [];

  const usedCodes =
    new Set();

  const maxAttempts =
    150;

  for (
    let attempt = 0;
    attempt < maxAttempts &&
    products.length <
      CASES_PER_VIDEO;
    attempt++
  ) {
    const product =
      await getClothingProduct(
        "PhoneCase"
      );

    if (!product?.code) {
      continue;
    }

    if (
      usedCodes.has(
        product.code
      )
    ) {
      continue;
    }

    usedCodes.add(
      product.code
    );

    products.push(
      product
    );
  }

  if (
    products.length !==
    CASES_PER_VIDEO
  ) {
    throw new Error(
      `Kunne ikke finde ${CASES_PER_VIDEO} forskellige aktive PhoneCase produkter. Der skal være mindst ${CASES_PER_VIDEO} aktive PhoneCase produkter i Google Sheet.`
    );
  }

  return products;
}

export async function generatePhoneCaseVideos(
  videoCount = 1
) {
  const count =
    Number(videoCount);

  if (
    !ALLOWED_VIDEO_COUNTS.includes(
      count
    )
  ) {
    throw new Error(
      "Antallet af videoer skal være 1, 2, 4 eller 8."
    );
  }

  const videos = [];

  for (
    let videoIndex = 0;
    videoIndex < count;
    videoIndex++
  ) {
    const cases =
      await getUniquePhoneCases();

    const slides = [];

    for (
      let slideIndex = 0;
      slideIndex < 4;
      slideIndex++
    ) {
      const start =
        slideIndex * 4;

      slides.push(
        cases.slice(
          start,
          start + 4
        )
      );
    }

    videos.push({
      videoNumber:
        videoIndex + 1,

      cases,

      slides
    });
  }

  return videos;
}