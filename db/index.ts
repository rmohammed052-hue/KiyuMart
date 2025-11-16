import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool as PgPool } from "pg";
import * as schema from "../shared/schema";
import ws from "ws";

// Use standard pg driver for local PostgreSQL, Neon serverless for production
const isLocalPostgres = process.env.DATABASE_URL?.includes('localhost') || 
                        process.env.DATABASE_URL?.includes('127.0.0.1');

let db;

if (isLocalPostgres) {
  // Local PostgreSQL using standard pg driver
  const pool = new PgPool({
    connectionString: process.env.DATABASE_URL!,
  });
  db = drizzlePg(pool, { schema });
} else {
  // Neon serverless for production
  neonConfig.webSocketConstructor = ws;
  const pool = new NeonPool({
    connectionString: process.env.DATABASE_URL!,
  });
  db = drizzle(pool, { schema });
}

export { db };
