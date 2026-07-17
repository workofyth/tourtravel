import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  await pool.query('ALTER TABLE packages DROP COLUMN IF EXISTS price');
  await pool.query('ALTER TABLE packages DROP COLUMN IF EXISTS duration_days');
  console.log('OK: price and duration_days dropped');
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
