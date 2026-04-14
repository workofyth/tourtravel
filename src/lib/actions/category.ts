"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
});

export async function createCategory(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
    };

    const validatedData = categorySchema.parse(rawData);

    await pool.query(
      `INSERT INTO categories (name, slug, description)
       VALUES ($1, $2, $3)`,
      [
        validatedData.name,
        validatedData.slug,
        validatedData.description,
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
      slug: formData.get("slug"),
      description: formData.get("description"),
    };

    const validatedData = categorySchema.parse(rawData);

    await pool.query(
      `UPDATE categories 
       SET name = $1, slug = $2, description = $3
       WHERE id = $4`,
      [
        validatedData.name,
        validatedData.slug,
        validatedData.description,
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
