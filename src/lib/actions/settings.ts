"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { put } from "@vercel/blob";

async function processImage(file: File): Promise<string> {
  if (file.size > 2 * 1024 * 1024) {
    throw new Error(`File ${file.name} exceeds 2MB limit`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const resizedBuffer = await sharp(buffer)
    .resize(500, 500, { fit: 'inside', withoutEnlargement: true })
    .toBuffer();

  const { url } = await put(`settings/${Date.now()}-${file.name.replace(/\s+/g, "-")}`, resizedBuffer, {
    access: 'public',
  });

  return url;
}

export async function updateSiteSettings(formData: FormData) {
  try {
    const rawData = {
      site_name: formData.get("site_name") as string | null,
      site_name_en: formData.get("site_name_en") as string || null,
      site_name_es: formData.get("site_name_es") as string || null,
      logo_url: formData.get("logo_url") as string | null,
      address: formData.get("address") as string | null,
      address_en: formData.get("address_en") as string || null,
      address_es: formData.get("address_es") as string || null,
      email: formData.get("email") as string | null,
      phone: formData.get("phone") as string | null,
      whatsapp: formData.get("whatsapp") as string | null,
      facebook_url: formData.get("facebook_url") as string | null,
      instagram_url: formData.get("instagram_url") as string | null,
      twitter_url: formData.get("twitter_url") as string | null,
    };

    const logoFile = formData.get("logo_file") as File | null;
    let finalLogoUrl = rawData.logo_url;

    if (logoFile && logoFile.size > 0 && logoFile.name !== 'undefined') {
      finalLogoUrl = await processImage(logoFile);
    }

    await pool.query(
      `UPDATE site_settings
       SET site_name = $1, site_name_en = $2, site_name_es = $3, logo_url = $4, address = $5, address_en = $6, address_es = $7, email = $8, phone = $9, whatsapp = $10, facebook_url = $11, instagram_url = $12, twitter_url = $13, updated_at = now()
       WHERE id = 1`,
      [
        rawData.site_name,
        rawData.site_name_en,
        rawData.site_name_es,
        finalLogoUrl,
        rawData.address,
        rawData.address_en,
        rawData.address_es,
        rawData.email,
        rawData.phone,
        rawData.whatsapp,
        rawData.facebook_url,
        rawData.instagram_url,
        rawData.twitter_url,
      ]
    );

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");

    return { success: true, message: "Site settings updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update site settings" };
  }
}
