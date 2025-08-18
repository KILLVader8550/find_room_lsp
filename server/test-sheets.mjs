import fs from "node:fs/promises";
import { google } from "googleapis";
import process from "node:process";

const SHEET_ID = process.env.SPREADSHEET_ID;
const RANGE = process.env.RANGE_SHEET;
const CREDS = process.env.GOOGLE_CREDENTIALS_PATH;

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

function assert(cond, msg) { if (!cond) { console.error(msg); process.exit(1); } }

(async () => {
  assert(SHEET_ID, "Missing SPREADSHEET_ID");
  assert(RANGE, "Missing RANGE_SHEET");
  assert(CREDS, "Missing GOOGLE_CREDENTIALS_PATH");

  const raw = await fs.readFile(CREDS, "utf8");
  const sa = JSON.parse(raw);
  console.log("project_id:", sa.project_id);
  console.log("client_email:", sa.client_email);
  console.log("key_id:", sa.private_key_id?.slice(0,8));

  assert(sa.type === "service_account", "Key is not a service_account JSON");

  const auth = new google.auth.JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: SCOPES,
  });

  // ensure token is minted
  const tokens = await auth.authorize();
  console.log("access_token len:", tokens.access_token?.length, "expires_in:", Math.round((tokens.expiry_date - Date.now())/1000), "s");

  // verify token info
  const accessToken = tokens.access_token;
  const infoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`);
  const info = await infoRes.json();
  console.log("tokeninfo.scope:", info.scope);
  if (!info.scope?.includes("spreadsheets.readonly")) throw new Error("Scope missing");

  // call Sheets
  const sheets = google.sheets({ version: "v4", auth });
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE,
  });

  console.log("Sheets OK. rows:", data.values?.length ?? 0);
})().catch((err) => {
  console.error("FAIL:", err.response?.data || err.message);
  process.exit(1);
});
