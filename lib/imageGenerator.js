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

async function getImageSize(buffer) {
  const metadata = await sharp(buffer).metadata();

  return {
    width: metadata.width || 0,
    height: metadata.height || 0
  };
}

async function createCanvas(width, height) {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 1
      }
    }
  });
}

async function createCover(products) {
  const templateUrl = process.env.TEMPLATE_COVER_URL;

  if (!templateUrl) {
    throw new Error("TEMPLATE_COVER_URL mangler.");
  }

  const templateBuffer = await downloadImage(templateUrl);

  const product1 = await prepareProductImage(
    products[0]["Product Image URL"],
    360,
    360
  );

  const product2 = await prepareProductImage(
    products[1]["Product Image URL"],
    360,
    360
  );

  const product3 = await prepareProductImage(
    products[2]["Product Image URL"],
    360,
    360
  );

  const canvas = await createCanvas(1024, 1536);

  const templateSize = await getImageSize(templateBuffer);

  if (
    templateSize.width !== 1024 ||
    templateSize.height !== 1536
  ) {
    throw new Error(
      `Cover template har størrelsen ${templateSize.width}x${templateSize.height}, men forventede 1024x1536.`
    );
  }

  return canvas
    .composite([
      {
        input: product1,
        left: 40,
        top: 650
      },
      {
        input: product2,
        left: 624,
        top: 650
      },
      {
        input: product3,
        left: 332,
        top: 1030
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

  if (
    templateSize.width !== 864 ||
    templateSize.height !== 1536
  ) {
    throw new Error(
      `Image template har størrelsen ${templateSize.width}x${templateSize.height}, men forventede 864x1536.`
    );
  }

  const product1 = await prepareProductImage(
    products[0]["Product Image URL"],
    330,
    380
  );

  const product2 = await prepareProductImage(
    products[1]["Product Image URL"],
    330,
    380
  );

  const product3 = await prepareProductImage(
    products[2]["Product Image URL"],
    330,
    380
  );

  const canvas = await createCanvas(864, 1536);

  return canvas
    .composite([
      {
        input: product1,
        left: 55,
        top: 50
      },
      {
        input: product2,
        left: 55,
        top: 530
      },
      {
        input: product3,
        left: 55,
        top: 1010
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
