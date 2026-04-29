"use server";

import { put } from "@vercel/blob";
import { pool } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function migrateImagesToBlob() {
  const tables = [
    { name: "packages", column: "cover_image", folder: "packages" },
    { name: "package_images", column: "image_url", folder: "packages" },
    { name: "galleries", column: "image_url", folder: "gallery" },
    { name: "testimonials", column: "avatar_url", folder: "testimonials" },
    { name: "site_settings", column: "logo_url", folder: "settings" },
    { name: "transportations", column: "image_url", folder: "transportations" },
    { name: "categories", column: "image_url", folder: "destinations" },
  ];

  let totalMigrated = 0;
  let totalErrors = 0;
  let logs: string[] = [];

  for (const table of tables) {
    try {
      const { rows } = await pool.query(`SELECT id, ${table.column} FROM ${table.name}`);
      
      for (const row of rows) {
        let fileName = row[table.column];
        if (!fileName) continue;

        // Skip if already a URL
        if (fileName.startsWith("http")) continue;

        // Handle cases where the path might include the prefix
        // e.g. "/uploads/testimonials/image.jpg" -> "image.jpg"
        const cleanFileName = fileName.split("/").pop();
        if (!cleanFileName) continue;

        const filePath = path.join(process.cwd(), "public", "uploads", table.folder, cleanFileName);
        
        try {
          const fileBuffer = await fs.readFile(filePath);
          const { url } = await put(`${table.folder}/${cleanFileName}`, fileBuffer, {
            access: "public",
          });
          
          await pool.query(`UPDATE ${table.name} SET ${table.column} = $1 WHERE id = $2`, [url, row.id]);
          totalMigrated++;
          logs.push(`✅ Migrated ${table.name}.${table.column}: ${cleanFileName} -> ${url}`);
        } catch (err: any) {
          totalErrors++;
          logs.push(`❌ Failed to migrate ${table.name}.${table.column} (${cleanFileName}): ${err.message}`);
        }
      }
    } catch (err: any) {
      // Table might not exist yet
      if (err.code === "42P01") {
        logs.push(`ℹ️ Table ${table.name} does not exist, skipping.`);
      } else {
        logs.push(`❌ Error accessing table ${table.name}: ${err.message}`);
      }
    }
  }
  
  return { 
    success: true, 
    message: `Migration completed: ${totalMigrated} success, ${totalErrors} errors.`,
    logs 
  };
}
