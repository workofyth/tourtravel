"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import sharp from "sharp";
import { put } from "@vercel/blob";

const packageSchema = z.object({
  category_id: z.string().min(1),
  title: z.string().min(3, "Title must be at least 3 characters"),
  title_en: z.string().optional(),
  title_es: z.string().optional(),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  description_en: z.string().optional(),
  description_es: z.string().optional(),
  is_featured: z.boolean().default(false),
});

async function processImage(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error(`File ${file.name} exceeds 10MB limit`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const resizedBuffer = await sharp(buffer)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .toBuffer();

  const { url } = await put(`packages/${Date.now()}-${file.name.replace(/\s+/g, "-")}`, resizedBuffer, {
    access: 'public',
  });

  return url;
}

export async function createPackage(formData: FormData) {
  try {
    const rawData = {
      category_id: formData.get("category_id"),
      title: formData.get("title"),
      title_en: formData.get("title_en") || null,
      title_es: formData.get("title_es") || null,
      slug: formData.get("slug"),
      description: formData.get("description"),
      description_en: formData.get("description_en") || null,
      description_es: formData.get("description_es") || null,
      is_featured: formData.get("is_featured") === "true",
    };

    const validatedData = packageSchema.parse(rawData);

    const imageFiles = formData.getAll("images") as File[];
    const uploadedFilenames: string[] = [];

    for (const file of imageFiles) {
      if (file.size > 0 && file.name !== 'undefined') {
        const filename = await processImage(file);
        uploadedFilenames.push(filename);
      }
    }

    const coverImage = uploadedFilenames[0] || "default.jpg";

    const result = await pool.query(
      `INSERT INTO packages (category_id, title, title_en, title_es, slug, description, description_en, description_es, cover_image, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        validatedData.category_id,
        validatedData.title,
        validatedData.title_en,
        validatedData.title_es,
        validatedData.slug,
        validatedData.description,
        validatedData.description_en,
        validatedData.description_es,
        coverImage,
        validatedData.is_featured,
      ]
    );

    const packageId = result.rows[0].id;

    for (let i = 0; i < uploadedFilenames.length; i++) {
        await pool.query(
          `INSERT INTO package_images (package_id, image_url, sort_order) VALUES ($1, $2, $3)`,
          [packageId, uploadedFilenames[i], i]
        );
    }

    const itineraries = JSON.parse(formData.get("itineraries") as string || "[]");

    if (itineraries.length > 0) {
      for (const item of itineraries) {
        await pool.query(
          `INSERT INTO itineraries (package_id, day_number, title, title_en, title_es, description, description_en, description_es)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [packageId, item.day_number, item.title, item.title_en || null, item.title_es || null, item.description, item.description_en || null, item.description_es || null]
        );
      }
    }

    revalidatePath("/admin/packages");
    revalidatePath("/packages");
    revalidatePath("/");

    return { success: true, message: "Package added successfully!" };
  } catch (error: any) {
    console.error("Error creating package:", error);
    return { success: false, message: error.message || "Failed to add package" };
  }
}

export async function updatePackage(id: string, formData: FormData) {
  try {
    const rawData = {
      category_id: formData.get("category_id"),
      title: formData.get("title"),
      title_en: formData.get("title_en") || null,
      title_es: formData.get("title_es") || null,
      slug: formData.get("slug"),
      description: formData.get("description"),
      description_en: formData.get("description_en") || null,
      description_es: formData.get("description_es") || null,
      is_featured: formData.get("is_featured") === "true",
    };

    const validatedData = packageSchema.parse(rawData);

    const imageFiles = formData.getAll("images") as File[];
    const newUploadedFilenames: string[] = [];

    for (const file of imageFiles) {
      if (file.size > 0 && file.name !== 'undefined') {
        const filename = await processImage(file);
        newUploadedFilenames.push(filename);
      }
    }

    const existingImagesRaw = formData.get("existing_images") as string || "[]";
    const existingImages = JSON.parse(existingImagesRaw) as string[];

    const allImages = [...existingImages, ...newUploadedFilenames];
    const coverImage = allImages[0] || "default.jpg";

    await pool.query(
      `UPDATE packages
       SET category_id = $1, title = $2, title_en = $3, title_es = $4, slug = $5, description = $6, description_en = $7, description_es = $8, is_featured = $9, cover_image = $10
       WHERE id = $11`,
      [
        validatedData.category_id,
        validatedData.title,
        validatedData.title_en,
        validatedData.title_es,
        validatedData.slug,
        validatedData.description,
        validatedData.description_en,
        validatedData.description_es,
        validatedData.is_featured,
        coverImage,
        id,
      ]
    );

    await pool.query("DELETE FROM package_images WHERE package_id = $1", [id]);
    for (let i = 0; i < allImages.length; i++) {
      await pool.query(
        `INSERT INTO package_images (package_id, image_url, sort_order) VALUES ($1, $2, $3)`,
        [id, allImages[i], i]
      );
    }

    await pool.query("DELETE FROM itineraries WHERE package_id = $1", [id]);
    const itineraries = JSON.parse(formData.get("itineraries") as string || "[]");
    if (itineraries.length > 0) {
      for (const item of itineraries) {
        await pool.query(
          `INSERT INTO itineraries (package_id, day_number, title, title_en, title_es, description, description_en, description_es)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [id, item.day_number, item.title, item.title_en || null, item.title_es || null, item.description, item.description_en || null, item.description_es || null]
        );
      }
    }

    revalidatePath("/admin/packages");
    revalidatePath("/packages");
    revalidatePath(`/packages/${validatedData.slug}`);

    return { success: true, message: "Package updated successfully!" };
  } catch (error: any) {
    console.error("Error updating package:", error);
    return { success: false, message: error.message || "Failed to update package" };
  }
}

export async function deletePackage(id: string) {
  try {
    await pool.query("DELETE FROM packages WHERE id = $1", [id]);
    revalidatePath("/admin/packages");
    revalidatePath("/packages");
    return { success: true, message: "Package deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: "Failed to delete package. Ensure there are no related bookings." };
  }
}
