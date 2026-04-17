import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log("Starting transportation migration...");
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transportations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        slug text UNIQUE NOT NULL,
        image_url text,
        capacity_pax int DEFAULT 1,
        capacity_luggage int DEFAULT 1,
        price_per_day numeric DEFAULT 0,
        description text,
        is_active boolean DEFAULT true,
        created_at timestamptz DEFAULT now()
      );
    `);
    console.log("Transportation table created successfully.");
  } catch (error) {
    console.error("Error creating transportation table:", error);
  } finally {
    await pool.end();
  }
}

main();
