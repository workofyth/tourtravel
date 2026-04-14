const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://touruser:tourpassword@localhost:5435/tourdb",
  });

  try {
    console.log("Creating galleries table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS galleries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255),
        image_url TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    const end = pool.end();
    return end;
  }
}

migrate();
