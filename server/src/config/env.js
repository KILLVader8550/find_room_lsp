import "dotenv/config";

const required = ["GOOGLE_CREDENTIALS_PATH", "SPREADSHEET_ID", "RANGE_SHEET", "ALLOWED_ORIGIN"];
required.forEach(k => {
    if(!process.env[k]) throw new Error(`Missing ${k}`);
});

export const env = process.env;