// init-db.js
const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function init() {
    try {
        console.log("Menghubungkan ke Neon...");
        const sql = fs.readFileSync(path.join(__dirname, 'db', 'init.sql'), 'utf8');

        console.log("Menentukan schema...");
        // Menambahkan baris ini untuk memastikan schema terpilih
        await pool.query('SET search_path TO public;');

        console.log("Menjalankan init.sql...");
        await pool.query(sql);

        // Tambah tabel categories jika belum ada
        console.log("Mengecek tabel tambahan...");
        await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name text NOT NULL,
          slug text UNIQUE NOT NULL,
          description text,
          image_url text,
          created_at timestamptz DEFAULT now()
      );
      INSERT INTO categories (name, slug) VALUES 
      ('Daytrip', 'daytrip'), ('Staycation', 'staycation'), ('Transportation', 'transportation')
      ON CONFLICT (slug) DO NOTHING;
    `);

        console.log("✅ Database berhasil diinisialisasi!");
    } catch (err) {
        console.error("❌ Gagal inisialisasi database:", err);
    } finally {
        await pool.end();
    }
}

init();
