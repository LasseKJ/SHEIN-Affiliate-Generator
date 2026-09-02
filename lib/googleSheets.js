import { google } from "googleapis";

const SPREADSHEET_ID = "1d-44O5Wp0CfwRyqiptiLIp_EuaQaFtjFq9CPVRkW4Ts";

export async function getProducts() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({
    version: "v4",
    auth
  });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A:L"
  });

  const rows = response.data.values || [];

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0];

  return rows.slice(1).map((row) => {
    const product = {};

    headers.forEach((header, index) => {
      product[header] = row[index] || "";
    });

    return product;
  });
}
