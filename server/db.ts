import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

// Configure Neon to use WebSocket
neonConfig.webSocketConstructor = ws;

// Ensure the DATABASE_URL is provided only if we need database features
// This project primarily uses Firebase, so PostgreSQL is optional
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set. PostgreSQL features will be unavailable. Using in-memory storage instead.");
}

// Create a database pool and Drizzle instance only if DATABASE_URL is available
export const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;
export const db = pool ? drizzle({ client: pool, schema }) : null;
