const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://touruser:tourpassword@localhost:5435/tourdb",
  });

  try {
    console.log("Migrating packages table...");
    await pool.query('ALTER TABLE packages ADD COLUMN IF NOT EXISTS price_infant INTEGER DEFAULT 0;');
    console.log("Migrating bookings table...");
    await pool.query('ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pax_infant INTEGER DEFAULT 0;');
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrate();
