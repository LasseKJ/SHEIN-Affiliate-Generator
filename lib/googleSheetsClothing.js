import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

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
  "ShortDresses",
  "Sweaters",
  "PhoneCase",
  "Essentials-Makeup",
  "Essentials-Cases",
  "Essentials-MakeupStorage",
  "Essentials-Hair",
  "Essentials-HomeDecor",
  "Essentials-VanityExtras",
  "Essentials-Kitchen",
  "Essentials-Bath",
  "Essentials-GiftBoxes"
];

const CACHE_TTL_MS = 30 * 1000;
let cachedProducts = null;
let cacheExpiresAt = 0;
let productsPromise = null;

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

async function fetchAllClothingProducts() {
  if (!SPREADSHEET_ID) throw new Error("GOOGLE_SPREADSHEET_ID mangler i Environment Variables.");
  if (!SERVICE_ACCOUNT_JSON) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON mangler i Environment Variables.");

  let credentials;
  try {
    credentials = JSON.parse(SERVICE_ACCOUNT_JSON);
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON er ikke gyldig JSON.");
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Read metadata and values once per cache refresh, not once per selected product.
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const firstSheet = spreadsheet.data.sheets?.[0];
  if (!firstSheet) throw new Error("Google Sheet indeholder ingen faner.");

  const sheetTitle = firstSheet.properties?.title;
  if (!sheetTitle) throw new Error("Kunne ikke finde navnet på den første fane.");

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetTitle}'!A:L`
  });

  const rows = response.data.values || [];
  if (rows.length < 2) throw new Error("Google Sheet indeholder ingen produkter.");

  const headers = rows[0];

  return rows.slice(1).map((row) => {
    const product = {};
    headers.forEach((header, index) => {
      product[String(header || "").trim()] = row[index] || "";
    });
    return product;
  }).filter((product) => {
    const category = String(product["Category"] || "").replace(/<br\s*\/?>/gi, "").trim();
    const active = String(product["Active"] || "").trim().toUpperCase() === "YES";
    const isEssentials = category.toLowerCase().startsWith("essentials-");
    return active || isEssentials;
  }).map((product) => ({
    id: product["Product ID"] || "",
    name: product["Product Name"] || "",
    category: String(product["Category"] || "").replace(/<br\s*\/?>/gi, "").trim(),
    code: product["Product Code"] || "",
    imageUrl: product["Product Image URL"] || "",
    price: product["Price"] || "",
    currency: product["Currency"] || "",
    active: product["Active"] || ""
  }));
}

async function getAllClothingProducts() {
  const now = Date.now();

  if (cachedProducts && now < cacheExpiresAt) {
    return cachedProducts;
  }

  // If several product selections happen at the same time, they all share
  // the same Sheet request instead of each consuming Google API quota.
  if (!productsPromise) {
    productsPromise = fetchAllClothingProducts()
      .then((products) => {
        cachedProducts = products;
        cacheExpiresAt = Date.now() + CACHE_TTL_MS;
        return products;
      })
      .finally(() => {
        productsPromise = null;
      });
  }

  return productsPromise;
}

export async function getClothingProduct(selectedCategory) {
  if (!selectedCategory) throw new Error("Der blev ikke valgt en clothing kategori.");

  const normalizedSelectedCategory = String(selectedCategory).trim().toLowerCase();
  const allowedCategory = CLOTHING_CATEGORIES.find(
    (category) => category.toLowerCase() === normalizedSelectedCategory
  );

  if (!allowedCategory) throw new Error(`Ugyldig clothing kategori: ${selectedCategory}`);

  const products = await getAllClothingProducts();
  const matchingProducts = products.filter(
    (product) => String(product.category || "").trim().toLowerCase() === allowedCategory.toLowerCase()
  );

  if (matchingProducts.length === 0) {
    throw new Error(`Der blev ikke fundet aktive produkter i kategorien ${allowedCategory}.`);
  }

  return shuffle(matchingProducts)[0];
}
