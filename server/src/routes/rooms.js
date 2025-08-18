import {Router} from "express";
import { getRooms } from "../services/sheets.js";

export const ListRoom = Router();

function CurrentTime(date){
    const tz = "Asia/Bangkok";
    const hh = Number(new Intl.DateTimeFormat("en-US", { hour: "2-digit", hour12: false, timeZone: tz }).format(date));
    const mm = Number(new Intl.DateTimeFormat("en-US", { minute: "2-digit", timeZone: tz }).format(date));
    const mins = hh*60 + mm;

    const periods = [
        [1, "08:35", "09:20"],
        [2, "09:25", "10:10"],
        [3, "10:30", "11:15"],
        [4, "11:20", "12:05"],
        [5, "12:10", "12:55"],
        [6, "13:00", "13:45"],
        [7, "13:50", "14:35"],
        [8, "14:45", "15:30"],
        [9, "15:35", "16:20"],
    ];

    const toMin = t => {
        const [H, M] = t.split(":").map(Number);
        return H * 60 + M;
    };

    const time = periods.find(([_p,s,e]) => toMin(s) <= mins && mins <= toMin(e)) || periods[0];
    const map = { mon: "mon", tue: "tue", wed: "wed", thu: "thu", fri: "fri", sat: "sat", sun: "sun" };
    const day = map[weekdayShort] || "mon";

    return {day, period: String(time[0])};
}


ListRoom.get("/rooms", async (req,res) => {
    try{
        let {day, period} = req.query;
        if(!day || !period) ({day, period} = CurrentTime(now)); // why new Date()
        const list = await(getRooms(day,period));
        res.status(200).json({day, period, list});
    }
    catch(e){
        console.error(e);
        res.status(500).json({error: "internal error"});
    }
})
