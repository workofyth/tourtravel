"use server";

import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { error: "Invalid form data" };
  }

  const { username, password } = result.data;

  // Cek hardcoded admin credentials
  if (username === "admin_tour" && password === "SecurePassword123!") {
    await createSession(username);
    return { success: true };
  } else {
    return { error: "Username atau password salah!" };
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
