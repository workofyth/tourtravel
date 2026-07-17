"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { put } from "@vercel/blob";

async function processImage(file: File): Promise<string> {
  if (file.size > 2 * 1024 * 1024) {
    throw new Error(`File ${file.name} melebihi batas 2MB`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const resizedBuffer = await sharp(buffer)
    .resize(500, 500, { fit: 'cover', position: 'center' })
    .toBuffer();

  const { url } = await put(`testimonials/${Date.now()}-${file.name.replace(/\s+/g, "-")}`, resizedBuffer, {
    access: 'public',
  });

  return url;
}

export async function createTestimonial(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      name_en: formData.get("name_en") as string || null,
      name_es: formData.get("name_es") as string || null,
      role: formData.get("role") as string | null,
      role_en: formData.get("role_en") as string || null,
      role_es: formData.get("role_es") as string || null,
      content: formData.get("content") as string,
      content_en: formData.get("content_en") as string || null,
      content_es: formData.get("content_es") as string || null,
      rating: parseInt(formData.get("rating") as string, 10) || 5,
      avatar_url: formData.get("avatar_url") as string | null,
      is_active: formData.get("is_active") === "true",
    };

    if (!rawData.name || !rawData.content) {
      throw new Error("Nama dan konten wajib diisi");
    }

    const avatarFile = formData.get("avatar_file") as File | null;
    let finalAvatarUrl = rawData.avatar_url;

    if (avatarFile && avatarFile.size > 0 && avatarFile.name && avatarFile.name !== 'undefined') {
      finalAvatarUrl = await processImage(avatarFile);
    }

    await pool.query(
      `INSERT INTO testimonials (name, name_en, name_es, role, role_en, role_es, content, content_en, content_es, rating, avatar_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        rawData.name,
        rawData.name_en,
        rawData.name_es,
        rawData.role,
        rawData.role_en,
        rawData.role_es,
        rawData.content,
        rawData.content_en,
        rawData.content_es,
        rawData.rating,
        finalAvatarUrl,
        rawData.is_active,
      ]
    );

    revalidatePath("/admin/testimonials");
    revalidatePath("/");

    return { success: true, message: "Testimonial berhasil ditambahkan!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal menambahkan testimonial" };
  }
}

export async function updateTestimonial(id: string, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      name_en: formData.get("name_en") as string || null,
      name_es: formData.get("name_es") as string || null,
      role: formData.get("role") as string | null,
      role_en: formData.get("role_en") as string || null,
      role_es: formData.get("role_es") as string || null,
      content: formData.get("content") as string,
      content_en: formData.get("content_en") as string || null,
      content_es: formData.get("content_es") as string || null,
      rating: parseInt(formData.get("rating") as string, 10) || 5,
      avatar_url: formData.get("avatar_url") as string | null,
      is_active: formData.get("is_active") === "true",
    };

    if (!rawData.name || !rawData.content) {
      throw new Error("Nama dan konten wajib diisi");
    }

    const avatarFile = formData.get("avatar_file") as File | null;
    let finalAvatarUrl = rawData.avatar_url;

    if (avatarFile && avatarFile.size > 0 && avatarFile.name && avatarFile.name !== 'undefined') {
      finalAvatarUrl = await processImage(avatarFile);
    }

    await pool.query(
      `UPDATE testimonials
       SET name = $1, name_en = $2, name_es = $3, role = $4, role_en = $5, role_es = $6, content = $7, content_en = $8, content_es = $9, rating = $10, avatar_url = $11, is_active = $12
       WHERE id = $13`,
      [
        rawData.name,
        rawData.name_en,
        rawData.name_es,
        rawData.role,
        rawData.role_en,
        rawData.role_es,
        rawData.content,
        rawData.content_en,
        rawData.content_es,
        rawData.rating,
        finalAvatarUrl,
        rawData.is_active,
        id,
      ]
    );

    revalidatePath("/admin/testimonials");
    revalidatePath("/");

    return { success: true, message: "Testimonial berhasil diperbarui!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal memperbarui testimonial" };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await pool.query("DELETE FROM testimonials WHERE id = $1", [id]);
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true, message: "Testimonial berhasil dihapus!" };
  } catch (error: any) {
    return { success: false, message: "Gagal menghapus testimonial." };
  }
}
