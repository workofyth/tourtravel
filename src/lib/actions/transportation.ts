"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/transportations");

const transportationSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  capacity_pax: z.number().min(1, "Kapasitas penumpang minimal 1"),
  capacity_luggage: z.number().min(0, "Kapasitas bagasi minimal 0"),
  price_per_day: z.number().min(0, "Harga minimal 0"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

async function processImage(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error(`File ${file.name} exceeds 10MB limit`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure upload dir exists
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  // Resize to max 1080p (width or height)
  await sharp(buffer)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .toFile(filePath);

  return filename;
}

export async function createTransportation(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      capacity_pax: Number(formData.get("capacity_pax")),
      capacity_luggage: Number(formData.get("capacity_luggage")),
      price_per_day: Number(formData.get("price_per_day")),
      description: formData.get("description"),
      is_active: formData.get("is_active") === "true",
    };

    const validatedData = transportationSchema.parse(rawData);

    // Handle Image Upload
    const imageFile = formData.get("image") as File;
    let imageUrl = "default-car.jpg";

    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      imageUrl = await processImage(imageFile);
    }

    await pool.query(
      `INSERT INTO transportations (name, slug, image_url, capacity_pax, capacity_luggage, price_per_day, description, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        validatedData.name,
        validatedData.slug,
        imageUrl,
        validatedData.capacity_pax,
        validatedData.capacity_luggage,
        validatedData.price_per_day,
        validatedData.description,
        validatedData.is_active,
      ]
    );

    revalidatePath("/admin/transportations");
    revalidatePath("/transportation");
    revalidatePath("/");
    
    return { success: true, message: "Transportation berhasil ditambahkan!" };
  } catch (error: any) {
    console.error("Error creating transportation:", error);
    return { success: false, message: error.message || "Gagal menambahkan transportation" };
  }
}

export async function updateTransportation(id: string, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      capacity_pax: Number(formData.get("capacity_pax")),
      capacity_luggage: Number(formData.get("capacity_luggage")),
      price_per_day: Number(formData.get("price_per_day")),
      description: formData.get("description"),
      is_active: formData.get("is_active") === "true",
    };

    const validatedData = transportationSchema.parse(rawData);

    // Handle New Image Upload
    const imageFile = formData.get("image") as File;
    let imageUrl = formData.get("existing_image") as string || "default-car.jpg";

    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      imageUrl = await processImage(imageFile);
    }

    await pool.query(
      `UPDATE transportations 
       SET name = $1, slug = $2, image_url = $3, capacity_pax = $4, capacity_luggage = $5, price_per_day = $6, description = $7, is_active = $8
       WHERE id = $9`,
      [
        validatedData.name,
        validatedData.slug,
        imageUrl,
        validatedData.capacity_pax,
        validatedData.capacity_luggage,
        validatedData.price_per_day,
        validatedData.description,
        validatedData.is_active,
        id,
      ]
    );

    revalidatePath("/admin/transportations");
    revalidatePath("/transportation");
    revalidatePath("/");
    
    return { success: true, message: "Transportation berhasil diperbarui!" };
  } catch (error: any) {
    console.error("Error updating transportation:", error);
    return { success: false, message: error.message || "Gagal memperbarui transportation" };
  }
}

export async function deleteTransportation(id: string) {
  try {
    await pool.query("DELETE FROM transportations WHERE id = $1", [id]);
    revalidatePath("/admin/transportations");
    revalidatePath("/transportation");
    revalidatePath("/");
    return { success: true, message: "Transportation berhasil dihapus!" };
  } catch (error: any) {
    return { success: false, message: "Gagal menghapus transportation." };
  }
}

export async function toggleTransportationStatus(id: string, currentStatus: boolean) {
  try {
    await pool.query("UPDATE transportations SET is_active = $1 WHERE id = $2", [!currentStatus, id]);
    revalidatePath("/admin/transportations");
    revalidatePath("/transportation");
    return { success: true, message: "Status transportation berhasil diperbarui!" };
  } catch (error: any) {
    return { success: false, message: "Gagal memperbarui status transportation." };
  }
}
