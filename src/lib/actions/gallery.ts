"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import crypto from "crypto";

export async function createGalleryItem(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const title_en = formData.get("title_en") as string || null;
    const title_es = formData.get("title_es") as string || null;
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
          "INSERT INTO galleries (title, title_en, title_es, image_url, sort_order) VALUES ($1, $2, $3, $4, $5)",
          [title || null, title_en, title_es, url, sort_order]
        );
      } catch (err: any) {
        if (err.code === "42P01") {
          console.log("Auto-creating galleries table...");
          await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
          await client.query(`
            CREATE TABLE IF NOT EXISTS galleries (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              title VARCHAR(255),
              title_en VARCHAR(255),
              title_es VARCHAR(255),
              image_url TEXT NOT NULL,
              sort_order INTEGER DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
          `);
          await client.query(
            "INSERT INTO galleries (title, title_en, title_es, image_url, sort_order) VALUES ($1, $2, $3, $4, $5)",
            [title || null, title_en, title_es, url, sort_order]
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
