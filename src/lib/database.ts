import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data");

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

const dbFile = path.join(dbPath, "recordings.db");

export const db = new Database(dbFile);

db.exec(`
  CREATE TABLE IF NOT EXISTS recordings (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    uploadedAt TEXT NOT NULL
  )
`);
