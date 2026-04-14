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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id int PRIMARY KEY DEFAULT 1,
      site_name text,
      logo_url text,
      address text,
      email text,
      phone text,
      whatsapp text,
      facebook_url text,
      instagram_url text,
      twitter_url text,
      updated_at timestamptz DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      role text,
      content text NOT NULL,
      rating int DEFAULT 5,
      avatar_url text,
      is_active boolean DEFAULT true,
      created_at timestamptz DEFAULT now()
    );

    INSERT INTO site_settings (id, site_name) 
    VALUES (1, 'Tour & Travel') 
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log("Migration complete.");
  process.exit(0);
}
main();
