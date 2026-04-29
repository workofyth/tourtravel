"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import crypto from "crypto";

// const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/gallery");

export async function createGalleryItem(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const image = formData.get("image") as File;
    const sort_order = Number(formData.get("sort_order") || 0);

    if (!image) {
      return { success: false, message: "Image is required" };
    }

    const { url } = await put(`gallery/${crypto.randomUUID()}-${image.name}`, image, {
      access: 'public',
    });

    const client = await pool.connect();
    try {
      try {
        await client.query(
          "INSERT INTO galleries (title, image_url, sort_order) VALUES ($1, $2, $3)",
          [title || null, url, sort_order]
        );
      } catch (err: any) {
        // If table doesn't exist, create it and retry
        if (err.code === "42P01") {
          console.log("Auto-creating galleries table...");
          await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
          await client.query(`
            CREATE TABLE IF NOT EXISTS galleries (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              title VARCHAR(255),
              image_url TEXT NOT NULL,
              sort_order INTEGER DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
          `);
          // Retry the insert
          await client.query(
            "INSERT INTO galleries (title, image_url, sort_order) VALUES ($1, $2, $3)",
            [title || null, url, sort_order]
          );
        } else {
          throw err;
        }
      }
    } finally {
      client.release();
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true, message: "Gallery item added successfully" };
  } catch (error) {
    console.error("Error adding gallery item:", error);
    return { success: false, message: "Failed to add gallery item" };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    const client = await pool.connect();
    try {
      // Note: We don't delete from Vercel Blob here for simplicity, 
      // but you could use head() and del() if you have the URL.

      await client.query("DELETE FROM galleries WHERE id = $1", [id]);
    } finally {
      client.release();
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true, message: "Gallery item deleted successfully" };
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return { success: false, message: "Failed to delete gallery item" };
  }
}
