"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import sharp from "sharp";
import { put } from "@vercel/blob";

const transportationSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  name_en: z.string().optional(),
  name_es: z.string().optional(),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  capacity_pax: z.number().min(1, "Kapasitas penumpang minimal 1"),
  capacity_luggage: z.number().min(0, "Kapasitas bagasi minimal 0"),
  price_per_day: z.number().min(0, "Harga minimal 0"),
  description: z.string().optional(),
  description_en: z.string().optional(),
  description_es: z.string().optional(),
  is_active: z.boolean().default(true),
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

  const { url } = await put(`transportations/${Date.now()}-${file.name.replace(/\s+/g, "-")}`, resizedBuffer, {
    access: 'public',
  });

  return url;
}

export async function createTransportation(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      name_en: formData.get("name_en") || null,
      name_es: formData.get("name_es") || null,
      slug: formData.get("slug"),
      capacity_pax: Number(formData.get("capacity_pax")),
      capacity_luggage: Number(formData.get("capacity_luggage")),
      price_per_day: Number(formData.get("price_per_day")),
      description: formData.get("description"),
      description_en: formData.get("description_en") || null,
      description_es: formData.get("description_es") || null,
      is_active: formData.get("is_active") === "true",
    };

    const validatedData = transportationSchema.parse(rawData);

    const imageFile = formData.get("image") as File;
    let imageUrl = "default-car.jpg";

    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      imageUrl = await processImage(imageFile);
    }

    await pool.query(
      `INSERT INTO transportations (name, name_en, name_es, slug, image_url, capacity_pax, capacity_luggage, price_per_day, description, description_en, description_es, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        validatedData.name,
        validatedData.name_en,
        validatedData.name_es,
        validatedData.slug,
        imageUrl,
        validatedData.capacity_pax,
        validatedData.capacity_luggage,
        validatedData.price_per_day,
        validatedData.description,
        validatedData.description_en,
        validatedData.description_es,
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
      name_en: formData.get("name_en") || null,
      name_es: formData.get("name_es") || null,
      slug: formData.get("slug"),
      capacity_pax: Number(formData.get("capacity_pax")),
      capacity_luggage: Number(formData.get("capacity_luggage")),
      price_per_day: Number(formData.get("price_per_day")),
      description: formData.get("description"),
      description_en: formData.get("description_en") || null,
      description_es: formData.get("description_es") || null,
      is_active: formData.get("is_active") === "true",
    };

    const validatedData = transportationSchema.parse(rawData);

    const imageFile = formData.get("image") as File;
    let imageUrl = formData.get("existing_image") as string || "default-car.jpg";

    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      imageUrl = await processImage(imageFile);
    }

    await pool.query(
      `UPDATE transportations
       SET name = $1, name_en = $2, name_es = $3, slug = $4, image_url = $5, capacity_pax = $6, capacity_luggage = $7, price_per_day = $8, description = $9, description_en = $10, description_es = $11, is_active = $12
       WHERE id = $13`,
      [
        validatedData.name,
        validatedData.name_en,
        validatedData.name_es,
        validatedData.slug,
        imageUrl,
        validatedData.capacity_pax,
        validatedData.capacity_luggage,
        validatedData.price_per_day,
        validatedData.description,
        validatedData.description_en,
        validatedData.description_es,
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
