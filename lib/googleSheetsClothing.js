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
      "Der blev ikke valgt en tøjkategori."
    );
  }

  const normalizedCategory =
    selectedCategory
      .trim()
      .toLowerCase();

  const allowedCategory =
    CLOTHING_CATEGORIES.find(
      (category) =>
        category.toLowerCase() ===
        normalizedCategory
    );

  if (!allowedCategory) {
    throw new Error(
      "Den valgte tøjkategori er ikke gyldig."
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
      .map((row) => {
        const product = {};

        headers.forEach(
          (header, index) => {
            product[header] =
              row[index] || "";
          }
        );

        return product;
      });

  const activeClothingProducts =
    products.filter(
      (product) => {
        const isActive =
          product["Active"]
            ?.trim()
            .toUpperCase() ===
          "YES";

        const category =
          product["Category"]
            ?.trim()
            .toLowerCase();

        const isSelectedCategory =
          category ===
          allowedCategory.toLowerCase();

        return (
          isActive &&
          isSelectedCategory
        );
      }
    );

  if (
    activeClothingProducts.length === 0
  ) {
    throw new Error(
      `Der er ingen aktive produkter i kategorien ${allowedCategory}.`
    );
  }

  const shuffledProducts =
    [...activeClothingProducts].sort(
      () =>
        Math.random() - 0.5
    );

  return shuffledProducts[0];
}
