import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// On Vercel the filesystem is read-only except /tmp. Use /tmp so the app runs;
// data there is ephemeral (lost between invocations/cold starts). For production
// persistence use Vercel Postgres, Turso, or another serverless-friendly DB.
const isReadOnlyFS =
  process.env.VERCEL === "1" || process.cwd() === "/var/task";
const dbDir = isReadOnlyFS ? "/tmp" : path.join(process.cwd(), "data");
const dbFile = path.join(dbDir, "recordings.db");

if (!isReadOnlyFS && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbFile);

db.exec(`
  CREATE TABLE IF NOT EXISTS recordings (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    uploadedAt TEXT NOT NULL
  )
`);
