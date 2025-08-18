import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {env} from "./src/config/env.js";
import {ListRoom} from "./src/routes/rooms.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const public_path = path.join(__dirname, "../public");
const client_path = path.join(__dirname, "../client");

app.use(cors({origin: env.ALLOWED_ORIGIN,}));
app.use(express.json());
app.use(express.static(client_path));
app.use(express.static(public_path));
app.use("/public", express.static(public_path));
app.use("/api", ListRoom);
app.get("/", (_req,res) => res.sendFile(path.join(client_path, "index.html")));
app.listen(3000, () => console.log("Server on http://localhost:3000"));
