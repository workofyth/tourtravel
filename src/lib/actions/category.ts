"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  name_en: z.string().optional(),
  name_es: z.string().optional(),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  description_en: z.string().optional(),
  description_es: z.string().optional(),
});

export async function createCategory(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      name_en: formData.get("name_en") || null,
      name_es: formData.get("name_es") || null,
      slug: formData.get("slug"),
      description: formData.get("description"),
      description_en: formData.get("description_en") || null,
      description_es: formData.get("description_es") || null,
    };

    const validatedData = categorySchema.parse(rawData);

    await pool.query(
      `INSERT INTO categories (name, name_en, name_es, slug, description, description_en, description_es)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        validatedData.name,
        validatedData.name_en,
        validatedData.name_es,
        validatedData.slug,
        validatedData.description,
        validatedData.description_en,
        validatedData.description_es,
      ]
    );

    revalidatePath("/admin/categories");
    revalidatePath("/packages");
    revalidatePath("/");

    return { success: true, message: "Destinasi berhasil ditambahkan!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal menambahkan destinasi" };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      name_en: formData.get("name_en") || null,
      name_es: formData.get("name_es") || null,
      slug: formData.get("slug"),
      description: formData.get("description"),
      description_en: formData.get("description_en") || null,
      description_es: formData.get("description_es") || null,
    };

    const validatedData = categorySchema.parse(rawData);

    await pool.query(
      `UPDATE categories
       SET name = $1, name_en = $2, name_es = $3, slug = $4, description = $5, description_en = $6, description_es = $7
       WHERE id = $8`,
      [
        validatedData.name,
        validatedData.name_en,
        validatedData.name_es,
        validatedData.slug,
        validatedData.description,
        validatedData.description_en,
        validatedData.description_es,
        id,
      ]
    );

    revalidatePath("/admin/categories");
    revalidatePath("/packages");
    revalidatePath("/");

    return { success: true, message: "Destinasi berhasil diperbarui!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal memperbarui destinasi" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
    revalidatePath("/admin/categories");
    revalidatePath("/packages");
    revalidatePath("/");
    return { success: true, message: "Destinasi berhasil dihapus!" };
  } catch (error: any) {
    return { success: false, message: "Gagal menghapus destinasi. Pastikan tidak ada paket wisata terkait." };
  }
}
