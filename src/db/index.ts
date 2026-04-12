/** Dual-mode Drizzle DB client — sqlite (local) or neon (hosted) */
import { drizzle as drizzleSQLite } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import Database from "better-sqlite3";
import * as schema from "./schema";

const mode = import.meta.env.VITE_DB_MODE ?? "sqlite";

function createDb() {
  if (mode === "neon") {
    const url = import.meta.env.VITE_DATABASE_URL;
    if (!url) throw new Error("VITE_DATABASE_URL is required in neon mode");
    const sql = neon(url);
    return drizzleNeon(sql, { schema });
  }

  const sqlite = new Database("orkestrix.db");
  return drizzleSQLite(sqlite, { schema });
}

export const db = createDb();
