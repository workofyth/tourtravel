import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      console.log("Ensuring pgcrypto extension exists...");
      await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

      console.log("Creating galleries table via API...");
      await client.query(`
        CREATE TABLE IF NOT EXISTS galleries (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255),
          image_url TEXT NOT NULL,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } finally {
      client.release();
    }
    return NextResponse.json({ 
      success: true, 
      message: "Tabel 'galleries' berhasil dibuat! Anda sekarang bisa menghapus file ini." 
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Gagal membuat tabel: " + (error as Error).message 
    }, { status: 500 });
  }
}
