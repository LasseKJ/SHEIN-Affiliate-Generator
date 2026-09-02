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
      position: "center",
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 0
      }
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

  const product1 = await prepareProductImage(
    products[0]["Product Image URL"],
    430,
    430
  );

  const product2 = await prepareProductImage(
    products[1]["Product Image URL"],
    430,
    430
  );

  const product3 = await prepareProductImage(
    products[2]["Product Image URL"],
    430,
    430
  );

  return sharp({
    create: {
      width: 1024,
      height: 1536,
      channels: 4,
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 0
      }
    }
  })
    .composite([
      {
        input: product1,
        left: 30,
        top: 650
      },
      {
        input: product2,
        left: 535,
        top: 650
      },
      {
        input: product3,
        left: 297,
        top: 990
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

  const product1 = await prepareProductImage(
    products[0]["Product Image URL"],
    350,
    400
  );

  const product2 = await prepareProductImage(
    products[1]["Product Image URL"],
    350,
    400
  );

  const product3 = await prepareProductImage(
    products[2]["Product Image URL"],
    350,
    400
  );

  return sharp({
    create: {
      width: 864,
      height: 1536,
      channels: 4,
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 0
      }
    }
  })
    .composite([
      {
        input: product1,
        left: 50,
        top: 40
      },
      {
        input: product2,
        left: 50,
        top: 515
      },
      {
        input: product3,
        left: 50,
        top: 1000
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
