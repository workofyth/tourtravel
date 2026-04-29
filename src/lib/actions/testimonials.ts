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
      role: formData.get("role") as string | null,
      content: formData.get("content") as string,
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
      `INSERT INTO testimonials (name, role, content, rating, avatar_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        rawData.name,
        rawData.role,
        rawData.content,
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
      role: formData.get("role") as string | null,
      content: formData.get("content") as string,
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
       SET name = $1, role = $2, content = $3, rating = $4, avatar_url = $5, is_active = $6
       WHERE id = $7`,
      [
        rawData.name,
        rawData.role,
        rawData.content,
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
