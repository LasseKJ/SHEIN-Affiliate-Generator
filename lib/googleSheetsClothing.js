import { google } from "googleapis";

const SPREADSHEET_ID =
  process.env.GOOGLE_SPREADSHEET_ID;

const SERVICE_ACCOUNT_JSON =
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

export const CLOTHING_CATEGORIES = [
  "AutumnTop",
  "AutumnBottom",
  "AutumnShoe",
  "AutumnAccessories",

  "WinterTop",
  "WinterBottom",
  "WinterShoe",
  "WinterAccessories",

  "Dresses",
  "LongDresses",
  "ShortDresses"
];

function shuffle(array) {
  return [...array].sort(
    () => Math.random() - 0.5
  );
}

export async function getClothingProduct(
  selectedCategory
) {
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

  if (!selectedCategory) {
    throw new Error(
      "Der blev ikke valgt en clothing kategori."
    );
  }

  const allowedCategory =
    CLOTHING_CATEGORIES.find(
      (category) =>
        category.toLowerCase() ===
        selectedCategory.trim().toLowerCase()
    );

  if (!allowedCategory) {
    throw new Error(
      `Ugyldig clothing kategori: ${selectedCategory}`
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
    throw new Error(
      "Google Sheet indeholder ingen produkter."
    );
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

  const matchingProducts =
    products.filter(
      (product) => {
        const isActive =
          product["Active"]
            ?.trim()
            .toUpperCase() ===
          "YES";

        const isCorrectCategory =
          product["Category"]
            ?.trim()
            .toLowerCase() ===
          allowedCategory.toLowerCase();

        return (
          isActive &&
          isCorrectCategory
        );
      }
    );

  if (
    matchingProducts.length === 0
  ) {
    throw new Error(
      `Der blev ikke fundet aktive produkter i kategorien ${allowedCategory}.`
    );
  }

  const shuffled =
    shuffle(
      matchingProducts
    );

  const product =
    shuffled[0];

  return {
    id:
      product["Product ID"] || "",

    name:
      product["Product Name"] || "",

    category:
      product["Category"] || "",

    code:
      product["Product Code"] || "",

    imageUrl:
      product["Product Image URL"] || "",

    price:
      product["Price"] || "",

    currency:
      product["Currency"] || "",

    active:
      product["Active"] || ""
  };
}
