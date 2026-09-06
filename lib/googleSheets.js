import { google } from "googleapis";

const SPREADSHEET_ID =
  process.env.GOOGLE_SPREADSHEET_ID;

const SERVICE_ACCOUNT_JSON =
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

let cachedSquishyProducts = null;

async function getAllSquishyProducts() {
  if (cachedSquishyProducts) {
    return cachedSquishyProducts;
  }

  if (!SPREADSHEET_ID) {
    throw new Error(
      "GOOGLE_SPREADSHEET_ID mangler i Environment Variables."
    );
  }

  if (!SERVICE_ACCOUNT_JSON) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON mangler i Environment Variables."
    );
  }

  let credentials;

  try {
    credentials =
      JSON.parse(
        SERVICE_ACCOUNT_JSON
      );
  } catch {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON er ikke gyldig JSON."
    );
  }

  const auth =
    new google.auth.GoogleAuth({
      credentials,

      scopes: [
        "https://www.googleapis.com/auth/spreadsheets.readonly"
      ]
    });

  const sheets =
    google.sheets({
      version: "v4",
      auth
    });

  const spreadsheet =
    await sheets.spreadsheets.get({
      spreadsheetId:
        SPREADSHEET_ID
    });

  const firstSheet =
    spreadsheet.data.sheets?.[0];

  if (!firstSheet) {
    throw new Error(
      "Google Sheet indeholder ingen faner."
    );
  }

  const sheetTitle =
    firstSheet.properties?.title;

  if (!sheetTitle) {
    throw new Error(
      "Kunne ikke finde navnet på den første fane."
    );
  }

  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId:
        SPREADSHEET_ID,

      range:
        `'${sheetTitle}'!A:L`
    });

  const rows =
    response.data.values || [];

  if (rows.length < 2) {
    return [];
  }

  const headers =
    rows[0];

  const products =
    rows
      .slice(1)
      .map(
        (row) => {
          const product = {};

          headers.forEach(
            (
              header,
              index
            ) => {
              product[header] =
                row[index] || "";
            }
          );

          return product;
        }
      );

  const activeSquishyProducts =
    products.filter(
      (product) => {

        const isActive =
          product["Active"]
            ?.trim()
            .toUpperCase() ===
          "YES";

        const isSquishy =
          product["Category"]
            ?.trim()
            .toLowerCase() ===
          "squishy";

        return (
          isActive &&
          isSquishy
        );
      }
    );

  cachedSquishyProducts =
    activeSquishyProducts;

  return cachedSquishyProducts;
}

export async function getProducts(
  count = 9,
  excludedCodes = []
) {
  const products =
    await getAllSquishyProducts();

  const excludedSet =
    new Set(
      excludedCodes
    );

  const availableProducts =
    products.filter(
      (product) =>
        !excludedSet.has(
          product["Product Code"]
        )
    );

  if (
    availableProducts.length <
    count
  ) {
    throw new Error(
      `Der er ikke nok unikke aktive Squishy produkter. Der skal bruges ${count}, men der er kun ${availableProducts.length} tilgængelige.`
    );
  }

  const shuffledProducts =
    [...availableProducts].sort(
      () =>
        Math.random() -
        0.5
    );

  return shuffledProducts.slice(
    0,
    count
  );
}
