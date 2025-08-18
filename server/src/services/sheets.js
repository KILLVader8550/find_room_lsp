import {env} from "../config/env.js";
import {google} from "googleapis";
import { ToObject } from "../utils/ToObject.js";
import fs from "node:fs/promises";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

const valueToStatus = (v) => {
    if (typeof v === "boolean") return v ? "Available" : "Occupied";
    const s = String(v ?? "").trim().toLowerCase();
    if (s === "true" || s === "available" || s === "1" || s === "yes") return "Available";
    if (s === "false" || s === "occupied" || s === "0" || s === "no") return "Occupied";
    return "Occupied";
}

async function getSheetsClient() {
    const raw = await fs.readFile(env.GOOGLE_CREDENTIALS_PATH, "utf8");
    const sa = JSON.parse(raw);
    const auth = new google.auth.JWT({
        email: sa.client_email,
        key: sa.private_key,
        scopes: SCOPES,
    });
    await auth.authorize();
    return google.sheets({ version: "v4", auth });
}

export async function fetchSheets(){
    const sheets = await getSheetsClient();
    const { data } = await sheets.spreadsheets.values.get({
        spreadsheetId: env.SPREADSHEET_ID,
        range: env.RANGE_SHEET,
    });
    return data.values ?? [];
}


export async function getRooms(day, period){
    const rows = ToObject(await fetchSheets());
    const rooms = rows.filter(r => 
        String(r.Period) === String(period) && 
        String(r.Day).toLowerCase().startsWith(String(day).toLowerCase())    
    );
    
    return rooms.map(r => ({
        roomId: String(r.Room_ID ||"").trim().replace(/\s+/g, "-"),
        floor: String(r.Floor || "").trim(),
        status: valueToStatus(r.Status),
    }));
}

