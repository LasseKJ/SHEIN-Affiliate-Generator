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

  if (!templateSize.width || !templateSize.height) {
    throw new Error("Kunne ikke finde størrelsen på cover templaten.");
  }

  const productSize = Math.round(templateSize.width * 0.34);

  const product1 = await prepareProductImage(
    products[0]["Product Image URL"],
    productSize,
    productSize
  );

  const product2 = await prepareProductImage(
    products[1]["Product Image URL"],
    productSize,
    productSize
  );

  const product3 = await prepareProductImage(
    products[2]["Product Image URL"],
    productSize,
    productSize
  );

  return sharp({
    create: {
      width: templateSize.width,
      height: templateSize.height,
      channels: 4,
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 1
      }
    }
  })
    .composite([
      {
        input: product1,
        left: Math.round(templateSize.width * 0.03),
        top: Math.round(templateSize.height * 0.42)
      },
      {
        input: product2,
        left: Math.round(templateSize.width * 0.63),
        top: Math.round(templateSize.height * 0.42)
      },
      {
        input: product3,
        left: Math.round(templateSize.width * 0.31),
        top: Math.round(templateSize.height * 0.65)
      },
      {
        input: templateBuffer,
        left: 0,
        top: 0
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

  if (!templateSize.width || !templateSize.height) {
    throw new Error("Kunne ikke finde størrelsen på image templaten.");
  }

  const productWidth = Math.round(templateSize.width * 0.36);
  const productHeight = Math.round(templateSize.height * 0.23);

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

  return sharp({
    create: {
      width: templateSize.width,
      height: templateSize.height,
      channels: 4,
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 1
      }
    }
  })
    .composite([
      {
        input: product1,
        left: Math.round(templateSize.width * 0.055),
        top: Math.round(templateSize.height * 0.025)
      },
      {
        input: product2,
        left: Math.round(templateSize.width * 0.055),
        top: Math.round(templateSize.height * 0.315)
      },
      {
        input: product3,
        left: Math.round(templateSize.width * 0.055),
        top: Math.round(templateSize.height * 0.605)
      },
      {
        input: templateBuffer,
        left: 0,
        top: 0
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
