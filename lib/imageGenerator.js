import sharp from "sharp";

async function downloadImage(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Kunne ikke hente billede. Status: ${response.status}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();

  return Buffer.from(arrayBuffer);
}

async function getImageSize(buffer) {
  const metadata = await sharp(buffer).metadata();

  return {
    width: metadata.width || 0,
    height: metadata.height || 0
  };
}

async function prepareProductImage(url, width, height) {
  const imageBuffer = await downloadImage(url);

  return sharp(imageBuffer)
    .resize(width, height, {
      fit: "contain",
      position: "center"
    })
    .png()
    .toBuffer();
}

async function createCover(products) {
  const templateUrl = process.env.TEMPLATE_COVER_URL;

  if (!templateUrl) {
    throw new Error("TEMPLATE_COVER_URL mangler.");
  }

  const templateBuffer = await downloadImage(templateUrl);
  const templateSize = await getImageSize(templateBuffer);

  const product1 = await prepareProductImage(
    products[0]["Product Image URL"],
    350,
    350
  );

  const product2 = await prepareProductImage(
    products[1]["Product Image URL"],
    350,
    350
  );

  const product3 = await prepareProductImage(
    products[2]["Product Image URL"],
    350,
    350
  );

  return sharp(templateBuffer)
    .composite([
      {
        input: product1,
        left: 25,
        top: 650
      },
      {
        input: product2,
        left: templateSize.width - 375,
        top: 650
      },
      {
        input: product3,
        left: Math.round((templateSize.width - 350) / 2),
        top: 980
      }
    ])
    .png()
    .toBuffer();
}

async function createProductImage(products) {
  const templateUrl = process.env.TEMPLATE_IMAGE_URL;

  if (!templateUrl) {
    throw new Error("TEMPLATE_IMAGE_URL mangler.");
  }

  const templateBuffer = await downloadImage(templateUrl);
  const templateSize = await getImageSize(templateBuffer);

  const productWidth = Math.round(templateSize.width * 0.34);
  const productHeight = Math.round(templateSize.height * 0.19);

  const product1 = await prepareProductImage(
    products[0]["Product Image URL"],
    productWidth,
    productHeight
  );

  const product2 = await prepareProductImage(
    products[1]["Product Image URL"],
    productWidth,
    productHeight
  );

  const product3 = await prepareProductImage(
    products[2]["Product Image URL"],
    productWidth,
    productHeight
  );

  const leftPosition = Math.round(
    templateSize.width * 0.065
  );

  return sharp(templateBuffer)
    .composite([
      {
        input: product1,
        left: leftPosition,
        top: Math.round(templateSize.height * 0.055)
      },
      {
        input: product2,
        left: leftPosition,
        top: Math.round(templateSize.height * 0.345)
      },
      {
        input: product3,
        left: leftPosition,
        top: Math.round(templateSize.height * 0.635)
      }
    ])
    .png()
    .toBuffer();
}

export async function generateImages(products) {
  if (!products || products.length !== 9) {
    throw new Error("Der skal bruges præcis 9 produkter.");
  }

  const cover = await createCover(products);

  const image1 = await createProductImage(
    products.slice(0, 3)
  );

  const image2 = await createProductImage(
    products.slice(3, 6)
  );

  const image3 = await createProductImage(
    products.slice(6, 9)
  );

  return {
    cover,
    image1,
    image2,
    image3
  };
}
