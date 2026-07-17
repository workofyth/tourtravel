import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config({ path: '.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const sql = readFileSync('db/migrate_i18n.sql', 'utf8');
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    try {
      await pool.query(stmt);
      console.log(`OK: ${stmt.slice(0, 80)}...`);
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`SKIP (already exists): ${stmt.slice(0, 60)}...`);
      } else {
        console.error(`ERROR: ${err.message}`);
      }
    }
  }

  console.log('\nMigrasi selesai.');
  await pool.end();
}

main().catch((err) => {
  console.error('Gagal:', err);
  process.exit(1);
});
