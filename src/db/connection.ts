import Database, { type Database as DatabaseType } from 'better-sqlite3';
import { dirname } from 'path';
import { mkdirSync, existsSync } from 'fs';

const DB_PATH = process.env.DATABASE_PATH || './data/playlist.db';

// Ensure data directory exists
const dbDir = dirname(DB_PATH);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

export const db: DatabaseType = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Configure for better performance
db.pragma('journal_mode = WAL');

export default db;
