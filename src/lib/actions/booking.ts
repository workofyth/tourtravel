"use server";

import { pool } from "@/lib/db";
import { z } from "zod";

const bookingSchema = z.object({
  package_id: z.string().uuid(),
  name: z.string().min(3, "Name is required (min 3 chars)"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number required"),
  travel_date: z.string(),
  pax: z.number().min(1, "At least 1 pax"),
  pax_child: z.number().min(0),
  pax_infant: z.number().min(0),
  notes: z.string().optional(),
});

import { revalidatePath } from "next/cache";

export async function createBooking(prevState: any, formData: FormData) {
  try {
    const rawData = {
      package_id: formData.get("package_id") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      travel_date: formData.get("travel_date") as string,
      pax: Number(formData.get("pax")),
      pax_child: Number(formData.get("pax_child") || 0),
      pax_infant: Number(formData.get("pax_infant") || 0),
      notes: formData.get("notes") as string,
    };

    const validatedData = bookingSchema.parse(rawData);

    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO bookings (package_id, name, email, phone, travel_date, pax, pax_child, pax_infant, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          validatedData.package_id,
          validatedData.name,
          validatedData.email,
          validatedData.phone,
          validatedData.travel_date,
          validatedData.pax,
          validatedData.pax_child,
          validatedData.pax_infant,
          validatedData.notes,
        ]
      );
    } finally {
      client.release();
    }

    return { success: true, message: "Booking successful! We will contact you soon." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: (error as any).errors.map((e: any) => e.message).join(", ") };
    }
    return { success: false, message: "An error occurred while booking. Please try again." };
  }
}

export async function deleteBooking(id: string) {
  try {
    const client = await pool.connect();
    try {
      await client.query("DELETE FROM bookings WHERE id = $1", [id]);
    } finally {
      client.release();
    }
    revalidatePath("/admin/bookings");
    return { success: true, message: "Booking deleted successfully." };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { success: false, message: "Failed to delete booking." };
  }
}
