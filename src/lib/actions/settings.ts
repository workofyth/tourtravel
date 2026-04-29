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
      logo_url: formData.get("logo_url") as string | null, // we'll handle this in a moment
      address: formData.get("address") as string | null,
      email: formData.get("email") as string | null,
      phone: formData.get("phone") as string | null,
      whatsapp: formData.get("whatsapp") as string | null,
      facebook_url: formData.get("facebook_url") as string | null,
      instagram_url: formData.get("instagram_url") as string | null,
      twitter_url: formData.get("twitter_url") as string | null,
    };

    // Handle Image Upload
    const logoFile = formData.get("logo_file") as File | null;
    let finalLogoUrl = rawData.logo_url;

    if (logoFile && logoFile.size > 0 && logoFile.name !== 'undefined') {
      finalLogoUrl = await processImage(logoFile);
    }

    await pool.query(
      `UPDATE site_settings 
       SET site_name = $1, logo_url = $2, address = $3, email = $4, phone = $5, whatsapp = $6, facebook_url = $7, instagram_url = $8, twitter_url = $9, updated_at = now()
       WHERE id = 1`,
      [
        rawData.site_name,
        finalLogoUrl,
        rawData.address,
        rawData.email,
        rawData.phone,
        rawData.whatsapp,
        rawData.facebook_url,
        rawData.instagram_url,
        rawData.twitter_url,
      ]
    );

    revalidatePath("/", "layout"); // Revalidate entire app basically
    revalidatePath("/admin/settings");
    
    return { success: true, message: "Site settings updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update site settings" };
  }
}
